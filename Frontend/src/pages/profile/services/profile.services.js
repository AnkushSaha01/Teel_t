import axios from "axios";

const getMe = async ({ backURI }) => {
    try {
        const { data } = await axios.get(`${backURI}/user/get-me`, {
            withCredentials: true,
        });
        return data.user;
    } catch (error) {
        console.error("Error fetching profile:", error);
        throw error;
    }
}

const updateProfile = async ({ backURI, profileData }) => {
    try {
        const { data } = await axios.put(`${backURI}/user/update-profile`, profileData, {
            withCredentials: true,
        });
        return data.user;
    } catch (error) {
        console.error("Error updating profile:", error);
        throw error;
    }
}

const getUserById = async ({ backURI, userId }) => {
    try {
        const { data } = await axios.get(`${backURI}/user/get-user/${userId}`, {
            withCredentials: true,
        });
        return data.user;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
}

const logoutUser = async ({ backURI }) => {
    try {
        await axios.post(
            `${backURI}/auth/user/logout`,
            {},
            { withCredentials: true }
        );
    } catch (error) {
        console.error("Error logging out:", error);
        throw error;
    }
}

const getUserPosts = async ({ backURI, authorId }) => {
    try {
        const { data } = await axios.get(`${backURI}/post/get-post?authorId=${authorId}&limit=3`, {
            withCredentials: true,
        });
        return data.posts;
    } catch (error) {
        console.error("Error fetching user posts:", error);
        throw error;
    }
}

const deletePostApi = async ({ backURI, postId }) => {
    try {
        const { data } = await axios.delete(`${backURI}/post/delete-post/${postId}`, {
            withCredentials: true,
        });
        return data;
    } catch (error) {
        console.error("Error deleting post:", error);
        throw error;
    }
}

const updatePostApi = async ({ backURI, postId, title, content }) => {
    try {
        const { data } = await axios.put(`${backURI}/post/update-post/${postId}`, { title, content }, {
            withCredentials: true,
        });
        return data.post;
    } catch (error) {
        console.error("Error updating post:", error);
        throw error;
    }
}

const getPicklistApi = async ({ backURI, userId }) => {
    try {
        const { data } = await axios.get(`${backURI}/picklist/get?userId=${userId}`, {
            withCredentials: true,
        });
        return data.picklist;
    } catch (error) {
        console.error("Error fetching picklists:", error);
        throw error;
    }
}

const createPicklistApi = async ({ backURI, picklistData }) => {
    try {
        const { data } = await axios.post(`${backURI}/picklist/create`, picklistData, {
            withCredentials: true,
        });
        return data.picklistItem;
    } catch (error) {
        console.error("Error creating picklist:", error);
        throw error;
    }
}

const deletePicklistApi = async ({ backURI, picklistId }) => {
    try {
        const { data } = await axios.delete(`${backURI}/picklist/delete/${picklistId}`, {
            withCredentials: true,
        });
        return data;
    } catch (error) {
        console.error("Error deleting picklist item:", error);
        throw error;
    }
}

const updatePicklistApi = async ({ backURI, picklistId, title, description, category }) => {
    try {
        const { data } = await axios.put(`${backURI}/picklist/update/${picklistId}`, { title, description, category }, {
            withCredentials: true,
        });
        return data.picklistItem;
    } catch (error) {
        console.error("Error updating picklist item:", error);
        throw error;
    }
}

export { 
    getMe, 
    updateProfile, 
    getUserById, 
    logoutUser, 
    getUserPosts, 
    deletePostApi, 
    updatePostApi,
    getPicklistApi,
    createPicklistApi,
    deletePicklistApi,
    updatePicklistApi
};