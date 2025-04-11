import React, { useState } from 'react';
import { Card, Table, Button, Badge, Avatar, Tooltip, Dropdown } from 'flowbite-react';
import { 
  IconEye, IconStar, IconTrash, IconDotsVertical, IconCalendarTime,
  IconCheck, IconX, IconBookmark, IconPlus, IconClipboardCheck,
  IconFilter, IconSearch, IconSend, IconReportAnalytics, IconNotes
} from '@tabler/icons-react';
import { MockWatchlist } from 'src/api/mocks/data/investorDashboardMockData';

interface WatchlistSectionProps {
  watchlistData: MockWatchlist;
  isLoading?: boolean;
  onAddToWatchlist?: () => void;
}

const WatchlistSection: React.FC<WatchlistSectionProps> = ({ 
  watchlistData, 
  isLoading = false,
  onAddToWatchlist
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'fundraising'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [notesOpen, setNotesOpen] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  
  // Filter startups based on active filter and search query
  const filteredStartups = watchlistData.topWatched
    .filter(startup => {
      if (activeFilter === 'all') return true;
      if (activeFilter === 'active') return startup.status === 'Active';
      if (activeFilter === 'fundraising') return startup.status === 'Fundraising';
      return true;
    })
    .filter(startup => {
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      return (
        startup.startupName.toLowerCase().includes(query) ||
        startup.industry.toLowerCase().includes(query) ||
        startup.stage.toLowerCase().includes(query)
      );
    });
    
  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'info';
      case 'Fundraising': return 'success';
      case 'Acquired': return 'purple';
      case 'Closed': return 'failure';
      default: return 'gray';
    }
  };
  
  // Handler for toggling notes
  const toggleNotes = (id: string) => {
    setNotesOpen(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  // Handler for saving notes
  const saveNotes = (id: string, value: string) => {
    setNotes(prev => ({
      ...prev,
      [id]: value
    }));
    toggleNotes(id);
  };
  
  if (isLoading) {
    return (
      <Card>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded-md w-1/4 mb-4"></div>
          <div className="flex space-x-4 mb-6">
            <div className="h-16 bg-gray-200 rounded-md w-1/3"></div>
            <div className="h-16 bg-gray-200 rounded-md w-1/3"></div>
            <div className="h-16 bg-gray-200 rounded-md w-1/3"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded-md w-1/4 mb-2"></div>
          <div className="h-32 bg-gray-200 rounded-md"></div>
        </div>
      </Card>
    );
  }
  
  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-600 p-4 -mt-6 -mx-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <IconBookmark size={20} className="text-white mr-2" />
            <h5 className="text-xl font-bold text-white">Watchlist</h5>
          </div>
          <Button size="xs" color="light" onClick={onAddToWatchlist}>
            <IconPlus size={14} className="mr-1" /> Add Startup
          </Button>
        </div>
      </div>
      
      {/* Summary statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-yellow-50 dark:bg-gray-800 rounded-lg p-4 border border-yellow-100 dark:border-gray-700">
          <div className="text-sm text-yellow-800 dark:text-yellow-400 font-medium mb-1">Total Watched</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{watchlistData.totalWatched}</div>
          <div className="text-xs text-gray-500 mt-1">
            {watchlistData.recentlyAdded} added in the last 30 days
          </div>
        </div>
        
        <div className="bg-indigo-50 dark:bg-gray-800 rounded-lg p-4 border border-indigo-100 dark:border-gray-700">
          <div className="text-sm text-indigo-800 dark:text-indigo-400 font-medium mb-1">By Stage</div>
          <div className="flex flex-wrap gap-1 mt-2">
            {watchlistData.watchedByStage.map((item, index) => (
              <Badge key={index} color="indigo" className="text-xs">
                {item.stage}: {item.count}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="bg-purple-50 dark:bg-gray-800 rounded-lg p-4 border border-purple-100 dark:border-gray-700">
          <div className="text-sm text-purple-800 dark:text-purple-400 font-medium mb-1">By Industry</div>
          <div className="flex flex-wrap gap-1 mt-2">
            {watchlistData.watchedByIndustry.slice(0, 4).map((item, index) => (
              <Badge key={index} color="purple" className="text-xs">
                {item.industry}: {item.count}
              </Badge>
            ))}
            {watchlistData.watchedByIndustry.length > 4 && (
              <Badge color="light" className="text-xs">
                +{watchlistData.watchedByIndustry.length - 4} more
              </Badge>
            )}
          </div>
        </div>
      </div>
      
      {/* Filters and search */}
      <div className="flex flex-wrap justify-between items-center mb-4">
        <div className="flex space-x-2 mb-2 sm:mb-0">
          <Button 
            size="xs"
            color={activeFilter === 'all' ? "blue" : "light"}
            onClick={() => setActiveFilter('all')}
          >
            All Startups
          </Button>
          <Button 
            size="xs"
            color={activeFilter === 'active' ? "info" : "light"}
            onClick={() => setActiveFilter('active')}
          >
            Active
          </Button>
          <Button 
            size="xs"
            color={activeFilter === 'fundraising' ? "success" : "light"}
            onClick={() => setActiveFilter('fundraising')}
          >
            Fundraising
          </Button>
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <IconSearch size={14} className="text-gray-500" />
          </div>
          <input 
            type="text"
            className="block pl-10 pr-3 py-1.5 text-xs border-gray-200 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            placeholder="Search by name, industry, stage..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {/* Watchlist table */}
      {filteredStartups.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-md">
          <IconBookmark size={40} className="mx-auto mb-3 text-gray-400" />
          <h5 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-2">
            No matching startups in your watchlist
          </h5>
          <p className="text-gray-500 mb-4">
            {searchQuery || activeFilter !== 'all' 
              ? "Try adjusting your filters or search criteria." 
              : "Your watchlist is empty. Add startups to keep track of them."}
          </p>
          {(searchQuery || activeFilter !== 'all') && (
            <Button size="xs" color="light" onClick={() => {
              setSearchQuery('');
              setActiveFilter('all');
            }}>
              Clear Filters
            </Button>
          )}
          {!searchQuery && activeFilter === 'all' && (
            <Button size="xs" color="blue" onClick={onAddToWatchlist}>
              <IconPlus size={14} className="mr-1" /> Add Startup
            </Button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <Table.Head>
              <Table.HeadCell className="text-xs">Startup</Table.HeadCell>
              <Table.HeadCell className="text-xs">Stage</Table.HeadCell>
              <Table.HeadCell className="text-xs">Status</Table.HeadCell>
              <Table.HeadCell className="text-xs">Added</Table.HeadCell>
              <Table.HeadCell className="text-xs">Last Update</Table.HeadCell>
              <Table.HeadCell className="text-xs">
                <span className="sr-only">Actions</span>
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {filteredStartups.map((startup) => (
                <React.Fragment key={startup.id}>
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      <div className="flex items-center space-x-3">
                        <Avatar 
                          size="xs" 
                          rounded 
                          img={`https://ui-avatars.com/api/?name=${encodeURIComponent(startup.startupName)}&background=random`}
                        />
                        <div>
                          <p className="font-medium text-sm">{startup.startupName}</p>
                          <p className="text-xs text-gray-500">{startup.industry}</p>
                        </div>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge color="indigo" size="sm">{startup.stage}</Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge color={getStatusColor(startup.status)} size="sm">{startup.status}</Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="text-xs text-gray-500">{startup.dateAdded}</span>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="text-xs text-gray-500">{startup.lastUpdate}</span>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex space-x-1">
                        <Tooltip content="View Startup Profile">
                          <Button size="xs" color="light">
                            <IconEye size={14} />
                          </Button>
                        </Tooltip>
                        <Tooltip content="Add Notes">
                          <Button 
                            size="xs" 
                            color={notesOpen[startup.id] || startup.notes ? "info" : "light"}
                            onClick={() => toggleNotes(startup.id)}
                          >
                            <IconNotes size={14} />
                          </Button>
                        </Tooltip>
                        <Dropdown
                          label=""
                          dismissOnClick={true}
                          renderTrigger={() => (
                            <Button size="xs" color="light">
                              <IconDotsVertical size={14} />
                            </Button>
                          )}
                        >
                          <Dropdown.Item icon={IconSend}>Contact Founder</Dropdown.Item>
                          <Dropdown.Item icon={IconReportAnalytics}>View Analytics</Dropdown.Item>
                          <Dropdown.Item icon={IconCalendarTime}>Schedule Call</Dropdown.Item>
                          <Dropdown.Item icon={IconTrash} className="text-red-600">Remove from Watchlist</Dropdown.Item>
                        </Dropdown>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                  
                  {/* Notes section */}
                  {notesOpen[startup.id] && (
                    <Table.Row>
                      <Table.Cell colSpan={6} className="bg-gray-50 dark:bg-gray-900 p-4">
                        <div className="flex flex-col space-y-3">
                          <div className="text-sm font-medium">Notes for {startup.startupName}</div>
                          <textarea
                            className="w-full p-2 text-sm border-gray-200 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                            rows={3}
                            placeholder="Add your notes here..."
                            defaultValue={notes[startup.id] || startup.notes || ''}
                          />
                          <div className="flex justify-end space-x-2">
                            <Button size="xs" color="light" onClick={() => toggleNotes(startup.id)}>
                              Cancel
                            </Button>
                            <Button 
                              size="xs" 
                              color="blue"
                              onClick={(e) => {
                                // Get the textarea value
                                const textarea = e.currentTarget.parentElement?.previousElementSibling as HTMLTextAreaElement;
                                if (textarea) {
                                  saveNotes(startup.id, textarea.value);
                                }
                              }}
                            >
                              <IconClipboardCheck size={14} className="mr-1" /> Save Notes
                            </Button>
                          </div>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  )}
                  
                  {/* Display saved notes if any */}
                  {!notesOpen[startup.id] && (notes[startup.id] || startup.notes) && (
                    <Table.Row>
                      <Table.Cell colSpan={6} className="bg-blue-50 dark:bg-gray-900 p-2 text-xs border-b border-blue-100 dark:border-gray-700">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start">
                            <IconNotes size={14} className="text-blue-600 mr-2 mt-0.5" />
                            <div className="text-gray-700 dark:text-gray-300">
                              {notes[startup.id] || startup.notes}
                            </div>
                          </div>
                          <Button 
                            size="xs" 
                            color="light" 
                            className="ml-2 -mr-1 -my-1"
                            onClick={() => toggleNotes(startup.id)}
                          >
                            <IconNotes size={14} />
                          </Button>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  )}
                </React.Fragment>
              ))}
            </Table.Body>
          </Table>
        </div>
      )}
    </Card>
  );
};

export default WatchlistSection; 