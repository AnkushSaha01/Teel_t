import axios from "axios";

const likePostAPI = async (backURI, postId) => {
    try {
        const res = await axios.post(`${backURI}/interaction/like`, { postId }, {
            withCredentials: true
        });
        return res.data;
    } catch (error) {
        return error;
    }
}

export {
    likePostAPI
}