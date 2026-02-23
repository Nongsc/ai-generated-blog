"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Home, Tags, User, Link2, Archive } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBasicConfig } from "@/contexts/SiteConfigContext";

const navLinks = [
  { href: "/", label: "首页", icon: Home },
  { href: "/categories", label: "分类", icon: Tags },
  { href: "/tags", label: "标签", icon: Tags },
  { href: "/archives", label: "归档", icon: Archive },
  { href: "/links", label: "友链", icon: Link2 },
  { href: "/about", label: "关于", icon: User },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const basicConfig = useBasicConfig();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      setIsScrolled(scrollY > viewportHeight * 0.5);
    };

    if (pathname === "/") {
      window.addEventListener("scroll", handleScroll);
      handleScroll();
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  const isHomePage = pathname === "/";
  const useTransparentHeader = isHomePage && !isScrolled;

  const siteTitle = basicConfig?.title || "博客";
  const siteLogo = basicConfig?.logo;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-border/50 transition-all duration-300",
        useTransparentHeader ? "bg-transparent" : "bg-background/60"
      )}
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[oklch(0.75_0.12_350)] to-[oklch(0.7_0.15_200)] flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow overflow-hidden">
              {siteLogo ? (
                <img src={siteLogo} alt={siteTitle} className="w-full h-full object-cover" />
              ) : (
                <span className="text-white font-bold text-sm">
                  {siteTitle.charAt(0)}
                </span>
              )}
            </div>
            <span
              className={cn(
                "font-semibold text-lg transition-colors",
                useTransparentHeader
                  ? "text-white group-hover:text-primary"
                  : "text-foreground group-hover:text-primary"
              )}
            >
              {siteTitle}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200",
                  useTransparentHeader
                    ? "text-white/80 hover:text-white hover:bg-white/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <link.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={cn(
              "md:hidden p-2 rounded-lg transition-colors",
              useTransparentHeader
                ? "hover:bg-white/10"
                : "hover:bg-muted"
            )}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className={cn("w-5 h-5", useTransparentHeader ? "text-white" : "text-foreground")} />
            ) : (
              <Menu className={cn("w-5 h-5", useTransparentHeader ? "text-white" : "text-foreground")} />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
            isMenuOpen ? "max-h-64 pb-4" : "max-h-0"
          )}
        >
          <div className="flex flex-col gap-1 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                  useTransparentHeader
                    ? "text-white/80 hover:text-white hover:bg-white/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <link.icon className="w-5 h-5" />
                <span className="font-medium">{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
