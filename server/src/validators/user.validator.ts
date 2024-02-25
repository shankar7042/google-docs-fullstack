import { body } from "express-validator";
import { userService } from "../services/user.service";

class UserValidator {
  public register = [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Must provide a valid email address"),

    body("email").custom(async (email) => {
      const user = await userService.findUserByEmail(email);
      if (user) {
        return Promise.reject(`User with ${email} already exists`);
      }
      return true;
    }),

    body("password1")
      .isLength({ min: 8, max: 25 })
      .withMessage("Password length must be between 8 to 25 characters"),

    body("password1")
      .matches(/\d/)
      .withMessage("Password must contain atleast 1 number"),

    body("password1").custom((value, { req }) => {
      if (value !== req.body.password1) {
        throw new Error("Passwords must match");
      }
      return true;
    }),
  ];

  public resetPassword = [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Must provide a valid email address"),
  ];
}

const userValidator = new UserValidator();

export { userValidator };
