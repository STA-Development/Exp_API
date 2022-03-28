import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Inject,
  UseInterceptors,
  ClassSerializerInterceptor,
} from "@nestjs/common";
import { EventsService } from "../service/eventService";
import { CreateEventDto } from "../dto/eventCreateDto";
import { UpdateEventDto } from "../dto/eventUpdateDto";
import { Event } from "../entity/event";
import { eventGetDto } from "../dto/eventGetDto";
import { UserRefDto } from "../dto/userRefDto";
import { Period } from "../interface/eventInterface";

@Controller("events")
export class EventsController {
  @Inject()
  eventsService: EventsService;

  @UseInterceptors(ClassSerializerInterceptor)
  @Put(":id/user")
  addUsers(
    @Param("id") eventId: number,
    @Body() userRef: UserRefDto
  ): Promise<Event> {
    return this.eventsService.addUsers(eventId, userRef);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  create(@Body() createEventDto: CreateEventDto): Promise<Event> {
    return this.eventsService.create(createEventDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll(): Promise<Event[]> {
    return (await this.eventsService.findAll()).map((event) => eventGetDto(event));
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get("/allByTitle/:title")
  async findAllByTitle(@Param("title") title: string): Promise<Event[]> {
    return (await this.eventsService.findAllByTitle(title)).map((event) => eventGetDto(event));
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(":id")
  async findOneById(@Param("id") id: number): Promise<Event> {
    return eventGetDto(await this.eventsService.findOneById(id));
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get("/byTitle/:title")
  async findOneByTitle(@Param("title") title: string): Promise<Event> {
    return eventGetDto(await this.eventsService.findOneByTitle(title));
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get("/byTimePeriod/:TimePeriod")
  async findOneByTimePeriod(@Param("TimePeriod") TimePeriod: Period): Promise<Event> {
    return eventGetDto(await this.eventsService.findOneByTimePeriod(TimePeriod));
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Put(":id")
  update(
    @Param("id") id: number,
    @Body() updateEventDto: UpdateEventDto
  ): Promise<Event> {
    return this.eventsService.update(id, updateEventDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(":id")
  remove(@Param("id") id: number): Promise<Event> {
    return this.eventsService.remove(id);
  }
}
