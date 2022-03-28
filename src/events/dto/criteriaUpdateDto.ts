import { PartialType } from "@nestjs/mapped-types";
import { CreateCriteriaDto } from "./criteriaCreateDto";

export class UpdateCriteriaDto extends PartialType(CreateCriteriaDto) {}
