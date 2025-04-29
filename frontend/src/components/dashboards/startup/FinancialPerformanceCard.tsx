import React from 'react';
import { Card } from 'flowbite-react';
import { IconCurrencyDollar, IconRobot } from '@tabler/icons-react';
import { AIAnalysisData } from '../../../types/database';

interface FinancialPerformanceCardProps {
  analysisData: AIAnalysisData | null;
  isLoading: boolean;
}

const FinancialPerformanceCard: React.FC<FinancialPerformanceCardProps> = ({ 
  analysisData, 
  isLoading, 
}) => {
  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2.5"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full my-2.5"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6 my-2.5"></div>
      </Card>
    );
  }

  // Check if AI data is available
  const hasFinancialData = analysisData?.financial_assessment || 
                           analysisData?.cash_burn_rate || 
                           analysisData?.profitability_projection;

  if (!hasFinancialData) {
    return (
      <Card>
        <div className="flex items-center justify-between mb-3">
          <h5 className="text-base font-semibold text-gray-900 dark:text-white flex items-center">
            <IconCurrencyDollar className="mr-2 text-green-500" size={20} />
            Financial Performance
          </h5>
        </div>
        
        <div className="text-center py-6">
          <IconRobot size={32} className="mx-auto mb-3 text-gray-400" />
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">No AI Financial Assessment Available</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            Request an AI analysis using the main refresh button to get detailed financial insights.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <h5 className="text-base font-semibold text-gray-900 dark:text-white flex items-center">
          <IconCurrencyDollar className="mr-2 text-green-500" size={20} />
          Financial Performance
        </h5>
      </div>

      {/* AI Financial Assessment */}
      {analysisData?.financial_assessment && (
        <div className="space-y-3">
          {/* Financial Summary Card */}
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-xs font-medium text-blue-800 dark:text-blue-300 mb-1">AI Financial Assessment</p>
            <p className="text-xs text-blue-700 dark:text-blue-400">
              Based on your financial data, the AI has generated insights about your company's financial position.
            </p>
          </div>
          
          {/* Financial Strengths */}
          {Array.isArray(analysisData.financial_assessment.strengths) && analysisData.financial_assessment.strengths.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Financial Strengths</p>
              <ul className="list-disc pl-4 space-y-1">
                {analysisData.financial_assessment.strengths.map((strength, idx) => (
                  <li key={`fin-str-${idx}`} className="text-xs text-gray-600 dark:text-gray-400">
                    {strength}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Financial Weaknesses */}
          {Array.isArray(analysisData.financial_assessment.weaknesses) && analysisData.financial_assessment.weaknesses.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Financial Concerns</p>
              <ul className="list-disc pl-4 space-y-1">
                {analysisData.financial_assessment.weaknesses.map((weakness, idx) => (
                  <li key={`fin-weak-${idx}`} className="text-xs text-gray-600 dark:text-gray-400">
                    {weakness}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Financial Recommendations */}
          {Array.isArray(analysisData.financial_assessment.recommendations) && analysisData.financial_assessment.recommendations.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Recommendations</p>
              <ul className="list-disc pl-4 space-y-1">
                {analysisData.financial_assessment.recommendations.map((rec, idx) => (
                  <li key={`fin-rec-${idx}`} className="text-xs text-gray-600 dark:text-gray-400">
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Cash Burn Rate */}
      {analysisData?.cash_burn_rate && (
        <div className="space-y-2 mt-3">
          <hr className="my-4 border-gray-200 dark:border-gray-700" />
          <h6 className="font-semibold text-sm mb-2 text-gray-800 dark:text-white">Cash Runway Analysis</h6>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400">Monthly Burn Rate</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                ${analysisData.cash_burn_rate.monthly_rate?.toLocaleString() || 'N/A'}
              </p>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400">Estimated Runway</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {analysisData.cash_burn_rate.runway_months || 'N/A'} months
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
            {analysisData.cash_burn_rate.assessment || 'Assessment not available.'}
          </p>
        </div>
      )}

      {/* Profitability Projection */}
      {analysisData?.profitability_projection && (
        <div className="space-y-2 mt-3">
          <hr className="my-4 border-gray-200 dark:border-gray-700" />
          <h6 className="font-semibold text-sm mb-2 text-gray-800 dark:text-white">Profitability Outlook</h6>
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400">Estimated Timeline to Profitability</p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {analysisData.profitability_projection.estimated_timeframe || 'Not determined'}
            </p>
          </div>
          
          {Array.isArray(analysisData.profitability_projection.key_factors) && 
            analysisData.profitability_projection.key_factors.length > 0 && (
            <div className="mt-2">
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Key Factors</p>
              <ul className="list-disc pl-4 space-y-1">
                {analysisData.profitability_projection.key_factors.map((factor, idx) => (
                  <li key={`prof-factor-${idx}`} className="text-xs text-gray-600 dark:text-gray-400">
                    {factor}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default FinancialPerformanceCard; 