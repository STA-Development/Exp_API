import {Factory, Seeder} from 'typeorm-seeding'
import {Connection} from 'typeorm'
import {Rating} from '../../events/entity/rating'

export default class InitialDatabaseSeed implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(Rating)
      .values([
        {from: 1, to: 5, isSelected: false},
        {from: 1, to: 10, isSelected: true},
        {from: 1, to: 20, isSelected: false},
      ])
      .execute()
  }
}
