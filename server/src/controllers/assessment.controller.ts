import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { AssessmentService } from "../services/assessment.service";
import { ScoreAnswersDto } from "../dtos/score-answers.dto";
import { ScoreResultDto } from "../dtos/score-result.dto";

@Controller("assessments")
export class AssessmentController {
  constructor(private readonly assessmentService: AssessmentService) {}

  @Post("score")
  @UsePipes(new ValidationPipe({ transform: true }))
  async scoreAnswers(@Body() dto: ScoreAnswersDto): Promise<ScoreResultDto> {
    const results = await this.assessmentService.scoreAnswers(dto.answers);
    return { results };
  }

  @Get("screener")
  async getScreener() {
    return await this.assessmentService.getScreener();
  }
}
