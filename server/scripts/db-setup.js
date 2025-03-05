import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

// ES Module equivalent for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Initialize Supabase client with additional options
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials. Please check your .env file.");
  process.exit(1);
}

// Create Supabase client with fetch options to increase timeout
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  global: {
    fetch: (url, options) => {
      return fetch(url, {
        ...options,
        timeout: 60000, // Increase timeout to 60 seconds
      });
    },
  },
});
// Helper function to retry operations
const retryOperation = async (operation, maxRetries = 3, delay = 2000) => {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      console.log(`Attempt ${attempt} failed. Retrying in ${delay}ms...`);
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, delay));
      // Increase delay for next attempt (exponential backoff)
      delay *= 2;
    }
  }

  throw lastError;
};

const setupDatabase = async () => {
  try {
    console.log("Setting up Supabase database...");

    // Read SQL file
    // const sqlPath = path.join(__dirname, "..", "sql", "database.sql");
    // const sqlCommands = fs.readFileSync(sqlPath, "utf8");

    // Execute SQL commands
    // try {
    //   console.log("Creating database schema...");
    //   const { error: sqlError } = await supabase.rpc("exec_sql", {
    //     sql_commands: sqlCommands,
    //   });
    //   if (sqlError) {
    //     console.error("Error executing SQL commands:", sqlError);
    //     console.log("Continuing with setup as tables might already exist...");
    //   } else {
    //     console.log("Database schema created successfully.");
    //   }
    // } catch (error) {
    //   console.error("Error executing SQL commands:", error);
    //   console.log("Continuing with setup as tables might already exist...");
    // }

    // 1. Insert domain mappings data
    console.log("Inserting domain mappings data...");
    const domainMappingsPath = path.join(
      __dirname,
      "..",
      "src",
      "data",
      "domain-mapping.json"
    );
    const domainMappingsData = JSON.parse(
      fs.readFileSync(domainMappingsPath, "utf8")
    );

    console.log(domainMappingsData);
    const { data, error } = await supabase.from("domain_mappings").select("*");
    await retryOperation(async () => {
      const { error: insertDomainMappingsError } = await supabase
        .from("domain_mappings")
        .upsert(domainMappingsData, { onConflict: "question_id" });

      if (insertDomainMappingsError) {
        console.error(
          "Error inserting domain mappings:",
          insertDomainMappingsError
        );
        throw insertDomainMappingsError;
      } else {
        console.log("Domain mappings inserted successfully.");
      }
    });

    // 2. Insert assessment criteria data
    console.log("Inserting assessment criteria data...");
    const assessmentCriteriaPath = path.join(
      __dirname,
      "..",
      "src",
      "data",
      "assessment-criteria.json"
    );
    const assessmentCriteriaData = JSON.parse(
      fs.readFileSync(assessmentCriteriaPath, "utf8")
    );

    await retryOperation(async () => {
      const { error: insertAssessmentCriteriaError } = await supabase
        .from("assessment_criteria")
        .upsert(assessmentCriteriaData, { onConflict: "domain" });

      if (insertAssessmentCriteriaError) {
        console.error(
          "Error inserting assessment criteria:",
          insertAssessmentCriteriaError
        );
        throw insertAssessmentCriteriaError;
      } else {
        console.log("Assessment criteria inserted successfully.");
      }
    });

    // 3. Insert screener data
    console.log("Inserting screener data...");
    const screenerPath = path.join(
      __dirname,
      "..",
      "src",
      "data",
      "screener.json"
    );
    const screenerData = JSON.parse(fs.readFileSync(screenerPath, "utf8"));

    // Simplify the screener data to reduce payload size if needed
    const simplifiedScreenerData = {
      id: screenerData.id,
      data: {
        ...screenerData,
        // Remove any unnecessary large fields if needed
        // For example, if there are large arrays or nested objects that aren't essential
      },
    };

    await retryOperation(async () => {
      const { error: insertScreenerError } = await supabase
        .from("screeners")
        .upsert(simplifiedScreenerData, { onConflict: "id" });

      if (insertScreenerError) {
        console.error("Error inserting screener:", insertScreenerError);
        throw insertScreenerError;
      } else {
        console.log("Screener data inserted successfully.");
      }
    });

    console.log("Database setup completed successfully!");
  } catch (error) {
    console.error("Error setting up database:", error);
    process.exit(1);
  }
};

// Execute the setup
console.log("Starting database setup...");
setupDatabase()
  .then(() => {
    console.log("Database setup completed.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Database setup failed:", error);
    process.exit(1);
  });
