"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Logo } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";

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
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className='min-h-screen flex'>
      {/* Left Panel - Bold Abstract Design */}
      <div className='hidden lg:flex w-1/2 relative overflow-hidden bg-foreground'>
        {/* Abstract gradient shapes - different from login */}
        <div className='absolute inset-0'>
          <div className='absolute top-[5%] right-[20%] w-[50%] h-[50%] rounded-full bg-gradient-to-bl from-accent/40 to-transparent blur-[80px]' />
          <div className='absolute bottom-[20%] left-[10%] w-[60%] h-[60%] rounded-full bg-gradient-to-tr from-primary/30 to-transparent blur-[100px]' />
          <div className='absolute top-[50%] right-[40%] w-[25%] h-[25%] rounded-full bg-gradient-to-br from-accent/20 to-primary/20 blur-[50px]' />
        </div>

        {/* Pattern overlay */}
        <div className='absolute inset-0 pattern-diagonal opacity-10' />

        {/* Content */}
        <div className='relative z-10 flex flex-col h-full justify-between p-12'>
          <Logo size='lg' inverted />

          <div className='max-w-lg'>
            <h1 className='text-5xl font-black text-background leading-tight tracking-tight mb-6'>
              <span className='text-gradient-bold'>새로운</span> 연구의
              <br />
              시작점
            </h1>
            <p className='text-background/60 text-xl leading-relaxed'>
              무료로 가입하고 AI 기반 학습의 힘을 경험하세요.
            </p>
          </div>

          {/* Decorative elements - mirrored */}
          <div className='flex gap-4 justify-end'>
            <div className='w-4 h-2 rounded-full bg-background/30' />
            <div className='w-8 h-2 rounded-full bg-accent' />
            <div className='w-16 h-2 rounded-full bg-primary' />
          </div>
        </div>
      </div>

      {/* Right Panel - Signup Form */}
      <div className='flex flex-1 flex-col justify-center items-center px-6 py-12 bg-background overflow-y-auto'>
        <div className='w-full max-w-[420px] flex flex-col gap-8'>
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
          <form
            onSubmit={handleSubmit}
            className='flex flex-col gap-5 stagger-fade'
          >
            {error && (
              <div className='p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3'>
                <span className='material-symbols-outlined text-red-500'>
                  error
                </span>
                <span className='text-sm text-red-600 font-medium'>{error}</span>
              </div>
            )}

            <div className='flex flex-col gap-2'>
              <Label htmlFor='name' className='text-base font-semibold'>
                이름
              </Label>
              <Input
                id='name'
                type='text'
                placeholder='홍길동'
                value={name}
                onChange={e => setName(e.target.value)}
                required
                disabled={isLoading}
                className='h-13 px-5 text-base rounded-2xl border-2 focus:border-primary transition-colors disabled:opacity-50'
              />
            </div>

            <div className='flex flex-col gap-2'>
              <Label htmlFor='email' className='text-base font-semibold'>
                이메일
              </Label>
              <Input
                id='email'
                type='email'
                placeholder='you@example.com'
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className='h-13 px-5 text-base rounded-2xl border-2 focus:border-primary transition-colors disabled:opacity-50'
              />
            </div>

            <div className='flex flex-col gap-2'>
              <Label htmlFor='password' className='text-base font-semibold'>
                비밀번호
              </Label>
              <div className='relative'>
                <Input
                  id='password'
                  type={showPassword ? "text" : "password"}
                  placeholder='8자 이상'
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={8}
                  disabled={isLoading}
                  className='h-13 px-5 pr-14 text-base rounded-2xl border-2 focus:border-primary transition-colors disabled:opacity-50'
                />
                <button
                  type='button'
                  onClick={toggleShowPassword}
                  className='absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
                >
                  <span className='material-symbols-outlined'>
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* Terms */}
            <label className='flex items-start gap-3 cursor-pointer mt-1'>
              <div className='relative flex items-center justify-center mt-0.5'>
                <input
                  type='checkbox'
                  checked={agreedToTerms}
                  onChange={e => setAgreedToTerms(e.target.checked)}
                  required
                  className='peer appearance-none size-6 bg-background border-2 border-border rounded-lg checked:bg-primary checked:border-primary transition-all'
                />
                <span className='material-symbols-outlined text-primary-foreground text-sm absolute opacity-0 peer-checked:opacity-100 pointer-events-none'>
                  check
                </span>
              </div>
              <span className='text-sm text-muted-foreground leading-relaxed'>
                <Link
                  href='#'
                  className='text-foreground font-semibold hover:text-primary transition-colors'
                >
                  이용약관
                </Link>{" "}
                및{" "}
                <Link
                  href='#'
                  className='text-foreground font-semibold hover:text-primary transition-colors'
                >
                  개인정보 처리방침
                </Link>
                에 동의합니다.
              </span>
            </label>

            <Button
              type='submit'
              disabled={isLoading}
              className='h-14 rounded-2xl text-base font-bold bg-primary text-primary-foreground btn-3d mt-2 disabled:opacity-50'
            >
              {isLoading ? (
                <span className='flex items-center gap-2'>
                  <span className='material-symbols-outlined animate-spin text-lg'>
                    progress_activity
                  </span>
                  가입 중...
                </span>
              ) : (
                "회원가입"
              )}
            </Button>

          </form>

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
