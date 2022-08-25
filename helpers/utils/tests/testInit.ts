// import { DataSource } from "typeorm/browser";
import { createDataSource } from "../../../database";

export class TestHelper {
  private static _instance: TestHelper;

  private constructor() {}

  public static get instance(): TestHelper {
    if (!this._instance) this._instance = new TestHelper();

    return this._instance;
  }

  public dbConnect!: any;

  async setupTestDB() {
    const host = process.env.DS_HOST || "";
    const port = parseInt(process.env.DS_PORT || "5432");
    const username = process.env.DS_USERNAME || "";
    const password = process.env.DS_PASSWORD || "";
    const database = process.env.DS_DATABASE || "";
    try {
      this.dbConnect = createDataSource({ host, port, username, password, database });
      await this.dbConnect.initialize();
      return;
    } catch (error) {
      console.error(error);
    }
  }

  async teardownTestDB() {
    try {
      await this.dbConnect.destroy();
    } catch (error) {
      console.error(error);
    }
  }
}
