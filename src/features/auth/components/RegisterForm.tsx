import { useEffect, useState } from "react";
import { Eye, EyeOff, MoveRight, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { authService } from "@/services/auth.service";
import {
  registerSchema,
  type RegisterFormValues,
} from "../schemas/register.schema";
import RegistrationSuccessCard from "./RegistrationSuccessCard";

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);

  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  useEffect(() => {
    if (errors.email?.message) {
      toast.error(errors.email.message, { id: "err-reg-email" });
    }
    if (errors.password?.message) {
      toast.error(errors.password.message, { id: "err-reg-password" });
    }
    if (errors.confirmPassword?.message) {
      toast.error(errors.confirmPassword.message, { id: "err-reg-cpassword" });
    }
  }, [
    errors.email?.message,
    errors.password?.message,
    errors.confirmPassword?.message,
  ]);

  async function onSubmit(data: RegisterFormValues) {
    toast.dismiss("err-reg-submit");

    const { error } = await authService.signUp({
      email: data.email,
      password: data.password,
    });

    if (error) {
      toast.error(error.message || "Registration failed. Please try again.", {
        id: "err-reg-submit",
      });
      return;
    }

    setRegisteredEmail(data.email);
    setRegistrationComplete(true);

    toast.success("Verification email sent. Please check your inbox.", {
      id: "success-reg",
    });
  }

  if (registrationComplete) {
    return <RegistrationSuccessCard email={registeredEmail} />;
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
            autoComplete="new-password"
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

      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirm Password</Label>
        <div className="relative">
          <Input
            id="confirm-password"
            type={showCPassword ? "text" : "password"}
            autoComplete="new-password"
            {...register("confirmPassword")}
            className="py-5 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowCPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900 transition-colors"
          >
            {showCPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* 🚀 Submit Button */}
      <Button
        type="submit"
        className="w-full mt-6! py-5 transition-all duration-200 active:scale-[0.99]"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" /> Creating account...
          </span>
        ) : (
          <span className="flex items-center gap-2 group">
            Creating Account
            <MoveRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        )}
      </Button>
    </form>
  );
}
