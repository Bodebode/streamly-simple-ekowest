import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export const EmailPopup = () => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the email to your backend
    console.log('Email submitted:', email);
    toast({
      title: "Thanks for subscribing!",
      description: "We'll keep you updated with the latest movies.",
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Welcome to Ekowest TV!</DialogTitle>
          <DialogDescription>
            Subscribe to get notified about new releases and exclusive content.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" className="w-full">
            Subscribe
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};