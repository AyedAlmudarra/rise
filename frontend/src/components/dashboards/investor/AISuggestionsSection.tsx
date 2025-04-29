import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, Avatar, Button, Badge, Progress, Alert } from 'flowbite-react';
import { 
  IconBrain, IconRefresh, IconChevronLeft, 
  IconChevronRight, IconMapPin, IconUsers, 
  IconCurrencyDollar, IconHeartFilled, IconShare3,
  IconInfoCircle, IconFilter, IconMessageCircle
} from '@tabler/icons-react';
import { supabase } from '../../../lib/supabaseClient';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-hot-toast';

// Placeholder: Replace with actual type definition later
interface StartupSuggestion {
  id: string; // Assuming startup ID or suggestion ID
  startupName: string;
  logoUrl?: string;
  industry: string;
  stage: string;
  matchScore: number;
  description: string;
  location?: string;
  teamSize?: number | string; // Allow string based on usage possibility
  fundingNeeded?: number;
  highlights: string[];
  matchReason: string;
}

interface AISuggestionsSectionProps { 
  // Removed suggestions prop, keep onRefresh optional
  onRefreshProp?: () => void; 
}

const AISuggestionsSection: React.FC<AISuggestionsSectionProps> = ({ 
  onRefreshProp 
}) => {
  const { user } = useAuth(); // Get current user
  const [suggestions, setSuggestions] = useState<StartupSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [favorited, setFavorited] = useState<Record<string, boolean>>({});
  const [industryFilter, setIndustryFilter] = useState<string | null>(null);
  const [stageFilter, setStageFilter] = useState<string | null>(null);

  // State to hold initially favorited startup IDs
  const [initialFavoriteIds, setInitialFavoriteIds] = useState<Set<string>>(new Set());

  // --- Data Fetching --- 
  const fetchSuggestions = useCallback(async () => {
    if (!user) return; // Don't fetch if user is not logged in

    setIsLoading(true);
    setError(null);
    try {
      // --- Fetch data using the deployed Supabase function --- 
      console.log("Calling get_investor_suggestions RPC function...");
      const { data, error: fetchError } = await supabase.rpc('get_investor_suggestions');
      console.log("RPC call finished.");

      if (fetchError) {
          console.error("Supabase RPC Error:", fetchError);
          throw new Error(`Failed to fetch suggestions: ${fetchError.message}`);
      }
      
      // Assuming 'data' returned by the function is an array of objects matching StartupSuggestion
      // TODO: Add validation or mapping here if the returned data structure differs slightly
      console.log("Suggestions received:", data ? data.length : 0);
      setSuggestions(data || []); 

      // Fetch initial favorite statuses after suggestions are loaded
      try {
          const { data: favoritesData, error: favoritesError } = await supabase
              .from('investor_favorites')
              .select('startup_id')
              .eq('investor_user_id', user.id);

          if (favoritesError) {
              console.error("Error fetching initial favorites:", favoritesError);
              // Handle error - maybe show a toast, but don't block suggestions
          } else if (favoritesData) {
              // Assuming startup_id in favorites table matches StartupSuggestion.id type (string)
              setInitialFavoriteIds(new Set(favoritesData.map((fav: { startup_id: string }) => fav.startup_id)));
          }
      } catch (favErr: any) {
           console.error("Error processing favorites fetch:", favErr);
      }

    } catch (err: any) {
        console.error("Error fetching AI suggestions:", err);
        setError(err.message || 'Could not load suggestions.');
        setSuggestions([]); // Clear suggestions on error
    } finally {
        setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchSuggestions();
  }, [fetchSuggestions]);

  // Handle refresh - call fetchSuggestions and potentially the prop
  const handleRefresh = () => {
      fetchSuggestions();
      if (onRefreshProp) {
          onRefreshProp();
      }
  };
  
  // --- Filtering and Memoization (Good practice) ---
  const uniqueIndustries = useMemo(() => 
      [...new Set(suggestions.map(item => item.industry))]
  , [suggestions]);
  
  const uniqueStages = useMemo(() => 
      [...new Set(suggestions.map(item => item.stage))]
  , [suggestions]);
  
  const filteredSuggestions = useMemo(() => 
     suggestions.filter(suggestion => {
        if (industryFilter && suggestion.industry !== industryFilter) return false;
        if (stageFilter && suggestion.stage !== stageFilter) return false;
        return true;
      })
  , [suggestions, industryFilter, stageFilter]);

  // Reset index if filters change and index becomes invalid
  useEffect(() => {
      if (currentIndex >= filteredSuggestions.length) {
          setCurrentIndex(0); // Reset to first item if current index is out of bounds
      }
  }, [filteredSuggestions, currentIndex]);
  
  // Initialize local favorite state based on fetched suggestions and initial favorite IDs
  useEffect(() => {
      const initialFavorites: Record<string, boolean> = {};
      suggestions.forEach(suggestion => {
          if (initialFavoriteIds.has(suggestion.id)) {
              initialFavorites[suggestion.id] = true;
          } else {
              // Ensure keys exist for all suggestions for easier toggling later
              initialFavorites[suggestion.id] = false; 
          }
      });
      setFavorited(initialFavorites);
      // console.log("Initialized favorited state:", initialFavorites);
  }, [suggestions, initialFavoriteIds]); // Run when suggestions or initial IDs change
  
  // --- Navigation and Actions --- 
  const hasNext = currentIndex < filteredSuggestions.length - 1;
  const hasPrev = currentIndex > 0;
  
  const goToNext = () => {
    if (hasNext) {
      setCurrentIndex(prev => prev + 1);
    }
  };
  
  const goToPrev = () => {
    if (hasPrev) {
      setCurrentIndex(prev => prev - 1);
    }  
  };
  
  const toggleFavorite = async (startupId: string) => {
    if (!user) {
        toast.error("You must be logged in to save favorites.");
        return;
    }

    const isCurrentlyFavorited = !!favorited[startupId];

    setFavorited(prev => ({
        ...prev,
        [startupId]: !isCurrentlyFavorited,
    }));

    try {
        if (isCurrentlyFavorited) {
            const { error: deleteError } = await supabase
                .from('investor_favorites')
                .delete()
                .match({ investor_user_id: user.id, startup_id: startupId });

            if (deleteError) throw deleteError;
            toast.success('Removed from Saved');
        } else {
            const { error: insertError } = await supabase
                .from('investor_favorites')
                .insert({ investor_user_id: user.id, startup_id: startupId });

            if (insertError) throw insertError;
            toast.success('Added to Saved');
        }
    } catch (error: any) {
        console.error("Error updating favorite status:", error);
        toast.error(`Failed to update saved status: ${error.message}`);
        setFavorited(prev => ({
            ...prev,
            [startupId]: isCurrentlyFavorited, 
        }));
    }
  };

  // Placeholder Contact Handler
  const handleContact = (startupId: string, startupName: string) => {
      // TODO: Implement actual contact logic (e.g., open modal, send connection request)
      console.log(`Placeholder: Contact button clicked for ${startupName} (ID: ${startupId})`);
      alert(`Contact functionality for ${startupName} not yet implemented.`);
  };

  // Placeholder Share Handler
  const handleShare = (startupId: string, startupName: string) => {
      // TODO: Implement actual share logic (e.g., copy link, Web Share API)
      console.log(`Placeholder: Share button clicked for ${startupName} (ID: ${startupId})`);
      alert(`Share functionality for ${startupName} not yet implemented.`);
  };
  
  // --- UI Helpers --- 
  const formatCurrency = (value?: number) => {
    if (!value) return 'N/A';
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value.toLocaleString()}`;
  };
  
  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'success';
    if (score >= 80) return 'info';
    if (score >= 70) return 'warning';
    return 'dark';
  };
  
  // --- Render Logic --- 
  if (isLoading) {
    return (
      <Card>
        <div className="animate-pulse space-y-4 p-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-md w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-1/2"></div>
          <div className="h-64 bg-gray-300 dark:bg-gray-600 rounded-md"></div>
          <div className="flex justify-center space-x-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-md w-20"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-md w-20"></div>
          </div>
        </div>
      </Card>
    );
  }
  
  // Handle Error State
  if (error) {
    return (
        <Card>
            <Alert color="failure" icon={IconInfoCircle}>
                <span className="font-medium">Error!</span> {error}
            </Alert>
            <div className="mt-4 text-center">
                <Button color="light" size="sm" onClick={handleRefresh}>
                     <IconRefresh size={16} className="mr-1" />
                     Try Again
                 </Button>
            </div>
        </Card>
    );
  }

  // Handle No Suggestions Found (after loading and no error)
  if (suggestions.length === 0) {
      return (
        <Card>
          <div className="text-center py-8">
            <IconBrain size={40} className="mx-auto mb-3 text-gray-400" />
            <h5 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
              No Suggestions Available
            </h5>
            <p className="text-gray-500 mb-4">We couldn't find any startup suggestions for you at this time.</p>
            <Button 
              color="blue" 
              size="sm"
              onClick={handleRefresh}
            >
              <IconRefresh size={16} className="mr-1" />
              Check for New Suggestions
            </Button>
          </div>
        </Card>
      );
  }
  
  // Handle No Filtered Suggestions Found
  if (filteredSuggestions.length === 0) {
    return (
      <Card>
         {/* Header - reused */} 
         <div className="bg-gradient-to-r from-green-500 to-teal-600 p-4 -mt-6 -mx-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <IconBrain size={20} className="text-white mr-2" />
                <h5 className="text-xl font-bold text-white">AI-Suggested Startups</h5>
              </div>
              <div className="flex space-x-2">
                 {/* Use internal handleRefresh */} 
                 <Button size="xs" color="light" onClick={handleRefresh}>
                   <IconRefresh size={14} className="mr-1" /> Refresh
                 </Button>
              </div>
            </div>
         </div>
         {/* Filter bar - reused */} 
         <div className="flex flex-wrap gap-2 mb-4">
           <div>
             <span className="text-xs text-gray-600 dark:text-gray-400 mr-2">Industry:</span>
             <div className="inline-flex flex-wrap gap-1">
                <Button size="xs" color={industryFilter === null ? "blue" : "light"} onClick={() => setIndustryFilter(null)}>All</Button>
                {uniqueIndustries.map((industry: string) => (
                  <Button key={industry} size="xs" color={industryFilter === industry ? "blue" : "light"} onClick={() => setIndustryFilter(industry)}>{industry}</Button>
                ))}
             </div>
           </div>
           <div>
             <span className="text-xs text-gray-600 dark:text-gray-400 mr-2">Stage:</span>
             <div className="inline-flex flex-wrap gap-1">
                <Button size="xs" color={stageFilter === null ? "purple" : "light"} onClick={() => setStageFilter(null)}>All</Button>
                {uniqueStages.map((stage: string) => (
                  <Button key={stage} size="xs" color={stageFilter === stage ? "purple" : "light"} onClick={() => setStageFilter(stage)}>{stage}</Button>
                ))}
             </div>
           </div>
         </div>
         {/* No results message */} 
         <div className="text-center py-8">
           <IconFilter size={40} className="mx-auto mb-3 text-gray-400" />
           <h5 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
             No Matching Startups
           </h5>
           <p className="text-gray-500 mb-4">No suggestions match your current filter selection.</p>
           <Button 
             color="light" 
             size="sm"
             onClick={() => {
               setIndustryFilter(null);
               setStageFilter(null);
             }}
           >
             Clear Filters
           </Button>
         </div>
       </Card>
    );
  }
  
  // Display the current suggestion if filters match
  const currentSuggestion = filteredSuggestions[currentIndex];
  
  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-teal-600 p-4 -mt-6 -mx-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <IconBrain size={20} className="text-white mr-2" />
            <h5 className="text-xl font-bold text-white">
              AI-Suggested Startups
            </h5>
          </div>
          <div className="flex space-x-2">
             {/* Removed Filter button from here - now just part of the bar */}
             {/* Use internal handleRefresh */}
             <Button size="xs" color="light" onClick={handleRefresh}>
               <IconRefresh size={14} className="mr-1" /> Refresh
             </Button>
          </div>
        </div>
      </div>
      
      {/* Filter bar */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div>
          <span className="text-xs text-gray-600 dark:text-gray-400 mr-2">Industry:</span>
          <div className="inline-flex flex-wrap gap-1">
            <Button 
              size="xs"
              color={industryFilter === null ? "blue" : "light"}
              onClick={() => setIndustryFilter(null)}
            >
              All
            </Button>
            {uniqueIndustries.map((industry: string) => (
              <Button
                key={industry}
                size="xs"
                color={industryFilter === industry ? "blue" : "light"}
                onClick={() => setIndustryFilter(industry)}
              >
                {industry}
              </Button>
            ))}
          </div>
        </div>
        
        <div>
          <span className="text-xs text-gray-600 dark:text-gray-400 mr-2">Stage:</span>
          <div className="inline-flex flex-wrap gap-1">
            <Button 
              size="xs"
              color={stageFilter === null ? "purple" : "light"}
              onClick={() => setStageFilter(null)}
            >
              All
            </Button>
            {uniqueStages.map((stage: string) => (
              <Button
                key={stage}
                size="xs"
                color={stageFilter === stage ? "purple" : "light"}
                onClick={() => setStageFilter(stage)}
              >
                {stage}
              </Button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="relative">
        <div className="text-sm text-gray-500 mb-2">
          Showing {currentIndex + 1} of {filteredSuggestions.length} matches
        </div>
        
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden mb-4">
          {/* Startup header */} 
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center space-x-3">
              <Avatar 
                img={currentSuggestion.logoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentSuggestion.startupName)}&background=random`}
                size="md" 
                rounded 
              />
              <div>
                <h5 className="text-lg font-bold text-gray-900 dark:text-white">
                  {currentSuggestion.startupName}
                </h5>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                  <Badge color="indigo" className="mr-2">{currentSuggestion.industry}</Badge>
                  <Badge color="purple">{currentSuggestion.stage}</Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="text-right mr-3">
                <div className="text-xs text-gray-500 dark:text-gray-400">Match Score</div>
                <div className="font-bold text-xl text-gray-900 dark:text-white">
                  {currentSuggestion.matchScore}%
                </div>
              </div>
              <Progress
                color={getMatchScoreColor(currentSuggestion.matchScore)}
                progress={currentSuggestion.matchScore}
                size="sm"
                className="w-16"
              />
            </div>
          </div>
          
          {/* Startup details */} 
          <div className="p-4">
            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                {currentSuggestion.description}
              </p>
              
              <div className="flex flex-wrap items-center gap-3 text-sm">
                {currentSuggestion.location && (
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <IconMapPin size={16} className="mr-1 text-gray-500" />
                    {currentSuggestion.location}
                  </div>
                )}
                
                {currentSuggestion.teamSize && (
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <IconUsers size={16} className="mr-1 text-gray-500" />
                    {currentSuggestion.teamSize} team members
                  </div>
                )}
                
                {currentSuggestion.fundingNeeded && (
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <IconCurrencyDollar size={16} className="mr-1 text-gray-500" />
                    Seeking {formatCurrency(currentSuggestion.fundingNeeded)}
                  </div>
                )}
              </div>
              
              <div>
                <div className="font-medium mb-2">Key Highlights</div>
                <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                  {currentSuggestion.highlights.map((highlight: string, index: number) => (
                    <li key={index}>{highlight}</li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-blue-50 dark:bg-gray-800 p-3 rounded-md border-l-4 border-blue-500 mt-4">
                <div className="font-medium text-blue-800 dark:text-blue-300 mb-1">Why We Think It's a Match</div>
                <p className="text-blue-700 dark:text-blue-400 text-sm">
                  {currentSuggestion.matchReason}
                </p>
              </div>
            </div>
          </div>
          
          {/* Action buttons */} 
          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <div className="flex space-x-2">
              <Button 
                size="xs" 
                color={favorited[currentSuggestion.id] ? "failure" : "light"}
                onClick={() => toggleFavorite(currentSuggestion.id)}
              >
                {favorited[currentSuggestion.id] ? (
                  <><IconHeartFilled size={14} className="mr-1" /> Saved</>
                ) : (
                  <><IconHeartFilled size={14} className="mr-1" /> Save</>
                )}
              </Button>
              <Button size="xs" color="light" onClick={() => handleContact(currentSuggestion.id, currentSuggestion.startupName)}>
                <IconMessageCircle size={14} className="mr-1" /> Contact
              </Button>
              <Button size="xs" color="light" onClick={() => handleShare(currentSuggestion.id, currentSuggestion.startupName)}>
                <IconShare3 size={14} className="mr-1" /> Share
              </Button>
            </div>
            <div className="flex space-x-2">
              <Button 
                size="xs" 
                color="light" 
                disabled={!hasPrev}
                onClick={goToPrev}
              >
                <IconChevronLeft size={14} />
              </Button>
              <Button 
                size="xs" 
                color="success"
                onClick={goToNext}
                disabled={!hasNext}
              >
                {hasNext ? 'Next Suggestion' : 'Last Suggestion'}
                <IconChevronRight size={14} className="ml-1" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Page indicator */} 
        <div className="flex justify-center">
          {filteredSuggestions.map((_: StartupSuggestion, index: number) => (
            <button
              key={index}
              className={`w-2 h-2 mx-1 rounded-full ${
                index === currentIndex 
                  ? 'bg-blue-600' 
                  : 'bg-gray-300 dark:bg-gray-700'
              }`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to suggestion ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </Card>
  );
};

export default AISuggestionsSection;