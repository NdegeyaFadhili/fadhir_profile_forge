import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthProvider";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) {
      navigate("/", { replace: true });
    }
  }, [session, navigate]);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast({ title: "Welcome back!", description: "You are now logged in." });
      navigate("/", { replace: true });
    } catch (err: any) {
      toast({ title: "Login failed", description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    try {
      setLoading(true);
      const redirectUrl = `${window.location.origin}/`;
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: redirectUrl },
      });
      if (error) throw error;
      toast({ title: "Check your email", description: "Confirm your email to complete signup." });
    } catch (err: any) {
      toast({ title: "Signup failed", description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background px-4 py-16">
      <Helmet>
        <title>Login or Sign Up | Ihirwe Portfolio</title>
        <meta name="description" content="Owner login to manage the professional portfolio." />
        <link rel="canonical" href={`${window.location.origin}/auth`} />
      </Helmet>

      <div className="mx-auto max-w-md">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Owner Access</CardTitle>
            <CardDescription>Sign in to manage your profile, projects, and more.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
                  </div>
                  <Button className="w-full" onClick={handleLogin} disabled={loading}>
                    {loading ? "Please wait..." : "Login"}
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="signup">
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-su">Email</Label>
                    <Input id="email-su" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-su">Password</Label>
                    <Input id="password-su" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
                  </div>
                  <Button className="w-full" onClick={handleSignup} disabled={loading}>
                    {loading ? "Please wait..." : "Create account"}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default Auth;
