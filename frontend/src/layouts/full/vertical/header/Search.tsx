import { useState } from "react";
import { Modal, TextInput, Spinner } from "flowbite-react";
import { Icon } from "@iconify/react";
import { SearchLinks } from "./Data";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import { Link } from "react-router-dom";

// Define type for search result item (can be expanded)
interface SearchResult {
  href: string;
  title: string;
}

const Search = () => {
  const [openModal, setOpenModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  // Remove useNavigate as it's not needed for modal search
  // const navigate = useNavigate(); 

  // State for search results
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false); // Track if a search has been performed

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return; // Don't search if query is empty

    console.log('Simulating search for:', searchQuery);
    setIsSearching(true);
    setSearchResults([]);
    setSearchError(null);
    setHasSearched(true); // Mark that a search attempt was made

    // Simulate an API call or filtering logic
    setTimeout(() => {
      try {
        const lowerQuery = searchQuery.toLowerCase();
        const filteredResults = SearchLinks.filter(
          (link) =>
            link.title.toLowerCase().includes(lowerQuery) ||
            link.href.toLowerCase().includes(lowerQuery)
        );
        setSearchResults(filteredResults);
      } catch (err) {
        console.error("Search simulation error:", err);
        setSearchError("An error occurred during the search.");
      } finally {
        setIsSearching(false);
      }
    }, 500); // Simulate 500ms delay
  };

  // Function to close modal and reset state
  const handleCloseModal = () => {
    setOpenModal(false);
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
    setSearchError(null);
    setHasSearched(false);
  }

  return (
    <div>
      <button
        onClick={() => setOpenModal(true)}
        className="h-10 w-10 hover:text-primary hover:bg-lightprimary rounded-full flex justify-center items-center cursor-pointer"
      >
        <Icon icon="solar:magnifer-line-duotone" height={20} />
      </button>

      <Modal dismissible show={openModal} onClose={handleCloseModal}>
        <div className="p-6 border-b border-ld">
          <form onSubmit={handleSearch} className="relative">
            <TextInput
              id="search-input"
              type="text"
              icon={() => <Icon icon="solar:magnifer-line-duotone" height={18} />}
              placeholder="Search..."
              required
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-48 [&_input]:!py-2 [&_input]:!ps-11 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
            {/* Hidden submit button for accessibility and form submission */}
            <button type="submit" className="absolute -left-[9999px]" aria-hidden="true" tabIndex={-1}>
              Search
            </button>
          </form>
        </div>
        <Modal.Body className="pt-0 "  >
          <SimpleBar className="max-h-72">
            {/* Conditional Rendering for Search State */} 
            {isSearching ? (
              <div className="text-center py-4">
                {/* Use Flowbite Spinner */} 
                <Spinner aria-label="Searching..." size="sm" />
                <p className="text-xs text-gray-500 mt-2">Searching...</p>
              </div>
            ) : searchError ? (
              <div className="text-center py-4 px-3 text-red-600">
                 <Icon icon="solar:danger-circle-line-duotone" className="mx-auto mb-1" height={24} />
                 <p className="text-sm font-medium">Error</p>
                <p className="text-xs">{searchError}</p>
              </div>
            ) : hasSearched && searchResults.length > 0 ? (
              <>
                <h5 className="text-lg pt-5 px-3">Search Results</h5>
                {searchResults.map((link) => (
                  <Link to={link.href} className="block py-1 px-3 group relative" key={link.href} onClick={handleCloseModal}>
                    <h6 className="group-hover:text-primary mb-1 font-medium text-sm">
                      {link.title}
                    </h6>
                    <p className="text-xs text-link dark:text-darklink opacity-90 font-medium">
                      {link.href}
                    </p>
                  </Link>
                ))}
              </>
            ) : hasSearched && searchResults.length === 0 ? (
              <div className="text-center py-6 px-3 text-gray-500">
                <Icon icon="solar:magnifer-zoom-out-line-duotone" className="mx-auto mb-1" height={28} />
                 <p className="text-sm font-medium">No Results Found</p>
                <p className="text-xs">Try adjusting your search query.</p>
              </div>
            ) : (
              // Show Quick Links only if no search has been performed yet
              <>
                <h5 className="text-lg pt-5 px-3">Quick Page Links</h5>
                {SearchLinks.map((links) => (
                  <Link to={links.href} className="block py-1 px-3 group relative" key={links.href} onClick={handleCloseModal}>
                    <h6 className="group-hover:text-primary mb-1 font-medium text-sm">
                      {links.title}
                    </h6>
                    <p className="text-xs text-link dark:text-darklink opacity-90 font-medium">
                      {links.href}
                    </p>
                  </Link>
                ))}
              </>
            )}
          </SimpleBar>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Search;
