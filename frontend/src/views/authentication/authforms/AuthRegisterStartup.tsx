import React, { useState } from "react";
import { supabase } from "src/lib/supabaseClient";
import { Button, Checkbox, Label, TextInput, Textarea, Select, Alert, Spinner } from "flowbite-react";
import { useNavigate } from "react-router-dom";

// Define the structure for the startup profile data we want to insert
// Based on StartupProfile type in database.ts, focusing on registration fields
interface StartupProfileData {
  user_id: string;
  name: string;
  description: string;
  industry: string;
  sector?: string | null;
  operational_stage: string;
  location_city: string;
  website?: string | null; // Added website field
  num_employees?: number | null;
  annual_revenue?: number | null;
  // logo_url and pitch_deck_url will likely be handled post-registration
}

const AuthRegisterStartup = () => {
  const navigate = useNavigate();
  // User Auth fields
  const [fullName, setFullName] = useState(""); // Used for user_metadata
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Startup Specific Fields (map to StartupProfileData)
  const [startupName, setStartupName] = useState(""); // maps to 'name'
  const [startupDescription, setStartupDescription] = useState(""); // maps to 'description'
  const [industry, setIndustry] = useState("");
  const [sector, setSector] = useState(""); // Optional
  const [operationalStage, setOperationalStage] = useState("");
  const [locationCity, setLocationCity] = useState("");
  const [website, setWebsite] = useState(""); // Optional
  const [numEmployees, setNumEmployees] = useState(""); // Input as string, convert to number/null
  const [annualRevenue, setAnnualRevenue] = useState(""); // Input as string, convert to number/null

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Helper to parse numeric input strings
  const parseNumeric = (value: string): number | null => {
    if (value.trim() === '') return null;
    const num = Number(value);
    return isNaN(num) ? null : num; // Return null if not a valid number
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!agreeTerms) {
      setError("You must agree to the terms and conditions.");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      // Step 1: Sign up the user with Supabase Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            full_name: fullName, // Store full name in user_metadata
            role: 'startup', // Set the user role
          },
        },
      });

      if (signUpError) {
        console.error('Supabase Sign Up Error:', signUpError.message);
        throw signUpError;
      }

      if (!authData.user) {
          throw new Error("Sign up successful but user data not received.");
      }

      console.log('Supabase Sign Up Success:', authData);
      const userId = authData.user.id;

      // Step 2: Insert additional profile information into the 'startups' table
      const profileData: StartupProfileData = {
        user_id: userId,
        name: startupName,
        description: startupDescription,
        industry: industry,
        sector: sector || null,
        operational_stage: operationalStage,
        location_city: locationCity,
        website: website || null,
        num_employees: parseNumeric(numEmployees),
        annual_revenue: parseNumeric(annualRevenue),
      };

       // Filter out any potential undefined values just in case (though defaults set to null/"")
       const cleanProfileData = Object.entries(profileData).reduce((acc, [key, value]) => {
         if (value !== undefined) {
           acc[key as keyof StartupProfileData] = value;
         }
         return acc;
       }, {} as Partial<StartupProfileData>);

       console.log('Attempting to insert startup profile:', cleanProfileData);

       const { data: insertData, error: insertError } = await supabase
         .from('startups') // Correct table name
         .insert([cleanProfileData]); // Supabase expects an array of objects

      if (insertError) {
        console.error('Supabase Insert Error (startups):', insertError.message);
        // Optionally, attempt to clean up the created user if profile insert fails
        // await supabase.auth.admin.deleteUser(userId); // Requires admin privileges
        throw insertError;
      }

      console.log('Supabase Startup Profile Insert Success:', insertData);

      // Redirect to login or a "check your email" page
      alert("Registration successful! Please check your email to verify your account.");
      navigate("/auth/auth1/login");

    } catch (catchError: any) {
      console.error("Error during registration:", catchError);
      setError(catchError.message || "An unexpected error occurred during registration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
      {error && (
        <Alert color="failure">
          <span className="font-medium">Error!</span> {error}
        </Alert>
      )}

      {/* Personal/Account Information */}
       <h4 className="text-lg font-semibold mb-4">Your Account</h4>
      <div>
        <Label htmlFor="fullName" value="Full Name" className="mb-2 block" />
        <TextInput id="fullName" type="text" placeholder="Your full name" required value={fullName} onChange={(e) => setFullName(e.target.value)} disabled={loading} />
      </div>
      <div>
        <Label htmlFor="email" value="Your email" className="mb-2 block" />
        <TextInput id="email" type="email" placeholder="name@company.com" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
      </div>
      <div>
        <Label htmlFor="password" value="Password" className="mb-2 block" />
        <TextInput id="password" type="password" placeholder="••••••••" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} />
      </div>

      {/* Startup Specific Fields */}
      <hr className="my-6 border-gray-300 dark:border-gray-600" />
      <h4 className="text-lg font-semibold mb-4">Startup Details</h4>

      <div>
        <Label htmlFor="startupName" value="Startup Name" className="mb-2 block" />
        <TextInput id="startupName" type="text" placeholder="Your company name" required value={startupName} onChange={(e) => setStartupName(e.target.value)} disabled={loading} />
      </div>

      <div>
        <Label htmlFor="startupDescription" value="Company Description" className="mb-2 block" />
        <Textarea id="startupDescription" placeholder="Briefly describe your startup..." required rows={4} value={startupDescription} onChange={(e) => setStartupDescription(e.target.value)} disabled={loading} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="industry" value="Industry" className="mb-2 block" />
          <TextInput id="industry" type="text" placeholder="e.g., SaaS, FinTech, HealthTech" required value={industry} onChange={(e) => setIndustry(e.target.value)} disabled={loading} />
        </div>
        <div>
          <Label htmlFor="sector" value="Sector (Optional)" className="mb-2 block" />
          <TextInput id="sector" type="text" placeholder="e.g., B2B, B2C, Enterprise" value={sector} onChange={(e) => setSector(e.target.value)} disabled={loading} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="operationalStage" value="Operational Stage" className="mb-2 block" />
           {/* Consider using a Select dropdown for stages if predefined */}
          <TextInput id="operationalStage" type="text" placeholder="e.g., Pre-Seed, Seed, Series A" required value={operationalStage} onChange={(e) => setOperationalStage(e.target.value)} disabled={loading} />
        </div>
         <div>
           <Label htmlFor="locationCity" value="City" className="mb-2 block" />
           <TextInput id="locationCity" type="text" placeholder="e.g., Riyadh, San Francisco" required value={locationCity} onChange={(e) => setLocationCity(e.target.value)} disabled={loading} />
         </div>
      </div>

       <div>
         <Label htmlFor="website" value="Company Website (Optional)" className="mb-2 block" />
         <TextInput id="website" type="url" placeholder="https://yourstartup.com" value={website} onChange={(e) => setWebsite(e.target.value)} disabled={loading} />
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="numEmployees" value="Number of Employees (Optional)" className="mb-2 block" />
          <TextInput id="numEmployees" type="number" min="0" placeholder="e.g., 10" value={numEmployees} onChange={(e) => setNumEmployees(e.target.value)} disabled={loading} />
        </div>
        <div>
          <Label htmlFor="annualRevenue" value="Annual Revenue (USD, Optional)" className="mb-2 block" />
          <TextInput id="annualRevenue" type="number" min="0" placeholder="e.g., 100000" value={annualRevenue} onChange={(e) => setAnnualRevenue(e.target.value)} disabled={loading} />
        </div>
      </div>

      {/* Agreement and Submit */}
      <div className="flex items-start mt-6">
        <div className="flex h-5 items-center">
          <Checkbox id="agreeTerms" required checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} disabled={loading} />
        </div>
        <div className="ml-3 text-sm">
          <Label htmlFor="agreeTerms">
            I accept the <a href="#" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Terms and Conditions</a>
          </Label>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
         {loading ? (
            <>
              <Spinner size="sm" />
              <span className="pl-3">Creating Account...</span>
            </>
          ) : (
            "Create Startup Account"
          )}
      </Button>
    </form>
  );
};

export default AuthRegisterStartup; 