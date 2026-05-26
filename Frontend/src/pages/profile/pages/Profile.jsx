import React, { useContext } from 'react'
import { useProfile } from '../hooks/useProfile'
import { GlobalContext } from '../../../context/Context'
import Search from '../../search/Search'

const Profile = () => {
  const { backURI } = useContext(GlobalContext)
  const { data, isLoading, isError } = useProfile({ backURI })

  if (isLoading) return <div className="w-full min-h-screen flex items-center justify-center font-['ClashGrotesk-Variable']">Loading profile...</div>;
  if (isError) return <div className="w-full min-h-screen flex items-center justify-center font-['ClashGrotesk-Variable'] text-red-500">Error loading profile.</div>;

  return (
    <div className="w-full min-h-screen bg-[#f0efeb] flex flex-col items-center py-12 px-4 font-['ClashGrotesk-Variable']">
      {/* Profile Section */}
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-3xl p-8 md:p-12 mb-8 flex flex-col items-center text-center transition-all hover:shadow-xl">
        <div className="relative mb-6">
          <img 
            src={data?.profilePic || "https://ik.imagekit.io/bvd7qjtev/man-user-circle-icon.png"} 
            alt="Profile" 
            className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white shadow-md"
          />
          <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-2">
          @{data?.username || 'user'}
        </h1>
        
        <div className="w-16 h-1 bg-black/10 rounded-full my-4"></div>
        
        <p className="text-gray-600 text-sm max-w-lg leading-relaxed">
          Welcome to my profile! This is a demo bio. I am a passionate creator who loves building beautiful and scalable web applications. Always eager to learn new technologies and craft amazing user experiences. ✨
        </p>
      </div>

      {/* Search Section */}
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-3xl overflow-hidden transition-all hover:shadow-xl">
        <Search />
      </div>
    </div>
  )
}

export default Profile