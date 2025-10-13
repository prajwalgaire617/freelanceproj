import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

const OAuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const token = searchParams.get('token');
        const provider = searchParams.get('provider');
        const error = searchParams.get('error');

        if (error) {
          setStatus('error');
          setMessage('OAuth authentication failed. Please try again.');
          toast.error('Authentication failed');
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        if (!token) {
          setStatus('error');
          setMessage('No authentication token received. Please try again.');
          toast.error('Authentication failed');
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        // Store token in localStorage
        localStorage.setItem('token', token);

        // Decode token to get user info
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userData = {
          id: payload.id.toString(),
          email: payload.email,
          userType: payload.userType
        };

        // Login user
        login(userData, token);

        setStatus('success');
        setMessage(`Successfully logged in with ${provider}! Redirecting...`);
        toast.success(`Welcome! Logged in with ${provider}`);

        // Redirect based on user type
        setTimeout(() => {
          if (userData.userType === 'freelancer') {
            navigate('/freelancerhomepage');
          } else if (userData.userType === 'client') {
            navigate('/clienthomepage');
          } else {
            navigate('/');
          }
        }, 2000);

      } catch (error) {
        console.error('OAuth callback error:', error);
        setStatus('error');
        setMessage('An error occurred during authentication. Please try again.');
        toast.error('Authentication failed');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate, login]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {status === 'loading' && 'Authenticating...'}
            {status === 'success' && 'Authentication Successful!'}
            {status === 'error' && 'Authentication Failed'}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="flex flex-col items-center space-y-4">
            {status === 'loading' && (
              <>
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <p className="text-gray-600">Please wait while we complete your authentication...</p>
              </>
            )}
            
            {status === 'success' && (
              <>
                <CheckCircle className="h-8 w-8 text-green-600" />
                <p className="text-gray-600">{message}</p>
              </>
            )}
            
            {status === 'error' && (
              <>
                <XCircle className="h-8 w-8 text-red-600" />
                <p className="text-gray-600">{message}</p>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OAuthCallback;
