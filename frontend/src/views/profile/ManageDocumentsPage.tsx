import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from 'src/context/AuthContext';
import { Card, Button, FileInput, Spinner, Alert, List, Tooltip } from 'flowbite-react';
import {
  IconAlertCircle,
  IconFileUpload,
  IconTrash,
  IconDownload,
  IconEye,
  IconFileDescription,
  IconFileText,
  IconFileSpreadsheet,
  IconFileUnknown
} from '@tabler/icons-react';
import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import OutlineCard from 'src/components/shared/OutlineCard';
import { toast } from 'react-hot-toast';
import { supabase } from 'src/lib/supabaseClient';
import { FileObject } from '@supabase/storage-js'; // Import FileObject type

const BCrumb = [
  { to: '/', title: 'Home' },
  { to: '/profile/view', title: 'My Profile' },
  { title: 'Manage Documents' },
];

// Helper to get file icon based on name/type
const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (extension === 'pdf') return <IconFileDescription className="h-5 w-5 text-red-600" />;
    if (['doc', 'docx'].includes(extension || '')) return <IconFileText className="h-5 w-5 text-blue-600" />;
    if (['xls', 'xlsx'].includes(extension || '')) return <IconFileSpreadsheet className="h-5 w-5 text-green-600" />;
    // Add more icons for common types like ppt, images, etc.
    return <IconFileUnknown className="h-5 w-5 text-gray-500" />;
};

const ManageDocumentsPage: React.FC = () => {
  const { user, loading: authLoading, userRole } = useAuth();
  const [documents, setDocuments] = useState<FileObject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const getStoragePath = useCallback(() => {
    if (!user) return null;
    return `startup-documents/${user.id}`;
  }, [user]);

  // Fetch existing documents
  const fetchDocuments = useCallback(async () => {
    const storagePath = getStoragePath();
    if (!storagePath) {
        setIsLoading(false);
        setError("User not found.");
        return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const { data, error: listError } = await supabase.storage
        .from('startup-documents') // Use the correct bucket name
        .list(storagePath, {
           limit: 100, // Adjust limit as needed
           offset: 0,
           sortBy: { column: 'created_at', order: 'desc' },
        });

      if (listError) throw listError;
      setDocuments(data || []);

    } catch (err: any) {
      console.error("Error fetching documents:", err);
      setError("Failed to load documents. Please ensure the 'startup-documents' bucket exists and has correct policies.");
      setDocuments([]); // Clear documents on error
    } finally {
      setIsLoading(false);
    }
  }, [getStoragePath]);

  useEffect(() => {
     // Only fetch if user is loaded and is a startup
    if (!authLoading && user && userRole === 'startup') {
         fetchDocuments();
    } else if (!authLoading && (!user || userRole !== 'startup')) {
         setIsLoading(false);
         setError(userRole !== 'startup' ? "Access denied. Document management is for startups only." : "User not authenticated.");
    }
  }, [user, authLoading, userRole, fetchDocuments]);

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
        // Basic validation (consider more robust checks)
        const file = event.target.files[0];
        const maxSize = 10 * 1024 * 1024; // 10MB limit for example
        if (file.size > maxSize) {
            toast.error('File size exceeds 10MB limit.');
            event.target.value = ''; // Clear input
            setSelectedFile(null);
            return;
        }
        setSelectedFile(file);
    } else {
        setSelectedFile(null);
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    const storagePath = getStoragePath();
    if (!selectedFile || !storagePath) {
        toast.error("Please select a file to upload.");
        return;
    }

    setIsUploading(true);
    toast.loading(`Uploading ${selectedFile.name}...`);

    const filePath = `${storagePath}/${selectedFile.name}`; // Use original file name

    try {
         // Check if file already exists (optional, Supabase upload replaces by default)
         const { data: existingFiles, error: listCheckError } = await supabase.storage
            .from('startup-documents')
            .list(storagePath, { search: selectedFile.name });

         if (listCheckError) throw listCheckError;

         if (existingFiles && existingFiles.length > 0) {
             const overwrite = confirm(`A file named "${selectedFile.name}" already exists. Overwrite?`);
             if (!overwrite) {
                 toast.dismiss();
                 setIsUploading(false);
                 setSelectedFile(null);
                 // Clear the file input visually
                 const input = document.getElementById('document-upload') as HTMLInputElement;
                 if (input) input.value = '';
                 return;
             }
         }

        const { error: uploadError } = await supabase.storage
            .from('startup-documents')
            .upload(filePath, selectedFile, {
                cacheControl: '3600',
                upsert: true // Replace file if it exists
            });

        if (uploadError) throw uploadError;

        toast.dismiss();
        toast.success(`"${selectedFile.name}" uploaded successfully!`);
        setSelectedFile(null); // Clear selection
         // Clear the file input visually
         const input = document.getElementById('document-upload') as HTMLInputElement;
         if (input) input.value = '';
        fetchDocuments(); // Refresh the list

    } catch (err: any) {
        console.error("Error uploading document:", err);
        toast.dismiss();
        toast.error(`Upload failed: ${err.message}`);
    } finally {
        setIsUploading(false);
    }
  };

  // Handle file deletion
  const handleDelete = async (fileName: string) => {
     const storagePath = getStoragePath();
     if (!storagePath) return;

     const confirmDelete = confirm(`Are you sure you want to delete "${fileName}"? This cannot be undone.`);
     if (!confirmDelete) return;

     const filePath = `${storagePath}/${fileName}`;
     toast.loading(`Deleting ${fileName}...`);

     try {
        const { error: deleteError } = await supabase.storage
            .from('startup-documents')
            .remove([filePath]);

        if (deleteError) throw deleteError;

        toast.dismiss();
        toast.success(`"${fileName}" deleted successfully.`);
        fetchDocuments(); // Refresh the list

     } catch (err: any) {
        console.error("Error deleting document:", err);
        toast.dismiss();
        toast.error(`Deletion failed: ${err.message}`);
     }
  };

   // Handle file download/view (using signed URLs for potential private buckets)
    const handleDownload = async (fileName: string) => {
        const storagePath = getStoragePath();
        if (!storagePath) return;

        const filePath = `${storagePath}/${fileName}`;
        toast.loading(`Preparing ${fileName}...`);

        try {
            const { data, error } = await supabase.storage
                .from('startup-documents')
                .createSignedUrl(filePath, 60, { // URL valid for 60 seconds
                     download: true // Suggest download instead of opening in browser
                });

            if (error) throw error;

            toast.dismiss();
            // Open the signed URL in a new tab
            window.open(data.signedUrl, '_blank');

        } catch (err: any) {
            console.error("Error creating signed URL:", err);
            toast.dismiss();
            toast.error(`Could not get download link: ${err.message}`);
        }
    };

  return (
    <>
      <BreadcrumbComp title="Manage Documents" items={BCrumb} />

      {/* Show error or access denied message */}
       {error && !isLoading && (
         <Alert color="failure" icon={IconAlertCircle} className="mb-6">
            {error}
         </Alert>
       )}

      {/* Only show uploader and list if user is startup and no error */}
      {!error && userRole === 'startup' && (
          <div className="grid grid-cols-1 gap-6">
            {/* Upload Section */}
            <OutlineCard>
              <h5 className="card-title">Upload New Document</h5>
               <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
                 <FileInput
                    id="document-upload"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,image/*" // Define allowed types
                    onChange={handleFileSelect}
                    disabled={isUploading}
                    helperText="Max 10MB per file (PDF, DOC, XLS, PPT, Images)"
                    className="flex-grow"
                  />
                 <Button
                    color="primary"
                    onClick={handleUpload}
                    isProcessing={isUploading}
                    disabled={!selectedFile || isUploading}
                    className="w-full sm:w-auto"
                  >
                    <IconFileUpload size={18} className="mr-2"/>
                    {isUploading ? 'Uploading...' : 'Upload File'}
                  </Button>
               </div>
            </OutlineCard>

            {/* Document List Section */}
            <OutlineCard>
               <h5 className="card-title">Uploaded Documents</h5>
                {isLoading && !documents.length ? ( // Show spinner only during initial load
                    <div className="flex justify-center items-center p-10"><Spinner size="lg" /></div>
                ) : documents.length > 0 ? (
                    <List unstyled className="mt-4 divide-y divide-gray-200 dark:divide-gray-700">
                        {documents.map((doc) => (
                            <List.Item key={doc.id || doc.name} className="py-3 sm:py-4">
                                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                    <div className="flex-shrink-0">
                                        {getFileIcon(doc.name)}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                                            {doc.name}
                                        </p>
                                        <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                                            Size: {doc.metadata?.size ? (doc.metadata.size / 1024 / 1024).toFixed(2) + ' MB' : 'N/A'} |
                                            Uploaded: {doc.created_at ? new Date(doc.created_at).toLocaleDateString() : 'N/A'}
                                        </p>
                                    </div>
                                    <div className="inline-flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
                                        <Tooltip content="Download Document">
                                            <Button size="xs" color="gray" pill onClick={() => handleDownload(doc.name)}>
                                                <IconDownload className="h-4 w-4" />
                                            </Button>
                                        </Tooltip>
                                         <Tooltip content="Delete Document">
                                            <Button size="xs" color="failure" pill onClick={() => handleDelete(doc.name)}>
                                                <IconTrash className="h-4 w-4" />
                                            </Button>
                                         </Tooltip>
                                    </div>
                                </div>
                            </List.Item>
                        ))}
                    </List>
                 ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-10">No documents uploaded yet.</p>
                )}
            </OutlineCard>
          </div>
       )}
    </>
  );
};

export default ManageDocumentsPage; 