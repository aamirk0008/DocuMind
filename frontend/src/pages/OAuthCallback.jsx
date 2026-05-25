import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export default function OAuthCallback() {
  const [params] = useSearchParams();

  useEffect(() => {
    const token = params.get('token');
    const name = params.get('name');
    const email = params.get('email');
    const id = params.get('id');
    const error = params.get('error');

    if (window.opener && !window.opener.closed) {
      // In popup — send message to parent window then close
      if (error || !token) {
        window.opener.postMessage(
          { type: 'GOOGLE_AUTH_ERROR' },
          import.meta.env.VITE_FRONTEND_URL || window.location.origin
        );
      } else {
        window.opener.postMessage(
          { type: 'GOOGLE_AUTH_SUCCESS', token, name, email, id },
          import.meta.env.VITE_FRONTEND_URL || window.location.origin
        );
      }
      // Small delay so postMessage sends before close
      setTimeout(() => window.close(), 300);
    } else {
      // Fallback if not in popup
      if (error || !token) {
        window.location.href = '/auth?error=oauth_failed';
        return;
      }
      localStorage.setItem('accessToken', token);
      window.location.href = '/';
    }
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Completing sign in...</p>
      </div>
    </div>
  );
}