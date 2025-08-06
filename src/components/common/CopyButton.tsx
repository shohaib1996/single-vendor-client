"use client";

import React, { useState } from "react";
import { Copy, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  text: string;
  className?: string;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "outline" | "ghost" | "secondary";
  showText?: boolean;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  text,
  className,
  size = "sm",
  variant = "ghost",
  showText = false,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy to clipboard");
      console.error("Copy failed:", error);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleCopy}
      className={cn(
        "transition-all duration-200 hover:scale-105",
        copied && "text-green-600 dark:text-green-400",
        className
      )}
      title={`Copy ${text}`}
    >
      {copied ? (
        <Check className="h-3 w-3" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
      {showText && (
        <span className="ml-1 text-xs">
          {copied ? "Copied!" : "Copy"}
        </span>
      )}
    </Button>
  );
};

// Hook for copy functionality
export const useCopyToClipboard = () => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
      return true;
    } catch (error) {
      toast.error("Failed to copy to clipboard");
      console.error("Copy failed:", error);
      return false;
    }
  };

  return { copyToClipboard, copied };
};
