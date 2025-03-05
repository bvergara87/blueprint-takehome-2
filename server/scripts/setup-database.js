import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

// Load environment variables
dotenv.config();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials. Please check your .env file.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const setupDatabase = async () => {
  try {
    console.log("Setting up Supabase database...");

    // 1. Create domain_mappings table and insert data
    console.log("Creating domain_mappings table...");
    const { error: createDomainMappingsError } = await supabase.rpc(
      "create_domain_mappings_table"
    );

    if (
      createDomainMappingsError &&
      !createDomainMappingsError.message.includes("already exists")
    ) {
      console.error(
        "Error creating domain_mappings table:",
        createDomainMappingsError
      );
    } else {
      // Read domain mappings data
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

      // Insert domain mappings
      console.log("Inserting domain mappings data...");
      const { error: insertDomainMappingsError } = await supabase
        .from("domain_mappings")
        .upsert(domainMappingsData, { onConflict: "question_id" });

      if (insertDomainMappingsError) {
        console.error(
          "Error inserting domain mappings:",
          insertDomainMappingsError
        );
      }
    }

    // 2. Create assessment_criteria table and insert data
    console.log("Creating assessment_criteria table...");
    const { error: createAssessmentCriteriaError } = await supabase.rpc(
      "create_assessment_criteria_table"
    );

    if (
      createAssessmentCriteriaError &&
      !createAssessmentCriteriaError.message.includes("already exists")
    ) {
      console.error(
        "Error creating assessment_criteria table:",
        createAssessmentCriteriaError
      );
    } else {
      // Read assessment criteria data
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

      // Insert assessment criteria
      console.log("Inserting assessment criteria data...");
      const { error: insertAssessmentCriteriaError } = await supabase
        .from("assessment_criteria")
        .upsert(assessmentCriteriaData, { onConflict: "domain" });

      if (insertAssessmentCriteriaError) {
        console.error(
          "Error inserting assessment criteria:",
          insertAssessmentCriteriaError
        );
      }
    }

    // 3. Create screeners table and insert data
    console.log("Creating screeners table...");
    const { error: createScreenersError } = await supabase.rpc(
      "create_screeners_table"
    );

    if (
      createScreenersError &&
      !createScreenersError.message.includes("already exists")
    ) {
      console.error("Error creating screeners table:", createScreenersError);
    } else {
      // Read screener data
      const screenerPath = path.join(
        __dirname,
        "..",
        "src",
        "data",
        "screener.json"
      );
      const screenerData = JSON.parse(fs.readFileSync(screenerPath, "utf8"));

      // Insert screener
      console.log("Inserting screener data...");
      const { error: insertScreenerError } = await supabase
        .from("screeners")
        .upsert(
          {
            id: screenerData.id,
            data: screenerData,
          },
          { onConflict: "id" }
        );

      if (insertScreenerError) {
        console.error("Error inserting screener:", insertScreenerError);
      }
    }

    console.log("Database setup completed successfully!");
  } catch (error) {
    console.error("Error setting up database:", error);
  }
};

// SQL functions to create tables
const createTableFunctions = async () => {
  // Create function to create domain_mappings table
  const { error: createDomainMappingsFunctionError } = await supabase.rpc(
    "create_function_domain_mappings"
  );
  if (createDomainMappingsFunctionError) {
    console.error(
      "Error creating domain_mappings function:",
      createDomainMappingsFunctionError
    );
  }

  // Create function to create assessment_criteria table
  const { error: createAssessmentCriteriaFunctionError } = await supabase.rpc(
    "create_function_assessment_criteria"
  );
  if (createAssessmentCriteriaFunctionError) {
    console.error(
      "Error creating assessment_criteria function:",
      createAssessmentCriteriaFunctionError
    );
  }

  // Create function to create screeners table
  const { error: createScreenersFunctionError } = await supabase.rpc(
    "create_function_screeners"
  );
  if (createScreenersFunctionError) {
    console.error(
      "Error creating screeners function:",
      createScreenersFunctionError
    );
  }
};

// Execute the setup
(async () => {
  await createTableFunctions();
  await setupDatabase();
})();
