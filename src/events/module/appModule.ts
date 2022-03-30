import {Logger, Module} from "@nestjs/common";
import { SubCriteriaModule } from "./subCriteriaModule";
import { EventModule } from "./eventModule";
import {CriteriaModule} from "./criteriaModule";

@Module({
    imports: [ CriteriaModule, SubCriteriaModule, EventModule],  // , Logger
})
export class EventsModule {}
