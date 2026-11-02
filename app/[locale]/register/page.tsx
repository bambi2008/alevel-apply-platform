import { connection } from "next/server";
import { RegisterForm } from "@/components/register-form";
import { getRegistrationMode } from "@/lib/auth/registration-mode";

export default async function RegisterPage() {
  await connection();
  return <RegisterForm mode={getRegistrationMode()} />;
}
