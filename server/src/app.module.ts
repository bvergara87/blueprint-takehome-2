import { Module } from "@nestjs/common";
import { AssessmentController } from "./controllers/assessment.controller";
import { AssessmentService } from "./services/assessment.service";
import { SupabaseService } from "./services/supabase.service";

@Module({
  imports: [],
  controllers: [AssessmentController],
  providers: [AssessmentService, SupabaseService],
})
export class AppModule {}
