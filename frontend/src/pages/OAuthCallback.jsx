import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import useAuthStore from '../store/authStore';

export default function OAuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const setUser = useAuthStore(s => s.setUser);

  useEffect(() => {
    const token = params.get('token');
    const name = params.get('name');
    const email = params.get('email');
    const id = params.get('id');
    const error = params.get('error');

    if (error || !token) {
      navigate('/auth?error=oauth_failed');
      return;
    }

    localStorage.setItem('accessToken', token);
    setUser({ id, name, email });
    navigate('/');
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Signing you in...</p>
      </div>
    </div>
  );
}