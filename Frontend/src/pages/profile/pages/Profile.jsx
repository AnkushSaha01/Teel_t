import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useProfile } from '../hooks/useProfile'
import { GlobalContext } from '../../../context/Context'
import Search from '../../search/Search'

const Profile = () => {
  const { backURI } = useContext(GlobalContext)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data, isLoading, isError } = useProfile({ backURI })

  const handleLogout = async () => {
    try {
      await axios.post(`${backURI}/auth/user/logout`, {}, { withCredentials: true })
      // Clear React Query cache so the next user doesn't see stale profile/feed data
      queryClient.clear()
      // Redirect to login page
      navigate('/login')
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  if (isLoading) return <div className="w-full min-h-screen flex items-center justify-center font-['ClashGrotesk-Variable']">Loading profile...</div>;
  if (isError) return <div className="w-full min-h-screen flex items-center justify-center font-['ClashGrotesk-Variable'] text-red-500">Error loading profile.</div>;

  return (
    <div className="w-full min-h-screen bg-[#f0efeb] flex flex-col items-center py-12 px-4 font-['ClashGrotesk-Variable']">
      {/* Profile Section */}
      <div className="w-full relative max-w-3xl bg-white shadow-lg rounded-3xl p-8 md:p-12 mb-8 flex flex-col items-center text-center transition-all hover:shadow-xl">
        <div className="relative mb-6">
          <img 
            src={data?.profilePic || "https://ik.imagekit.io/bvd7qjtev/man-user-circle-icon.png"} 
            alt="Profile" 
            className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white shadow-md"
          />
          <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-medium text-gray-900 tracking-tight mb-2">
          @{data?.username || 'user'}
        </h1>
        
        <div className="w-16 h-1 bg-black/10 rounded-full my-4"></div>
        
        <p className="text-gray-700 text-sm uppercase max-w-lg ">
          Welcome to my profile! This is a demo bio. I am a passionate creator who loves building beautiful and scalable web applications. Always eager to learn new technologies and craft amazing user experiences. ✨
        </p>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="absolute top-4 right-4 bg-black text-[#F0EFEB] text-xs font-semibold tracking-wider uppercase p-4 rounded-full hover:bg-black/85 transition-all hover:scale-105 active:scale-95 shadow-md flex items-center gap-2 cursor-pointer border border-transparent font-sans"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
          
        </button>
      </div>

      {/* Search Section */}
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-3xl overflow-hidden transition-all hover:shadow-xl">
        <Search />
      </div>
    </div>
  )
}

export default Profile