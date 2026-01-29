"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import { useAuth } from "@/lib/auth-context";
import LoginForm from "./_components/LoginForm";
import LoginLeftPanel from "./_components/LoginLeftPanel";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setError(null);

      try {
        await login(email, password);
        router.push("/curriculum/history");
      } catch (err) {
        setError(err instanceof Error ? err.message : "로그인에 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    },
    [email, password, login, router]
  );

  return (
    <div className='min-h-screen flex'>
      <LoginLeftPanel />

      <LoginForm
        email={email}
        password={password}
        showPassword={showPassword}
        isLoading={isLoading}
        error={error}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onTogglePassword={() => setShowPassword(p => !p)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
