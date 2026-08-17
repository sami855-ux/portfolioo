'use client';

import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (!isLoginPage && status === 'unauthenticated') {
      router.replace('/admin/login');
    }
  }, [status, isLoginPage, router]);

  if (!isLoginPage && status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-zinc-400 font-medium">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isLoginPage && status === 'unauthenticated') {
    return null;
  }

  return <>{children}</>;
}
