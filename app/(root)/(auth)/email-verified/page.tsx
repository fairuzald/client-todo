"use client";

import { AlertCircle, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { AuthContainer } from "@/components/AuthContainer";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";

const EmailVerified = () => {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");

  const renderContent = () => {
    switch (status) {
      case "success":
        return (
          <div className="text-center py-4">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <h3 className="text-xl font-medium mb-2">Email Verified</h3>
            <p className="text-muted-foreground mb-6">
              Your email has been successfully verified. You can now access all
              features of your account.
            </p>
            <Button asChild className="w-full">
              <Link href="/login">Continue to Login</Link>
            </Button>
          </div>
        );

      case "invalid":
        return (
          <div className="text-center py-4">
            <div className="flex justify-center mb-4">
              <XCircle className="h-12 w-12 text-red-500" />
            </div>
            <h3 className="text-xl font-medium mb-2">
              Invalid Verification Link
            </h3>
            <p className="text-muted-foreground mb-6">
              The email verification link is invalid or has expired. Please
              request a new verification link.
            </p>
            <Button asChild variant="outline" className="w-full mb-4">
              <Link href="/resend-verification">Request New Link</Link>
            </Button>
            <Button asChild className="w-full">
              <Link href="/login">Back to Login</Link>
            </Button>
          </div>
        );

      case "already-verified":
        return (
          <div className="text-center py-4">
            <div className="flex justify-center mb-4">
              <AlertCircle className="h-12 w-12 text-amber-500" />
            </div>
            <h3 className="text-xl font-medium mb-2">Email Already Verified</h3>
            <p className="text-muted-foreground mb-6">
              Your email has already been verified. No further action is needed.
            </p>
            <Button asChild className="w-full">
              <Link href="/login">Continue to Login</Link>
            </Button>
          </div>
        );

      default:
        return (
          <div className="text-center py-4">
            <div className="flex justify-center mb-4">
              <XCircle className="h-12 w-12 text-red-500" />
            </div>
            <h3 className="text-xl font-medium mb-2">Something Went Wrong</h3>
            <p className="text-muted-foreground mb-6">
              We couldn&apos;t process your email verification. Please try again
              or contact support.
            </p>
            <Button asChild className="w-full">
              <Link href="/login">Back to Login</Link>
            </Button>
          </div>
        );
    }
  };

  return (
    <AuthContainer
      title="Email Verification"
      description="Confirm your email address to activate your account"
      footer={
        <div>
          <Link
            href="/login"
            className="inline-flex items-center text-primary hover:underline"
          >
            <ArrowLeft className="mr-1 h-3 w-3" /> Back to login
          </Link>
        </div>
      }
    >
      {renderContent()}
    </AuthContainer>
  );
};
export default function EmailVerifiedPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EmailVerified />
    </Suspense>
  );
}
