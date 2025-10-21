import { Column, Entity } from "typeorm";
import Schema from "../../database/schema.js";
import f from "../../database/field.js";
import { Field } from "../../decorators/index.js";

@Entity("ke")
export default class Key extends Schema {
  @Column({ type: "varchar" })
  @Field(() =>
    f().string("Campos necessariamente string").required("Campo obrigatorio")
  )
  hs!: string;

  @Column({ type: "date", default: new Date() })
  @Field(() => f().date("Campo necessariamente Date").default(new Date()))
  ct!: Date;

  @Column({
    type: "date",
    default: new Date(
      new Date().getFullYear() + 1,
      new Date().getMonth(),
      new Date().getDate()
    ),
  })
  @Field(() => f().date("Campo necessariamente Date"))
  ex!: Date;
}

/*
  hs => key
  ct => created at
  ex => expires date
*/
