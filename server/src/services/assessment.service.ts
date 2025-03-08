import { Injectable } from "@nestjs/common";
import { Answer } from "../interfaces/answer.interface";
import { DomainMapping } from "../interfaces/domain-mapping.interface";
import { AssessmentCriteria } from "../interfaces/assessment-criteria.interface";
import { SupabaseService } from "./supabase.service";

@Injectable()
export class AssessmentService {
  private domainMappings: DomainMapping[];
  private assessmentCriteria: AssessmentCriteria[];

  constructor(private readonly supabaseService: SupabaseService) {
    this.loadData();
  }

  private async loadData(): Promise<void> {
    try {
      // Load domain mappings from database
      const { data: domainMappingsData, error: domainMappingsError } =
        await this.supabaseService.client.from("domain_mappings").select("*");

      if (domainMappingsError) {
        console.error("Error fetching domain mappings:", domainMappingsError);
        throw new Error("Failed to load domain mappings");
      }

      this.domainMappings = domainMappingsData;

      // Load assessment criteria from database
      const { data: assessmentCriteriaData, error: assessmentCriteriaError } =
        await this.supabaseService.client
          .from("assessment_criteria")
          .select("*");

      if (assessmentCriteriaError) {
        console.error(
          "Error fetching assessment criteria:",
          assessmentCriteriaError
        );
        throw new Error("Failed to load assessment criteria");
      }

      this.assessmentCriteria = assessmentCriteriaData;
    } catch (error) {
      console.error("Error loading data:", error);
      throw new Error("Failed to load required data");
    }
  }

  async scoreAnswers(answers: Answer[]): Promise<string[]> {
    // Calculate domain scores
    const domainScores = this.calculateDomainScores(answers);

    // Determine which assessments should be assigned
    const assessments = this.determineAssessments(domainScores);

    // Store the response in the database
    await this.storeResponse(answers, assessments);

    // Remove duplicates and return
    return [...new Set(assessments)];
  }

  private calculateDomainScores(answers: Answer[]): Map<string, number> {
    const domainScores = new Map<string, number>();

    // Initialize all domains with a score of 0
    this.domainMappings.forEach((mapping) => {
      if (!domainScores.has(mapping.domain)) {
        domainScores.set(mapping.domain, 0);
      }
    });

    // Add scores for each answer
    answers.forEach((answer) => {
      const mapping = this.domainMappings.find(
        (m) => m.question_id === answer.question_id
      );

      if (mapping) {
        const currentScore = domainScores.get(mapping.domain) || 0;
        domainScores.set(mapping.domain, currentScore + answer.value);
      }
    });

    return domainScores;
  }

  private determineAssessments(domainScores: Map<string, number>): string[] {
    const recommendedAssessments: string[] = [];

    // Check each domain against criteria
    domainScores.forEach((score, domain) => {
      const criteria = this.assessmentCriteria.find((c) => c.domain === domain);

      if (criteria && score >= criteria.threshold) {
        recommendedAssessments.push(criteria.assessment);
      }
    });

    return recommendedAssessments;
  }

  private async storeResponse(
    answers: Answer[],
    results: string[]
  ): Promise<void> {
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
    } catch (error) {
      console.error("Error storing response:", error);
    }
  }

  async getScreener(): Promise<any> {
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

      return data;
    } catch (error) {
      console.error("Error loading screener data:", error);
      throw new Error("Failed to load screener data");
    }
  }
}
