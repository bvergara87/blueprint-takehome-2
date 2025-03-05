import { Answer } from "../interfaces/answer.interface";
import { SupabaseService } from "./supabase.service";
export declare class AssessmentService {
    private readonly supabaseService;
    private domainMappings;
    private assessmentCriteria;
    constructor(supabaseService: SupabaseService);
    private loadData;
    scoreAnswers(answers: Answer[]): Promise<string[]>;
    private calculateDomainScores;
    private determineAssessments;
    private storeResponse;
    getScreener(): Promise<any>;
}
