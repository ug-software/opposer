import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("layouts/main/index.tsx", [
    index("pages/playground/index.tsx"),
    route("database-schema", "pages/database-schema/index.tsx"),
    route("scheduler", "pages/scheduler/index.tsx"),
    route("user-management", "pages/user-management/index.tsx"),
    route("key-management", "pages/key-management/index.tsx")
  ]),
  route("login", "pages/login/index.tsx")
] satisfies RouteConfig;
