import Sequelize from "sequelize";
import sequelize from "../../config/db.config";
import { DocumentUser } from "./document-user.model";
import { Document } from "./document.model";
import { RefreshToken } from "./refresh-token";
import { Role } from "./role.model";
import { UserRole } from "./user-role.model";
import { User } from "./user.model";

sequelize.addModels([
  User,
  RefreshToken,
  Role,
  Document,
  UserRole,
  DocumentUser,
]);

const db = {
  Sequelize,
  sequelize,
  User,
  RefreshToken,
  Role,
  Document,
  UserRole,
  DocumentUser,
};

export default db;
