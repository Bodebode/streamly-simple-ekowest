import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function truncateTitle(title: string): string {
  // Define the special characters to truncate at
  const specialChars = ['-', ':', '|', '{', '}', '.', ',', '#', '||'];
  
  // Create a regex pattern that matches any of the special characters
  // followed by any other characters
  const pattern = new RegExp(`[${specialChars.map(char => 
    char === '|' || char === '{' || char === '}' ? '\\' + char : char
  ).join('')}].*$`);
  
  // Remove everything after the first special character
  const truncated = title.replace(pattern, '').trim();
  
  return truncated || title; // Return original title if truncated is empty
}