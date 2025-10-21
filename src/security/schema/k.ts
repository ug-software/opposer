import { Column, Entity } from "typeorm";
import Schema from "../../database/schema.js";
import f from "../../database/field.js"

@Entity('k')
export default class Key extends Schema {

  @Column({ type: "varchar" })
  hs = f.object().string("Campos necessariamente string").required("Campo obrigatorio");

  @Column({ type: "date", default: new Date() })
  ct = f.object().date("Campo necessariamente Date").default(new Date());

  @Column({ type: "date", default: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()) })
  ex = f.object().date("Campo necessariamente Date")
}

/*
  hs => key
  ct => created at
  ex => expires date
*/
