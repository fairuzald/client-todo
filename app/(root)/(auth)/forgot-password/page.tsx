"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { forgotPassword } from "@/api/out";
import { AuthContainer } from "@/components/AuthContainer";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const resetSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" }),
});

type ResetFormValues = z.infer<typeof resetSchema>;

const ForgotPassword = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  // Initialize form with react-hook-form and zod validation
  const form = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: ResetFormValues) => {
    const performReset = async () => {
      try {
        const response = await forgotPassword({
          body: { email: values.email },
        });

        const responseData = response.data;

        if (responseData?.success === false) {
          throw new Error(responseData.message || "Registration failed");
        }

        return response;
      } catch (error) {
        throw error;
      }
    };

    toast.promise(performReset(), {
      loading: "Sending reset instructions...",
      success: () => {
        setSubmittedEmail(values.email);
        setIsSubmitted(true);
        return "Password reset instructions sent to your email";
      },
      error: (error) => {
        if (error.response?.data?.message) {
          return error.response.data.message;
        }

        if (error instanceof Error) {
          return error.message;
        }

        return "Failed to send reset instructions. Please try again.";
      },
    });
  };

  return (
    <AuthContainer
      title="Reset your password"
      description="Enter your email to receive a password reset link"
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
      {isSubmitted ? (
        <div className="text-center py-4">
          <h3 className="text-lg font-medium mb-2">Check your email</h3>
          <p className="text-muted-foreground mb-4">
            We&apos;ve sent a password reset link to:
            <br />
            <span className="font-medium text-foreground">
              {submittedEmail}
            </span>
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Please check your inbox and spam folder. The link will expire in 1
            hour.
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-2"
            onClick={() => setIsSubmitted(false)}
          >
            Try a different email
          </Button>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="name@example.com"
                      autoComplete="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                </>
              ) : (
                "Send reset instructions"
              )}
            </Button>
          </form>
        </Form>
      )}
    </AuthContainer>
  );
};

export default ForgotPassword;
