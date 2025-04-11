import React, { useState } from "react";
import { supabase } from "src/lib/supabaseClient";
import { Button, Checkbox, Label, TextInput, Textarea, Select, Alert, Spinner } from "flowbite-react";
import { useNavigate } from "react-router-dom";

// Define the structure for the investor profile data we want to insert
interface InvestorProfileData {
  user_id: string;
  job_title?: string;
  company_name?: string;
  preferred_industries?: string[];
  preferred_geography?: string[];
  preferred_stage?: string[];
  website?: string;
  linkedin_profile?: string;
  company_description?: string;
}

const AuthRegisterInvestor = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Investor specific fields
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [website, setWebsite] = useState("");
  const [linkedinProfile, setLinkedinProfile] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");

  // Multi-select fields (using simple comma-separated input for now)
  const [preferredIndustries, setPreferredIndustries] = useState(""); // e.g., "SaaS,Fintech,AI"
  const [preferredGeography, setPreferredGeography] = useState(""); // e.g., "MENA,Global"
  const [preferredStage, setPreferredStage] = useState(""); // e.g., "Seed,Series A"

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

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
            full_name: fullName,
            role: 'investor', // Set the user role
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

      // Step 2: Insert additional profile information into the 'investors' table
      const profileData: InvestorProfileData = {
        user_id: userId,
        job_title: jobTitle || undefined,
        company_name: companyName || undefined,
        // Convert comma-separated strings to arrays, trimming whitespace
        preferred_industries: preferredIndustries ? preferredIndustries.split(',').map(s => s.trim()).filter(Boolean) : undefined,
        preferred_geography: preferredGeography ? preferredGeography.split(',').map(s => s.trim()).filter(Boolean) : undefined,
        preferred_stage: preferredStage ? preferredStage.split(',').map(s => s.trim()).filter(Boolean) : undefined,
        website: website || undefined,
        linkedin_profile: linkedinProfile || undefined,
        company_description: companyDescription || undefined,
      };

       // Filter out undefined values before insertion
       const cleanProfileData = Object.entries(profileData).reduce((acc, [key, value]) => {
         if (value !== undefined) {
           acc[key as keyof InvestorProfileData] = value;
         }
         return acc;
       }, {} as Partial<InvestorProfileData>);


       console.log('Attempting to insert investor profile:', cleanProfileData);


       const { data: insertData, error: insertError } = await supabase
         .from('investors')
         .insert([cleanProfileData]); // Supabase expects an array of objects

      if (insertError) {
        console.error('Supabase Insert Error (investors):', insertError.message);
        // Optionally, attempt to clean up the created user if profile insert fails?
        // await supabase.auth.admin.deleteUser(userId); // Be cautious with this
        throw insertError;
      }

      console.log('Supabase Investor Profile Insert Success:', insertData);

      // Redirect to login or a "check your email" page after successful signup and profile creation
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

      {/* Personal Information */}
      <div>
        <Label htmlFor="fullName" value="Full Name" className="mb-2 block" />
        <TextInput
          id="fullName"
          type="text"
          placeholder="Your full name"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          disabled={loading}
        />
      </div>
      <div>
        <Label htmlFor="email" value="Your email" className="mb-2 block" />
        <TextInput
          id="email"
          type="email"
          placeholder="name@company.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
      </div>
      <div>
        <Label htmlFor="password" value="Password" className="mb-2 block" />
        <TextInput
          id="password"
          type="password"
          placeholder="••••••••"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
      </div>

      {/* Investor Specific Fields */}
      <hr className="my-6 border-gray-300 dark:border-gray-600" />
       <h4 className="text-lg font-semibold mb-4">Investor Profile</h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div>
             <Label htmlFor="jobTitle" value="Job Title" className="mb-2 block" />
             <TextInput
               id="jobTitle"
               type="text"
               placeholder="e.g., Investment Analyst"
               value={jobTitle}
               onChange={(e) => setJobTitle(e.target.value)}
               disabled={loading}
             />
           </div>
            <div>
              <Label htmlFor="companyName" value="Company Name" className="mb-2 block" />
              <TextInput
                id="companyName"
                type="text"
                placeholder="e.g., Venture Capital Inc."
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                disabled={loading}
              />
            </div>
       </div>


       <div>
         <Label htmlFor="website" value="Company Website (Optional)" className="mb-2 block" />
         <TextInput
           id="website"
           type="url"
           placeholder="https://yourcompany.com"
           value={website}
           onChange={(e) => setWebsite(e.target.value)}
           disabled={loading}
         />
       </div>

       <div>
         <Label htmlFor="linkedinProfile" value="LinkedIn Profile (Optional)" className="mb-2 block" />
         <TextInput
           id="linkedinProfile"
           type="url"
           placeholder="https://linkedin.com/in/yourprofile"
           value={linkedinProfile}
           onChange={(e) => setLinkedinProfile(e.target.value)}
           disabled={loading}
         />
       </div>


       <div>
          <Label htmlFor="preferredIndustries" value="Preferred Industries (comma-separated)" className="mb-2 block" />
          <TextInput
            id="preferredIndustries"
            type="text"
            placeholder="e.g., SaaS, Fintech, AI"
            value={preferredIndustries}
            onChange={(e) => setPreferredIndustries(e.target.value)}
            disabled={loading}
          />
       </div>

       <div>
          <Label htmlFor="preferredGeography" value="Preferred Geography (comma-separated)" className="mb-2 block" />
          <TextInput
            id="preferredGeography"
            type="text"
            placeholder="e.g., MENA, Global, North America"
            value={preferredGeography}
            onChange={(e) => setPreferredGeography(e.target.value)}
            disabled={loading}
          />
       </div>

        <div>
           <Label htmlFor="preferredStage" value="Preferred Investment Stage (comma-separated)" className="mb-2 block" />
           <TextInput
             id="preferredStage"
             type="text"
             placeholder="e.g., Seed, Series A, Growth"
             value={preferredStage}
             onChange={(e) => setPreferredStage(e.target.value)}
             disabled={loading}
           />
        </div>

      <div>
        <Label htmlFor="companyDescription" value="Company Description / Investment Thesis (Optional)" className="mb-2 block" />
        <Textarea
          id="companyDescription"
          placeholder="Briefly describe your fund or investment focus..."
          rows={4}
          value={companyDescription}
          onChange={(e) => setCompanyDescription(e.target.value)}
          disabled={loading}
        />
      </div>


      {/* Agreement and Submit */}
      <div className="flex items-start">
        <div className="flex h-5 items-center">
          <Checkbox
            id="agreeTerms"
            required
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            disabled={loading}
          />
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
            "Create Investor Account"
          )}
      </Button>
    </form>
  );
};

export default AuthRegisterInvestor; 