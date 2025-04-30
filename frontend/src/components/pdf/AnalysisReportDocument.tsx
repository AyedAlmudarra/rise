import React from 'react';
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';
import { StartupProfile, AIAnalysisData } from '../../types/database';

// // Register Roboto font for better web compatibility - COMMENTED OUT FOR VERCEL TEST
// Font.register({
//   family: 'Roboto',
//   fonts: [
//     { src: 'https://cdn.jsdelivr.net/npm/@fontsource/roboto@4.5.8/files/roboto-latin-400-normal.woff' }, // Regular
//     { src: 'https://cdn.jsdelivr.net/npm/@fontsource/roboto@4.5.8/files/roboto-latin-700-normal.woff', fontWeight: 'bold' }, // Bold
//     { src: 'https://cdn.jsdelivr.net/npm/@fontsource/roboto@4.5.8/files/roboto-latin-400-italic.woff', fontStyle: 'italic' }, // Italic
//     { src: 'https://cdn.jsdelivr.net/npm/@fontsource/roboto@4.5.8/files/roboto-latin-700-italic.woff', fontWeight: 'bold', fontStyle: 'italic' }, // Bold Italic
//   ]
// });

// Define Color Palette - Copied from the last full version provided
const colors = {
    primary: '#1a56db',         // Stronger blue for main elements
    primaryLight: '#ebf4ff',    // Light blue background
    secondary: '#4b5563',       // Dark gray for secondary text
    text: '#111827',            // Nearly black for primary text
    textLight: '#4b5563',       // Medium gray for less important text
    border: '#e5e7eb',          // Light gray border
    borderDark: '#d1d5db',      // Darker border for emphasis
    background: '#ffffff',      // White background
    section: '#f9fafb',         // Very light gray for section backgrounds
    success: '#059669',         // Green
    successLight: '#d1fae5',    // Light green background
    warning: '#d97706',         // Amber
    warningLight: '#fef3c7',    // Light amber background
    danger: '#dc2626',          // Red
    dangerLight: '#fee2e2',     // Light red background
    info: '#2563eb',            // Blue
    infoLight: '#dbeafe',       // Light blue background
};

// Define styles using StyleSheet - Copied from the last full version provided
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: colors.background,
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 40,
    // fontFamily: 'Roboto', // COMMENTED OUT FOR VERCEL TEST
    fontSize: 10,
    lineHeight: 1.8,
    color: colors.text,
    letterSpacing: 0.3,
    wordSpacing: 1.2,
  },
  header: {
    fontSize: 20,
    marginBottom: 25,
    textAlign: 'center',
    color: colors.primary,
    fontWeight: 'bold',
    // fontFamily: 'Roboto', // COMMENTED OUT FOR VERCEL TEST (If present elsewhere, remove too)
    letterSpacing: 0.5,
  },
  section: {
    marginBottom: 25,
    padding: 18,
    backgroundColor: colors.section,
    borderRadius: 8,
    borderLeft: `4pt solid ${colors.primary}`,
    boxShadow: '0 1pt 2pt rgba(0, 0, 0, 0.1)',
  },
  sectionTitle: {
    fontSize: 14,
    marginBottom: 15,
    fontWeight: 'bold',
    // fontFamily: 'Roboto', // COMMENTED OUT FOR VERCEL TEST (If present elsewhere, remove too)
    color: colors.primary,
    borderBottom: `1pt solid ${colors.borderDark}`,
    paddingBottom: 8,
    letterSpacing: 0.5,
  },
  subheading: {
      fontSize: 11,
      fontWeight: 'bold',
      // fontFamily: 'Roboto', // COMMENTED OUT FOR VERCEL TEST (If present elsewhere, remove too)
      marginBottom: 8,
      marginTop: 4,
      color: colors.secondary,
      letterSpacing: 0.3,
  },
  paragraph: {
    marginBottom: 8,
    lineHeight: 1.8,
    color: colors.textLight,
    letterSpacing: 0.2,
    wordSpacing: 1.5,
    fontSize: 10,
  },
  listItem: {
    marginLeft: 15,
    marginBottom: 6,
    lineHeight: 1.7,
    color: colors.textLight,
    letterSpacing: 0.2,
    fontSize: 10,
  },
  bold: {
      fontWeight: 'bold',
      // fontFamily: 'Roboto', // COMMENTED OUT FOR VERCEL TEST (If present elsewhere, remove too)
      color: colors.text,
      letterSpacing: 0.3,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 9,
    color: colors.secondary,
    paddingTop: 10,
    paddingHorizontal: 35,
    borderTop: `1pt solid ${colors.border}`,
  },
  indentedParagraph: {
    marginLeft: 12,
    marginBottom: 6,
    lineHeight: 1.7,
    color: colors.textLight,
    letterSpacing: 0.2,
    fontSize: 10,
  },
  nestedListContainer: {
    marginLeft: 12,
    marginBottom: 8,
  },
  subSectionTitle: {
      fontSize: 10,
      fontWeight: 'bold',
      // fontFamily: 'Roboto', // COMMENTED OUT FOR VERCEL TEST (If present elsewhere, remove too)
      marginBottom: 4,
      marginTop: 6,
      color: colors.secondary,
      letterSpacing: 0.3,
  },
  listItemBullet: {
  },
  keyValuePair: {
      marginBottom: 8,
      lineHeight: 1.7,
      letterSpacing: 0.2,
      fontSize: 10,
  },
  growthPhase: {
    marginBottom: 15,
    paddingLeft: 12,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    borderLeftStyle: 'solid',
    paddingBottom: 6,
    paddingTop: 2,
  },
  growthPhasePeriod: {
    fontSize: 10,
    // fontFamily: 'Roboto', // COMMENTED OUT FOR VERCEL TEST (If present elsewhere, remove too)
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 3,
    letterSpacing: 0.3,
  },
  growthPhaseFocus: {
    fontSize: 12,
    // fontFamily: 'Roboto', // COMMENTED OUT FOR VERCEL TEST (If present elsewhere, remove too)
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  phaseDescription: {
    fontSize: 10,
    color: colors.textLight,
    lineHeight: 1.7,
    letterSpacing: 0.2,
    wordSpacing: 1.2,
  },
  financialDivider: {
    borderBottom: `1pt dashed ${colors.border}`,
    marginVertical: 14,
  },
  scenarioItem: {
      marginBottom: 10,
      marginLeft: 8,
  },
  numberedListItem: {
    marginBottom: 6,
    lineHeight: 1.7,
    color: colors.textLight,
    letterSpacing: 0.2,
    fontSize: 10,
  },
  documentHeader: {
    flexDirection: 'row',
    marginBottom: 25,
    paddingBottom: 14,
    borderBottom: `2pt solid ${colors.primary}`,
  },
  logoPlaceholder: {
    width: 55,
    height: 55,
    backgroundColor: colors.primaryLight,
    borderRadius: 8,
    marginRight: 16,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    border: `1pt solid ${colors.primary}`,
  },
  logoText: {
    // fontFamily: 'Roboto', // COMMENTED OUT FOR VERCEL TEST (If present elsewhere, remove too)
    fontWeight: 'bold',
    fontSize: 18,
    color: colors.primary,
    letterSpacing: 0.8,
  },
  headerInfo: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 4,
  },
  headerTitle: {
    fontSize: 20,
    // fontFamily: 'Roboto', // COMMENTED OUT FOR VERCEL TEST (If present elsewhere, remove too)
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 3,
    letterSpacing: 0.7,
  },
  headerSubtitle: {
    fontSize: 11,
    marginTop: 4,
    color: colors.secondary,
    letterSpacing: 0.3,
  },
  headerDate: {
    fontSize: 9,
    marginTop: 6,
    color: colors.secondary,
    letterSpacing: 0.2,
  },
  overviewGrid: {
    marginBottom: 14,
    marginTop: 6,
  },
  overviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    paddingBottom: 4,
  },
  overviewLabelColumn: {
    width: '40%',
    paddingRight: 5,
  },
  overviewValueColumn: {
    width: '55%',
    textAlign: 'right',
  },
  overviewLabel: {
    // fontFamily: 'Roboto', // COMMENTED OUT FOR VERCEL TEST (If present elsewhere, remove too)
    fontWeight: 'bold',
    fontSize: 9,
    color: colors.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  overviewValue: {
    fontSize: 11,
    color: colors.text,
    letterSpacing: 0.2,
    flexShrink: 1,
  },
  overviewDescription: {
    marginTop: 15,
    paddingTop: 10,
    borderTop: `1pt dashed ${colors.border}`,
  },
  overviewDescriptionLabel: {
    // fontFamily: 'Roboto', // COMMENTED OUT FOR VERCEL TEST (If present elsewhere, remove too)
    fontWeight: 'bold',
    fontSize: 9,
    color: colors.secondary,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  overviewDescriptionText: {
    fontSize: 10,
    color: colors.textLight,
    lineHeight: 1.7,
    letterSpacing: 0.2,
    wordSpacing: 1.5,
    flexShrink: 1,
  },
  overviewBox: {
    backgroundColor: colors.primaryLight,
    padding: 12,
    borderRadius: 6,
    marginBottom: 15,
    marginTop: 2,
  },
  scoreContainer: {
    marginTop: 12,
    marginBottom: 12,
  },
  scoreBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    marginTop: 6,
    marginBottom: 10,
    position: 'relative',
  },
  scoreIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 8,
    borderRadius: 4,
  },
  readinessContainer: {
    marginTop: 15,
    marginBottom: 5,
    backgroundColor: colors.primaryLight,
    padding: 16,
    borderRadius: 6,
  },
  readinessScore: {
    fontSize: 28,
    fontWeight: 'bold',
    // fontFamily: 'Roboto', // COMMENTED OUT FOR VERCEL TEST (If present elsewhere, remove too)
    textAlign: 'center',
    marginBottom: 6,
    color: colors.primary,
    letterSpacing: 0.8,
  },
  readinessLabel: {
    fontSize: 10,
    textAlign: 'center',
    color: colors.secondary,
    marginBottom: 14,
    letterSpacing: 0.5,
  },
  swotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    marginHorizontal: -6,
  },
  swotCell: {
    width: '50%',
    padding: 6,
    boxSizing: 'border-box',
    marginBottom: 12,
  },
  swotInnerCell: {
    padding: 10,
    borderRadius: 6,
    height: 'auto',
    minHeight: 80,
  },
  swotTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    // fontFamily: 'Roboto', // COMMENTED OUT FOR VERCEL TEST (If present elsewhere, remove too)
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  swotList: {
    marginTop: 6,
  },
  swotListItem: {
    fontSize: 10,
    marginBottom: 4,
    lineHeight: 1.5,
    letterSpacing: 0.2,
    wordSpacing: 1,
    flexShrink: 1,
  },
  progressStepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    marginTop: 8,
  },
  progressStep: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  progressStepCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    border: `1pt solid ${colors.primary}`,
  },
  progressStepNumber: {
    fontSize: 10,
    color: colors.primary,
    // fontFamily: 'Roboto', // COMMENTED OUT FOR VERCEL TEST (If present elsewhere, remove too)
    fontWeight: 'bold',
    letterSpacing: 0.3,
  },
  progressStepLabel: {
    fontSize: 9,
    textAlign: 'center',
    color: colors.secondary,
    maxWidth: 75,
    letterSpacing: 0.2,
    lineHeight: 1.5,
  },
  progressLine: {
    position: 'absolute',
    height: 1,
    top: 13,
    left: '50%',
    right: '50%',
    backgroundColor: colors.primary,
  },
  executiveSummaryBox: {
    backgroundColor: colors.primaryLight,
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 12,
    borderLeft: `3pt solid ${colors.primary}`,
  },
  executiveSummaryText: {
    fontSize: 11,
    lineHeight: 1.8,
    color: colors.text,
    fontStyle: 'italic',
    letterSpacing: 0.3,
    wordSpacing: 1.5,
    flexShrink: 1,
  },
  financialHighlight: {
    backgroundColor: colors.primaryLight,
    padding: 12,
    borderRadius: 6,
    marginVertical: 12,
    flexDirection: 'row',
  },
  financialIcon: {
    width: 34,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  financialInfo: {
    flex: 1,
  },
  financialValue: {
    fontSize: 16,
    // fontFamily: 'Roboto', // COMMENTED OUT FOR VERCEL TEST (If present elsewhere, remove too)
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 5,
    letterSpacing: 0.4,
  },
  financialLabel: {
    fontSize: 9,
    color: colors.secondary,
    letterSpacing: 0.3,
  },
});

interface AnalysisReportDocumentProps {
  startupData: StartupProfile | null;
  analysisData: AIAnalysisData | null;
}

// Helper to safely render list items
const renderListItems = (items: string[] | undefined | null, itemStyle?: object) => {
    const baseStyle = styles.listItem;
    const combinedStyle = itemStyle ? { ...baseStyle, ...itemStyle } : baseStyle;
    if (!items || items.length === 0) {
        return <Text style={combinedStyle}>• N/A</Text>;
    }
    return items.map((item: string, index: number) => (
        <Text key={`li-${index}`} style={combinedStyle}>• {item}</Text>
    ));
};

// Format date function
const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  });
};

const AnalysisReportDocument: React.FC<AnalysisReportDocumentProps> = ({ startupData, analysisData }) => {
  // Remove debugging logs
  // console.log("--- Rendering FULL AnalysisReportDocument ---");
  // console.log("Startup Data available:", !!startupData);
  // console.log("Analysis Data available:", !!analysisData);
  // console.log("Font registration status:", Font.getRegisteredFontFamilies());
  
  // Keep data validation
  const validatedAnalysisData = React.useMemo(() => {
    if (!analysisData) return null;
    const validateData = (obj: any): any => {
      if (obj === undefined) return null;
      if (obj === null) return null;
      if (typeof obj !== 'object') return obj;
      if (Array.isArray(obj)) {
        return obj.map(item => validateData(item));
      }
      const result: any = {};
      Object.keys(obj).forEach(key => {
        result[key] = validateData(obj[key]);
      });
      return result;
    };
    try {
      return validateData(analysisData);
    } catch (error) {
      console.error("Error validating analysis data:", error);
      return null;
    }
  }, [analysisData]);
  
  const reportDate = new Date();
  
  // Keep error boundary
  try {
    return (
      <Document title={`AI Analysis Report - ${startupData?.name || 'Startup'}`}>
        <Page size="A4" style={styles.page}>
          {/* Document Header with Logo */}
          <View style={styles.documentHeader}>
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoText}>RISE</Text>
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.headerTitle}>{startupData?.name || 'Startup'} Analysis</Text>
              <Text style={styles.headerSubtitle}>AI-Generated Insights & Recommendations</Text>
              <Text style={styles.headerDate}>Report generated on {formatDate(reportDate)}</Text>
            </View>
          </View>

          {/* Progress Steps Indicator */}
          <View style={styles.progressStepsContainer}>
             <View style={styles.progressStep}>
               <View style={styles.progressStepCircle}>
                 <Text style={styles.progressStepNumber}>1</Text>
               </View>
               <Text style={styles.progressStepLabel}>Overview &amp; SWOT</Text>
               <View style={[styles.progressLine, { right: 0 }]} />
             </View>
             <View style={styles.progressStep}>
               <View style={styles.progressStepCircle}>
                 <Text style={styles.progressStepNumber}>2</Text>
               </View>
               <Text style={styles.progressStepLabel}>Funding Readiness</Text>
               <View style={[styles.progressLine, { left: 0, right: 0 }]} />
             </View>
             <View style={styles.progressStep}>
               <View style={styles.progressStepCircle}>
                 <Text style={styles.progressStepNumber}>3</Text>
               </View>
               <Text style={styles.progressStepLabel}>Financial Performance</Text>
               <View style={[styles.progressLine, { left: 0, right: 0 }]} />
             </View>
             <View style={styles.progressStep}>
               <View style={styles.progressStepCircle}>
                 <Text style={styles.progressStepNumber}>4</Text>
               </View>
               <Text style={styles.progressStepLabel}>Growth &amp; Projections</Text>
               <View style={[styles.progressLine, { left: 0 }]} />
             </View>
           </View>

          {/* Basic Startup Info */}
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>Startup Overview</Text>
            <View style={styles.overviewBox}>
              <Text style={{...styles.overviewValue, fontSize: 13, color: colors.primary}}>{startupData?.name || 'N/A'}</Text>
              <Text style={{fontSize: 10, marginTop: 2, color: colors.secondary}}>
                {[startupData?.industry, startupData?.location_city, startupData?.operational_stage].filter(Boolean).join(' • ')}
              </Text>
            </View>
            <View style={styles.overviewGrid}>
              <View style={styles.overviewRow}>
                <View style={styles.overviewLabelColumn}>
                  <Text style={styles.overviewLabel}>Operational Stage</Text>
                </View>
                <View style={styles.overviewValueColumn}>
                  <Text style={styles.overviewValue}>{startupData?.operational_stage || 'N/A'}</Text>
                </View>
              </View>
              <View style={styles.overviewRow}>
                <View style={styles.overviewLabelColumn}>
                   <Text style={styles.overviewLabel}>Employees</Text>
                </View>
                <View style={styles.overviewValueColumn}>
                   <Text style={styles.overviewValue}>
                     {startupData?.num_employees !== undefined && startupData?.num_employees !== null 
                       ? startupData.num_employees 
                       : 'N/A'}
                   </Text>
                </View>
              </View>
              <View style={styles.overviewRow}>
                <View style={styles.overviewLabelColumn}>
                  <Text style={styles.overviewLabel}>Annual Revenue</Text>
                </View>
                <View style={styles.overviewValueColumn}>
                  <Text style={styles.overviewValue}>
                    {startupData?.annual_revenue !== undefined && startupData?.annual_revenue !== null 
                      ? `SAR ${startupData.annual_revenue}`
                      : 'N/A'}
                  </Text>
                </View>
              </View>
              <View style={styles.overviewRow}>
                 <View style={styles.overviewLabelColumn}>
                    <Text style={styles.overviewLabel}>Annual Expenses</Text>
                 </View>
                 <View style={styles.overviewValueColumn}>
                    <Text style={styles.overviewValue}>
                       {startupData?.annual_expenses !== undefined && startupData?.annual_expenses !== null 
                         ? `SAR ${startupData.annual_expenses}`
                         : 'N/A'}
                     </Text>
                 </View>
              </View>
            </View>
            {startupData?.description && (
              <View style={styles.overviewDescription}>
                <Text style={styles.overviewDescriptionLabel}>Description</Text>
                <Text style={styles.overviewDescriptionText}>{startupData.description}</Text>
              </View>
            )}
          </View>

          {/* Check if Analysis Data Exists */}
          {!validatedAnalysisData ? (
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>AI Analysis</Text>
                <Text style={styles.paragraph}>AI analysis data is not available for this report.</Text>
            </View>
          ) : (
            <> 
              {/* Executive Summary */}
              {validatedAnalysisData.executive_summary && (
                <View style={styles.section} wrap={false}>
                    <Text style={styles.sectionTitle}>Executive Summary</Text>
                    <View style={styles.executiveSummaryBox}>
                      <Text style={styles.executiveSummaryText}>{validatedAnalysisData.executive_summary}</Text>
                    </View>
                    {validatedAnalysisData.summary_points && validatedAnalysisData.summary_points.length > 0 && (
                      <View style={{ marginTop: 10 }}>
                        <Text style={styles.subheading}>Key Takeaways:</Text>
                        {validatedAnalysisData.summary_points.map((point: string, index: number) => (
                          <Text key={`summary-${index}`} style={styles.listItem}>• {point}</Text>
                        ))}
                      </View>
                    )}
                </View>
              )}

              {/* SWOT Analysis */}
              {validatedAnalysisData.swot_analysis && (
                <View style={styles.section} wrap={false}>
                    <Text style={styles.sectionTitle}>SWOT Analysis</Text>
                    <View style={styles.swotGrid}>
                      <View style={styles.swotCell}>
                        <View style={{...styles.swotInnerCell, backgroundColor: `${colors.success}15`}}>
                          <Text style={{...styles.swotTitle, color: colors.success}}>STRENGTHS</Text>
                          <View style={styles.swotList}>
                            {renderListItems(validatedAnalysisData.swot_analysis.strengths, styles.swotListItem)}
                          </View>
                        </View>
                      </View>
                      <View style={styles.swotCell}>
                        <View style={{...styles.swotInnerCell, backgroundColor: `${colors.danger}15`}}>
                          <Text style={{...styles.swotTitle, color: colors.danger}}>WEAKNESSES</Text>
                          <View style={styles.swotList}>
                             {renderListItems(validatedAnalysisData.swot_analysis.weaknesses, styles.swotListItem)}
                          </View>
                        </View>
                      </View>
                      <View style={styles.swotCell}>
                        <View style={{...styles.swotInnerCell, backgroundColor: `${colors.info}15`}}>
                          <Text style={{...styles.swotTitle, color: colors.info}}>OPPORTUNITIES</Text>
                          <View style={styles.swotList}>
                             {renderListItems(validatedAnalysisData.swot_analysis.opportunities, styles.swotListItem)}
                          </View>
                        </View>
                      </View>
                      <View style={styles.swotCell}>
                        <View style={{...styles.swotInnerCell, backgroundColor: `${colors.warning}15`}}>
                          <Text style={{...styles.swotTitle, color: colors.warning}}>THREATS</Text>
                          <View style={styles.swotList}>
                             {renderListItems(validatedAnalysisData.swot_analysis.threats, styles.swotListItem)}
                          </View>
                        </View>
                      </View>
                    </View>
                </View>
              )}

              {/* Funding Readiness Score */}
              <View style={styles.section} wrap={false}>
                  <Text style={styles.sectionTitle}>Funding Readiness Score</Text>
                  <View style={styles.readinessContainer}>
                    <Text style={styles.readinessScore}>
                      {validatedAnalysisData.funding_readiness_score ?? 'N/A'}<Text style={{fontSize: 14}}>/100</Text>
                    </Text>
                    <Text style={styles.readinessLabel}>FUNDING READINESS</Text>
                    <View style={styles.scoreBar}>
                      <View 
                        style={{
                          ...styles.scoreIndicator,
                          width: `${validatedAnalysisData.funding_readiness_score || 0}%`,
                          backgroundColor: 
                            (validatedAnalysisData.funding_readiness_score || 0) >= 70 ? colors.success :
                            (validatedAnalysisData.funding_readiness_score || 0) >= 40 ? colors.warning :
                            colors.danger
                        }}
                      />
                    </View>
                  </View>
                  <Text style={styles.keyValuePair}>
                      <Text style={styles.bold}>Justification:</Text> {validatedAnalysisData.funding_readiness_justification || 'N/A'}
                  </Text>
              </View>
              
              {/* Suggested KPIs */}
              {validatedAnalysisData.suggested_kpis && Array.isArray(validatedAnalysisData.suggested_kpis) && (
                <View style={styles.section} wrap={false}>
                    <Text style={styles.sectionTitle}>Suggested KPIs</Text>
                    {validatedAnalysisData.suggested_kpis.length > 0 ? (
                        validatedAnalysisData.suggested_kpis.map((kpi: { kpi: string | null, justification: string | null }, index: number) => (
                          <View key={`kpi-${index}`} style={{ marginBottom: 8 }}>
                            <Text style={styles.subheading}>{`• ${kpi.kpi || 'N/A'}`}</Text>
                            <Text style={styles.indentedParagraph}>
                               {kpi.justification || 'No justification provided.'}
                            </Text>
                          </View>
                        ))
                    ) : (
                        <Text style={styles.paragraph}>No specific KPIs were suggested in this analysis.</Text>
                    )}
                </View>
              )}
              
              {/* Financial Performance */}
              {(validatedAnalysisData.financial_assessment || validatedAnalysisData.cash_burn_rate || validatedAnalysisData.profitability_projection) && (
                <View style={styles.section} wrap={false}>
                    <Text style={styles.sectionTitle}>Financial Performance</Text>
                    {validatedAnalysisData.financial_assessment && (
                        <View style={{ marginBottom: 10 }}>
                            <Text style={styles.subheading}>AI Financial Assessment</Text>
                            {validatedAnalysisData.financial_assessment.strengths?.length > 0 && (
                               <View style={styles.nestedListContainer}>
                                 <Text style={styles.subSectionTitle}>Strengths:</Text>
                                 {renderListItems(validatedAnalysisData.financial_assessment.strengths, styles.swotListItem)}
                                </View>
                            )}
                            {validatedAnalysisData.financial_assessment.weaknesses?.length > 0 && (
                                <View style={styles.nestedListContainer}>
                                 <Text style={styles.subSectionTitle}>Weaknesses:</Text>
                                 {renderListItems(validatedAnalysisData.financial_assessment.weaknesses, styles.swotListItem)}
                                </View>
                            )}
                             {validatedAnalysisData.financial_assessment.recommendations?.length > 0 && (
                                <View style={styles.nestedListContainer}>
                                 <Text style={styles.subSectionTitle}>Recommendations:</Text>
                                 {renderListItems(validatedAnalysisData.financial_assessment.recommendations, styles.swotListItem)}
                                </View>
                            )}
                        </View>
                    )}
                    {validatedAnalysisData.cash_burn_rate && (
                      <View style={{ marginVertical: 12 }}>
                        <Text style={{...styles.subheading, textAlign: 'center', marginBottom: 12}}>Cash Runway Analysis</Text>
                        <View style={{flexDirection: 'row'}}>
                          <View style={{flex: 1}}>
                            <View style={styles.financialHighlight}>
                              <View style={styles.financialIcon}>
                                <Text style={{fontSize: 18, color: colors.warning}}>SAR</Text>
                              </View>
                              <View style={styles.financialInfo}>
                                <Text style={styles.financialValue}>
                                  SAR {validatedAnalysisData.cash_burn_rate.monthly_rate?.toLocaleString() || 'N/A'}
                                </Text>
                                <Text style={styles.financialLabel}>MONTHLY BURN RATE</Text>
                              </View>
                            </View>
                          </View>
                          <View style={{width: 15}} />
                          <View style={{flex: 1}}>
                            <View style={styles.financialHighlight}>
                              <View style={styles.financialIcon}>
                                <Text style={{fontSize: 18, color: colors.primary}}>→</Text>
                              </View>
                              <View style={styles.financialInfo}>
                                <Text style={styles.financialValue}>
                                  {validatedAnalysisData.cash_burn_rate.runway_months || 'N/A'} months
                                </Text>
                                <Text style={styles.financialLabel}>ESTIMATED RUNWAY</Text>
                              </View>
                            </View>
                          </View>
                        </View>
                        <View style={{marginTop: 8, padding: 8, backgroundColor: colors.section, borderRadius: 4}}>
                          <Text style={{...styles.paragraph, marginBottom: 0}}>
                            <Text style={styles.bold}>Assessment: </Text>
                            {validatedAnalysisData.cash_burn_rate.assessment || 'N/A'}
                          </Text>
                        </View>
                      </View>
                    )}
                    {validatedAnalysisData.profitability_projection && (
                         <View style={{ marginTop: (validatedAnalysisData.financial_assessment || validatedAnalysisData.cash_burn_rate) ? 10 : 0 }}>
                            <Text style={styles.subheading}>Profitability Outlook</Text>
                             <Text style={styles.keyValuePair}>
                               <Text style={styles.bold}>Estimated Timeline:</Text> 
                               {validatedAnalysisData.profitability_projection.estimated_timeframe || 'Not determined'}
                            </Text>
                            {validatedAnalysisData.profitability_projection.key_factors?.length > 0 && (
                                 <View style={styles.nestedListContainer}>
                                    <Text style={styles.subSectionTitle}>Key Factors:</Text>
                                    {renderListItems(validatedAnalysisData.profitability_projection.key_factors, styles.swotListItem)}
                                 </View>
                            )}
                         </View>
                    )}
                    {!validatedAnalysisData.financial_assessment && !validatedAnalysisData.cash_burn_rate && !validatedAnalysisData.profitability_projection && (
                       <Text style={styles.paragraph}>No specific financial performance data was generated in this analysis.</Text>
                    )}
                </View>
               )}
              
              {/* Growth Plan */}
              {validatedAnalysisData.growth_plan_phases && Array.isArray(validatedAnalysisData.growth_plan_phases) && (
                <View style={styles.section} wrap={false}>
                    <Text style={styles.sectionTitle}>Growth Plan</Text>
                    {validatedAnalysisData.growth_plan_phases.length > 0 ? (
                        validatedAnalysisData.growth_plan_phases.map((phase: { period: string | null, focus: string | null, description: string | null }, index: number) => (
                          <View key={`gp-${index}`} style={{...styles.growthPhase, borderLeftColor: 
                            index === 0 ? colors.success : 
                            index === 1 ? colors.info : 
                            index === 2 ? colors.warning : 
                            colors.primary
                          }}>
                            <Text style={styles.growthPhasePeriod}>{phase.period || `Phase ${index + 1}`}</Text>
                            <Text style={styles.growthPhaseFocus}>{phase.focus || 'N/A'}</Text>
                            <Text style={styles.phaseDescription}>{phase.description || 'No details provided.'}</Text>
                          </View>
                        ))
                    ) : (
                        <Text style={styles.paragraph}>No specific growth plan phases were generated in this analysis.</Text>
                    )}
                </View>
              )}

              {/* Projections & Risks */}
              {(validatedAnalysisData.key_risks || validatedAnalysisData.what_if_scenarios || validatedAnalysisData.funding_outlook) && (
                <View style={styles.section} wrap={false}>
                    <Text style={styles.sectionTitle}>Projections & Risks</Text>
                    {validatedAnalysisData.funding_outlook && (
                        <View style={{ marginBottom: 10 }}>
                            <Text style={styles.subheading}>Funding Outlook</Text>
                            <Text style={styles.paragraph}>{validatedAnalysisData.funding_outlook}</Text>
                         </View>
                     )}
                     {validatedAnalysisData.what_if_scenarios && Array.isArray(validatedAnalysisData.what_if_scenarios) && validatedAnalysisData.what_if_scenarios.length > 0 && (
                        <View style={{ marginBottom: 10, marginTop: validatedAnalysisData.funding_outlook ? 10 : 0 }}>
                            <Text style={styles.subheading}>Potential Scenarios</Text>
                            {validatedAnalysisData.what_if_scenarios.map((scenario: { scenario: string | null, outcome: string | null }, index: number) => (
                                <View key={`scenario-${index}`} style={styles.scenarioItem}>
                                    <Text style={styles.paragraph}>
                                        <Text style={styles.bold}>• Scenario:</Text> {scenario.scenario || 'N/A'}
                                    </Text>
                                    <Text style={styles.indentedParagraph}>
                                        <Text style={styles.bold}>Outcome:</Text> {scenario.outcome || 'N/A'}
                                    </Text>
                                </View>
                            ))}
                         </View>
                     )}
                     {validatedAnalysisData.key_risks && Array.isArray(validatedAnalysisData.key_risks) && validatedAnalysisData.key_risks.length > 0 && (
                        <View style={{ marginTop: (validatedAnalysisData.funding_outlook || (validatedAnalysisData.what_if_scenarios && validatedAnalysisData.what_if_scenarios.length > 0)) ? 10 : 0 }}>
                            <Text style={styles.subheading}>Key Risks</Text>
                            {renderListItems(validatedAnalysisData.key_risks, styles.swotListItem)}
                         </View>
                     )}
                     {!validatedAnalysisData.key_risks && !validatedAnalysisData.what_if_scenarios && !validatedAnalysisData.funding_outlook && (
                         <Text style={styles.paragraph}>No specific projection or risk data was generated in this analysis.</Text>
                     )}
                </View>
              )}

              {/* Market Positioning */}
              {validatedAnalysisData.market_positioning && (
                <View style={styles.section} wrap={false}>
                    <Text style={styles.sectionTitle}>Market Positioning</Text>
                    <Text style={styles.paragraph}>{validatedAnalysisData.market_positioning}</Text>
                </View>
              )}
              
              {/* Scalability Assessment */}
              {validatedAnalysisData.scalability_assessment && (
                <View style={styles.section} wrap={false}>
                    <Text style={styles.sectionTitle}>Scalability Assessment</Text>
                    <Text style={styles.paragraph}>
                        <Text style={styles.bold}>Level:</Text> {validatedAnalysisData.scalability_assessment.level || 'N/A'}
                    </Text>
                    <Text style={styles.paragraph}>
                        <Text style={styles.bold}>Justification:</Text> {validatedAnalysisData.scalability_assessment.justification || 'N/A'}
                    </Text>
                </View>
              )}

              {/* Competitive Advantage */}
              {validatedAnalysisData.competitive_advantage_evaluation && (
                <View style={styles.section} wrap={false}>
                    <Text style={styles.sectionTitle}>Competitive Advantage</Text>
                     <Text style={styles.subheading}>Assessment:</Text>
                     <Text style={styles.paragraph}>{validatedAnalysisData.competitive_advantage_evaluation.assessment || 'N/A'}</Text>
                     <Text style={{...styles.subheading, marginTop: 5}}>Suggestion:</Text>
                     <Text style={styles.paragraph}>{validatedAnalysisData.competitive_advantage_evaluation.suggestion || 'N/A'}</Text>
                </View>
              )}
              
              {/* Current Challenges */}
              {validatedAnalysisData.current_challenges && Array.isArray(validatedAnalysisData.current_challenges) && validatedAnalysisData.current_challenges.length > 0 && (
                 <View style={styles.section} wrap={false}>
                    <Text style={styles.sectionTitle}>Current Challenges</Text>
                    {renderListItems(validatedAnalysisData.current_challenges, styles.swotListItem)}
                </View>
              )}
              
               {/* Strategic Recommendations */}
              {validatedAnalysisData.strategic_recommendations && Array.isArray(validatedAnalysisData.strategic_recommendations) && validatedAnalysisData.strategic_recommendations.length > 0 && (
                 <View style={styles.section} wrap={false}>
                    <Text style={styles.sectionTitle}>Strategic Recommendations (Next 6 Months)</Text>
                     {validatedAnalysisData.strategic_recommendations.map((item: string, index: number) => (
                        <Text key={`sr-${index}`} style={{...styles.listItem, marginLeft: 0 }}>{index + 1}. {item}</Text>
                    ))}
                </View>
              )}

              {/* END OF AI SECTIONS */}
            </>
          )}

          {/* Page Number Footer */}
          <Text style={styles.footer} fixed render={({ pageNumber, totalPages }) => (
            `Page ${pageNumber} of ${totalPages}`
          )} />
        </Page>
      </Document>
    );
  } catch (error) {
    console.error("Error rendering FULL PDF document:", error);
    // Return a simplified error document if the full one fails
    return (
      <Document>
        <Page size="A4" style={{padding: 30, fontFamily: 'Roboto'}}>
          <View>
            <Text style={{fontSize: 14, marginBottom: 10}}>Error Generating Full PDF Report</Text>
            <Text style={{fontSize: 10}}>
              There was an error generating the complete PDF report. 
              Details: {error instanceof Error ? error.message : String(error)}
            </Text>
          </View>
        </Page>
      </Document>
    );
  }
};

export default AnalysisReportDocument; 