import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import * as z from "zod";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { NavLink, useNavigate } from "react-router";
import { useAuth } from "~/components/providers/auth-provider";

const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const LoginForm = () => {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const navigate = useNavigate();
  const { login, refresh } = useAuth();

  function onSubmit(data: z.infer<typeof loginSchema>) {
    const body = {
      email: data.email,
      password: data.password,
    };
    const req = login(body);

    toast.promise(req, {
      loading: "Loading...",
      success: () => `Welcome back!`,
      error: (err) =>
        `${(err as any)?.response?.data?.error || (err as any)?.message || "Login failed"}`,
    });

    req.then(() => {
      navigate("/dashboard");
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-sm text-balance">
                  Enter your email and password to sign in to your account.
                </p>
              </div>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Your email"
                      required
                      {...field}
                    />
                    {fieldState.error && (
                      <FieldDescription className="text-red-600">
                        {fieldState.error.message}
                      </FieldDescription>
                    )}
                  </Field>
                )}
              />
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Your password"
                      required
                      {...field}
                    />
                    {fieldState.error && (
                      <FieldDescription className="text-red-600">
                        {fieldState.error.message}
                      </FieldDescription>
                    )}
                  </Field>
                )}
              />

              <Field>
                <Button type="submit" className="w-full">
                  Continue
                </Button>
              </Field>
              <FieldDescription className="text-center">
                Don't have an account?{" "}
                <NavLink to="/register">
                  <span className="text-primary underline">Sign up</span>
                </NavLink>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/3fbf927c-1ef7-4b97-8e59-745a82358263.jpg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
};

export default LoginForm;
