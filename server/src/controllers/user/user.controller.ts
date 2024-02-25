import { Request, Response } from "express";
import jwt, { VerifyErrors } from "jsonwebtoken";
import catchAsync from "../../middlewares/catch-async";
import { validationResult } from "express-validator";
import { userService } from "../../services/user.service";
import { resetPassword as resetPasswordResponse } from "../../responses/index";

class UserController {
  public register = catchAsync(async (req: Request, res: Response) => {
    const err = validationResult(req);

    if (!err.isEmpty()) {
      return res.status(400).json(err);
    }

    const { email, password1 } = req.body;

    await userService.createUser(email, password1);

    return res.sendStatus(200);
  });

  public getUser = catchAsync(async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);

    const user = await userService.getUserById(userId);

    if (user === null) return res.sendStatus(400);

    return res.status(200).json(user);
  });

  public resetPassword = catchAsync(async (req: Request, res: Response) => {
    const err = validationResult(req);
    if (!err.isEmpty()) return res.status(400).json(err);

    const { email } = req.body;

    const user = await userService.findUserByEmail(email);

    if (!user) return res.status(200).json(resetPasswordResponse);

    await userService.resetPassword(user);

    return res.status(200).json(resetPasswordResponse);
  });

  public verifyEmail = catchAsync(async (req: Request, res: Response) => {
    const token = req.params.token;

    jwt.verify(
      token,
      "verify_token",
      (err: VerifyErrors | null, decoded: unknown) => {
        if (err) return res.sendStatus(403);
        try {
          const { email } = decoded as { email: string };
          userService
            .findUserByVerificationToken(email, token)
            .then((user) => {
              if (!user || user.isVerified) return res.sendStatus(400);

              userService
                .updateIsVerified(user, true)
                .then(() => {
                  return res.sendStatus(200);
                })
                .catch(() => {
                  return res.sendStatus(500);
                });
            })
            .catch(() => {
              return res.sendStatus(500);
            });
        } catch (error) {
          console.log(error);
          return res.sendStatus(403);
        }
      }
    );
  });

  public confirmResetPassword = catchAsync(
    async (req: Request, res: Response) => {
      const err = validationResult(req);
      if (!err.isEmpty()) return res.status(400).json(err);

      const resetPasswordToken = req.params.token;
      const { password1 } = req.body;

      jwt.verify(
        resetPasswordToken,
        "password_reset",
        (err: VerifyErrors | null, decoded: unknown) => {
          if (err) return res.sendStatus(403);
          try {
            const { email } = decoded as { email: string };
            userService
              .findUserByPasswordResetToken(email, resetPasswordToken)
              .then((user) => {
                if (!user) return res.sendStatus(400);

                userService
                  .updatePassword(user, password1)
                  .then(() => {
                    return res.status(200);
                  })
                  .catch(() => {
                    return res.sendStatus(500);
                  });
              })
              .catch(() => {
                return res.sendStatus(500);
              });
          } catch (error) {
            console.log(error);
            return res.sendStatus(403);
          }
        }
      );
    }
  );
}

const userController = new UserController();

export { userController };
