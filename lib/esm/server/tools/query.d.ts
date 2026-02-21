import { QueryBuilder, RelationBuilder } from "../../interfaces/controller.js";
export default class QueryTool {
    renderFilter(query: QueryBuilder): Record<string, any> | null;
    renderRelations(relations: (string | RelationBuilder)[] | string): {
        [key: string]: any;
    };
    renderSelect(select: string[] | string): {
        [key: string]: any;
    };
}
