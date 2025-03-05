import { AssessmentService } from "../services/assessment.service";
import { ScoreAnswersDto } from "../dtos/score-answers.dto";
import { ScoreResultDto } from "../dtos/score-result.dto";
export declare class AssessmentController {
    private readonly assessmentService;
    constructor(assessmentService: AssessmentService);
    scoreAnswers(dto: ScoreAnswersDto): Promise<ScoreResultDto>;
    getScreener(): Promise<any>;
}
