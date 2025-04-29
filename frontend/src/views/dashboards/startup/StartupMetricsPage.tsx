import { useState, useEffect } from 'react';
import BreadcrumbComp from '@/layouts/full/shared/breadcrumb/BreadcrumbComp';
import { KeyMetricsSection } from '@/components/dashboards/startup';
import { useAuth } from '@/context/AuthContext'; // Import useAuth
import { supabase } from '@/lib/supabaseClient'; // Import supabase
import { StartupProfile, AIAnalysisData } from '@/types/database'; // Import types
import { Spinner, Alert } from 'flowbite-react'; // Import Spinner/Alert

const BCrumb = [
  { to: '/', title: 'Home' },
  { to: '/startup/dashboard', title: 'Startup Dashboard' },
  { title: 'Metrics & Performance' },
];

const StartupMetricsPage = () => {
  const { user } = useAuth(); // Get user
  const [startupData, setStartupData] = useState<StartupProfile | null>(null);
  const [analysisData, setAnalysisData] = useState<AIAnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch startup data including ai_analysis
  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setIsLoading(false);
        setError("User not authenticated.");
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const { data, error: fetchError, status } = await supabase
          .from('startups')
          .select('*, ai_analysis') // Ensure ai_analysis is selected
          .eq('user_id', user.id)
          .single();

        if (fetchError && status !== 406) throw fetchError;

        if (data) {
          setStartupData(data);
        } else {
          setError("Startup profile not found.");
        }
      } catch (err: any) {
        setError(`Failed to load data: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user]);

  // Parse AI analysis data when startupData is available
  useEffect(() => {
    if (startupData?.ai_analysis) {
      try {
        const parsed = typeof startupData.ai_analysis === 'string'
          ? JSON.parse(startupData.ai_analysis)
          : startupData.ai_analysis;
        setAnalysisData(parsed);
      } catch (e) {
        console.error("Failed to parse AI analysis:", e);
        setAnalysisData(null); // Set to null or an error state if parsing fails
      }
    } else {
      setAnalysisData(null);
    }
  }, [startupData]);

  return (
    <>
      <BreadcrumbComp title="Metrics & Performance" items={BCrumb} />
      <div className="grid grid-cols-12 gap-6 mt-6">
        <div className="col-span-12">
          {isLoading ? (
            <div className="flex justify-center items-center p-10">
              <Spinner size="xl" />
            </div>
          ) : error ? (
            <Alert color="failure">{error}</Alert>
          ) : (
            <KeyMetricsSection
              analysisData={analysisData}
              startupData={startupData}
              isLoading={isLoading} // Pass loading state
            />
          )}
        </div>
      </div>
    </>
  );
};

export default StartupMetricsPage; 