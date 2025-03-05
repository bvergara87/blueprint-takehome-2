import { IsArray, IsString } from "class-validator";

export class ScoreResultDto {
  @IsArray()
  @IsString({ each: true })
  results: string[];
}
