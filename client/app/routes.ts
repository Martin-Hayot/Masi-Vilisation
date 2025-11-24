import {
  type RouteConfig,
  index,
  route,
  layout,
  prefix,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),
  route("register", "routes/register.tsx"),
  route("dashboard", "components/layouts/dashboard.tsx", [
    index("routes/dashboard/index.tsx"),
    route("ressources", "routes/dashboard/ressources.tsx"),
  ]),
] satisfies RouteConfig;
