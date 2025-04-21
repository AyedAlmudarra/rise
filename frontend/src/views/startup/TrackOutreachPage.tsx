import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Spinner,
  Alert,
  Modal,
  Label,
  TextInput,
  Select,
  Textarea
} from 'flowbite-react';
import { HiPlus } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';

// Define the structure for an outreach record (including investor details)
interface OutreachRecord {
  id: number;
  investor_id: number;
  investor_name: string; // Assuming we join/fetch this
  investor_company: string; // Assuming we join/fetch this
  status: 'Not Contacted' | 'Contacted' | 'Responded' | 'Meeting Scheduled' | 'Declined';
  last_contacted_at: string | null;
  notes: string | null;
}

// Mock Data Generation (Replace with actual fetch later)
const generateMockOutreach = (count: number): OutreachRecord[] => {
  const statuses: OutreachRecord['status'][] = ['Not Contacted', 'Contacted', 'Responded', 'Meeting Scheduled', 'Declined'];
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    investor_id: 100 + i,
    investor_name: `Investor ${String.fromCharCode(65 + i)}`,
    investor_company: `VC Firm ${String.fromCharCode(65 + i)}`,
    status: statuses[i % statuses.length],
    last_contacted_at: i % 3 !== 0 ? new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : null,
    notes: i % 2 === 0 ? `Initial contact made via email on ${new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}. Follow up scheduled.` : null,
  }));
};

const TrackOutreachPage: React.FC = () => {
  const { user } = useAuth();
  const [outreachData, setOutreachData] = useState<OutreachRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  useEffect(() => {
    const fetchOutreach = async () => {
      if (!user) {
         setError("User not authenticated.");
         setLoading(false);
         return;
      }
      setLoading(true);
      setError(null);
      try {
        // --- MOCK DATA USAGE ---
        // Replace this section with actual Supabase fetch when table exists
        // Example: const { data, error } = await supabase.from('investor_outreach').select('*, investors(company_name, name)').eq('startup_user_id', user.id);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
        const mockData = generateMockOutreach(8); // Generate 8 mock records
        setOutreachData(mockData);
        // --- END MOCK DATA USAGE ---

      } catch (err: any) {
        console.error('Error fetching outreach data:', err);
        setError(err.message || 'Failed to fetch outreach records.');
      } finally {
        setLoading(false);
      }
    };

    fetchOutreach();
  }, [user]);

  const handleAddOutreach = () => {
      console.log("Saving new outreach record...");
      setShowAddModal(false);
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Track Investor Outreach</h2>
        <Button onClick={() => setShowAddModal(true)} size="sm">
          <HiPlus className="mr-2 h-5 w-5" />
          Add Outreach
        </Button>
      </div>

      {loading && (
        <div className="text-center py-10">
          <Spinner size="xl" aria-label="Loading outreach data..." />
        </div>
      )}

      {error && (
        <Alert color="failure" onDismiss={() => setError(null)}>
          <span className="font-medium">Error!</span> {error}
        </Alert>
      )}

      {!loading && !error && (
        <Card className="overflow-x-auto">
          {outreachData.length === 0 ? (
             <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                No outreach records found. Click "Add Outreach" to get started.
             </div>
          ) : (
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>Investor</Table.HeadCell>
                <Table.HeadCell>Company</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
                <Table.HeadCell>Last Contacted</Table.HeadCell>
                <Table.HeadCell>Notes</Table.HeadCell>
                <Table.HeadCell>
                  <span className="sr-only">Edit</span>
                </Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {outreachData.map((record) => (
                  <Table.Row key={record.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {record.investor_name}
                    </Table.Cell>
                    <Table.Cell>{record.investor_company}</Table.Cell>
                    <Table.Cell>{record.status}</Table.Cell>
                    <Table.Cell>{record.last_contacted_at || 'N/A'}</Table.Cell>
                    <Table.Cell className="max-w-xs truncate">{record.notes || 'N/A'}</Table.Cell>
                    <Table.Cell>
                      <a href="#" className="font-medium text-cyan-600 hover:underline dark:text-cyan-500">
                        Edit
                      </a>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          )}
        </Card>
      )}

      <Modal show={showAddModal} onClose={() => setShowAddModal(false)} popup size="md">
            <Modal.Header />
            <Modal.Body>
            <div className="space-y-6">
                <h3 className="text-xl font-medium text-gray-900 dark:text-white">Add New Outreach Record</h3>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="investorSelect" value="Select Investor" />
                    </div>
                    <Select id="investorSelect" required>
                        <option>Investor A (VC Firm A)</option>
                         <option>Investor B (VC Firm B)</option>
                         <option>Investor C (VC Firm C)</option>
                     </Select>
                </div>
                 <div>
                    <div className="mb-2 block">
                        <Label htmlFor="statusSelect" value="Status" />
                    </div>
                    <Select id="statusSelect" required>
                         <option>Not Contacted</option>
                         <option>Contacted</option>
                         <option>Responded</option>
                         <option>Meeting Scheduled</option>
                         <option>Declined</option>
                    </Select>
                 </div>
                 <div>
                    <div className="mb-2 block">
                        <Label htmlFor="lastContacted" value="Last Contacted Date (Optional)" />
                    </div>
                    <TextInput id="lastContacted" type="date" />
                </div>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="notes" value="Notes (Optional)" />
                    </div>
                    <Textarea id="notes" placeholder="Add notes about the interaction..." rows={3} />
                </div>

                <div className="w-full">
                <Button onClick={handleAddOutreach}>Add Record</Button>
                </div>
            </div>
            </Modal.Body>
        </Modal>

    </div>
  );
};

export default TrackOutreachPage; 