import { Toast as ShadcnToast } from "@/components/ui/toast"

export interface CustomToast extends ShadcnToast {
  icon?: React.ReactNode;
}

export type Toast = CustomToast;