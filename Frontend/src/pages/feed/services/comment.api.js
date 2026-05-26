import axios from "axios";

const getCommentsByPostId = async (backURI, postId) => {
    try {
        const response = await axios.get(`${backURI}/interaction/comment/get-comments/${postId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching comments:", error);
        throw error;
    }
}

const createComment = async (backURI, postId, comment) => {
    try {
        const response = await axios.post(`${backURI}/interaction/comment/create-comment/${postId}`, { content: comment });
        return response.data;
    } catch (error) {
        console.error("Error creating comment:", error);
        throw error;
    }
}   

export { getCommentsByPostId, createComment }  