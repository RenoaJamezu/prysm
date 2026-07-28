import LoginForm from "../components/LoginForm";
import AuthLayout from "../layout/AuthLayout";

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back"
      description="Run your business smarter with modern POS and inventory management."
    >
      <LoginForm />
    </AuthLayout>
  );
}
