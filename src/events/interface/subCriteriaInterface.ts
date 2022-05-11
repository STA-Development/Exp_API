import { UserSubCriteria } from '../entity/userSubCriteria';
import { Criteria } from '../entity/criteria';

export interface ISubCriteria {
  id: number;
  name: string;
  result: boolean;
  userSubCriteria: UserSubCriteria[];
  criteria: Criteria;
}
