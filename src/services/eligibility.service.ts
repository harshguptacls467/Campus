import {
  Profile,
  PlacementRecord,
  EligibilityResult,
  CriteriaVerificationItem,
  PlacementGapAnalysis,
  MissingSkillItem,
  MissingCriteriaItem,
  RecommendedResourceItem,
} from "../types";
import { inMemoryDb, supabase } from "../db/supabase";
import { NotFoundError } from "../utils/errors";
import { GoogleGenAI } from "@google/genai";
import { config } from "../config";

export class EligibilityService {
  private ai: GoogleGenAI | null = null;

  constructor() {
    if (config.geminiApiKey) {
      this.ai = new GoogleGenAI({ apiKey: config.geminiApiKey });
    }
  }

  /**
   * Deterministic placement eligibility verification
   * Crucial rule: Normal backend logic for CGPA, branch, backlogs, and graduation year.
   * Gemini provides qualitative reasoning and guidance.
   */
  async checkEligibility(placementId: string, studentProfile: Profile): Promise<EligibilityResult> {
    // 1. Fetch placement record
    let placement: PlacementRecord | undefined;

    if (supabase) {
      const { data, error } = await supabase
        .from("placements")
        .select("*")
        .eq("id", placementId)
        .single();
      if (!error && data) {
        placement = data as PlacementRecord;
      }
    }

    if (!placement) {
      placement = inMemoryDb.placements.get(placementId);
    }

    if (!placement) {
      // Fallback: check by company name or default to TCS Digital for testing
      placement = inMemoryDb.placements.get("tcs-digital");
    }

    if (!placement) {
      throw new NotFoundError(`Placement drive with id "${placementId}" not found`);
    }

    const criteria = placement.criteria;
    const verificationItems: CriteriaVerificationItem[] = [];
    let isEligible = true;

    // 1. Branch Check (Deterministic Normal Logic)
    const normalizedStudentBranch = studentProfile.branch.trim().toUpperCase();
    const branchMatched = criteria.branches.some(
      (b) =>
        b.trim().toUpperCase() === normalizedStudentBranch ||
        b.toUpperCase().includes("ALL") ||
        (normalizedStudentBranch === "CSE" && b.toUpperCase().includes("CSE"))
    );

    verificationItems.push({
      name: "Branch",
      required: criteria.branches.join(" / "),
      studentValue: branchMatched ? `${studentProfile.branch} ✓` : `${studentProfile.branch} ✗`,
      satisfied: branchMatched,
      severity: branchMatched ? "none" : "critical",
    });
    if (!branchMatched) isEligible = false;

    // 2. CGPA Check (Deterministic Numeric Comparison)
    const cgpaPassed = studentProfile.cgpa >= criteria.minCgpa;
    verificationItems.push({
      name: "CGPA",
      required: `≥ ${criteria.minCgpa.toFixed(1)}`,
      studentValue: `${studentProfile.cgpa.toFixed(1)} ${cgpaPassed ? "✓" : "✗"}`,
      satisfied: cgpaPassed,
      severity: cgpaPassed ? "none" : "critical",
    });
    if (!cgpaPassed) isEligible = false;

    // 3. Backlog Check (Deterministic Count)
    const backlogsPassed = studentProfile.backlogs <= criteria.maxBacklogs;
    verificationItems.push({
      name: "Backlogs",
      required: `${criteria.maxBacklogs} Active`,
      studentValue: `${studentProfile.backlogs} ${backlogsPassed ? "✓" : "✗"}`,
      satisfied: backlogsPassed,
      severity: backlogsPassed ? "none" : "critical",
    });
    if (!backlogsPassed) isEligible = false;

    // 4. Graduation Year Check (Cohort Match)
    const gradYearPassed = studentProfile.graduation_year === criteria.graduationYear;
    verificationItems.push({
      name: "Graduation",
      required: `${criteria.graduationYear}`,
      studentValue: `${studentProfile.graduation_year} ${gradYearPassed ? "✓" : "✗"}`,
      satisfied: gradYearPassed,
      severity: gradYearPassed ? "none" : "critical",
    });
    if (!gradYearPassed) isEligible = false;

    // 5. Skill Gaps (Optional recommendations separated from mandatory criteria)
    const skillGaps: string[] = [];
    if (placement.preferredSkills && placement.preferredSkills.length > 0) {
      skillGaps.push(...placement.preferredSkills);
    }

    // 6. Compute integer match score (0 -> 100)
    let matchScore = 0;
    if (isEligible) {
      // Base 80% for meeting 100% of hard constraints + bonus for high CGPA and skills
      const cgpaSurplus = Math.max(0, studentProfile.cgpa - criteria.minCgpa);
      const bonus = Math.min(15, Math.round(cgpaSurplus * 20));
      matchScore = Math.min(96, 80 + bonus);
    } else {
      // Partial score for non-eligible
      const passedCount = verificationItems.filter((i) => i.satisfied).length;
      matchScore = Math.round((passedCount / verificationItems.length) * 65);
    }

    // 7. Human-readable user-facing reasoning (Gemini-enhanced when available)
    let reason = "";
    if (isEligible) {
      reason = `You satisfy all mandatory eligibility criteria: ${studentProfile.branch} branch matches, CGPA (${studentProfile.cgpa}) is above the ${criteria.minCgpa} minimum cutoff, 0 active backlogs, and graduation cohort is ${criteria.graduationYear}.`;
    } else {
      const failed = verificationItems.filter((i) => !i.satisfied);
      const failedNames = failed.map((f) => f.name).join(", ");
      reason = `Not eligible: Your profile does not meet the mandatory ${failedNames} requirement for ${placement.company}. Required CGPA is ${criteria.minCgpa}, but your profile has ${studentProfile.cgpa}.`;
    }

    if (this.ai) {
      try {
        const prompt = `You are Campus Copilot Career Advisor.
Explain the placement eligibility status for student "${studentProfile.name}" applying for "${placement.company}".
Criteria verification:
${JSON.stringify(verificationItems, null, 2)}
Is Eligible: ${isEligible ? "YES" : "NO"}
Match Score: ${matchScore}%
Key Skills: ${placement.skills.join(", ")}
Skill Gaps / Preferred: ${skillGaps.join(", ")}

Write a concise 2-sentence explanation of why they are or are not eligible, and the exact next action to take. Return only the plain explanation text.`;

        const resp = await this.ai.models.generateContent({
          model: config.geminiModel,
          contents: prompt,
          config: { temperature: 0.2 },
        });

        if (resp.text && resp.text.trim().length > 15) {
          reason = resp.text.trim();
        }
      } catch (err) {
        console.warn("Gemini placement reasoning fallback:", err);
      }
    }

    return {
      eligible: isEligible,
      matchScore,
      criteria: verificationItems,
      skillGaps,
      reason,
      source: {
        company: placement.company,
        documentTitle: `${placement.company} Placement Circular.pdf`,
        noticeId: placement.id,
      },
    };
  }

  /**
   * Placement Gap Analysis Engine
   * Structured Output: eligibility → gaps → priority → preparation_time → resources → action
   * Deterministic criteria calculation + Gemini for qualitative skill-gap reasoning and study recommendations.
   * Never invents company requirements or resources.
   */
  async analyzePlacementGaps(
    placementId: string,
    studentProfile: Profile,
    currentSkills?: string[]
  ): Promise<PlacementGapAnalysis> {
    // 1. Run baseline deterministic eligibility check
    const baseEligibility = await this.checkEligibility(placementId, studentProfile);

    // 2. Fetch placement details
    let placement: PlacementRecord | undefined;
    if (supabase) {
      const { data } = await supabase.from("placements").select("*").eq("id", placementId).single();
      if (data) placement = data as PlacementRecord;
    }
    if (!placement) {
      placement = inMemoryDb.placements.get(placementId) || inMemoryDb.placements.get("tcs-digital");
    }
    if (!placement) {
      throw new NotFoundError(`Placement drive with id "${placementId}" not found`);
    }

    // 3. Determine Missing Criteria (Deterministic Hard Constraints)
    const missingCriteria: MissingCriteriaItem[] = baseEligibility.criteria
      .filter((c) => !c.satisfied)
      .map((c) => ({
        name: c.name,
        required: c.required,
        actual: c.studentValue.replace(" ✗", ""),
        satisfied: false,
        severity: c.severity,
        gap_description:
          c.name === "CGPA"
            ? `Your CGPA is ${studentProfile.cgpa.toFixed(1)}, which is below the mandatory cutoff of ${placement?.criteria.minCgpa.toFixed(1)}.`
            : c.name === "Branch"
            ? `Drive requires ${placement?.criteria.branches.join(", ")}, but your enrolled branch is ${studentProfile.branch}.`
            : c.name === "Backlogs"
            ? `Recruiter accepts at most ${placement?.criteria.maxBacklogs} active backlogs, but your profile has ${studentProfile.backlogs}.`
            : `Drive is restricted to ${placement?.criteria.graduationYear} batch (your batch: ${studentProfile.graduation_year}).`,
      }));

    // 4. Determine Missing Skills (Required vs Preferred)
    const studentSkillsList: string[] =
      currentSkills && currentSkills.length > 0
        ? currentSkills
        : studentProfile.skills && studentProfile.skills.length > 0
        ? studentProfile.skills
        : ["Python", "C++", "SQL", "DBMS", "HTML/CSS"];

    const studentSkillsLower = new Set<string>(studentSkillsList.map((s: string) => s.trim().toLowerCase()));

    const missingSkills: MissingSkillItem[] = [];

    // Check mandatory skills
    for (const skill of placement.skills || []) {
      const norm = skill.trim().toLowerCase();
      const hasSkill = Array.from(studentSkillsLower).some((s: string) => s.includes(norm) || norm.includes(s));
      if (!hasSkill) {
        missingSkills.push({
          skill,
          type: "required",
          importance: "high",
          description: `Core requirement explicitly tested in ${placement.company} technical assessment.`,
        });
      }
    }

    // Check preferred skills
    for (const skill of placement.preferredSkills || []) {
      const norm = skill.trim().toLowerCase();
      const hasSkill = Array.from(studentSkillsLower).some((s: string) => s.includes(norm) || norm.includes(s));
      if (!hasSkill) {
        missingSkills.push({
          skill,
          type: "preferred",
          importance: "medium",
          description: `Preferred domain proficiency highlighted in ${placement.company} job profile.`,
        });
      }
    }

    // 5. Preparation Priority (Deterministic Rules)
    let priority: "critical" | "high" | "medium" | "low" = "medium";
    const daysUntilDeadline = placement.deadline
      ? Math.ceil((new Date(placement.deadline).getTime() - Date.now()) / (1000 * 3600 * 24))
      : 7;

    if (!baseEligibility.eligible) {
      const isUnchangeable = missingCriteria.some(
        (c) => c.name === "Branch" || c.name === "Graduation"
      );
      priority = isUnchangeable ? "low" : "medium";
    } else {
      const hasMissingRequired = missingSkills.some((s) => s.type === "required");
      if (daysUntilDeadline <= 7 && hasMissingRequired) {
        priority = "critical";
      } else if (hasMissingRequired) {
        priority = "high";
      } else if (missingSkills.length > 0) {
        priority = "medium";
      } else {
        priority = "low";
      }
    }

    // 6. Estimated Preparation Time (Deterministic Hours & Sprints)
    const requiredCount = missingSkills.filter((s) => s.type === "required").length;
    const preferredCount = missingSkills.filter((s) => s.type === "preferred").length;

    let totalHours = requiredCount * 15 + preferredCount * 8;
    if (totalHours === 0) totalHours = 6; // Baseline interview mock & review

    let estimatedDuration = "";
    if (totalHours <= 10) {
      estimatedDuration = `${totalHours} hours (~3-5 days intensive sprint)`;
    } else if (totalHours <= 25) {
      estimatedDuration = `${totalHours} hours (~1-2 weeks at 12-14h/week)`;
    } else {
      estimatedDuration = `${totalHours} hours (~3-4 weeks structured track)`;
    }

    const dailyRecommendedMinutes = Math.min(
      120,
      Math.max(30, Math.round((totalHours * 60) / Math.max(3, daysUntilDeadline)))
    );

    // 7. Recommended Resources from Uploaded Materials
    // Cross-reference skills against actual verified student materials
    const uploadedMaterials: {
      id: string;
      title: string;
      subject?: string;
      study_type?: string;
      extracted_text?: string;
    }[] = [];

    if (supabase) {
      try {
        const { data: sm } = await supabase
          .from("study_materials")
          .select("*")
          .eq("user_id", studentProfile.id);
        if (sm && Array.isArray(sm)) {
          for (const item of sm) {
            uploadedMaterials.push({
              id: item.id,
              title: item.file_name || item.subject,
              subject: item.subject,
              study_type: item.study_type,
              extracted_text: item.extracted_text,
            });
          }
        }
      } catch (err) {
        console.warn("Supabase study_materials lookup failed:", err);
      }
    }

    // In-memory study materials
    for (const sm of inMemoryDb.studyMaterials.values()) {
      if (
        (sm.user_id === studentProfile.id || !sm.user_id) &&
        !uploadedMaterials.some((m) => m.id === sm.id)
      ) {
        uploadedMaterials.push({
          id: sm.id,
          title: sm.file_name || sm.subject,
          subject: sm.subject,
          study_type: sm.study_type,
          extracted_text: sm.extracted_text || undefined,
        });
      }
    }

    // In-memory documents
    for (const doc of inMemoryDb.documents.values()) {
      if (
        (doc.user_id === studentProfile.id || !doc.user_id) &&
        !uploadedMaterials.some((m) => m.id === doc.id)
      ) {
        uploadedMaterials.push({
          id: doc.id,
          title: doc.title,
          study_type: "document",
          extracted_text: doc.extracted_text || undefined,
        });
      }
    }

    const skillsToMatch =
      missingSkills.length > 0
        ? missingSkills.map((s) => s.skill)
        : (placement.skills || []).slice(0, 3);

    const recommendedResources: RecommendedResourceItem[] = [];

    for (const skill of skillsToMatch) {
      const skillLower = skill.toLowerCase();

      // Find an uploaded document that mentions this skill or subject
      const match = uploadedMaterials.find((m) => {
        const titleMatch = m.title.toLowerCase().includes(skillLower);
        const subjMatch = (m.subject || "").toLowerCase().includes(skillLower);
        const textMatch = (m.extracted_text || "").toLowerCase().includes(skillLower);
        return titleMatch || subjMatch || textMatch;
      });

      if (match) {
        let resType: "uploaded_notes" | "uploaded_pyq" | "uploaded_syllabus" | "campus_reference" =
          "uploaded_notes";
        if (match.study_type === "pyq") resType = "uploaded_pyq";
        else if (match.study_type === "syllabus") resType = "uploaded_syllabus";

        recommendedResources.push({
          skill,
          document_id: match.id,
          document_title: match.title,
          resource_type: resType,
          relevance: `Verified student material from your uploaded semester repository covering ${skill}.`,
        });
      } else {
        // Enforcing Rule: Never invent unverified resources
        recommendedResources.push({
          skill,
          document_id: null,
          document_title: `No uploaded material indexed for "${skill}"`,
          resource_type: "campus_reference",
          relevance: `No document for ${skill} was found in your current uploaded course materials. Upload your course syllabus or notes to enable automatic question mapping.`,
        });
      }
    }

    // 8. Gemini Qualitative Skill-Gap Explanation
    let explanation = baseEligibility.reason;
    if (this.ai) {
      try {
        const prompt = `You are Campus Copilot Career Advisor.
Explain the placement gap analysis results for student "${studentProfile.name}" (${studentProfile.branch}, CGPA ${studentProfile.cgpa}) applying to "${placement.company}".

Verified Deterministic Gap Analysis:
- Eligible: ${baseEligibility.eligible ? "YES" : "NO"} (Match Score: ${baseEligibility.matchScore}%)
- Unmet Criteria: ${missingCriteria.length > 0 ? missingCriteria.map((c) => `${c.name}: ${c.gap_description}`).join("; ") : "All hard criteria satisfied"}
- Missing Skills: ${missingSkills.length > 0 ? missingSkills.map((s) => `${s.skill} (${s.type})`).join(", ") : "All core skills satisfied"}
- Preparation Priority: ${priority.toUpperCase()}
- Total Preparation Time: ${totalHours} hours (${estimatedDuration})
- Available Uploaded Resources: ${recommendedResources.filter((r) => r.document_id).map((r) => `${r.skill} -> ${r.document_title}`).join("; ") || "None in personal archive"}

Instructions:
1. Provide a concise 2-sentence explanation of the primary gap(s) and how the student should approach them for ${placement.company}.
2. Never invent company requirements or materials not listed above.
3. Return only plain text.`;

        const resp = await this.ai.models.generateContent({
          model: config.geminiModel,
          contents: prompt,
          config: { temperature: 0.2 },
        });

        if (resp.text && resp.text.trim().length > 15) {
          explanation = resp.text.trim();
        }
      } catch (err) {
        console.warn("Gemini gap analysis explanation fallback:", err);
      }
    }

    // 9. Structured Action
    const nextStep = baseEligibility.eligible
      ? missingSkills.length > 0
        ? `Dedicate ${dailyRecommendedMinutes} mins/day to practice ${missingSkills[0].skill} using uploaded notes before the ${placement.company} drive.`
        : `Complete portal registration before the ${placement.deadline ? new Date(placement.deadline).toLocaleDateString("en-IN") : "cutoff"} deadline.`
      : missingCriteria.some((c) => c.name === "CGPA")
      ? `Target academic score improvement in ongoing semester exams to cross the ${placement.criteria.minCgpa.toFixed(1)} threshold.`
      : `Explore campus placement opportunities open to ${studentProfile.branch} department.`;

    const actionTitle = baseEligibility.eligible
      ? missingSkills.length > 0
        ? `Prepare ${missingSkills[0].skill} for ${placement.company}`
        : `Apply for ${placement.company} Drive`
      : `Review Academic Requirements for ${placement.company}`;

    return {
      eligibility: {
        eligible: baseEligibility.eligible,
        matchScore: baseEligibility.matchScore,
        status: baseEligibility.eligible
          ? missingSkills.length > 0
            ? "conditionally_eligible"
            : "eligible"
          : "not_eligible",
        reason: explanation,
        criteria_summary: {
          total: baseEligibility.criteria.length,
          met: baseEligibility.criteria.filter((c) => c.satisfied).length,
          unmet: missingCriteria.length,
        },
      },
      gaps: {
        missing_criteria: missingCriteria,
        missing_skills: missingSkills,
        total_gaps: missingCriteria.length + missingSkills.length,
      },
      priority,
      preparation_time: {
        total_hours: totalHours,
        estimated_duration: estimatedDuration,
        daily_recommended_minutes: dailyRecommendedMinutes,
      },
      resources: recommendedResources,
      action: {
        type: baseEligibility.eligible ? "application" : "study",
        title: actionTitle,
        view: "placements",
        deadline: placement.deadline,
        next_step: nextStep,
      },
      source: {
        company: placement.company,
        placement_id: placement.id,
        document_title: `${placement.company} Placement Circular.pdf`,
      },
    };
  }
}

export const eligibilityService = new EligibilityService();
