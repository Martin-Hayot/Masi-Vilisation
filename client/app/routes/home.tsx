import { Button } from "~/components/ui/button";

import type { Route } from "./+types/home";
import { NavLink } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Masi-Vilisation" }];
}

export default function Home() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to Masi-Vilisation</h1>
      <div className="flex flex-row gap-4">
        <NavLink to="/login">
          <Button>Log in </Button>
        </NavLink>

        <NavLink to="/register">
          <Button>Register</Button>
        </NavLink>
      </div>
    </div>
  );
}
