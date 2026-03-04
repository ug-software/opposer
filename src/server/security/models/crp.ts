import {
  Entity,
  Field,
  PrimaryColumn,
  CreateDateColumn,
  f
} from "../../../orm/index.js";

@Entity("crp")
export default class ChangeRequestPassword {
  @PrimaryColumn({ type: "uuid" })
  id!: string;

  @Field(() => f().string("usr is string.").required("usr is required."))
  usr!: string;

  @Field(() => f().string("tk is string.").required("tk is required."))
  tk!: string;

  @Field(() => f().date("ex is date.").required("ex is required."))
  ex!: Date;

  @Field(() => f().boolean("ac is boolean.").required("ac is required."))
  ac!: boolean;

  @CreateDateColumn()
  ct!: Date;
}
