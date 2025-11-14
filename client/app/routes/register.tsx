import { Rocket } from "lucide-react";
import RegisterForm from "@/components/forms/register-form";
import { NavLink } from "react-router";

const RegisterPage = () => {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <div className="flex p-4 justify-center gap-2 md:justify-start">
          <NavLink
            to="/"
            className="flex items-center gap-2 font-medium text-2xl"
          >
            <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
              <Rocket className="size-5" />
            </div>
            Masi-Vilisation
          </NavLink>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
