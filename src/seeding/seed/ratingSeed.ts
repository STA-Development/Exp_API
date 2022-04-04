import { Factory, Seeder } from "typeorm-seeding";
import {Connection, getConnectionManager, getRepository} from "typeorm";
import { ConnectionOptions } from "typeorm";
import { Rating } from "../../events/entity/rating";
import ormconfig from "../../../ormconfig";

export default class InitialDatabaseSeed implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<void> {

        await connection
                .createQueryBuilder()
                .insert()
                .into(Rating)
                .values([
                    { from: 1, to: 5, isSelected: false },
                    { from: 1, to: 10, isSelected: false },
                    { from: 1, to: 20, isSelected: false },
                ])
                .execute()
    }
}
