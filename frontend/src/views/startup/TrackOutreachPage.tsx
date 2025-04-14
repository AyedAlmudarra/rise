import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from 'src/context/AuthContext';
import {
    Card, Spinner, Alert, Button, Table, Pagination, Badge, Modal, Textarea, Select, Label, TextInput // Added Modal, Textarea, Select, Label, TextInput
} from 'flowbite-react';
import {
    IconAlertCircle, IconPlus, IconPencil, IconTrash, IconNotebook // Added relevant icons
} from '@tabler/icons-react';
import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import { supabase } from 'src/lib/supabaseClient';
import { toast } from 'react-hot-toast';

// Define the shape of an outreach record (adjust based on your table schema)
interface OutreachRecord {
  id: string;
  startup_user_id: string;
  investor_profile_id: string; // FK to investors table
  interaction_date: string; // Or Date object
  interaction_type: 'Email' | 'Meeting' | 'Call' | 'Introduction' | 'Other';
  status: 'Contacted' | 'Responded' | 'Meeting Scheduled' | 'Due Diligence' | 'Declined' | 'Invested' | 'On Hold';
  notes?: string | null;
  created_at: string;
  // Add fields to join investor data if needed
  investors?: { 
    company_name?: string | null;
    users?: { 
      user_metadata?: { 
        full_name?: string | null; 
      } | null;
    } | null;
  } | null;
}

const BCrumb = [
  { to: '/', title: 'Home' },
  { title: 'Track Investor Outreach' },
];

const ITEMS_PER_PAGE = 10;
// Define options for dropdowns
const INTERACTION_TYPES: OutreachRecord['interaction_type'][] = ['Email', 'Meeting', 'Call', 'Introduction', 'Other'];
const STATUSES: OutreachRecord['status'][] = ['Contacted', 'Responded', 'Meeting Scheduled', 'Due Diligence', 'Declined', 'Invested', 'On Hold'];

const TrackOutreachPage: React.FC = () => {
  const { user, loading: authLoading, userRole } = useAuth();
  const [outreachData, setOutreachData] = useState<OutreachRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(outreachData.length / ITEMS_PER_PAGE);
  const paginatedData = outreachData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Fetch outreach data
  const fetchOutreach = useCallback(async () => {
    if (!user) {
        setIsLoading(false);
        setError("User not found.");
        return;
    }
    setIsLoading(true);
    setError(null);
    try {
      // Ensure the table name 'investor_outreach' is correct
      // Join with investors and users to get names
      const { data, error: fetchError } = await supabase
        .from('investor_outreach') 
        .select(`
            *,
            investors ( 
                company_name,
                users ( user_metadata->>full_name )
            )
        `)
        .eq('startup_user_id', user.id) // Filter for the logged-in startup
        .order('interaction_date', { ascending: false });

      if (fetchError) throw fetchError;
      setOutreachData(data || []);

    } catch (err: any) {
      console.error("Error fetching outreach data:", err);
      setError("Failed to load outreach records. Please ensure the 'investor_outreach' table exists and has correct policies.");
      setOutreachData([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading && user && userRole === 'startup') {
        fetchOutreach();
    } else if (!authLoading && (!user || userRole !== 'startup')) {
        setIsLoading(false);
        setError(userRole !== 'startup' ? "Access denied. This page is for startups only." : "User not authenticated.");
    }
  }, [user, authLoading, userRole, fetchOutreach]);

  // --- TODO: Add Handlers for Add/Edit/Delete Modal --- 
  // const [showModal, setShowModal] = useState(false);
  // const [isEditing, setIsEditing] = useState(false);
  // const [currentRecord, setCurrentRecord] = useState<Partial<OutreachRecord> | null>(null);
  // const handleOpenAddModal = () => { ... }
  // const handleOpenEditModal = (record: OutreachRecord) => { ... }
  // const handleSave = async () => { ... }
  // const handleDelete = async (id: string) => { ... }

  const onPageChange = (page: number) => {
      setCurrentPage(page);
  };

  // --- Render Logic --- 
  if (authLoading) {
     return <div className="flex justify-center items-center h-screen"><Spinner size="xl" /></div>; 
  }

  if (error) {
      return (
        <>
          <BreadcrumbComp title="Track Investor Outreach" items={BCrumb} />
          <Alert color="failure" icon={IconAlertCircle}>{error}</Alert>
        </>
      );
  }

  return (
    <>
      <BreadcrumbComp title="Track Investor Outreach" items={BCrumb} />

      <Card>
         <div className="flex justify-between items-center mb-4">
             <h5 className="card-title">Investor Outreach Log</h5>
             <Button color="primary" size="sm" > {/* onClick={handleOpenAddModal} */}
                 <IconPlus size={16} className="mr-2"/>
                 Log New Interaction
             </Button>
         </div>

         <div className="overflow-x-auto">
             {isLoading ? (
                 <div className="flex justify-center p-10"><Spinner size="lg" /></div>
             ) : (
                 <>
                 <Table hoverable>
                     <Table.Head>
                         <Table.HeadCell>Investor</Table.HeadCell>
                         <Table.HeadCell>Company</Table.HeadCell>
                         <Table.HeadCell>Date</Table.HeadCell>
                         <Table.HeadCell>Type</Table.HeadCell>
                         <Table.HeadCell>Status</Table.HeadCell>
                         <Table.HeadCell>Notes</Table.HeadCell>
                         <Table.HeadCell>
                             <span className="sr-only">Actions</span>
                         </Table.HeadCell>
                     </Table.Head>
                     <Table.Body className="divide-y">
                         {paginatedData.length > 0 ? (
                             paginatedData.map((record) => (
                                <Table.Row key={record.id} className="bg-white dark:border-gray-700 dark:bg-gray-800 text-sm">
                                     <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                         {record.investors?.users?.user_metadata?.full_name || 'N/A'}
                                     </Table.Cell>
                                     <Table.Cell>{record.investors?.company_name || 'N/A'}</Table.Cell>
                                     <Table.Cell>{new Date(record.interaction_date).toLocaleDateString()}</Table.Cell>
                                     <Table.Cell>{record.interaction_type}</Table.Cell>
                                     <Table.Cell>
                                         <Badge 
                                             color={record.status === 'Invested' ? 'success' : record.status === 'Declined' ? 'failure' : 'info'}
                                             size="sm"
                                            >
                                             {record.status}
                                         </Badge>
                                     </Table.Cell>
                                      <Table.Cell className="max-w-xs truncate" title={record.notes || ''}>{record.notes || '-'}</Table.Cell>
                                     <Table.Cell>
                                         <div className="flex gap-2">
                                            <Button size="xs" color="light" > {/* onClick={() => handleOpenEditModal(record)} */} 
                                                 <IconPencil size={14}/>
                                             </Button>
                                             <Button size="xs" color="failure" > {/* onClick={() => handleDelete(record.id)} */}
                                                <IconTrash size={14} />
                                             </Button>
                                         </div>
                                     </Table.Cell>
                                 </Table.Row>
                             ))
                         ) : (
                             <Table.Row>
                                <Table.Cell colSpan={7} className="text-center py-10 text-gray-500">
                                     No outreach activities logged yet.
                                </Table.Cell>
                             </Table.Row>
                         )}
                     </Table.Body>
                 </Table>
                  {totalPages > 1 && (
                     <div className="flex justify-center py-4">
                         <Pagination 
                            currentPage={currentPage} 
                            totalPages={totalPages} 
                            onPageChange={onPageChange} 
                            showIcons
                        />
                     </div>
                 )}
                </>
             )}
          </div>
      </Card>

        {/* --- TODO: Add/Edit Outreach Modal --- */} 
       {/* <Modal show={showModal} onClose={() => setShowModal(false)}> ... </Modal> */}
    </>
  );
};

export default TrackOutreachPage; 