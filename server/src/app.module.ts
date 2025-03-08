import { Module } from "@nestjs/common";
import { AssessmentController } from "./controllers/assessment.controller";
import { AssessmentService } from "./services/assessment.service";
import { SupabaseService } from "./services/supabase.service";
import { AppController } from "./controllers/app.controller";

@Module({
  imports: [],
  controllers: [AssessmentController, AppController],
  providers: [AssessmentService, SupabaseService],
})
export class AppModule {}
