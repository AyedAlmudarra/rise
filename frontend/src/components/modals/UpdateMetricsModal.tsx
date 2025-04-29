import React, { useState, useEffect } from 'react';
import { Modal, Button, Label, TextInput, Alert } from 'flowbite-react';
import { IconChartBar, IconCurrencyDollar, IconUsers, IconTargetArrow, IconAlertTriangle, IconDeviceFloppy } from '@tabler/icons-react';
import { StartupProfile } from '@/types/database';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'react-hot-toast';

interface UpdateMetricsModalProps {
  isOpen: boolean;
  onClose: () => void;
  startupData: StartupProfile | null;
  onUpdateSuccess: () => void; // Callback to refresh dashboard data
}

const UpdateMetricsModal: React.FC<UpdateMetricsModalProps> = ({
  isOpen,
  onClose,
  startupData,
  onUpdateSuccess,
}) => {
  const [formData, setFormData] = useState<Partial<StartupProfile>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  // Add more specific validation errors if needed
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Pre-fill form when modal opens or startupData changes
    if (startupData && isOpen) {
      setFormData({
        annual_revenue: startupData.annual_revenue ?? undefined,
        annual_expenses: startupData.annual_expenses ?? undefined,
        num_employees: startupData.num_employees ?? undefined,
        num_customers: startupData.num_customers ?? undefined,
        kpi_cac: startupData.kpi_cac ?? undefined,
        kpi_clv: startupData.kpi_clv ?? undefined,
        kpi_retention_rate: startupData.kpi_retention_rate ?? undefined,
        kpi_conversion_rate: startupData.kpi_conversion_rate ?? undefined,
        // Add other relevant metrics here
      });
      setError(null); // Clear previous errors
      setValidationErrors({});
    } else if (!isOpen) {
       // Clear form when modal closes
       setFormData({});
       setError(null);
       setValidationErrors({});
    }
  }, [isOpen, startupData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const numericFields = [
        'annual_revenue', 'annual_expenses', 'num_employees', 'num_customers',
        'kpi_cac', 'kpi_clv', 'kpi_retention_rate', 'kpi_conversion_rate'
    ];
    
    setFormData(prev => ({
      ...prev,
      // Convert to number if it's a numeric field, otherwise keep as string
      // Handle empty string by setting to null (or keep undefined/empty based on Supabase column type)
      [name]: numericFields.includes(name) 
                ? (value === '' ? null : Number(value)) 
                : value,
    }));
    // Clear validation error for this field on change
    if (validationErrors[name]) {
        setValidationErrors(prev => { const { [name]: _, ...rest } = prev; return rest; });
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    // Basic validation example: check if numeric fields are actually numbers
    const numericFields = [
        'annual_revenue', 'annual_expenses', 'num_employees', 'num_customers',
        'kpi_cac', 'kpi_clv', 'kpi_retention_rate', 'kpi_conversion_rate'
    ];
    numericFields.forEach(field => {
        const value = formData[field as keyof StartupProfile];
        if (value !== null && value !== undefined && typeof value !== 'number') {
            errors[field] = 'Must be a valid number.';
        } else if (value !== null && value !== undefined && value < 0) {
            // Example: Prevent negative numbers where appropriate
            if (!['annual_expenses'].includes(field)) { // Allow negative expenses maybe?
                 errors[field] = 'Cannot be negative.';
            }
        }
    });

    // Add more specific validations here (e.g., required fields)

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
        setError("Please fix the errors in the form.");
        return;
    }

    if (!startupData?.id) {
      setError("Startup ID is missing. Cannot update.");
      return;
    }

    setIsLoading(true);

    // Filters out unchanged fields before sending update
    const updatedFields: Partial<StartupProfile> = {};
    Object.keys(formData).forEach(key => {
        const formKey = key as keyof StartupProfile;
        const formValue = formData[formKey];
        const originalValue = startupData[formKey];

        // Check for actual change, handling null/undefined comparisons
        if (formValue !== originalValue && !(formValue == null && originalValue == null)) {
             // @ts-ignore - Linter seems unable to correctly infer type here
             updatedFields[formKey] = formValue; 
        }
    });
    
    // Clean up any potential explicit undefined values if Supabase prefers omitting the key
    // This step is now more important due to the workaround above
    Object.keys(updatedFields).forEach(key => {
        if (updatedFields[key as keyof StartupProfile] === undefined) {
            delete updatedFields[key as keyof StartupProfile];
        }
    });

    if (Object.keys(updatedFields).length === 0) {
        toast.success("No changes detected.", { id: 'no-metrics-change' });
        setIsLoading(false);
        onClose();
        return;
    }

    try {
      const { error: updateError } = await supabase
        .from('startups')
        .update(updatedFields)
        .eq('id', startupData.id);

      if (updateError) {
        throw updateError;
      }

      toast.success('Metrics updated successfully!');
      onUpdateSuccess(); // Trigger dashboard refresh
      onClose(); // Close modal on success

    } catch (err: any) {
      console.error("Error updating metrics:", err);
      setError(`Failed to update metrics: ${err.message || 'Unknown error'}`);
      toast.error(`Update failed: ${err.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to render form fields
  const renderFormField = (name: keyof StartupProfile, label: string, type: string = 'number', icon: React.ReactNode, placeholder?: string) => (
    <div className="mb-4">
      <Label htmlFor={name} value={label} className="mb-1 block text-sm font-medium" />
      <TextInput
        id={name}
        name={name}
        type={type}
        icon={() => React.cloneElement(icon as React.ReactElement, { size: 18, className: "text-gray-500"})}
        placeholder={placeholder || `Enter ${label.toLowerCase()}`}
        value={formData[name] != null ? String(formData[name]) : ''}
        onChange={handleChange}
        color={validationErrors[name] ? 'failure' : 'gray'}
        helperText={validationErrors[name] ? (
            <span className="text-red-600 text-xs flex items-center"><IconAlertTriangle size={14} className="mr-1"/>{validationErrors[name]}</span>
        ) : null}
        min={type === 'number' ? 0 : undefined} // Basic non-negative constraint for numbers
        step={type === 'number' ? 'any' : undefined} // Allow decimals for relevant number fields
        disabled={isLoading}
        required // Add required attribute if necessary based on schema
      />
    </div>
  );

  return (
    <Modal show={isOpen} onClose={onClose} size="xl">
      <Modal.Header className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <IconChartBar size={20} className="mr-2 text-blue-600 dark:text-blue-400" />
          Update Key Metrics
        </div>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert color="failure" icon={IconAlertTriangle}>
              <span className="font-medium">Error:</span> {error}
            </Alert>
          )}
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Keep your key performance indicators up-to-date for accurate analysis and investor matching.
          </p>
          
          {/* Grid layout for form fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            {/* Column 1 */}
            <div>
              {renderFormField('annual_revenue', 'Annual Revenue', 'number', <IconCurrencyDollar />, 'e.g., 150000')}
              {renderFormField('num_employees', 'Number of Employees', 'number', <IconUsers />, 'e.g., 15')}
              {renderFormField('kpi_cac', 'Customer Acquisition Cost (CAC)', 'number', <IconTargetArrow />, 'e.g., 50')}
              {renderFormField('kpi_retention_rate', 'Retention Rate (%)', 'number', <IconUsers />, 'e.g., 85')}
            </div>
            {/* Column 2 */}
            <div>
              {renderFormField('annual_expenses', 'Annual Expenses', 'number', <IconCurrencyDollar />, 'e.g., 90000')}
              {renderFormField('num_customers', 'Number of Customers', 'number', <IconUsers />, 'e.g., 500')}
              {renderFormField('kpi_clv', 'Customer Lifetime Value (CLV)', 'number', <IconTargetArrow />, 'e.g., 1500')}
              {renderFormField('kpi_conversion_rate', 'Conversion Rate (%)', 'number', <IconUsers />, 'e.g., 5')}
            </div>
          </div>

          {/* Add Textarea for notes or other fields if needed */}
          {/* 
          <div className="col-span-2">
            <Label htmlFor="metrics_notes" value="Notes" className="mb-1 block text-sm font-medium" />
            <Textarea 
              id="metrics_notes" 
              name="metrics_notes" 
              placeholder="Add any relevant notes about these metrics..."
              rows={3}
              // value={formData.notes ?? ''} 
              // onChange={handleChange}
              disabled={isLoading}
            />
          </div> 
          */}
        </form>
      </Modal.Body>
      <Modal.Footer className="border-t border-gray-200 dark:border-gray-700">
        <Button color="gray" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          isProcessing={isLoading} 
          disabled={isLoading}
          color="primary"
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          <IconDeviceFloppy size={18} className="mr-2" />
          {isLoading ? 'Saving...' : 'Save Metrics'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateMetricsModal; 