import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials. Please check your .env file.");
  process.exit(1);
}

console.log("Supabase URL:", supabaseUrl);
console.log("API Key (first 10 chars):", supabaseKey.substring(0, 10) + "...");

// Create Supabase client with custom fetch options
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
  },
  global: {
    fetch: (url, options) => {
      console.log(`Making request to: ${url}`);
      return fetch(url, {
        ...options,
        timeout: 10000, // 10 second timeout
      });
    },
  },
});

const checkConnection = async () => {
  try {
    console.log("Checking Supabase connection...");

    // Check internet connectivity first
    try {
      console.log("Testing internet connectivity...");
      const internetTest = await fetch("https://www.google.com", {
        timeout: 5000,
      });
      if (internetTest.ok) {
        console.log("Internet connectivity confirmed.");
      } else {
        console.warn(
          "Internet connectivity test returned status:",
          internetTest.status
        );
      }
    } catch (netError) {
      console.error("Internet connectivity test failed:", netError.message);
      console.error(
        "This suggests a network connectivity issue that may prevent Supabase connection."
      );
    }

    // Try to get the server timestamp
    const { data, error } = await supabase.rpc("get_server_timestamp");

    if (error) {
      console.error("Connection test failed:", error);

      // Try a simpler query if the RPC fails
      console.log("Trying a simpler query...");
      const { error: simpleError } = await supabase
        .from("domain_mappings")
        .select("count", { count: "exact", head: true });

      if (simpleError) {
        console.error("Simple query failed:", simpleError);

        if (
          simpleError.message &&
          simpleError.message.includes("fetch failed")
        ) {
          console.error(
            "\nThis is likely a network connectivity issue. Please check:"
          );
          console.error("1. Your internet connection is working");
          console.error(
            "2. Any VPN or firewall settings that might block the connection"
          );
          console.error("3. The Supabase URL is correct and the service is up");
        }

        return false;
      } else {
        console.log(
          "Simple query succeeded. Connection is working but RPC failed."
        );
        return true;
      }
    }

    console.log("Connection successful! Server timestamp:", data);
    return true;
  } catch (error) {
    console.error("Connection test threw an exception:", error);

    if (error.message && error.message.includes("fetch")) {
      console.error(
        "\nThis is likely a network connectivity issue. Please check:"
      );
      console.error("1. Your internet connection is working");
      console.error(
        "2. Any VPN or firewall settings that might block the connection"
      );
      console.error("3. The Supabase URL is correct and the service is up");
    }

    return false;
  }
};

// Execute the check
checkConnection()
  .then((isConnected) => {
    if (isConnected) {
      console.log("✅ Supabase connection is working properly.");
      process.exit(0);
    } else {
      console.error("❌ Failed to connect to Supabase.");
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error("❌ Error checking connection:", error);
    process.exit(1);
  });
