import {Module} from '@nestjs/common'
import {SubCriteriaModule} from './subCriteriaModule'
import {EventModule} from './eventModule'
import {RatingModule} from './ratingModule'
import {CriteriaModule} from './criteriaModule'

@Module({
  imports: [RatingModule, CriteriaModule, SubCriteriaModule, EventModule],
  providers: [],
})
export class EventsModule {}
