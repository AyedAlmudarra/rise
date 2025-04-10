import { Button, Checkbox, Label, TextInput, Alert } from "flowbite-react";
import React, { useState } from "react";
import { supabase } from "src/lib/supabaseClient";
import { useNavigate } from "react-router-dom";
// Import Link from react-router-dom if needed later
// import { Link } from "react-router-dom";

const AuthLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (signInError) {
        console.error('Supabase Sign In Error:', signInError.message);
        setError(signInError.message);
      } else if (data.user) {
        console.log('Supabase Sign In Success:', data);
        const role = data.user.user_metadata?.role;
        if (role === 'startup') {
          navigate('/startup/dashboard');
        } else if (role === 'investor') {
          navigate('/investor/dashboard');
        } else {
          console.warn('User has unknown or missing role:', role);
          navigate('/');
        }
      } else {
        setError("Sign in successful but user data not received.");
      }
    } catch (catchError: any) {
      console.error("Error during sign in:", catchError);
      setError(catchError.message || "An unexpected error occurred.");
    } finally {
       setLoading(false);
    }
  };

  return (
    <>
      <form className="mt-6" onSubmit={handleSubmit}>
        {error && (
          <Alert color="failure" className="mb-4">
            {error}
          </Alert>
        )}
        <div className="mb-4">
          <div className="mb-2 block">
            <Label htmlFor="email" value="Email Address" />
          </div>
          <TextInput
            id="email"
            type="email"
            sizing="md"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <div className="mb-2 block">
            <Label htmlFor="userpwd" value="Password" />
          </div>
          <TextInput
            id="userpwd"
            type="password"
            sizing="md"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button color={"primary"} type="submit" className="w-full mt-5" disabled={loading}>
          {loading ? 'Signing In...' : 'Sign in'}
        </Button>
      </form>
    </>
  );
};

export default AuthLogin;
