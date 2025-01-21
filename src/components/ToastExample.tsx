import { Toast } from "@/types/Toast";
import { CheckCircle } from "lucide-react";

const myToast: Toast = {
  message: "Success!",
  type: "success",
  icon: <CheckCircle className="h-4 w-4" />
};

export default myToast;