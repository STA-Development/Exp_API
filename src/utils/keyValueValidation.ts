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
  async validate(columnValue: IEstimation) {
    let isValidate = true;

    Object.keys(columnValue).forEach((key) => {
      if (typeof key !== 'number' || typeof columnValue[key] !== 'number')
        isValidate = false;
    });
    return isValidate;
  }

  defaultMessage(args: ValidationArguments) {
    for (const [key, value] of Object.entries(args.value)) {
      if (typeof key !== 'number') return 'must be a number';
      if (typeof value !== 'number') return 'must be a number';
    }
  }
}
