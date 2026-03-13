import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();

  const getLinkClasses = (path) => {
    const isActive = location.pathname === path;
    return `p-3.5 rounded-full transition-all duration-300 flex items-center justify-center ${
      isActive 
        ? 'text-black bg-black/5 scale-110' 
        : 'text-black/60 hover:text-black hover:bg-black/5 hover:scale-110'
    }`;
  };

  const socialLinkClasses = 'p-3.5 text-black/60 hover:text-black hover:bg-black/5 hover:scale-110 rounded-full transition-all duration-300 flex items-center justify-center';

  return (
    <div className='fixed bottom-8 left-1/2 -translate-x-1/2 z-50'>
      <div className='flex items-center gap-1.5 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] backdrop-blur-md px-3 py-2 rounded-full border border-black/10'>
        
        {/* Internal Navigation Links */}
        <Link to="/app/feed" className={getLinkClasses("/feed")} title="Home">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        </Link>
        
        <Link to="/app/create-post" className={getLinkClasses("/create-post")} title="Create">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
        </Link>
        
        {/* Divider */}
        <div className='w-px h-6 bg-black/15 mx-1.5'></div>

        {/* Social Links */}
        <a href="https://github.com" target="_blank" rel="noreferrer" className={socialLinkClasses} title="GitHub">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
        </a>

        <a href="https://linkedin.com" target="_blank" rel="noreferrer" className={socialLinkClasses} title="LinkedIn">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
        </a>

        <a href="https://twitter.com" target="_blank" rel="noreferrer" className={socialLinkClasses} title="X">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>
        </a>

        <a href="mailto:hello@example.com" className={socialLinkClasses} title="Email">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
        </a>

      </div>
    </div>
  )
}

export default Footer;