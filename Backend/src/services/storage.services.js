const ImageKit = require("@imagekit/nodejs");
const config = require("../config/config");

const imagekit = new ImageKit({
    publicKey: config.IMAGEKIT_PUBLIC_KEY || "your_public_key_here",
    privateKey: config.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: config.IMAGEKIT_URL_ENDPOINT || "your_url_endpoint_here",
});

const uploadFile = async (buffer, fileName = "file", folder = "/general") => {
  try {
    const result = await imagekit.files.upload({
      file: buffer.toString("base64"),
      fileName: fileName + "-" + Date.now(),
      folder: folder
    })
    return result;
  } catch (error) {
    console.error("ImageKit Upload Error:", error);
    return null;
  }
}

module.exports = uploadFile;