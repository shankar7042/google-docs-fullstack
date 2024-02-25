import { Router } from "express";
import { userValidator } from "../validators/user.validator";
import { userController } from "../controllers/user/user.controller";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.post("/", userValidator.register, userController.register);

router.get("/:id", authenticate, userController.getUser);

router.post(
  "/reset-password",
  userValidator.resetPassword,
  userController.resetPassword
);

export default router;
