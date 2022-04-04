import {Rating} from "./src/events/entity/rating";
import {Event} from "./src/events/entity/event";

export default {
  // host: process.env.DB_HOST,
  // port: +process.env.DB_PORT,
  // username: process.env.DB_USERNAME,
  // password: process.env.DB_PASSWORD,
  // database: process.env.DB_DATABASE,
  // connection: "mysql",
  // name: "mysql",
  // default: "mysql",
  type: "mysql",
  entities: ["src/events/entity/rating.ts"], //"src/events/entity/rating.ts"
  synchronize: true,
  factories: ["src/seeding/factory/*.ts"],
  seeds: ["src/seeding/seed/*.ts"],
  socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock',
};
