import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { IEstimation } from '../events/interface/estimationInterface';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsKeyValueValidate implements ValidatorConstraintInterface {
  async validate(columnValue: IEstimation, args: ValidationArguments) {
    let isValidate = true;
    console.log(columnValue);
    Object.keys(columnValue).forEach((key) => {
      if (Number.isNaN(Number(key)) || typeof columnValue[key] !== 'boolean')
        isValidate = false;
    });
    return isValidate;
  }
  defaultMessage(args: ValidationArguments) {
    for (const [key, value] of Object.entries(args.value)) {
      if (Number.isNaN(Number(key))) return 'must be a number';
      if (typeof value !== 'boolean') return 'must be a boolean';
    }
  }
}
