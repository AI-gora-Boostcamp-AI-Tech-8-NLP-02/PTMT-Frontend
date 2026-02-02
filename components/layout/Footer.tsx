import Link from "next/link";
import { memo } from "react";
import { LEGAL_LINKS, SERVICE_LINKS } from "../../const/serviceLinks";
import { Logo } from "./Logo";

// 5.5 Extract to Memoized Components
export const Footer = memo(function Footer() {
  return (
    <footer className='bg-foreground text-background py-16 relative overflow-hidden'>
      {/* Subtle gradient orbs */}
      <div className='absolute top-0 left-1/4 w-64 h-64 rounded-full bg-primary/10 blur-[100px]' />
      <div className='absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-accent/10 blur-[100px]' />

      <div className='max-w-350 mx-auto px-6 lg:px-8 relative'>
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
              {SERVICE_LINKS.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className='text-background/70 hover:text-primary transition-colors'
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className='font-bold text-sm uppercase tracking-widest mb-4 text-background/40'>
              법적 고지
            </h4>
            <ul className='space-y-3'>
              {LEGAL_LINKS.map(link => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className='text-background/70 hover:text-primary transition-colors'
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className='pt-8 border-t border-background/10 flex flex-col md:flex-row justify-between items-center gap-4'>
          <p className='text-sm text-background/40'>
            © 2024 페튜와 매튜. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
});
