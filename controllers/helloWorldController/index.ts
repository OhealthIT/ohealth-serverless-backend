import { User } from "database/entity";
import { HelloWorldRequestType } from "routes";
import { DataSource } from "typeorm/browser";

export const helloWorldController = async (req: HelloWorldRequestType, db: DataSource) => {
  const userRepo = db.getRepository(User);

  const user = userRepo.create({
    firstName: req.title,
    lastName: req.message,
    age: 18,
  });

  try {
    await userRepo.save(user);
  } catch (error) {}
  return `Hey this is a test: title ${user.firstName}, message: ${user.lastName}`;
};
