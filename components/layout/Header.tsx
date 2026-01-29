"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { memo, useCallback } from "react";
import { Logo } from "./Logo";

interface HeaderProps {
  variant?: "default" | "transparent" | "dark";
}

// 5.5 Extract to Memoized Components
export const Header = memo(function Header({
  variant = "default",
}: HeaderProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  const bgClass = {
    default: "bg-background/80 backdrop-blur-xl border-b border-border/50",
    transparent: "bg-transparent",
    dark: "bg-foreground text-background",
  }[variant];

  // 5.9 Use Functional setState - useCallback으로 안정적인 참조
  const handleLogout = useCallback(async () => {
    await logout();
    router.push("/");
  }, [logout, router]);

  return (
    <header className={`sticky top-0 z-50 ${bgClass}`}>
      <div className='max-w-350 mx-auto px-6 lg:px-8'>
        <div className='flex items-center justify-between h-20'>
          <Logo inverted={variant === "dark"} />
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
              </>
            ) : (
              // 비로그인 상태
              <>
                <Button
                  variant='ghost'
                  className={`rounded-xl font-semibold ${
                    variant === "dark"
                      ? "text-background hover:bg-background/10"
                      : ""
                  }`}
                  onClick={() => router.push("/auth/login")}
                >
                  로그인
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
});
