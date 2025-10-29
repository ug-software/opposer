import {
  type RouteConfig,
  route,
  index,
  layout,
} from "@react-router/dev/routes";

export default [
  layout("layouts/main/index.tsx", [
    index("pages/dashboard.tsx"),
    route("/handlers", "pages/handlers/index.tsx"),
  ]),
] satisfies RouteConfig;
