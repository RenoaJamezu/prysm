import { useEffect, useState } from "react";
import { Eye, EyeOff, MoveRight, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { authService } from "@/services/auth.service";
import { loginSchema, type LoginFormValues } from "../schemas/login.schema";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (errors.email?.message) {
      toast.error(errors.email.message, { id: "err-login-email" });
    }
    if (errors.password?.message) {
      toast.error(errors.password.message, { id: "err-login-password" });
    }
  }, [errors.email?.message, errors.password?.message]);

  async function onSubmit(data: LoginFormValues) {
    toast.dismiss("err-login-submit");

    const { error } = await authService.signIn(data);

    if (error) {
      toast.error("Incorrect email or password.", { id: "err-login-submit" });
    }

    toast.success("Welcome back");
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          autoFocus
          id="email"
          type="email"
          autoComplete="email"
          {...register("email")}
          className="py-5"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            {...register("password")}
            className="py-5 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900 transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full mt-6! py-5 transition-all duration-200 active:scale-[0.99]"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" /> Signing In...
          </span>
        ) : (
          <span className="flex items-center gap-2 group">
            Sign in
            <MoveRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        )}
      </Button>
    </form>
  );
}
