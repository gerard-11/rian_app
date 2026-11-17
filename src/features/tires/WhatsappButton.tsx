import { MessageCircle } from "lucide-react";
import type { ReactNode } from "react";

type WhatsappButtonProps = {
  href: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  variant?: "solid" | "outline";
  className?: string;
};

const sizes = {
  sm: "h-9 gap-1.5 px-3 text-xs",
  md: "h-11 gap-2 px-4 text-sm",
  lg: "h-12 gap-2 px-5 text-base",
};

const variants = {
  solid: "bg-[#1FAF54] text-white shadow-md shadow-[#1FAF54]/25 hover:bg-[#178A42]",
  outline: "border border-[#1FAF54] bg-white text-[#178A42] hover:bg-[#1FAF54]/10",
};

export function WhatsappButton({
  href,
  children,
  size = "md",
  variant = "solid",
  className = "",
}: WhatsappButtonProps) {
  return (
    <a
      className={`inline-flex items-center justify-center rounded-md font-bold transition focus:outline-none focus:ring-4 focus:ring-[#1FAF54]/30 ${sizes[size]} ${variants[variant]} ${className}`}
      href={href}
      rel="noopener noreferrer"
      target="_blank"
    >
      <MessageCircle className={size === "sm" ? "h-4 w-4" : "h-5 w-5"} />
      {children}
    </a>
  );
}
