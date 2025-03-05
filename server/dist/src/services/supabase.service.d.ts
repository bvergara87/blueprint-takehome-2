import { OnModuleInit } from "@nestjs/common";
import { SupabaseClient } from "@supabase/supabase-js";
export declare class SupabaseService implements OnModuleInit {
    private supabaseClient;
    constructor();
    onModuleInit(): void;
    get client(): SupabaseClient;
}
