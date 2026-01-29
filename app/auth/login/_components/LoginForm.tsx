import Link from "next/link";

import { Logo } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  email: string;
  password: string;
  showPassword: boolean;
  isLoading: boolean;
  error: string | null;
  onEmailChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onTogglePassword: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function LoginForm({
  email,
  password,
  showPassword,
  isLoading,
  error,
  onEmailChange,
  onPasswordChange,
  onTogglePassword,
  onSubmit,
}: Props) {
  return (
    <div className='flex flex-1 justify-center items-center px-6 py-12'>
      <div className='w-full max-w-105 flex flex-col gap-10'>
        <div className='lg:hidden'>
          <Logo />
        </div>

        <div>
          <h1 className='text-4xl font-black mb-2'>로그인</h1>
          <p className='text-muted-foreground text-lg'>
            계정에 로그인하여 학습을 이어가세요.
          </p>
        </div>

        <form onSubmit={onSubmit} className='flex flex-col gap-6'>
          {error && (
            <div className='p-4 bg-red-50 border border-red-200 rounded-xl flex gap-3'>
              <span className='material-symbols-outlined text-red-500'>
                error
              </span>
              <span className='text-sm text-red-600 font-medium'>{error}</span>
            </div>
          )}

          <div className='flex flex-col gap-2'>
            <Label>이메일</Label>
            <Input
              value={email}
              onChange={e => onEmailChange(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className='flex flex-col gap-2'>
            <Label>비밀번호</Label>
            <div className='relative'>
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => onPasswordChange(e.target.value)}
                disabled={isLoading}
                required
                className='pr-14' // 버튼 공간 확보
              />

              <button
                type='button'
                onClick={onTogglePassword}
                className='absolute right-2 top-1/2 -translate-y-1/2
               h-10 w-10 flex items-center justify-center
               rounded-lg hover:bg-slate-100 transition-colors'
              >
                <span className='material-symbols-outlined text-xl'>
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>

          <Button disabled={isLoading} className='h-14 rounded-2xl font-bold'>
            {isLoading ? "로그인 중..." : "로그인"}
          </Button>
        </form>

        <div className='text-center'>
          <span className='text-muted-foreground'>계정이 없으신가요?</span>{" "}
          <Link href='/auth/signup' className='text-primary font-bold'>
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
}
