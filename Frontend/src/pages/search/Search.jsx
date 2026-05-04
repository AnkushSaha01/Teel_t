import React, { useState, useContext, useEffect } from 'react';
import { GlobalContext } from '../../context/Context';
import { useQuery } from '@tanstack/react-query';
import { fetchUsers } from './service/search.api';
import UserTile from "./components/userTile";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const { backURI } = useContext(GlobalContext);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { data: users, isLoading, isError } = useQuery({
    queryKey: ['users', debouncedSearchTerm, backURI],
    queryFn: fetchUsers,
    enabled: !!debouncedSearchTerm, 
  });

  return (
    <div className="w-full min-h-[calc(100vh-96px)] p-6 md:p-12 font-[GeneralSans-Regular] flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight uppercase mb-8">Search Users</h1>
        
        {/* Search Input */}
        <div className="relative mb-10 group">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by username or email..."
            className="w-full p-4 pl-12 text-lg border-b-2 border-black/20 focus:border-black outline-none bg-transparent transition-colors placeholder:text-black/30"
          />
          <svg 
            className="w-6 h-6 absolute left-2 top-1/2 -translate-y-1/2 text-black/30 group-focus-within:text-black transition-colors" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Results Section */}
        <div className="flex flex-col gap-4">
          {isLoading && (
            <div className="text-center text-black/50 uppercase tracking-widest text-sm py-10">Searching...</div>
          )}
          
          {isError && (
            <div className="text-center text-red-500 uppercase tracking-widest text-sm py-10">Error searching users.</div>
          )}

          {!isLoading && !isError && users?.length === 0 && debouncedSearchTerm && (
            <div className="text-center text-black/50 uppercase tracking-widest text-sm py-10">No users found for "{debouncedSearchTerm}"</div>
          )}

          <UserTile users={users} />
        </div>
      </div>
    </div>
  );
}

export default Search;