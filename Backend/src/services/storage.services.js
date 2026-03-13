const ImageKit = require("@imagekit/nodejs");

const imagekit = new ImageKit({
    
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    
});

const uploadFile = async (buffer)=>{
  try {
    const result = await imagekit.files.upload({
      file: buffer,
      fileName: "profile" + Date.now(),
      folder: "/users"
    })
    return result;
  } catch (error) {
    
  }
}

module.exports = uploadFile;