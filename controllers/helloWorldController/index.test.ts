import { TestHelper } from "../../helpers/utils/tests/testInit";
import { helloWorldController } from "./index";

jest.mock("typeorm");
let db: any;
beforeAll(async () => {
  const testHelper = TestHelper.instance;
  await testHelper.setupTestDB();
  db = testHelper.dbConnect;
});

afterAll(async () => db.destroy());

describe("helloWorldController", async () => {
  it("should return a string", async () => {});
  await helloWorldController({ title: "hello world", message: "hello world" }, db);
});
