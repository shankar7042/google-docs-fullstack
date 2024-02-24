import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  PrimaryKey,
  Table,
  Model,
} from "sequelize-typescript";
import PermissionEnum from "../../types/enums/permission-enum";
import { User } from "./user.model";
import { Document } from "./document.model";

@Table({ tableName: "document_user", underscored: true })
class DocumentUser extends Model {
  @Column(DataType.ENUM("VIEW", "EDIT"))
  permission!: PermissionEnum;

  @ForeignKey(() => User)
  @PrimaryKey
  @Column
  userId!: number;

  @BelongsTo(() => User)
  user!: User;

  @ForeignKey(() => Document)
  @PrimaryKey
  @Column
  documentId!: number;

  @BelongsTo(() => Document)
  document!: Document;
}

export { DocumentUser };
