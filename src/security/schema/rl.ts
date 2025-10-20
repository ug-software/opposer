import Schema from "../../database/schema";
import urs from "./urs";

const rl = Schema("rl", (f) => ({
  sm: f.string("").required(""),
  mt: f.string("").required(""),
  usr: f
    .relation()
    .manyToOne()
    .target(() => urs.entity)
    .inverseSide("rl"),
}));

export default rl;

/* 
    sm => schema,
    mt => method,
    usr => user
*/
