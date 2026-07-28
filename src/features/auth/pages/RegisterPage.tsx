import RegisterForm from "../components/RegisterForm";
import AuthLayout from "../layout/AuthLayout";

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Create your account"
      description="Start managing sales, inventory, and orders in minutes."
    >
      <RegisterForm />
    </AuthLayout>
  );
}
