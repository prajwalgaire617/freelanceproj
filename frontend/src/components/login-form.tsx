import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import OAuthButtons from "@/components/auth/OAuthButtons";
import OTPVerification from "@/components/OTPVerification";

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [error, setError] = useState("");
  const [oauthConfig, setOauthConfig] = useState({ googleEnabled: false, appleEnabled: false });
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [pendingUser, setPendingUser] = useState<any>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    setError("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:3000/api/auth/login", formData);
      const { user, token, sessionId, expiresAt } = res.data;

      // Create session data object
      const sessionData = {
        sessionId,
        expiresAt
      };

      // Check if email verification is required
      if (res.data.requiresVerification) {
        setPendingUser({ user, token, sessionData });
        setShowOTPVerification(true);
        return;
      }

      login(user, token, sessionData);

      // Redirect based on role
      if (user.userType === "freelancer") navigate("/freelancerhomepage");
      else if (user.userType === "client") navigate("/clienthomepage");
      else navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setOauthLoading(true);
    window.location.href = 'http://localhost:3000/api/auth/google';
  };

  const handleAppleLogin = () => {
    setOauthLoading(true);
    window.location.href = 'http://localhost:3000/api/auth/apple';
  };

  // Fetch OAuth configuration on component mount
  useEffect(() => {
    const fetchOAuthConfig = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/auth/oauth-urls');
        if (response.data.success && response.data.data.configured) {
          setOauthConfig({
            googleEnabled: response.data.data.configured.google,
            appleEnabled: response.data.data.configured.apple
          });
        }
      } catch (error) {
        console.error('Failed to fetch OAuth configuration:', error);
        // Keep default values (both disabled)
      }
    };

    fetchOAuthConfig();
  }, []);

  const handleOTPVerificationSuccess = (verifiedUser: any) => {
    if (pendingUser) {
      login(pendingUser.user, pendingUser.token, pendingUser.sessionData);
      
      // Redirect based on role
      if (verifiedUser.userType === "freelancer") navigate("/freelancerhomepage");
      else if (verifiedUser.userType === "client") navigate("/clienthomepage");
      else navigate("/");
    }
  };

  const handleOTPBack = () => {
    setShowOTPVerification(false);
    setPendingUser(null);
  };

  if (showOTPVerification && pendingUser) {
    return (
      <OTPVerification
        email={pendingUser.user.email}
        onVerificationSuccess={handleOTPVerificationSuccess}
        onBack={handleOTPBack}
        type="email"
      />
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Login with your Apple or Google account</CardDescription>
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700 font-medium">
               New users get 20 free connects!
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Sign up to start applying for jobs
            </p>
          </div>
        </CardHeader>

        <CardContent>
          <OAuthButtons
            onGoogleLogin={handleGoogleLogin}
            onAppleLogin={handleAppleLogin}
            loading={oauthLoading}
            disabled={loading}
            googleEnabled={oauthConfig.googleEnabled}
            appleEnabled={oauthConfig.appleEnabled}
          />
          
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with email
              </FieldSeparator>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Field>

              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a href="/forgot-password" className="ml-auto text-sm underline-offset-4 hover:underline">
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </Field>

              {error && <p className="text-red-500 text-center">{error}</p>}

              <Field>
                <Button type="submit" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </Button>
                <FieldDescription className="text-center mt-2">
                  Don&apos;t have an account?{" "}
                  <Button
                    onClick={() => navigate("/signup")}
                    style={{
                      background: "none",
                      border: "none",
                      color: "blue",
                      cursor: "pointer",
                    }}
                  >
                    Sign up
                  </Button>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
