import "reflect-metadata";
import { DataSource } from "typeorm";
const yaml = require("js-yaml");
const fs = require("fs");
const path = require("path");
import { entities } from "./entity";

//Data source for cli based activities such as migrations

const createAppDataSource = () => {
  const doc = yaml.load(fs.readFileSync(path.resolve(__dirname, "../secrets.yml"), "utf8")) as any;

  let enviroment = "staging";

  const index = process.argv.findIndex((arg) => arg === "--stage");

  if (index > -1 && index + 1 <= process.argv.length) {
    const stage = process.argv[index + 1];
    if (["staging", "production"].includes(stage)) {
      enviroment = stage;
    } else {
      throw new Error(`Invalid stage: ${stage}`);
    }
  }

  console.log("enviroment", enviroment);
  const ds = new DataSource({
    type: "postgres",
    host: doc[enviroment].DS_HOST,
    port: parseInt(doc[enviroment].DS_PORT),
    username: doc[enviroment].DS_USERNAME,
    password: doc[enviroment].DS_PASSWORD,
    database: doc[enviroment].DS_DATABASE,
    synchronize: true,
    logging: false,
    entities,
    migrations: ["./migration"],
    subscribers: [],
  });

  return ds;
};

export const AppDataSource = createAppDataSource();
