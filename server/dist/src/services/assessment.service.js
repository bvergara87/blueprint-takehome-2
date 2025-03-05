"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("./supabase.service");
let AssessmentService = class AssessmentService {
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
        this.loadData();
    }
    async loadData() {
        try {
            const { data: domainMappingsData, error: domainMappingsError } = await this.supabaseService.client.from("domain_mappings").select("*");
            if (domainMappingsError) {
                console.error("Error fetching domain mappings:", domainMappingsError);
                throw new Error("Failed to load domain mappings");
            }
            this.domainMappings = domainMappingsData;
            const { data: assessmentCriteriaData, error: assessmentCriteriaError } = await this.supabaseService.client
                .from("assessment_criteria")
                .select("*");
            if (assessmentCriteriaError) {
                console.error("Error fetching assessment criteria:", assessmentCriteriaError);
                throw new Error("Failed to load assessment criteria");
            }
            this.assessmentCriteria = assessmentCriteriaData;
        }
        catch (error) {
            console.error("Error loading data:", error);
            throw new Error("Failed to load required data");
        }
    }
    async scoreAnswers(answers) {
        const domainScores = this.calculateDomainScores(answers);
        const assessments = this.determineAssessments(domainScores);
        await this.storeResponse(answers, assessments);
        return [...new Set(assessments)];
    }
    calculateDomainScores(answers) {
        const domainScores = new Map();
        this.domainMappings.forEach((mapping) => {
            if (!domainScores.has(mapping.domain)) {
                domainScores.set(mapping.domain, 0);
            }
        });
        answers.forEach((answer) => {
            const mapping = this.domainMappings.find((m) => m.question_id === answer.question_id);
            if (mapping) {
                const currentScore = domainScores.get(mapping.domain) || 0;
                domainScores.set(mapping.domain, currentScore + answer.value);
            }
        });
        return domainScores;
    }
    determineAssessments(domainScores) {
        const recommendedAssessments = [];
        domainScores.forEach((score, domain) => {
            const criteria = this.assessmentCriteria.find((c) => c.domain === domain);
            if (criteria && score >= criteria.threshold) {
                recommendedAssessments.push(criteria.assessment);
            }
        });
        return recommendedAssessments;
    }
    async storeResponse(answers, results) {
        try {
            const { error } = await this.supabaseService.client
                .from("responses")
                .insert({
                answers,
                results: { results },
            });
            if (error) {
                console.error("Error storing response:", error);
            }
        }
        catch (error) {
            console.error("Error storing response:", error);
        }
    }
    async getScreener() {
        try {
            const { data, error } = await this.supabaseService.client
                .from("screeners")
                .select("data")
                .eq("id", "abcd-123")
                .single();
            if (error) {
                console.error("Error fetching screener:", error);
                throw new Error("Failed to load screener data");
            }
            return data.data;
        }
        catch (error) {
            console.error("Error loading screener data:", error);
            throw new Error("Failed to load screener data");
        }
    }
};
exports.AssessmentService = AssessmentService;
exports.AssessmentService = AssessmentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], AssessmentService);
//# sourceMappingURL=assessment.service.js.map