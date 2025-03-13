"use client";

import { getAuthUser, User } from "@/api/out";
import {
  loginUserMutation,
  logoutUserMutation,
} from "@/api/out/@tanstack/react-query.gen";
import client from "@/api/out/client.gen";
import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

// Define the authentication context state
interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Define the authentication context and its methods
interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

// Create the authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Cookie name constant
const AUTH_COOKIE_NAME = "client_token";
const COOKIE_EXPIRY_DAYS = 7;

// Configure API client interceptors
const configureInterceptors = () => {
  // Add request interceptor to include token
  client.instance.interceptors.request.use(
    (config) => {
      const token = Cookies.get(AUTH_COOKIE_NAME);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Add response interceptor for handling unauthorized responses
  client.instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        Cookies.remove(AUTH_COOKIE_NAME);

        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
  );
};

// Provider component that wraps your app and makes auth available to any child component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });
  const router = useRouter();

  // Configure interceptors on client-side only
  useEffect(() => {
    if (typeof window !== "undefined") {
      configureInterceptors();
    }
  }, []);

  // Use React Query mutations
  const loginMutation = useMutation(loginUserMutation());
  const logoutMutation = useMutation(logoutUserMutation());

  // Initialize the auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const hasToken = !!Cookies.get(AUTH_COOKIE_NAME);

        if (hasToken) {
          await refreshUser();
        } else {
          setState((prev) => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error("Authentication initialization error:", error);
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    initializeAuth();
  }, []);

  // Refresh the user profile
  const refreshUser = async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      const response = await getAuthUser();

      if (response.data?.success && response.data?.data) {
        setState({
          user: response.data.data,
          isLoading: false,
          isAuthenticated: true,
        });
      } else {
        Cookies.remove(AUTH_COOKIE_NAME);
        setState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    } catch (error) {
      console.error("Error refreshing user:", error);
      Cookies.remove(AUTH_COOKIE_NAME);
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  };

  // Login the user
  const login = async (email: string, password: string) => {
    try {
      const response = await loginMutation.mutateAsync({
        body: { email, password },
      });

      if (response?.success === false) {
        throw new Error(response.message || "Login failed");
      }

      const token = response?.data?.token;
      const user = response?.data?.user;

      if (token && user) {
        Cookies.set(AUTH_COOKIE_NAME, token, {
          expires: COOKIE_EXPIRY_DAYS,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });

        setState({
          user,
          isLoading: false,
          isAuthenticated: true,
        });

        return;
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error: any) {
      console.error("Login error:", error);

      Cookies.remove(AUTH_COOKIE_NAME);

      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });

      throw error;
    }
  };

  // Logout the user
  const logout = async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      await logoutMutation.mutateAsync({});

      finishLogout();
    } catch (error) {
      console.error("Logout error:", error);
      finishLogout();
    }
  };

  // Helper to finish logout process
  const finishLogout = () => {
    Cookies.remove(AUTH_COOKIE_NAME);

    setState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    });

    router.push("/login");
  };

  // Context value
  const contextValue = {
    ...state,
    login,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Utility hook for protected routes
export const useProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  return { isLoading };
};
