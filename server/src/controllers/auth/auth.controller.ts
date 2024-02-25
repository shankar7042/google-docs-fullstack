import { Request, Response } from "express";
import { validationResult } from "express-validator";
import jwt, { VerifyErrors } from "jsonwebtoken";

import catchAsync from "../../middlewares/catch-async";
import { emailNotVerified, userNotFound } from "../../responses";
import { userService } from "../../services/user.service";

class AuthController {
  public login = catchAsync(async (req: Request, res: Response) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      return res.status(400).json(err);
    }

    const { email, password } = req.body;
    const user = await userService.findUserByEmail(email);
    if (!user) return res.status(401).json({ errors: userNotFound });

    const validPassword = await userService.checkPassword(user, password);
    if (!validPassword) return res.status(401).json({ errors: userNotFound });

    // if (!user.isVerified)
    //   return res.status(403).json({ errors: emailNotVerified });

    const authResponse = await userService.generateAuthResponse(user);
    return res.status(200).json(authResponse);
  });

  public refreshToken = catchAsync(async (req: Request, res: Response) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      return res.status(400).json(err);
    }

    const refreshToken = req.body.token;

    const isTokenActive = await userService.getIsTokenActive(refreshToken);

    if (!isTokenActive) {
      return res.sendStatus(403);
    }

    jwt.verify(
      refreshToken,
      "refresh_token",
      async (error: VerifyErrors | null, decoded: unknown) => {
        if (error) return res.sendStatus(403);

        try {
          const { id, email, roles } = decoded as RequestUser;
          const user = { id, email, roles };

          const authResponse = await userService.generateAuthResponse(user);
          return res.status(200).json(authResponse);
        } catch (e) {
          console.log(e);
          return res.sendStatus(403);
        }
      }
    );
  });

  public logout = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) return res.sendStatus(401);

    const userId = +req.user.id;
    await userService.logoutUser(userId);

    return res.sendStatus(200);
  });
}

const authController = new AuthController();

export { authController };
