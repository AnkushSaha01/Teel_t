import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { GlobalContext } from "../../../context/Context";

const Form = () => {
  const { backURI } = useContext(GlobalContext);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);
    
    // Add multiple files to formData
    if (data.media && data.media.length > 0) {
      Array.from(data.media).forEach((file) => {
        formData.append("media", file);
      });
    }

    axios.post(`${backURI}/post/create-post`, formData, { 
      withCredentials: true 
    })
    .then((res) => {
      console.log("Post created:", res.data);
      reset();
    })
    .catch((err) => {
      console.error("Error creating post:", err);
    });
  };

  return (
    <div className="w-full  bg-[#F0EFEB] text-black flex flex-col items-center px-6 py-10 md:p-12 font-['ClashGrotesk-Variable'] relative">
      <div className="w-full max-w-5xl mx-auto flex flex-col grow">
        
        

        {/* Huge Typographic Header */}
        <h1 className="text-[2.75rem] leading-none md:text-7xl lg:text-[5.5rem] lg:leading-[0.95] font-medium tracking-tighter uppercase mb-16 md:mb-24 text-black">
          CREATE A NEW <br />
          POST FOR THE <br />
          PLATFORM.
        </h1>

        <form
          className="w-full flex flex-col gap-12 md:gap-20"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Title Input */}
          <div className="w-full flex flex-col gap-2 md:gap-4">
            <div className="w-full flex justify-between items-center border-b border-black/80 pb-2">
              <label className="text-[10px] md:text-xs font-semibold tracking-[0.2em] uppercase text-black">
                TITLE
              </label>
              <span className="text-[10px] md:text-xs font-semibold tracking-[0.2em] uppercase text-black/40">
                01
              </span>
            </div>
            <input
              className="w-full bg-transparent py-2 text-2xl md:text-4xl lg:text-5xl font-medium tracking-tight focus:outline-none placeholder-black/30 text-black uppercase"
              type="text"
              placeholder="ENTER TITLE"
              {...register("title", { required: "Title is required", maxLength: 300 })}
            />
            {errors.title && (
              <p className="text-red-500 text-[10px] tracking-widest uppercase mt-2">
                Title is required
              </p>
            )}
          </div>

          {/* Content Input */}
          <div className="w-full flex flex-col gap-2 md:gap-4">
            <div className="w-full flex justify-between items-center border-b border-black/80 pb-2">
              <label className="text-[10px] md:text-xs font-semibold tracking-[0.2em] uppercase text-black">
                CONTENT
              </label>
              <span className="text-[10px] md:text-xs font-semibold tracking-[0.2em] uppercase text-black/40">
                02
              </span>
            </div>
            <textarea
              className="w-full bg-transparent py-4 text-lg md:text-2xl font-['ClashGrotesk-Variable'] font-light leading-relaxed focus:outline-none placeholder-black/30 text-black min-h-[150px] resize-y"
              placeholder="START WRITING..."
              {...register("content", { required: "Content is required", maxLength: 2000 })}
            />
            {errors.content && (
              <p className="text-red-500 text-[10px] tracking-widest uppercase">
                Content is required
              </p>
            )}
          </div>

          {/* Media Upload */}
          <div className="w-full flex flex-col gap-2 md:gap-4">
            <div className="w-full flex justify-between items-center border-b border-black/80 pb-2">
              <label className="text-[10px] md:text-xs font-semibold tracking-[0.2em] uppercase text-black">
                MEDIA (IMAGES OR VIDEOS)
              </label>
              <span className="text-[10px] md:text-xs font-semibold tracking-[0.2em] uppercase text-black/40">
                03
              </span>
            </div>
            <input
              className="hidden"
              type="file"
              id="media-upload"
              multiple
              accept="image/*,video/*"
              {...register("media")}
            />
            <label
              htmlFor="media-upload"
              className="w-full bg-black/5 py-8 md:py-12 flex flex-col items-center justify-center border-2 border-dashed border-black/10 hover:border-black/30 hover:bg-black/10 transition-all cursor-pointer group"
            >
              <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-black/60 group-hover:text-black">
                Click to upload or drag and drop
              </span>
              <span className="text-[8px] md:text-[10px] tracking-widest uppercase text-black/30 mt-2">
                Supports Images and Videos
              </span>
            </label>
          </div>

          {/* Bottom section matching the image's bottom text and submit button */}
          <div className="w-full pt-8 flex flex-col-reverse md:flex-row justify-between items-end md:items-center gap-8 border-none mt-auto">
             <span className="text-[10px] md:text-xs font-semibold tracking-[0.2em] uppercase text-black">
               READY FOR PUBLISH
             </span>
            <button
              className="bg-black text-[#F0EFEB] text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase py-4 px-12 md:py-5 md:px-16 hover:bg-black/80 transition-colors w-full md:w-auto mb-20"
              type="submit"
            >
              Submit Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;
