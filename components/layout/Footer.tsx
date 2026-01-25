import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className='bg-foreground text-background py-16 relative overflow-hidden'>
      {/* Subtle gradient orbs */}
      <div className='absolute top-0 left-1/4 w-64 h-64 rounded-full bg-primary/10 blur-[100px]' />
      <div className='absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-accent/10 blur-[100px]' />

      <div className='max-w-[1400px] mx-auto px-6 lg:px-8 relative'>
        <div className='grid md:grid-cols-4 gap-12 mb-16'>
          {/* Brand */}
          <div className='md:col-span-2'>
            <Logo size='lg' inverted showSubtitle={false} />
            <p className='text-background/60 mt-4 max-w-sm leading-relaxed'>
              AI 기반 논문 학습 도우미. 복잡한 연구를 쉽고 체계적으로
              학습하세요.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className='font-bold text-sm uppercase tracking-widest mb-4 text-background/40'>
              서비스
            </h4>
            <ul className='space-y-3'>
              <li>
                <Link
                  href='/curriculum/upload-paper'
                  className='text-background/70 hover:text-primary transition-colors'
                >
                  논문 업로드
                </Link>
              </li>
              <li>
                <Link
                  href='/curriculum/history'
                  className='text-background/70 hover:text-primary transition-colors'
                >
                  내 커리큘럼
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className='font-bold text-sm uppercase tracking-widest mb-4 text-background/40'>
              법적 고지
            </h4>
            <ul className='space-y-3'>
              <li>
                <Link
                  href='#'
                  className='text-background/70 hover:text-primary transition-colors'
                >
                  이용약관
                </Link>
              </li>
              <li>
                <Link
                  href='#'
                  className='text-background/70 hover:text-primary transition-colors'
                >
                  개인정보 처리방침
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className='pt-8 border-t border-background/10 flex flex-col md:flex-row justify-between items-center gap-4'>
          <p className='text-sm text-background/40'>
            © 2024 페튜와 매튜. All rights reserved.
          </p>
          <div className='flex gap-4'>
            <a
              href='#'
              className='w-10 h-10 rounded-xl bg-background/5 hover:bg-primary/20 flex items-center justify-center transition-colors'
            >
              <span className='material-symbols-outlined text-background/60'>
                mail
              </span>
            </a>
            <a
              href='#'
              className='w-10 h-10 rounded-xl bg-background/5 hover:bg-primary/20 flex items-center justify-center transition-colors'
            >
              <span className='material-symbols-outlined text-background/60'>
                code
              </span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
