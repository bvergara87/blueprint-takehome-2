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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentController = void 0;
const common_1 = require("@nestjs/common");
const assessment_service_1 = require("../services/assessment.service");
const score_answers_dto_1 = require("../dtos/score-answers.dto");
let AssessmentController = class AssessmentController {
    constructor(assessmentService) {
        this.assessmentService = assessmentService;
    }
    async scoreAnswers(dto) {
        const results = await this.assessmentService.scoreAnswers(dto.answers);
        return { results };
    }
    async getScreener() {
        return await this.assessmentService.getScreener();
    }
};
exports.AssessmentController = AssessmentController;
__decorate([
    (0, common_1.Post)("score"),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [score_answers_dto_1.ScoreAnswersDto]),
    __metadata("design:returntype", Promise)
], AssessmentController.prototype, "scoreAnswers", null);
__decorate([
    (0, common_1.Get)("screener"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AssessmentController.prototype, "getScreener", null);
exports.AssessmentController = AssessmentController = __decorate([
    (0, common_1.Controller)("assessments"),
    __metadata("design:paramtypes", [assessment_service_1.AssessmentService])
], AssessmentController);
//# sourceMappingURL=assessment.controller.js.map