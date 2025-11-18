import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
import { useNavigate } from "@tanstack/react-router";

// Validation schemas
const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signUpSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignInFormData = z.infer<typeof signInSchema>;
type SignUpFormData = z.infer<typeof signUpSchema>;

interface AuthDialogProps {
  children: React.ReactNode;
  defaultMode?: "signin" | "signup";
}

export function AuthDialog({
  children,
  defaultMode = "signin",
}: AuthDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">(defaultMode);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Sign In form
  const signInForm = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Sign Up form
  const signUpForm = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSignIn = async (data: SignInFormData) => {
    setIsLoading(true);
    try {
      const result = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });

      if (result.data) {
        console.log("Sign in successful:", result.data);
        setIsOpen(false);
        signInForm.reset();
      } else if (result.error) {
        signInForm.setError("root", {
          message: result.error.message || "Invalid email or password",
        });
      }
      navigate({ to: "/" });
    } catch (error) {
      console.error("Sign in error:", error);
      signInForm.setError("root", {
        message: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSignUp = async (data: SignUpFormData) => {
    setIsLoading(true);
    try {
      const result = await authClient.signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (result.data) {
        console.log("Sign up successful:", result.data);
        setIsOpen(false);
        signUpForm.reset();
      } else if (result.error) {
        signUpForm.setError("root", {
          message: result.error.message || "Failed to create account",
        });
      }
    } catch (error) {
      console.error("Sign up error:", error);
      signUpForm.setError("root", {
        message: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/welcome",
      });
    } catch (error) {
      console.error("Google sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === "signin" ? "signup" : "signin");
    signInForm.reset();
    signUpForm.reset();
  };

  const currentForm = mode === "signin" ? signInForm : signUpForm;
  const rootError = currentForm.formState.errors.root?.message;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "signin" ? "Welcome back" : "Create account"}
          </DialogTitle>
          <DialogDescription>
            {mode === "signin"
              ? "Sign in to your account to continue"
              : "Create a new account to get started"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Google Sign In Button */}
          <Button
            variant="outline"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full"
          >
            <svg
              className="mr-2 h-4 w-4"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background text-muted-foreground px-2">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Error Message */}
          {rootError && (
            <div className="text-destructive bg-destructive/10 rounded-md p-3 text-sm">
              {rootError}
            </div>
          )}

          {/* Sign In Form */}
          {mode === "signin" && (
            <form
              onSubmit={signInForm.handleSubmit(onSignIn)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <label htmlFor="signin-email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="signin-email"
                  type="email"
                  placeholder="m@example.com"
                  {...signInForm.register("email")}
                  className={cn(
                    signInForm.formState.errors.email && "border-destructive"
                  )}
                />
                {signInForm.formState.errors.email && (
                  <p className="text-destructive text-sm">
                    {signInForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="signin-password"
                  className="text-sm font-medium"
                >
                  Password
                </label>
                <Input
                  id="signin-password"
                  type="password"
                  {...signInForm.register("password")}
                  className={cn(
                    signInForm.formState.errors.password && "border-destructive"
                  )}
                />
                {signInForm.formState.errors.password && (
                  <p className="text-destructive text-sm">
                    {signInForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          )}

          {/* Sign Up Form */}
          {mode === "signup" && (
            <form
              onSubmit={signUpForm.handleSubmit(onSignUp)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <label htmlFor="signup-name" className="text-sm font-medium">
                  Full Name
                </label>
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="John Doe"
                  {...signUpForm.register("name")}
                  className={cn(
                    signUpForm.formState.errors.name && "border-destructive"
                  )}
                />
                {signUpForm.formState.errors.name && (
                  <p className="text-destructive text-sm">
                    {signUpForm.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="signup-email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="m@example.com"
                  {...signUpForm.register("email")}
                  className={cn(
                    signUpForm.formState.errors.email && "border-destructive"
                  )}
                />
                {signUpForm.formState.errors.email && (
                  <p className="text-destructive text-sm">
                    {signUpForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="signup-password"
                  className="text-sm font-medium"
                >
                  Password
                </label>
                <Input
                  id="signup-password"
                  type="password"
                  {...signUpForm.register("password")}
                  className={cn(
                    signUpForm.formState.errors.password && "border-destructive"
                  )}
                />
                {signUpForm.formState.errors.password && (
                  <p className="text-destructive text-sm">
                    {signUpForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="signup-confirm" className="text-sm font-medium">
                  Confirm Password
                </label>
                <Input
                  id="signup-confirm"
                  type="password"
                  {...signUpForm.register("confirmPassword")}
                  className={cn(
                    signUpForm.formState.errors.confirmPassword &&
                      "border-destructive"
                  )}
                />
                {signUpForm.formState.errors.confirmPassword && (
                  <p className="text-destructive text-sm">
                    {signUpForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </form>
          )}

          {/* Mode Switch */}
          <div className="text-center text-sm">
            <span className="text-muted-foreground">
              {mode === "signin"
                ? "Don't have an account? "
                : "Already have an account? "}
            </span>
            <button
              type="button"
              onClick={switchMode}
              className="hover:text-primary underline underline-offset-4"
              disabled={isLoading}
            >
              {mode === "signin" ? "Sign up" : "Sign in"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
