import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Chrome, 
  Apple, 
  Loader2 
} from 'lucide-react';

interface OAuthButtonsProps {
  onGoogleLogin: () => void;
  onAppleLogin: () => void;
  loading?: boolean;
  disabled?: boolean;
  googleEnabled?: boolean;
  appleEnabled?: boolean;
}

const OAuthButtons: React.FC<OAuthButtonsProps> = ({
  onGoogleLogin,
  onAppleLogin,
  loading = false,
  disabled = false,
  googleEnabled = true,
  appleEnabled = true
}) => {
  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <Button
          variant="outline"
          onClick={onGoogleLogin}
          disabled={disabled || loading || !googleEnabled}
          className="w-full h-12 text-sm font-medium transition-all hover:bg-gray-50 hover:border-gray-300"
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Chrome className="mr-2 h-4 w-4" />
          )}
          {googleEnabled ? 'Continue with Google' : 'Google OAuth not configured'}
        </Button>

        <Button
          variant="outline"
          onClick={onAppleLogin}
          disabled={disabled || loading || !appleEnabled}
          className="w-full h-12 text-sm font-medium transition-all hover:bg-gray-50 hover:border-gray-300"
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Apple className="mr-2 h-4 w-4" />
          )}
          {appleEnabled ? 'Continue with Apple' : 'Apple OAuth not configured'}
        </Button>
      </div>
    </div>
  );
};

export default OAuthButtons;
