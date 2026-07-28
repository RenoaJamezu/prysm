import { MailCheck } from "lucide-react";
import { Link } from "react-router-dom";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface RegistrationSuccessCardProps {
  email: string;
}

export default function RegistrationSuccessCard({
  email,
}: RegistrationSuccessCardProps) {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="flex flex-col items-center text-center">
        <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10">
          <MailCheck className="size-8 text-primary" />
        </div>

        <CardTitle>Verify your email</CardTitle>

        <CardDescription>
          We've sent a verification link to your email address.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 text-center">
        <div className="rounded-lg border bg-muted/40 px-4 py-3">
          <p className="break-all font-medium">{email}</p>
        </div>

        <p className="text-sm text-muted-foreground">
          Click the verification link in your inbox before signing in to your
          account.
        </p>

        <div className="space-y-2">
          <Button className="w-full">
            <Link to="/login">Back to Sign In</Link>
          </Button>

          <p className="text-xs text-muted-foreground">
            Didn't receive an email? Check your spam folder first.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
