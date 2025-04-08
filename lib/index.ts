import { DatabaseBaseConnection, DataSourceProps, FilterQuery, FindQuery, MapProperties, PropertiesQuery, SchemaDefinition, SchemaOptions, TypeMap } from "./index.d";


export class Schema<T extends SchemaDefinition>{
    _tableName: string;
    _schema: T;
    _options: SchemaOptions;

    constructor(tableName: string, schema: T, options?: SchemaOptions){
        this._schema = schema;
        this._tableName = tableName;

        if(options){
            this._options = options;
        }
    }

    create(data: { [K in keyof T]: TypeMap[T[K]['type']] }) {
        return data;
    }
}

export class Transaction {
    _table: any;
    _connection: DatabaseBaseConnection;

    constructor(entity: any, client: DatabaseBaseConnection){
        this._table = entity;
        this._connection = client;
    }

    /* methods geters */

    /* 
        METODO DESTINADO A SEMPRE DEVOLVER UM ARRAY DE ITENS, FAZENDO O FILTRO DE ACORDO COM A QUERY
        EX: {
            select: ["name", "email"], // Propriedades desejadas que sejam retornandas...
            filter: { // chave e valor da tabela que deseja filtar
                name: "Guilherme",
                email: "@hotmail.com"
            },
            join: {
                profiles: {
                    select: ["name"]
                }
            },
            paginate: { // propriedade adicionar para que a busca seja paginada...
                take: 10
            }
        }

        RESULTADOS: 
        -> com paginação:
        {
            data: [], // array de itens de acordo com o filtro, podendo ser vazio
            paginate: {
                page: 1, // pagina atual
                qnt: 20 // quantidade total de paginas
            }
        }

        -> sem paginação:
        [] // um array com os itens filtrados
    */
    async filter(query: FilterQuery) {
        var sql = "";
        var data = await this._connection.query(sql);

        return data;
    }

    /* 
        METODO DESTINADO A SEMPRE DEVOLVER UM ITEM, FAZENDO O FILTRO DE ACORDO COM A QUERY
        EX: {
            select: ["name", "email"], // Propriedades desejadas que sejam retornandas...
            find: { // chave e valor da tabela que deseja filtar
                name: "Guilherme",
                email: "@hotmail.com"
            },
            join: {
                profiles: {
                    select: ["name"]
                }
            }
            paginate: { // propriedade adicionar para que a busca seja paginada...
                take: 10
            }
        }

        RESULTADOS: 
        {} | NULL // um item ou então null caso não encontre
    */
    find(query: FindQuery) {}

    /* methods save */

    /* 
    METODO DESTINADO A INSERIR ITEM
    EX: {
        name: "uiaran",
        email: "@hotmail.com"
    }

    RESULTADOS: 
    {} o proprio item, porém com o id adicionado
    */
    insert(data: MapProperties) {}

    /* methods update */

    /* 
        METODO DESTINADO A ATUALIZAR ITEM, LEMBRANDO QUE ELE ATUALIZA SOMENTE AS PROPRIEDADES PASSADAS ATRAVÉS DA PROP DATA..
        PRIMEIRO PARAMETRO
        EX: { // chave e valor da tabela que deseja filtar
            name: "Guilherme",
            email: "@hotmail.com"
        }
        
        SEGUNDO PARAMETRO
        EX: {
            name: "Gerverson",
            email: "@hotmail.com"
        }

        RESULTADOS: 
        {} // O proprio item atualizado
    */
    update(query: PropertiesQuery, data: MapProperties) {}


    /* methods delate */

    /* 
    METODO DESTINADO A DELETAR ITEM
    EX: { // chave e valor da tabela que deseja filtar
        name: "Guilherme",
        email: "@hotmail.com"
    }

    RESULTADOS: 
    boolean
    */
    delete(query: PropertiesQuery) {}
}

export default class DataSource {
    configs: DataSourceProps | null = null
    _client: DatabaseBaseConnection | null;

    constructor(props: DataSourceProps){
        this.configs = props;

        this._client = null;
    }

    getRepository() {

    }

    async initialize() {
        
    }
}