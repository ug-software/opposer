import Schema from "../../database/schema";
import rl from "./rl";

const urs = Schema("urs", (f) => ({
  fn: f.string("").required(""),
  lm: f.string("").required(""),
  em: f.string("").required("").match(RegExp(""), ""),
  ps: f.string("").required(""),
  ac: f.boolean("").default(true),
  ct: f.date("").default(new Date()),
  ut: f.date("").default(new Date()),
  rl: f
    .relation()
    .cascade(true)
    .oneToMany()
    .target(() => rl.entity),
}));

export default urs;

/*
    fn => firstName,
    lm => lastName,
    em => e-mail,
    ps => password,
    ac => active,
    ct => created at,
    ut => update at
*/
