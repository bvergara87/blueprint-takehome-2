import { Injectable, OnModuleInit } from "@nestjs/common";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config();

@Injectable()
export class SupabaseService implements OnModuleInit {
  private supabaseClient: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        "Missing Supabase credentials. Please check your .env file."
      );
    }

    this.supabaseClient = createClient(supabaseUrl, supabaseKey);
  }

  onModuleInit() {
    console.log("Supabase client initialized");
  }

  get client(): SupabaseClient {
    return this.supabaseClient;
  }
}
