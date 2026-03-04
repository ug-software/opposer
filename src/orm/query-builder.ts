import { QueryBuilder as OpposerQueryBuilder } from "../interfaces/controller.js";
import { EntityMetadata, FieldMetadata } from "./metadata.js";

export class QueryTranslator {
  constructor(private entity: EntityMetadata, private fields: FieldMetadata[]) {}

  translateFilter(query: OpposerQueryBuilder): { sql: string; params: any[] } {
    const params: any[] = [];
    const sql = this.renderFilter(query, params);
    return { sql: sql ? `WHERE ${sql}` : "", params };
  }

  private renderFilter(query: OpposerQueryBuilder, params: any[]): string {
    if (!query || typeof query !== "object") return "";

    const parts: string[] = [];

    for (const [key, value] of Object.entries(query)) {
      if (key === "$or" && Array.isArray(value)) {
        const orParts = value.map((v) => `(${this.renderFilter(v, params)})`);
        parts.push(`(${orParts.join(" OR ")})`);
        continue;
      }

      if (typeof value === "object" && value !== null && !(value instanceof Date)) {
        // Special operator
        for (const [op, val] of Object.entries(value)) {
          parts.push(this.renderOperator(key, op, val, params));
        }
      } else {
        // Equality
        params.push(value);
        parts.push(`"${key}" = $${params.length}`);
      }
    }

    return parts.join(" AND ");
  }

  private renderOperator(column: string, op: string, val: any, params: any[]): string {
    switch (op) {
      case "$l":
        params.push(val);
        return `"${column}" LIKE $${params.length}`;
      case "$il":
        params.push(val);
        return `"${column}" ILIKE $${params.length}`;
      case "$in":
        params.push(val);
        return `"${column}" = ANY($${params.length})`;
      case "$nin":
        params.push(val);
        return `NOT ("${column}" = ANY($${params.length}))`;
      case "$btw":
        params.push(val[0]);
        params.push(val[1]);
        return `"${column}" BETWEEN $${params.length - 1} AND $${params.length}`;
      case "$mt":
        params.push(val);
        return `"${column}" > $${params.length}`;
      case "$mte":
        params.push(val);
        return `"${column}" >= $${params.length}`;
      case "$lt":
        params.push(val);
        return `"${column}" < $${params.length}`;
      case "$lte":
        params.push(val);
        return `"${column}" <= $${params.length}`;
      case "$eq":
        params.push(val);
        return `"${column}" = $${params.length}`;
      default:
        return "";
    }
  }

  translateSelect(select: string[]): string {
    if (!select || select.length === 0) return "*";
    return select.map((s) => `"${s}"`).join(", ");
  }

  translatePagination(pagination: { page: number; take: number } | undefined): string {
    if (!pagination) return "";
    const limit = pagination.take || 10;
    const offset = (pagination.page || 0) * limit;
    return `LIMIT ${limit} OFFSET ${offset}`;
  }
}
