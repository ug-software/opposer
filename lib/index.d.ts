/* Data Source */
export interface DataSourceProps {
    type: "postgress" | "mysql" | "sqlite",
    user?: string,
    password?: string,
    database?: string,
    url?: string,
    port?: number
}

export interface ConfigurationBaseConnection {
    user?: string,
    password?: string,
    host: string,
    port: number,
    database: string
}

export interface Client {}

export interface DatabaseBaseConnection {
    _config: ConfigurationBaseConnection,
    _connnection: Client,

    query: (sql: string) => any
}


/* Query */
export interface JoinQuery {
    [key: string]: {
        select: string[]
    }
}

export interface PaginateQuery {
    take: number
}

export interface PropertiesQuery {
    [key: string]: any
}

export interface FilterQuery {
    select: string[],
    query: PropertiesQuery,
    join: JoinQuery,
    paginate: PaginateQuery
}

export interface FindQuery {
    select: string[],
    query: PropertiesQuery,
    join: JoinQuery,
}

/* Tables and Schemas */

export interface SchemaDefinition {
    [key: string]: {
        type: Type,
        default?: any,
        required?: boolean
    }
}

export interface SchemaOptions {
    relations: {
        [key: string]: {
            type: Relation,
            collumn?: string
        }
    }
}

/* Enums */
export enum Type {
    VARCHAR = "VARCHAR",
    CHAR = "CHAR",
    TEXT = "TEXT",
    INT = "INT",
    DECIMAL = "DECIMAL",
    NUMERIC = "NUMERIC",
    FLOAT = "FLOAT",
    DOUBLE = "DOUBLE",
    DATE = "DATE",
    TIME = "TIME",
    DATETIME = "DATETIME",
    TIMESTAMP = "TIMESTAMP",
    BOOLEAN = "BOOLEAN",
    JSON = "JSON",
    ARRAY = "ARRAY"
}

export enum Relation {
    OneToMany = "OneToMany",
    ManyToMany = "ManyToMany",
    OneToOne = "OneToOne"
}

/* utils */

interface MapProperties {
    [key: string]: any
}

export type TypeMap = {
    [Type.VARCHAR]: string,
    [Type.CHAR]: number,
    [Type.TEXT]: boolean,
    [Type.INT]: number,
    [Type.DECIMAL]: number,
    [Type.NUMERIC]: number,
    [Type.FLOAT]: number,
    [Type.DOUBLE]: number,
    [Type.DATE]: Date,
    [Type.TIME]: string,
    [Type.DATETIME]: Date,
    [Type.TIMESTAMP]: Date,
    [Type.BOOLEAN]: boolean,
    [Type.JSON]: object,
    [Type.ARRAY]: Array<any>
};