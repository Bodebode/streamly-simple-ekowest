import { ToastProps } from "@/components/ui/toast"

export interface CustomToast extends ToastProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export type Toast = CustomToast;