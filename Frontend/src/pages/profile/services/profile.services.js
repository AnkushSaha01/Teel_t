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

export { getMe };