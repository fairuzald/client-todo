"use client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { CheckSquare, LogOut, Menu, Tag, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import FadeIn from "./animations/FadeIn";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, isLoading, logout } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navItems = [
    {
      name: "Tasks",
      path: "/tasks",
      icon: <CheckSquare className="w-4 h-4 mr-2" />,
    },
    {
      name: "Tags",
      path: "/tags",
      icon: <Tag className="w-4 h-4 mr-2" />,
    },
  ];

  const isActive = (path: string) => {
    return pathname === path;
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-apple",
          isScrolled || isMobileMenuOpen
            ? "bg-white/80 backdrop-blur-soft border-b border-border/50 shadow-subtle"
            : "bg-transparent"
        )}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <FadeIn direction="right" delay={100}>
                <Link href="/" className="flex items-center">
                  <CheckSquare className="w-5 h-5 mr-2 text-primary" />
                  <span className="text-lg font-semibold text-primary">
                    TodoApp
                  </span>
                </Link>
              </FadeIn>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item, index) => (
                <FadeIn
                  key={item.path}
                  delay={100 + index * 50}
                  direction="down"
                >
                  <Link
                    href={item.path}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-apple hover:text-primary/50",
                      isActive(item.path)
                        ? "text-primary"
                        : "text-muted-foreground"
                    )}
                  >
                    <span className="flex items-center">
                      {item.icon}
                      {item.name}
                    </span>
                  </Link>
                </FadeIn>
              ))}
            </nav>

            {/* User menu for desktop */}
            <div className="hidden md:flex items-center space-x-2">
              {isLoading ? (
                // Loading state - show nothing or a simple loading indicator
                <div className="h-8 w-20 animate-pulse rounded-full bg-muted"></div>
              ) : isAuthenticated ? (
                // Just a logout button for authenticated users
                <FadeIn delay={250} direction="down">
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </FadeIn>
              ) : (
                // Login/Register buttons for non-authenticated users
                <>
                  <FadeIn delay={250} direction="down">
                    <Button
                      size="sm"
                      variant="outline"
                      asChild
                      className="rounded-full mr-2"
                    >
                      <Link href="/login">Sign in</Link>
                    </Button>
                  </FadeIn>
                  <FadeIn delay={300} direction="down">
                    <Button size="sm" className="rounded-full" asChild>
                      <Link href="/register">Sign up</Link>
                    </Button>
                  </FadeIn>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border/50">
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col space-y-2">
                {navItems.map((item, index) => (
                  <FadeIn
                    key={item.path}
                    delay={50 * index}
                    direction="right"
                    className="w-full"
                  >
                    <Link
                      href={item.path}
                      className={cn(
                        "px-4 py-3 rounded-lg text-sm font-medium flex items-center transition-apple hover:text-primary/50",
                        isActive(item.path)
                          ? "text-primary"
                          : "text-muted-foreground"
                      )}
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  </FadeIn>
                ))}

                {/* Authentication buttons in mobile menu */}
                <div className="pt-2 mt-2 border-t border-border/50 flex flex-col gap-2">
                  {isLoading ? (
                    <div className="h-10 w-full animate-pulse rounded-lg bg-muted"></div>
                  ) : isAuthenticated ? (
                    // Just logout button for mobile
                    <FadeIn delay={200} direction="right" className="w-full">
                      <Button
                        variant="outline"
                        className="w-full justify-center rounded-lg"
                        onClick={handleLogout}
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </Button>
                    </FadeIn>
                  ) : (
                    <>
                      <FadeIn delay={200} direction="right" className="w-full">
                        <Button
                          variant="outline"
                          className="w-full justify-center rounded-lg"
                          asChild
                        >
                          <Link href="/login">Sign in</Link>
                        </Button>
                      </FadeIn>
                      <FadeIn delay={250} direction="right" className="w-full">
                        <Button
                          className="w-full justify-center rounded-lg"
                          asChild
                        >
                          <Link href="/register">Sign up</Link>
                        </Button>
                      </FadeIn>
                    </>
                  )}
                </div>
              </nav>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
