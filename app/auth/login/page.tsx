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
 * 로그인 페이지
 *
 * 적용된 Vercel Best Practices:
 * - 5.9 Use Functional setState - useCallback으로 안정적인 콜백
 */
export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 5.9 Use Functional setState - useCallback으로 안정적인 참조
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

  const toggleShowPassword = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  return (
    <div className='min-h-screen flex'>
      {/* Left Panel - Bold Abstract Design */}
      <div className='hidden lg:flex w-1/2 relative overflow-hidden bg-foreground'>
        {/* Abstract gradient shapes */}
        <div className='absolute inset-0'>
          <div className='absolute top-[10%] left-[20%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-primary/40 to-transparent blur-[80px]' />
          <div className='absolute bottom-[15%] right-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tl from-accent/30 to-transparent blur-[100px]' />
          <div className='absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-gradient-to-br from-primary/20 to-accent/20 blur-[60px]' />
        </div>

        {/* Pattern overlay */}
        <div className='absolute inset-0 pattern-diagonal opacity-10' />

        {/* Content */}
        <div className='relative z-10 flex flex-col h-full justify-between p-12'>
          <Logo size='lg' inverted />

          <div className='max-w-lg'>
            <h1 className='text-5xl font-black text-background leading-tight tracking-tight mb-6'>
              연구의 <span className='text-gradient-bold'>속도</span>를
              <br />
              높이세요
            </h1>
            <p className='text-background/60 text-xl leading-relaxed'>
              AI가 논문을 분석하고, 당신만의 학습 경로를 설계합니다.
            </p>
          </div>

          {/* Decorative elements */}
          <div className='flex gap-4'>
            <div className='w-16 h-2 rounded-full bg-primary' />
            <div className='w-8 h-2 rounded-full bg-accent' />
            <div className='w-4 h-2 rounded-full bg-background/30' />
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className='flex flex-1 flex-col justify-center items-center px-6 py-12 bg-background'>
        <div className='w-full max-w-[420px] flex flex-col gap-10'>
          {/* Mobile Logo */}
          <div className='lg:hidden'>
            <Logo />
          </div>

          {/* Header */}
          <div className='stagger-fade'>
            <h1 className='text-4xl font-black tracking-tight mb-2'>로그인</h1>
            <p className='text-muted-foreground text-lg'>
              계정에 로그인하여 학습을 이어가세요.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className='flex flex-col gap-6 stagger-fade'
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
                className='h-14 px-5 text-base rounded-2xl border-2 focus:border-primary transition-colors disabled:opacity-50'
              />
            </div>

            <div className='flex flex-col gap-2'>
              <div className='flex justify-between items-center'>
                <Label htmlFor='password' className='text-base font-semibold'>
                  비밀번호
                </Label>
                <Link
                  href='#'
                  className='text-sm font-medium text-muted-foreground hover:text-primary transition-colors'
                >
                  비밀번호 찾기
                </Link>
              </div>
              <div className='relative'>
                <Input
                  id='password'
                  type={showPassword ? "text" : "password"}
                  placeholder='••••••••'
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className='h-14 px-5 pr-14 text-base rounded-2xl border-2 focus:border-primary transition-colors disabled:opacity-50'
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
                  로그인 중...
                </span>
              ) : (
                "로그인"
              )}
            </Button>

          </form>

          {/* Sign up link */}
          <div className='flex justify-center items-center gap-2 text-base'>
            <span className='text-muted-foreground'>계정이 없으신가요?</span>
            <Link
              href='/auth/signup'
              className='text-primary font-bold hover:underline transition-colors'
            >
              회원가입
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
