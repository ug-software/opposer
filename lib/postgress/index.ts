import { Client, DatabaseBaseConnection } from "../index.d";
import { PostgressProps } from "./index.d";

export default class Postgress implements DatabaseBaseConnection {
    _config: PostgressProps;
    _connnection: Client

    constructor(props: PostgressProps) {
        this._config = props;
    }

    async connect() {
        const pg = await import("pg");
        const { Client } = pg;

        const client = new Client(this._config);
        await client.connect();

        this._connnection = client;
    }

    query(sql: string) {};
}