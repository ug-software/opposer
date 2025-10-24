import { Column, CreateDateColumn, Entity } from "typeorm";
import Schema from "../../database/schema.js";
import f from "../../database/field.js";
import { Field } from "../../decorators/index.js";

@Entity("ke")
export default class Key extends Schema {
  @Column({ type: "varchar" })
  @Field(() =>
    f().string("key is string.").required("key is required.")
  )
  hs!: string;

  @CreateDateColumn()
  ct!: Date;

  @Column({
    type: "date",
    default: new Date(
      new Date().getFullYear() + 1,
      new Date().getMonth(),
      new Date().getDate()
    ),
  })
  @Field(() => f().date("expires is date."))
  ex!: Date;
}

/*
  hs => key
  ct => created at
  ex => expires date
*/
