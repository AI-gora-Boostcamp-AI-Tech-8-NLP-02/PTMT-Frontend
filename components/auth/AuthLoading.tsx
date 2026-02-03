"use client";

export function AuthLoading() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-background'>
      <span className='material-symbols-outlined animate-spin text-5xl text-primary'>
        progress_activity
      </span>
    </div>
  );
}
