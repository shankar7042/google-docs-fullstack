import { genSalt, hash } from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../db/models/user.model";

class UserService {
  public findUserByEmail = async (email: string): Promise<User | null> => {
    const user = await User.findOne({ where: { email: email } });
    return user;
  };

  public createUser = async (email: string, password: string) => {
    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);
    const verificationToken = jwt.sign({ email }, "some very secret key");
    const user = User.create({
      email: email,
      password: hashedPassword,
      verificationToken: verificationToken,
    });
  };
}

const userService = new UserService();

export { userService };
