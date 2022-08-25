import { DataSource } from "typeorm/browser";
import { entities } from "./entity";

// Data source initialized and used for in app logic
interface SourceInfo {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}
export const createDataSource = (info: SourceInfo) => {
  return new DataSource({
    type: "postgres",
    synchronize: true,
    logging: false,
    entities,
    ...info,
  });
};
