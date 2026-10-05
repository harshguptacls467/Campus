import { inMemoryDb, supabase, DEFAULT_USER_ID } from "../db/supabase";
import { ActionRecord, CreateActionInput, UpdateActionInput } from "../types";
import { BadRequestError, NotFoundError, ForbiddenError } from "../utils/errors";

export class ActionService {
  /**
   * Helper to format an ISO date string into Google Calendar UTC format: YYYYMMDDTHHmmssZ
   */
  private formatGoogleCalendarDate(dateStr: string | null): { start: string; end: string } | null {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return null;

    const pad = (n: number) => n.toString().padStart(2, "0");
    const formatUtc = (date: Date) =>
      `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T${pad(
        date.getUTCHours()
      )}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`;

    const start = formatUtc(d);
    const end = formatUtc(new Date(d.getTime() + 60 * 60 * 1000)); // +1 hour duration
    return { start, end };
  }

  /**
   * Generate Google Calendar direct creation URL
   */
  private generateGoogleCalendarUrl(
    title: string,
    dueAt: string | null,
    details?: string,
    sourceName?: string
  ): string | null {
    const dates = this.formatGoogleCalendarDate(dueAt);
    if (!dates) return null;

    const desc = `${details || title}\n\nVerified Campus Source: ${sourceName || "Institutional Notice"}\nManaged by Campus Copilot`;
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: title,
      dates: `${dates.start}/${dates.end}`,
      details: desc,
      location: "Campus Examination / Placement Office",
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }

  /**
   * Evaluates if a due date expression has uncertainty or conflicting dates.
   * Enforces Rule 9: "Never create reminders for uncertain or conflicting dates without warning"
   */
  private evaluateDateConflict(dueAt?: string | null, title?: string): { hasConflict: boolean; warning: string | null } {
    if (!dueAt) {
      return {
        hasConflict: true,
        warning: "Warning: No definitive deadline date was specified. Reminder has been flagged for student verification.",
      };
    }

    const checkText = `${dueAt} ${title || ""}`.toLowerCase();
    const conflictSignals = [
      "conflict",
      "tentative",
      "provisional",
      "subject to change",
      "or",
      "tbd",
      "unconfirmed",
      "disputed",
    ];

    for (const signal of conflictSignals) {
      if (checkText.includes(signal)) {
        return {
          hasConflict: true,
          warning: `Warning: Date conflict or provisional signal detected ("${signal}"). Please verify against the signed official registrar circular before relying on this deadline.`,
        };
      }
    }

    // Check if date is invalid
    const parsed = new Date(dueAt);
    if (isNaN(parsed.getTime())) {
      return {
        hasConflict: true,
        warning: "Warning: Deadline date could not be parsed into a definitive calendar timestamp.",
      };
    }

    return { hasConflict: false, warning: null };
  }

  /**
   * Automatically calculates priority based on time remaining to deadline.
   */
  private calculatePriority(dueAt: string | null): "critical" | "high" | "medium" | "low" {
    if (!dueAt) return "medium";
    const d = new Date(dueAt);
    if (isNaN(d.getTime())) return "medium";

    const hours = Math.round((d.getTime() - Date.now()) / (1000 * 3600));
    const days = Math.ceil(hours / 24);

    if (days <= 2) return "critical";
    if (days <= 7) return "high";
    if (days <= 21) return "medium";
    return "low";
  }

  /**
   * 1. Create a new Action / Reminder.
   * - Enforces user ownership (`user_id = userId`)
   * - Rule 5: Prevents duplicate reminders for the same source/deadline
   * - Rule 8: Google Calendar creation if connected/requested; otherwise internal reminder
   * - Rule 9: Warns on uncertain or conflicting dates
   * - Rule 10: Preserves original source
   */
  async createAction(
    userId: string = DEFAULT_USER_ID,
    input: CreateActionInput
  ): Promise<{ action: ActionRecord; alreadyExists?: boolean; warning?: string | null }> {
    if (!input.title || !input.title.trim()) {
      throw new BadRequestError("Action title is required and cannot be empty");
    }

    const cleanTitle = input.title.trim();
    const cleanDueAt = input.due_at ? input.due_at.trim() : null;

    // Rule 9: Conflict & Uncertainty Analysis
    const conflictAnalysis = this.evaluateDateConflict(cleanDueAt, cleanTitle);
    const hasConflict = input.has_conflict ?? conflictAnalysis.hasConflict;
    const conflictWarning = input.conflict_warning || conflictAnalysis.warning;

    // Rule 5: Check for Duplicates (same source_id OR same cleanTitle + due_at)
    const existing = await this.getActions(userId, { status: "all" });
    const duplicate = existing.find((a) => {
      if (a.status === "dismissed") return false;
      if (input.source_id && a.source_id === input.source_id) return true;
      if (input.source?.document_id && a.source?.document_id === input.source.document_id) return true;
      const titleMatches = a.title.trim().toLowerCase() === cleanTitle.toLowerCase();
      const dateMatches = (a.due_at || "").slice(0, 10) === (cleanDueAt || "").slice(0, 10);
      return titleMatches && dateMatches;
    });

    if (duplicate) {
      return {
        action: duplicate,
        alreadyExists: true,
        warning: duplicate.conflict_warning || "Reminder already scheduled for this deadline.",
      };
    }

    const actionType = input.action_type || input.type || "reminder";
    const priority = input.priority || this.calculatePriority(cleanDueAt);
    const actionId = `act-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    // Rule 8: Google Calendar Sync
    let calendarSynced = false;
    let calendarUrl: string | null = null;
    let calendarEventId: string | null = null;

    if (input.calendar_sync) {
      calendarUrl = this.generateGoogleCalendarUrl(
        cleanTitle,
        cleanDueAt,
        `Deadline action created via Campus Copilot`,
        input.source?.source_name || "Campus Portal"
      );
      if (calendarUrl) {
        calendarSynced = true;
        calendarEventId = `gcal-${Date.now()}`;
      }
    }

    // Rule 10: Original Source Preservation
    const source = input.source
      ? {
          document_id: input.source.document_id || input.source_id || null,
          source_name: input.source.source_name || "Campus Authority",
          source_url: input.source.source_url || null,
          file_name: input.source.file_name || null,
          title: input.source.title || input.title,
        }
      : input.source_id
      ? {
          document_id: input.source_id,
          source_name: "Institutional Circular",
          source_url: null,
          file_name: null,
          title: input.title,
        }
      : null;

    const actionRecord: ActionRecord = {
      id: actionId,
      user_id: userId,
      type: actionType,
      action_type: actionType,
      title: cleanTitle,
      due_at: cleanDueAt,
      priority,
      status: "pending",
      source_id: input.source_id || source?.document_id || null,
      source,
      calendar_synced: calendarSynced,
      calendar_event_id: calendarEventId,
      calendar_url: calendarUrl,
      has_conflict: hasConflict,
      conflict_warning: conflictWarning,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // 1. Store in Supabase
    if (supabase) {
      try {
        await supabase.from("actions").insert({
          id: actionRecord.id,
          user_id: actionRecord.user_id,
          type: actionRecord.type,
          title: actionRecord.title,
          due_at: actionRecord.due_at,
          status: actionRecord.status,
          source_id: actionRecord.source_id,
        });
      } catch (err) {
        console.warn("Supabase action insert error, stored in-memory:", err);
      }
    }

    // 2. Store in Memory
    inMemoryDb.actions.set(actionRecord.id, actionRecord);

    return {
      action: actionRecord,
      warning: conflictWarning,
    };
  }

  /**
   * Retrieve actions for the authenticated user with status filtering.
   */
  async getActions(
    userId: string = DEFAULT_USER_ID,
    filters?: { status?: "pending" | "completed" | "dismissed" | "all"; priority?: string; action_type?: string }
  ): Promise<ActionRecord[]> {
    const statusFilter = filters?.status || "pending";
    const list: ActionRecord[] = [];

    if (supabase) {
      try {
        let query = supabase.from("actions").select("*").eq("user_id", userId);
        if (statusFilter !== "all") {
          query = query.eq("status", statusFilter);
        }
        query = query.order("due_at", { ascending: true, nullsFirst: false });

        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          for (const item of data) {
            list.push({
              id: item.id,
              user_id: item.user_id,
              type: (item.type as any) || "reminder",
              action_type: (item.type as any) || "reminder",
              title: item.title,
              due_at: item.due_at,
              priority: this.calculatePriority(item.due_at),
              status: item.status as any,
              source_id: item.source_id,
              source: {
                document_id: item.source_id,
                source_name: "Campus Notice",
                source_url: null,
                file_name: null,
                title: item.title,
              },
              created_at: item.created_at || new Date().toISOString(),
              updated_at: item.updated_at || new Date().toISOString(),
            });
          }
        }
      } catch (err) {
        console.warn("Supabase getActions query error:", err);
      }
    }

    // In-memory fallback
    for (const a of inMemoryDb.actions.values()) {
      if (a.user_id === userId || !a.user_id) {
        if (!list.some((existingItem) => existingItem.id === a.id)) {
          if (statusFilter === "all" || a.status === statusFilter) {
            list.push(a);
          }
        }
      }
    }

    // Sort by due_at ascending
    list.sort((a, b) => {
      if (!a.due_at) return 1;
      if (!b.due_at) return -1;
      return new Date(a.due_at).getTime() - new Date(b.due_at).getTime();
    });

    return list;
  }

  /**
   * Retrieve a single action by ID with user ownership verification.
   */
  async getActionById(userId: string = DEFAULT_USER_ID, actionId: string): Promise<ActionRecord> {
    const actions = await this.getActions(userId, { status: "all" });
    const action = actions.find((a) => a.id === actionId);

    if (!action) {
      throw new NotFoundError(`Action with ID "${actionId}" was not found`);
    }

    if (action.user_id && action.user_id !== userId) {
      throw new ForbiddenError("You do not have permission to view this action");
    }

    return action;
  }

  /**
   * Update an action (e.g. mark completed, dismiss, edit date/title).
   */
  async updateAction(
    userId: string = DEFAULT_USER_ID,
    actionId: string,
    updates: UpdateActionInput
  ): Promise<ActionRecord> {
    const action = await this.getActionById(userId, actionId);

    if (updates.status !== undefined) {
      action.status = updates.status;
    }
    if (updates.title !== undefined) {
      action.title = updates.title.trim();
    }
    if (updates.due_at !== undefined) {
      action.due_at = updates.due_at;
      action.priority = updates.priority || this.calculatePriority(updates.due_at);
      const conflict = this.evaluateDateConflict(updates.due_at, action.title);
      action.has_conflict = conflict.hasConflict;
      action.conflict_warning = conflict.warning;
    }
    if (updates.action_type !== undefined) {
      action.action_type = updates.action_type;
      action.type = updates.action_type;
    }
    if (updates.calendar_sync) {
      action.calendar_url = this.generateGoogleCalendarUrl(
        action.title,
        action.due_at,
        "Scheduled reminder via Campus Copilot",
        action.source?.source_name || "Campus Portal"
      );
      action.calendar_synced = Boolean(action.calendar_url);
    }
    action.updated_at = new Date().toISOString();

    // 1. Update in Supabase
    if (supabase) {
      try {
        await supabase
          .from("actions")
          .update({
            title: action.title,
            due_at: action.due_at,
            status: action.status,
            type: action.type,
          })
          .eq("id", action.id)
          .eq("user_id", userId);
      } catch (err) {
        console.warn("Supabase action update error:", err);
      }
    }

    // 2. Update in Memory
    inMemoryDb.actions.set(action.id, action);

    return action;
  }

  /**
   * Delete or permanently dismiss an action.
   */
  async deleteAction(userId: string = DEFAULT_USER_ID, actionId: string): Promise<{ success: boolean; id: string }> {
    const action = await this.getActionById(userId, actionId);

    if (supabase) {
      try {
        await supabase.from("actions").delete().eq("id", action.id).eq("user_id", userId);
      } catch (err) {
        console.warn("Supabase action delete error:", err);
      }
    }

    inMemoryDb.actions.delete(action.id);
    return { success: true, id: actionId };
  }
}

export const actionService = new ActionService();
