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
const supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
const setupDatabase = async () => {
    try {
        console.log("Setting up Supabase database...");
        console.log("Creating domain_mappings table...");
        const { error: createDomainMappingsError } = await supabase.rpc("create_domain_mappings_table");
        if (createDomainMappingsError &&
            !createDomainMappingsError.message.includes("already exists")) {
            console.error("Error creating domain_mappings table:", createDomainMappingsError);
        }
        else {
            const domainMappingsPath = path.join(__dirname, "..", "src", "data", "domain-mapping.json");
            const domainMappingsData = JSON.parse(fs.readFileSync(domainMappingsPath, "utf8"));
            console.log("Inserting domain mappings data...");
            const { error: insertDomainMappingsError } = await supabase
                .from("domain_mappings")
                .upsert(domainMappingsData, { onConflict: "question_id" });
            if (insertDomainMappingsError) {
                console.error("Error inserting domain mappings:", insertDomainMappingsError);
            }
        }
        console.log("Creating assessment_criteria table...");
        const { error: createAssessmentCriteriaError } = await supabase.rpc("create_assessment_criteria_table");
        if (createAssessmentCriteriaError &&
            !createAssessmentCriteriaError.message.includes("already exists")) {
            console.error("Error creating assessment_criteria table:", createAssessmentCriteriaError);
        }
        else {
            const assessmentCriteriaPath = path.join(__dirname, "..", "src", "data", "assessment-criteria.json");
            const assessmentCriteriaData = JSON.parse(fs.readFileSync(assessmentCriteriaPath, "utf8"));
            console.log("Inserting assessment criteria data...");
            const { error: insertAssessmentCriteriaError } = await supabase
                .from("assessment_criteria")
                .upsert(assessmentCriteriaData, { onConflict: "domain" });
            if (insertAssessmentCriteriaError) {
                console.error("Error inserting assessment criteria:", insertAssessmentCriteriaError);
            }
        }
        console.log("Creating screeners table...");
        const { error: createScreenersError } = await supabase.rpc("create_screeners_table");
        if (createScreenersError &&
            !createScreenersError.message.includes("already exists")) {
            console.error("Error creating screeners table:", createScreenersError);
        }
        else {
            const screenerPath = path.join(__dirname, "..", "src", "data", "screener.json");
            const screenerData = JSON.parse(fs.readFileSync(screenerPath, "utf8"));
            console.log("Inserting screener data...");
            const { error: insertScreenerError } = await supabase
                .from("screeners")
                .upsert({
                id: screenerData.id,
                data: screenerData,
            }, { onConflict: "id" });
            if (insertScreenerError) {
                console.error("Error inserting screener:", insertScreenerError);
            }
        }
        console.log("Database setup completed successfully!");
    }
    catch (error) {
        console.error("Error setting up database:", error);
    }
};
const createTableFunctions = async () => {
    const { error: createDomainMappingsFunctionError } = await supabase.rpc("create_function_domain_mappings");
    if (createDomainMappingsFunctionError) {
        console.error("Error creating domain_mappings function:", createDomainMappingsFunctionError);
    }
    const { error: createAssessmentCriteriaFunctionError } = await supabase.rpc("create_function_assessment_criteria");
    if (createAssessmentCriteriaFunctionError) {
        console.error("Error creating assessment_criteria function:", createAssessmentCriteriaFunctionError);
    }
    const { error: createScreenersFunctionError } = await supabase.rpc("create_function_screeners");
    if (createScreenersFunctionError) {
        console.error("Error creating screeners function:", createScreenersFunctionError);
    }
};
(async () => {
    await createTableFunctions();
    await setupDatabase();
})();
//# sourceMappingURL=setup-database.js.map