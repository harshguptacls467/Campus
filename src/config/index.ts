import dotenv from "dotenv";
dotenv.config();

export interface Config {
  port: number;
  host: string;
  supabaseUrl: string | null;
  supabaseServiceKey: string | null;
  supabaseAnonKey: string | null;
  geminiApiKey: string | null;
  geminiModel: string;
  geminiFallbackModel: string;
  storageBucket: string;
  isMockDb: boolean;
  isMockGemini: boolean;
  rgpvBaseUrl: string;
  rgpvNoticesUrl: string;
  rgpvSourceName: string;
}

export const config: Config = {
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 5001,
  host: process.env.HOST || "0.0.0.0",
  supabaseUrl: process.env.SUPABASE_URL || null,
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || null,
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY || null,
  geminiApiKey: process.env.GEMINI_API_KEY || null,
  geminiModel: process.env.GEMINI_MODEL || "gemini-3.5-flash",
  geminiFallbackModel: process.env.GEMINI_FALLBACK_MODEL || "gemini-3.1-flash-lite",
  storageBucket: process.env.STORAGE_BUCKET || "campus-documents",
  isMockDb: !process.env.SUPABASE_URL,
  isMockGemini: !process.env.GEMINI_API_KEY,
  rgpvBaseUrl: process.env.RGPV_BASE_URL || "https://www.rgpv.ac.in",
  rgpvNoticesUrl: process.env.RGPV_NOTICES_URL || "https://www.rgpv.ac.in/Uni/ImpNoticeArchive.aspx",
  rgpvSourceName: process.env.RGPV_SOURCE_NAME || "RGPV Bhopal",
};
