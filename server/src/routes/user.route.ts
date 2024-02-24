import { Router } from "express";
import { userValidator } from "../validators/user.validator";
import { userController } from "../controllers/user/user.controller";

const router = Router();

router.post("/", userValidator.register, userController.register);

export default router;
