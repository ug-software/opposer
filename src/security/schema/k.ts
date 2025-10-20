import Schema from "../../database/schema.js";

const rl = Schema("k", (f) => ({
  hs: f.string("").required(""),
  ct: f.date("").default(new Date()),
  ex: f
    .date("")
    .default(
      new Date(
        new Date().getFullYear() + 1,
        new Date().getMonth(),
        new Date().getDate()
      )
    ),
}));

export default rl;

/*
  k => key
  ct => created at
  ex => expires date
*/
