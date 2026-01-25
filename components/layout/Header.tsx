"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "./Logo";

interface HeaderProps {
  variant?: "default" | "transparent" | "dark";
}

export function Header({ variant = "default" }: HeaderProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  const bgClass = {
    default: "bg-background/80 backdrop-blur-xl border-b border-border/50",
    transparent: "bg-transparent",
    dark: "bg-foreground text-background",
  }[variant];

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <header className={`sticky top-0 z-50 ${bgClass}`}>
      <div className='max-w-[1400px] mx-auto px-6 lg:px-8'>
        <div className='flex items-center justify-between h-20'>
          <Logo inverted={variant === "dark"} />

          {/* Navigation - Bold style */}
          <nav className='hidden md:flex items-center gap-1'>
            {[
              { href: "#how-it-works", label: "작동 방식" },
              { href: "/curriculum/history", label: "내 커리큘럼" },
            ].map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-bounce ${
                  variant === "dark"
                    ? "hover:bg-background/10"
                    : "hover:bg-secondary"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className='flex items-center gap-3'>
            {isLoading ? (
              // 로딩 중
              <div className='w-20 h-10 bg-secondary/50 rounded-xl animate-pulse' />
            ) : isAuthenticated ? (
              // 로그인 상태
              <>
                <div
                  className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl ${
                    variant === "dark" ? "bg-background/10" : "bg-secondary"
                  }`}
                >
                  <div className='size-7 rounded-full bg-primary/20 flex items-center justify-center'>
                    <span className='material-symbols-outlined text-primary text-sm'>
                      person
                    </span>
                  </div>
                  <span
                    className={`text-sm font-semibold ${
                      variant === "dark" ? "text-background" : ""
                    }`}
                  >
                    {user?.name}
                  </span>
                </div>
                <Button
                  variant='ghost'
                  onClick={handleLogout}
                  className={`rounded-xl font-semibold ${
                    variant === "dark"
                      ? "text-background hover:bg-background/10"
                      : ""
                  }`}
                >
                  로그아웃
                </Button>
                <Link href='/curriculum/upload-paper'>
                  <Button className='rounded-xl font-bold bg-primary text-primary-foreground btn-3d px-6'>
                    <span className='material-symbols-outlined text-lg'>
                      add
                    </span>
                    시작하기
                  </Button>
                </Link>
              </>
            ) : (
              // 비로그인 상태
              <>
                <Link href='/auth/login'>
                  <Button
                    variant='ghost'
                    className={`rounded-xl font-semibold ${
                      variant === "dark"
                        ? "text-background hover:bg-background/10"
                        : ""
                    }`}
                  >
                    로그인
                  </Button>
                </Link>
                <Link href='/curriculum/upload-paper'>
                  <Button className='rounded-xl font-bold bg-primary text-primary-foreground btn-3d px-6'>
                    <span className='material-symbols-outlined text-lg'>
                      add
                    </span>
                    시작하기
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
