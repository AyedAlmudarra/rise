import React, { useState } from "react";
import { Modal, TextInput } from "flowbite-react";
import { Icon } from "@iconify/react";
import * as SearchData from "./Data";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import { Link } from "react-router-dom";

const Search = () => {
  const [openModal, setOpenModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual search logic here
    // e.g., call API, navigate to search results page
    console.log('Performing search for:', searchQuery);
  };

  return (
    <div>
      <button
        onClick={() => setOpenModal(true)}
        className="h-10 w-10 hover:text-primary hover:bg-lightprimary rounded-full flex justify-center items-center cursor-pointer"
      >
        <Icon icon="solar:magnifer-line-duotone" height={20} />
      </button>

      <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
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
            <h5 className="text-lg pt-5">Quick Page Links</h5>
            {SearchData.SearchLinks.map((links, index) => (
              <Link to={links.href} className="py-1 px-3  group relative" key={index}>
                <h6 className="group-hover:text-primary mb-1 font-medium text-sm">
                  {links.title}
                </h6>
                <p className="text-xs text-link dark:text-darklink opacity-90 font-medium">
                  {links.href}
                </p>
              </Link>
            ))}
          </SimpleBar>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Search;
