import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useAuthCheck() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [workId, setWorkId] = useState<string | null>(null);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        // Check if user is logged in
        const authResponse = await fetch('/api/auth/check');
        const authData = await authResponse.json();
        
        if (!authData.user) {
          router.push('/login');
          return;
        }

        // Check if user has active work session
        const activeWorkResponse = await fetch('/api/work/check-active');
        const activeWorkData = await activeWorkResponse.json();
        
        if (!activeWorkData.success || !activeWorkData.activeWork) {
          router.push('/');
          return;
        }

        setWorkId(activeWorkData.activeWork.workId);
        setIsLoading(false);
      } catch (error) {
        console.error('Access check error:', error);
        router.push('/login');
      }
    };

    checkAccess();
  }, [router]);

  return { isLoading, workId };
} 