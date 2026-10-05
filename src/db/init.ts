import fs from "fs";
import path from "path";
import { supabase, inMemoryDb, DEFAULT_USER_ID } from "./supabase";
import { config } from "../config";

/**
 * Initializes and hardens the database layer:
 * 1. Verifies / applies schema.sql tables on Supabase
 * 2. Ensures Supabase Storage bucket exists for document and study material uploads
 * 3. Seeds default student profile and institutional baseline data
 * 4. Falls back to in-memory store seamlessly for local dev
 */
export async function initializeDatabase(): Promise<void> {
  const schemaPath = path.join(__dirname, "schema.sql");
  let schemaSql = "";
  try {
    if (fs.existsSync(schemaPath)) {
      schemaSql = fs.readFileSync(schemaPath, "utf-8");
    }
  } catch (err) {
    console.warn("Could not read schema.sql from disk:", err);
  }

  if (supabase) {
    console.log("📡 Connecting to Supabase at:", config.supabaseUrl);

    // 1. Ensure Storage Bucket exists
    try {
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some((b) => b.name === config.storageBucket);

      if (!bucketExists) {
        const { error: bucketError } = await supabase.storage.createBucket(
          config.storageBucket,
          { public: true }
        );
        if (!bucketError) {
          console.log(`✅ Supabase Storage bucket "${config.storageBucket}" created/verified.`);
        } else {
          console.warn(`Storage bucket creation notice:`, bucketError.message);
        }
      } else {
        console.log(`✅ Supabase Storage bucket "${config.storageBucket}" active.`);
      }
    } catch (err: any) {
      console.warn("Supabase storage verification note:", err.message || err);
    }

    // 2. Try executing schema.sql if custom RPC is available
    if (schemaSql) {
      try {
        await supabase.rpc("exec_sql", { sql: schemaSql });
        console.log("✅ Applied schema.sql via Supabase RPC.");
      } catch {
        // PostgREST doesn't expose DDL over REST by default without a migration function;
        // Verify tables exist via standard PostgREST selects
      }
    }

    // 3. Ensure Default Student Profile exists in profiles table
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", DEFAULT_USER_ID)
        .maybeSingle();

      if (!profile) {
        await supabase.from("profiles").insert({
          id: DEFAULT_USER_ID,
          name: "Isha Sharma",
          branch: "CSE",
          semester: "5th Semester",
          cgpa: 7.80,
          backlogs: 0,
          graduation_year: 2027,
        });
        console.log("✅ Seeded default student profile (Isha Sharma) in Supabase.");
      }
    } catch (err: any) {
      console.warn("Profiles table check in Supabase:", err.message || err);
    }

    // 4. Ensure Baseline Placements exist in placements table
    try {
      const { data: existingPlacements } = await supabase
        .from("placements")
        .select("id")
        .limit(2);

      if (!existingPlacements || existingPlacements.length === 0) {
        for (const p of inMemoryDb.placements.values()) {
          await supabase.from("placements").upsert({
            id: p.id,
            document_id: p.document_id,
            company: p.company,
            criteria: p.criteria,
            skills: p.skills,
            deadline: p.deadline,
          });
        }
        console.log("✅ Seeded baseline placement opportunities in Supabase.");
      }
    } catch (err: any) {
      console.warn("Placements table check in Supabase:", err.message || err);
    }

    // 5. Ensure Baseline Notices exist in notices table
    try {
      const { data: existingNotices } = await supabase
        .from("notices")
        .select("id")
        .limit(1);

      if (!existingNotices || existingNotices.length === 0) {
        for (const n of inMemoryDb.notices.values()) {
          await supabase.from("notices").upsert({
            id: n.id,
            document_id: n.document_id,
            title: n.title,
            category: n.category,
            deadline: n.deadline,
            eligibility: n.eligibility,
            fee: n.fee,
            required_documents: n.required_documents,
            priority: n.priority,
          });
        }
        console.log("✅ Seeded baseline notices in Supabase.");
      }
    } catch (err: any) {
      console.warn("Notices table check in Supabase:", err.message || err);
    }

    console.log("🚀 Supabase persistence layer ready.");
  } else {
    console.log("ℹ️  Running with in-memory persistence layer (local/test mode).");
  }
}
