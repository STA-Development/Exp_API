import { Module } from "@nestjs/common";
import { UserModule } from "./userModule";
import { EventModule } from "./eventModule";

@Module({
  imports: [UserModule, EventModule],
})
export class AppModule {}
