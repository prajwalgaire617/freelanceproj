import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

const URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/auth/register";

interface RegisterFormProps extends React.ComponentProps<"div"> {}

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  userType: "freelancer" | "client";
}

interface BackendError {
  errors?: { msg: string; path: string; value: string }[];
  message?: string;
  error?: string;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ className, ...props }) => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "freelancer",
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    setFieldErrors(prev => ({ ...prev, [id]: "" }));
  };

  const handleUserTypeChange = (value: "freelancer" | "client") => {
    setFormData(prev => ({ ...prev, userType: value }));
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.fullName.trim()) errors.fullName = "Full name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    if (formData.password.length < 6)
      errors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword)
      errors.confirmPassword = "Passwords do not match";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    setFieldErrors({});

    if (!validate()) return;

    setLoading(true);

    try {
      const response = await axios.post(URL, {
        firstName: formData.fullName.split(" ")[0],
        lastName: formData.fullName.split(" ")[1] || "",
        email: formData.email,
        password: formData.password,
        userType: formData.userType,
      });

      const { user, token, sessionId, expiresAt } = response.data;

      // Create session data object
      const sessionData = {
        sessionId,
        expiresAt
      };

      // Auto-login after registration
      login(user, token, sessionData);

      setSuccess(response.data.message || "Account created successfully!");
      
      // Redirect based on role
      setTimeout(() => {
        if (user.userType === "freelancer") navigate("/freelancerhomepage");
        else if (user.userType === "client") navigate("/clienthomepage");
        else navigate("/");
      }, 1500);
    } catch (err: any) {
      const data: BackendError = err.response?.data;

      if (data?.errors) {
        const errors: Record<string, string> = {};
        data.errors.forEach(e => (errors[e.path] = e.msg));
        setFieldErrors(errors);
      } else if (data?.message) {
        setFieldErrors({ general: data.message });
      } else if (data?.error) {
        setFieldErrors({ general: data.error });
      } else {
        setFieldErrors({ general: "Something went wrong" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-4 max-w-md mx-auto", className)} {...props}>
      <Card>
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription className="text-sm">
            Sign up with your Apple or Google account
          </CardDescription>
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700 font-medium">
               Get 20 free connects when you sign up!
            </p>
            <p className="text-xs text-green-600 mt-1">
              Use connects to apply for jobs and start earning
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* OAuth buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" type="button" className="w-full">
                  Apple
                </Button>
                <Button variant="outline" type="button" className="w-full">
                  Google
                </Button>
              </div>

              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>

              {/* Full Name & Email in 2 columns on larger screens */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field>
                  <FieldLabel htmlFor="fullName" className="text-sm">Full Name</FieldLabel>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="h-9"
                  />
                  {fieldErrors.fullName && (
                    <p className="text-red-500 text-xs mt-1">{fieldErrors.fullName}</p>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="email" className="text-sm">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="h-9"
                  />
                  {fieldErrors.email && (
                    <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>
                  )}
                </Field>
              </div>

              {/* User Type - More compact */}
              <Field>
                <FieldLabel className="text-sm">I am a</FieldLabel>
                <RadioGroup
                  defaultValue="freelancer"
                  className="flex gap-4"
                  onValueChange={handleUserTypeChange}
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="freelancer" id="r1" />
                    <Label htmlFor="r1" className="text-sm font-normal cursor-pointer">Freelancer</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="client" id="r2" />
                    <Label htmlFor="r2" className="text-sm font-normal cursor-pointer">Client</Label>
                  </div>
                </RadioGroup>
              </Field>

              {/* Password fields in 2 columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field>
                  <FieldLabel htmlFor="password" className="text-sm">Password</FieldLabel>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="h-9"
                  />
                  {fieldErrors.password && (
                    <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="confirmPassword" className="text-sm">Confirm</FieldLabel>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="h-9"
                  />
                  {fieldErrors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">{fieldErrors.confirmPassword}</p>
                  )}
                </Field>
              </div>

              {/* General Errors / Success */}
              {fieldErrors.general && (
                <p className="text-red-500 text-center text-sm">{fieldErrors.general}</p>
              )}
              {success && <p className="text-green-500 text-center text-sm font-medium">{success}</p>}

              {/* Submit Button */}
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Creating..." : "Create Account"}
              </Button>

              <FieldDescription className="text-center text-xs">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-primary hover:underline font-medium"
                >
                  Login
                </button>
              </FieldDescription>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Footer */}
      <p className="text-xs text-center text-muted-foreground px-8">
        By signing up, you agree to our{" "}
        <a href="#" className="underline hover:text-primary">Terms</a> and{" "}
        <a href="#" className="underline hover:text-primary">Privacy Policy</a>
      </p>
    </div>
  );
};

export default RegisterForm;