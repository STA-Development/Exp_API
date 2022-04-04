import {forwardRef, MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import {SubCriteriaModule} from './subCriteriaModule';
import {EventModule} from './eventModule';
import {RatingModule} from './ratingModule';
import {CriteriaModule} from './criteriaModule';
import {eventLogger} from "../../logger";

@Module({
  imports: [

   // forwardRef(() => Logger),
    RatingModule,
    CriteriaModule,
    SubCriteriaModule,
    EventModule,
  ], // , Logger

        // .apply(eventLogger)
        // .forRoutes('cats');
  providers: [],
})
export class EventsModule {}
