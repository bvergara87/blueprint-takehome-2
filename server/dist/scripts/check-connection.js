"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const supabase_js_1 = require("@supabase/supabase-js");
const dotenv = require("dotenv");
dotenv.config();
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials. Please check your .env file.");
    process.exit(1);
}
console.log("Supabase URL:", supabaseUrl);
console.log("API Key (first 10 chars):", supabaseKey);
const supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
const checkConnection = async () => {
    try {
        console.log("Checking Supabase connection...");
        const { data, error } = await supabase.rpc("get_server_timestamp");
        if (error) {
            console.error("Connection test failed:", error);
            console.log("Trying a simple query...");
            const { error: simpleError } = await supabase
                .from("domain_mappings")
                .select("count", { count: "exact", head: true });
            if (simpleError) {
                console.error("Simple query failed:", simpleError);
                return false;
            }
            else {
                console.log("Simple query succeeded. Connection is working but RPC failed.");
                return true;
            }
        }
        console.log("Connection successful! Server timestamp:", data);
        return true;
    }
    catch (error) {
        console.error("Connection test threw an exception:", error);
        return false;
    }
};
checkConnection()
    .then((isConnected) => {
    if (isConnected) {
        console.log("✅ Supabase connection is working properly.");
        process.exit(0);
    }
    else {
        console.error("❌ Failed to connect to Supabase.");
        process.exit(1);
    }
})
    .catch((error) => {
    console.error("❌ Error checking connection:", error);
    process.exit(1);
});
//# sourceMappingURL=check-connection.js.map