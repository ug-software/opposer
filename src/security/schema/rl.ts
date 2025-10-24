import { Column, Entity, ManyToOne } from "typeorm";
import Schema from "../../database/schema.js";
import f from "../../database/field.js";
import { Field } from "../../decorators/index.js";
import User from "./usr.js";

@Entity("rl")
export default class Role extends Schema {
  @Column({ type: "varchar" })
  @Field(() => f().string("schema is string.").required("schema is required."))
  sm!: string;

  @Column({ type: "varchar" })
  @Field(() => f().string("method is string.").required("method is required."))
  mt!: string;

  @ManyToOne(() => User, (user) => user.rl)
  usr!: User;
}

/* 
    sm => schema,
    mt => method,
    usr => user
*/
