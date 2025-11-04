import { type RouteConfig, index, layout } from "@react-router/dev/routes";

export default [
  layout("layouts/main/index.tsx", [index("pages/playground/index.tsx")]),
] satisfies RouteConfig;
