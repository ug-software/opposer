import { Type } from "../../index.d";
import DataSource, { Schema } from "../../index";

const User = new Schema("User", {
    name: {
        type: Type.VARCHAR
    },
    email: {
        type: Type.VARCHAR,
        required: true
    }
});

const user = User.create({
    email: "uiaran@hotmail.com",
    name: "uiaran guilherme"
});

var db = new DataSource({
    type: "postgress",
    database: "exemple",
    port: 2708,
    user: "opposer",
    password: "opposer"
});

db.initialize().then(console.log)