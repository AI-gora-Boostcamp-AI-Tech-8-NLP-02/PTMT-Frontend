"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import { Logo } from "@/components/layout";
import { useAuth } from "@/lib/auth-context";
import { SignupForm } from "./_components/SignUpForm";
import SignUpLeftPanel from "./_components/SignUpLeftPanel";

/**
 * 회원가입 페이지
 *
 * 적용된 Vercel Best Practices:
 * - 5.9 Use Functional setState - useCallback으로 안정적인 콜백
 */
export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmShowPassword, setConfirmShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmPassword, setConfirmPassword] = useState("");

  // 5.9 Use Functional setState - useCallback으로 안정적인 참조
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setError(null);

      try {
        await signup(email, password, name);
        router.push("/curriculum/history");
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "회원가입에 실패했습니다."
        );
      } finally {
        setIsLoading(false);
      }
    },
    [email, password, name, signup, router]
  );

  const toggleShowPassword = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const toggleConfirmShowPassword = useCallback(() => {
    setConfirmShowPassword(prev => !prev);
  }, []);

  return (
    <div className='min-h-screen flex'>
      {/* Left Panel - Bold Abstract Design */}
      <SignUpLeftPanel />

      {/* Right Panel - Signup Form */}
      <div className='flex flex-1 flex-col justify-center items-center px-6 py-12 bg-background overflow-y-auto'>
        <div className='w-full max-w-105 flex flex-col gap-8'>
          {/* Mobile Logo */}
          <div className='lg:hidden'>
            <Logo />
          </div>

          {/* Header */}
          <div className='stagger-fade'>
            <h1 className='text-4xl font-black tracking-tight mb-2'>
              회원가입
            </h1>
            <p className='text-muted-foreground text-lg'>
              무료로 시작하세요. 카드 등록 필요 없어요.
            </p>
          </div>

          {/* Form */}
          <SignupForm
            name={name}
            email={email}
            password={password}
            confirmPassword={confirmPassword}
            showPassword={showPassword}
            confirmShowPassword={confirmShowPassword}
            agreed={agreedToTerms}
            isLoading={isLoading}
            error={error}
            onNameChange={setName}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onConfirmChange={setConfirmPassword}
            onTogglePassword={toggleShowPassword}
            onToggleConfirmPassword={toggleConfirmShowPassword}
            onAgreeChange={setAgreedToTerms}
            onSubmit={handleSubmit}
          />

          {/* Login link */}
          <div className='flex justify-center items-center gap-2 text-base'>
            <span className='text-muted-foreground'>
              이미 계정이 있으신가요?
            </span>
            <Link
              href='/auth/login'
              className='text-primary font-bold hover:underline transition-colors'
            >
              로그인
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
