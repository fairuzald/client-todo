/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { verifyEmail } from "@/api/out";
import { AuthContainer } from "@/components/AuthContainer";
import { Button } from "@/components/ui/button";

const Confirmation = () => {
  const [isVerifying, setIsVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyUserAccount = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const token = searchParams.get("token");
      const id = searchParams.get("id");

      if (!token) {
        setIsVerifying(false);
        setError("Invalid verification link. No token provided.");
        toast.error("Invalid verification link. No token provided.");
        return;
      }

      if (!id && isNaN(Number(id))) {
        setIsVerifying(false);
        setError("Invalid verification link. No user ID provided.");
        toast.error("Invalid verification link. No user ID provided.");
        return;
      }

      const verificationPromise = verifyEmail({
        path: {
          id: Number(id),
          hash: token,
        },
      });

      toast.promise(verificationPromise, {
        loading: "Verifying your account...",
        success: (response) => {
          setVerified(true);
          setIsVerifying(false);
          return (
            response.data?.message ||
            "Your account has been verified successfully!"
          );
        },
        error: (err: unknown) => {
          const error = err as any;
          setIsVerifying(false);

          let errorMessage = "An unknown error occurred during verification.";

          if (error?.response?.data?.message) {
            errorMessage = error.response.data.message;
          } else if (error instanceof Error) {
            errorMessage = error.message;
          }

          setError(errorMessage);
          return errorMessage;
        },
      });
    };

    verifyUserAccount();
  }, []);

  return (
    <AuthContainer
      title="Confirm your account"
      description="We're verifying your account"
      footer={
        <div>
          Having trouble?{" "}
          <Link href="/contact" className="text-primary hover:underline">
            Contact support
          </Link>
        </div>
      }
    >
      <div className="flex flex-col items-center justify-center py-8">
        {isVerifying ? (
          <>
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
            <h3 className="text-lg font-medium mb-2">Verifying your account</h3>
            <p className="text-sm text-muted-foreground text-center">
              Please wait while we verify your account details...
            </p>
          </>
        ) : verified ? (
          <>
            <CheckCircle2 className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-lg font-medium mb-2">Account confirmed!</h3>
            <p className="text-sm text-muted-foreground text-center mb-6">
              Your account has been successfully verified. You can now log in.
            </p>
            <Button asChild className="w-full">
              <Link href="/login">Log in to your account</Link>
            </Button>
          </>
        ) : (
          <>
            <XCircle className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-medium mb-2">Verification failed</h3>
            <p className="text-sm text-muted-foreground text-center mb-6">
              {error ||
                "We couldn't verify your account. The link may have expired or been used already."}
            </p>
            <Button asChild variant="outline" className="w-full mb-3">
              <Link href="/login">Try logging in</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/forgot-password">Reset your password</Link>
            </Button>
          </>
        )}
      </div>
    </AuthContainer>
  );
};

export default Confirmation;
