import * as dayjs from 'dayjs';
import { INotEvaluated } from '../events/interface/notEvaluatedEvaluators';

export const getNotEvaluatedEvaluators = (evaluationPairs): INotEvaluated[] => {
  const notEvaluatedEvaluatees: INotEvaluated[] = [];
  let notEvaluatedCounter = 0;

  for (let i = 0; i < evaluationPairs.length; i++) {
    let uniquenessCounter = 0;
    for (let j = 0; j < evaluationPairs.length; j++) {
      if (evaluationPairs[i].evaluatorId !== evaluationPairs[j].evaluateeId) {
        uniquenessCounter++;
      }
    }

    if (uniquenessCounter === evaluationPairs.length) {
      notEvaluatedEvaluatees[notEvaluatedCounter++] = {
        firstName: evaluationPairs[i].firstName,
        lastName: evaluationPairs[i].lastName,
        lastEvaluated:
          evaluationPairs[i].lastEvent !== null
            ? String(dayjs().diff(evaluationPairs[i].lastEvent, 'month')) !==
              '0'
              ? `${dayjs().diff(
                  evaluationPairs[i].lastEvent,
                  'month'
                )} month(s) ago`
              : `${dayjs().diff(
                  evaluationPairs[i].lastEvent,
                  'day'
                )} day(s) ago`
            : 'Not evaluated yet'
      };
    }
  }

  return notEvaluatedEvaluatees.filter(
    (notEvaluated, index) =>
      index ===
      notEvaluatedEvaluatees.findIndex(
        (notEvaluatedEvaluatee) =>
          JSON.stringify(notEvaluatedEvaluatee) === JSON.stringify(notEvaluated)
      )
  );
};
