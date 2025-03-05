import {
  IsArray,
  IsNumber,
  IsString,
  ValidateNested,
  Min,
  Max,
} from "class-validator";
import { Type } from "class-transformer";

class AnswerDto {
  @IsNumber()
  @Min(0)
  @Max(4)
  value: number;

  @IsString()
  question_id: string;
}

export class ScoreAnswersDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  answers: AnswerDto[];
}
