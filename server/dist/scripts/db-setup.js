"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const supabase_js_1 = require("@supabase/supabase-js");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
dotenv.config();
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials. Please check your .env file.");
  process.exit(1);
}
const supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  global: {
    fetch: (url, options) => {
      return fetch(
        url,
        Object.assign(Object.assign({}, options), { timeout: 60000 })
      );
    },
  },
});
const retryOperation = async (operation, maxRetries = 3, delay = 2000) => {
  let lastError;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      console.log(`Attempt ${attempt} failed. Retrying in ${delay}ms...`);
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= 2;
    }
  }
  throw lastError;
};
const setupDatabase = async () => {
  try {
    console.log("Setting up Supabase database...");
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
    console.log("Inserting screener data...");
    const screenerPath = path.join(
      __dirname,
      "..",
      "src",
      "data",
      "screener.json"
    );
    const screenerData = JSON.parse(fs.readFileSync(screenerPath, "utf8"));
    const simplifiedScreenerData = {
      id: screenerData.id,
      data: Object.assign({}, screenerData),
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
//# sourceMappingURL=db-setup.js.map
