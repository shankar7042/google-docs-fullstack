import { compare, genSalt, hash } from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../db/models/user.model";
import { RefreshToken } from "../db/models/refresh-token";

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

  public checkPassword = async (
    user: User,
    password: string
  ): Promise<boolean> => {
    return await compare(password, user.password);
  };

  public getRequestUser = async (
    user: RequestUser | User
  ): Promise<RequestUser> => {
    if (user instanceof User) {
      const userWithRoles = await User.scope("withRoles").findByPk(user.id);
      const roles = userWithRoles?.userRoles.map(
        (userRole) => userRole.role.name
      );

      return {
        id: user.id,
        email: user.email,
        roles,
      } as RequestUser;
    }
    return user;
  };

  public generateAuthResponse = async (
    user: RequestUser | User
  ): Promise<TokenPair> => {
    const requestUser = await this.getRequestUser(user);

    const accessToken = jwt.sign(requestUser, "access_token", {
      expiresIn: "24h",
    });

    const refreshToken = jwt.sign(requestUser, "refresh_token", {
      expiresIn: "24h",
    });

    await RefreshToken.destroy({
      where: {
        userId: requestUser.id,
      },
    });

    await RefreshToken.create({
      token: refreshToken,
      userId: requestUser.id,
    });

    return { accessToken, refreshToken };
  };

  public getIsTokenActive = async (token: string): Promise<boolean> => {
    const refreshToken = await RefreshToken.findOne({
      where: {
        token,
      },
    });

    return refreshToken !== null;
  };

  public logoutUser = async (userId: number) => {
    return await RefreshToken.destroy({
      where: {
        userId,
      },
    });
  };

  public getUserById = async (userId: number): Promise<User | null> => {
    return await User.findByPk(userId);
  };

  public resetPassword = async (user: User) => {
    const passwordResetToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      "password_reset",
      {
        expiresIn: "24h",
      }
    );

    await user.update({
      passwordResetToken,
    });

    // send password reset email to the user
  };
}

const userService = new UserService();

export { userService };
