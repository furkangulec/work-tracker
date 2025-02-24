import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export function useAuthCheck() {
  const router = useRouter();
  const searchParams = useSearchParams();
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

        // Get workId from URL parameters
        const paramWorkId = searchParams.get('workId');

        if (paramWorkId) {
          // If workId is provided in URL, verify ownership
          const workResponse = await fetch(`/api/work/${paramWorkId}`);
          const workData = await workResponse.json();

          if (!workData.success) {
            router.push('/panel/works');
            return;
          }

          setWorkId(paramWorkId);
          setIsLoading(false);
          return;
        }

        // If no workId in URL, check for active work session
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
  }, [router, searchParams]);

  return { isLoading, workId };
} 