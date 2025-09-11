import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AuthDialog = ({ open, onOpenChange }: AuthDialogProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isResetMode, setIsResetMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [canSignup, setCanSignup] = useState(false);
  const [checkingOwner, setCheckingOwner] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const { toast } = useToast();

  // Check if signup is allowed (no existing users)
  useEffect(() => {
    const checkOwnerStatus = async () => {
      if (!open) return;
      
      setCheckingOwner(true);
      try {
        const { data, error } = await supabase.functions.invoke('check-owner');
        
        if (error) throw error;
        
        setCanSignup(data.canSignup);
        
        // If no users exist, default to signup mode
        if (data.canSignup) {
          setIsLogin(false);
        }
      } catch (error) {
        console.error('Error checking owner status:', error);
        setCanSignup(false);
      } finally {
        setCheckingOwner(false);
      }
    };

    checkOwnerStatus();
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isResetMode) {
        // Password reset
        const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
          redirectTo: `${window.location.origin}/reset-password`
        });
        
        if (error) throw error;
        
        toast({
          title: "Reset email sent!",
          description: "Check your email for password reset instructions.",
        });
        setIsResetMode(false);
        setFormData({ email: '', password: '', confirmPassword: '' });
      } else if (isLogin) {
        // Login
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        
        if (error) throw error;
        
        toast({
          title: "Welcome back!",
          description: "You have been successfully logged in.",
        });
        onOpenChange(false);
      } else {
        // Signup (only if allowed)
        if (!canSignup) {
          throw new Error("Account creation is not allowed. An owner account already exists.");
        }

        if (formData.password !== formData.confirmPassword) {
          throw new Error("Passwords don't match");
        }

        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/`
          }
        });
        
        if (error) throw error;
        
        toast({
          title: "Owner account created!",
          description: "Please check your email to verify your account.",
        });
        onOpenChange(false);
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast({
        title: "Error",
        description: error.message || "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const resetForm = () => {
    setFormData({ email: '', password: '', confirmPassword: '' });
    setIsResetMode(false);
  };

  const getDialogTitle = () => {
    if (isResetMode) return 'Reset Password';
    if (canSignup && !isLogin) return 'Create Owner Account';
    return 'Owner Login';
  };

  if (checkingOwner) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Loading...</DialogTitle>
          </DialogHeader>
          <div className="py-8 text-center">
            <p>Checking authentication status...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) {
        resetForm();
      }
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your.email@example.com"
            />
          </div>
          
          {!isResetMode && (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
              />
            </div>
          )}
          
          {!isLogin && !isResetMode && canSignup && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="••••••••"
              />
            </div>
          )}
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Please wait...' : (
              isResetMode ? 'Send Reset Email' : 
              (isLogin ? 'Sign In' : 'Create Owner Account')
            )}
          </Button>
          
          <div className="text-center space-y-2">
            {!isResetMode && (
              <>
                {canSignup && (
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-sm text-primary hover:underline block w-full"
                  >
                    {isLogin ? "Create owner account" : "Already have an account? Sign in"}
                  </button>
                )}
                
                {isLogin && (
                  <button
                    type="button"
                    onClick={() => setIsResetMode(true)}
                    className="text-sm text-muted-foreground hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </>
            )}
            
            {isResetMode && (
              <button
                type="button"
                onClick={() => setIsResetMode(false)}
                className="text-sm text-primary hover:underline"
              >
                Back to login
              </button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;