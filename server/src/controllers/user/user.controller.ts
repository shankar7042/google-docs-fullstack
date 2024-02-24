import { Request, Response } from "express";
import catchAsync from "../../middlewares/catch-async";
import { validationResult } from "express-validator";
import { userService } from "../../services/user.service";

class UserController {
  public register = catchAsync(async (req: Request, res: Response) => {
    const err = validationResult(req);

    if (!err.isEmpty) {
      return res.status(400).json(err);
    }

    const { email, password1 } = req.body;

    await userService.createUser(email, password1);

    return res.sendStatus(200);
  });
}

const userController = new UserController();

export { userController };
