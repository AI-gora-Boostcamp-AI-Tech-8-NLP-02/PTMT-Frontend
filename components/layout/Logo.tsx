"use client";

import { memo } from "react";
import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showSubtitle?: boolean;
  className?: string;
  inverted?: boolean;
}

// 6.3 Hoist Static JSX - 정적 데이터를 컴포넌트 외부로
const SIZE_CLASSES = {
  sm: {
    icon: "size-9",
    iconText: "text-lg",
    title: "text-base",
    subtitle: "text-[9px]",
  },
  md: {
    icon: "size-11",
    iconText: "text-xl",
    title: "text-xl",
    subtitle: "text-[10px]",
  },
  lg: {
    icon: "size-14",
    iconText: "text-2xl",
    title: "text-2xl",
    subtitle: "text-xs",
  },
} as const;

// 5.5 Extract to Memoized Components
export const Logo = memo(function Logo({
  size = "md",
  showSubtitle = true,
  className = "",
  inverted = false,
}: LogoProps) {
  const sizes = SIZE_CLASSES[size];
  const textColor = inverted ? "text-background" : "text-foreground";
  const mutedColor = inverted ? "text-background/60" : "text-muted-foreground";

  return (
    <Link href='/' className={`flex items-center gap-3 group ${className}`}>
      {/* Logo Icon - 3D effect */}
      <div className={`${sizes.icon} relative`}>
        <div className='absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-2xl transform rotate-6 opacity-60 group-hover:rotate-12 transition-transform' />
        <div className='absolute inset-0 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg group-hover:-translate-y-0.5 transition-transform'>
          <span
            className={`material-symbols-outlined icon-filled ${sizes.iconText} text-primary-foreground`}
          >
            school
          </span>
        </div>
      </div>
      <div className='flex flex-col'>
        <span
          className={`${sizes.title} font-black tracking-tight ${textColor} leading-none`}
        >
          페튜<span className='text-primary'>와</span>매튜
        </span>
        {showSubtitle && (
          <span
            className={`${sizes.subtitle} font-semibold ${mutedColor} tracking-widest uppercase mt-1`}
          >
            Paper & Map Tutor
          </span>
        )}
      </div>
    </Link>
  );
});
