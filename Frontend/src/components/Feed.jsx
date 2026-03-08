import React, { useContext, useEffect } from 'react'
import axios from 'axios'
import { GlobalContext } from '../context/Context'

const Feed = () => {
  const { data, setData } = useContext(GlobalContext);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get("https://teel-twitter-but-better-backend.onrender.com/post/get-post");
      
      setData(res.data.posts);
    };
    fetchData();
  }, []);
  return (
    <div 
      className='w-full h-[calc(100vh-96px)] overflow-y-scroll snap-y snap-mandatory flex flex-col font-[GeneralSans-Regular] hide-scrollbar'
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Adding a placeholder if there is no data */}
      {(!data || data.length === 0) && (
        <div className='w-full h-full shrink-0 flex flex-col justify-center items-center px-6 text-black/50 uppercase tracking-widest text-xs'>
          No posts available.
        </div>
      )}

      {data && data.map((post)=>{
        return(
            <div 
              key={post._id} 
              className='w-full h-full shrink-0 snap-start snap-always px-6 md:px-12 flex flex-col justify-center text-black' 
            >
                <span className="text-[10px] md:text-xs font-semibold tracking-[0.2em] uppercase text-black/40 mb-4 md:mb-6">
                  POST
                </span>
                <h1 className='text-5xl md:text-7xl lg:text-[5.5rem] leading-[0.95] tracking-tighter uppercase font-medium mb-6 md:mb-10'>
                  {post.title}
                </h1>
                <p className='text-lg md:text-2xl font-[GeneralSans-Light] uppercase leading-relaxed max-w-3xl'>
                  {post.content}
                </p>
                {/* Adding a sleek bottom border separator for aesthetic context */}
                <div className="w-1/4 border-b border-black/20 mt-12 md:mt-24"></div>
            </div>
        )
      })}
    </div>
  )
}

export default Feed