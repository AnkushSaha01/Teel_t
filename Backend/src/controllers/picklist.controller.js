const ogs = require("open-graph-scraper");
const PickList = require("../models/picklist.model");

const CreatePickList = async (req, res) => {
    try {
        const { item, category, title, description } = req.body;
        const userId = req.user._id;

        if (!item || !category || !title) {
            return res.status(400).json({ message: "URL, category, and title are required" });
        }

        // Validate category
        const validCategories = ['Outfit', 'Makeup', 'Hair', 'Shoes', 'Accessories', 'Other'];
        if (!validCategories.includes(category)) {
            return res.status(400).json({ message: "Invalid category" });
        }

        let iconUrl = "https://ik.imagekit.io/bvd7qjtev/man-user-circle-icon.png"; // default fallback

        try {
            const options = { url: item, timeout: 5000 };
            const { error, result } = await ogs(options);
            if (!error && result && result.favicon) {
                // If result.favicon is relative, convert to absolute using URL origin
                if (result.favicon.startsWith("http")) {
                    iconUrl = result.favicon;
                } else {
                    const parsedUrl = new URL(item);
                    iconUrl = `${parsedUrl.origin}${result.favicon.startsWith("/") ? "" : "/"}${result.favicon}`;
                }
            } else {
                // Fallback using Google S2 Favicon API
                const parsedUrl = new URL(item);
                iconUrl = `https://www.google.com/s2/favicons?domain=${parsedUrl.hostname}&sz=128`;
            }
        } catch (scrapeError) {
            console.error("Open Graph scraper error, using fallback:", scrapeError);
            try {
                const parsedUrl = new URL(item);
                iconUrl = `https://www.google.com/s2/favicons?domain=${parsedUrl.hostname}&sz=128`;
            } catch (urlError) {
                // Keep the default fallback iconUrl
            }
        }

        const picklistItem = await PickList.create({
            user: userId,
            item,
            category,
            title,
            description,
            icon: iconUrl
        });

        res.status(201).json({ message: "Picklist item created successfully", picklistItem });
    } catch (error) {
        console.error("Create Picklist Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const GetPickList = async (req, res) => {
    try {
        const userId = req.query.userId || req.user._id;
        const picklist = await PickList.find({ user: userId }).sort({ createdAt: -1 });
        res.status(200).json({ message: "Picklist fetched successfully", picklist });
    } catch (error) {
        console.error("Get Picklist Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const DeletePickList = async (req, res) => {
    try {
        const { id } = req.params;
        const currentUserId = req.user._id;

        const picklist = await PickList.findById(id);
        if (!picklist) {
            return res.status(404).json({ message: "Picklist item not found" });
        }

        // Verify if logged-in user is the owner
        if (picklist.user.toString() !== currentUserId.toString()) {
            return res.status(403).json({ message: "Unauthorized to delete this picklist item" });
        }

        await PickList.findByIdAndDelete(id);

        res.status(200).json({ message: "Picklist item deleted successfully" });
    } catch (error) {
        console.error("Delete Picklist Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const UpdatePickList = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, category } = req.body;
        const currentUserId = req.user._id;

        if (!title || !category) {
            return res.status(400).json({ message: "Title and category are required" });
        }

        // Validate category
        const validCategories = ['Outfit', 'Makeup', 'Hair', 'Shoes', 'Accessories', 'Other'];
        if (!validCategories.includes(category)) {
            return res.status(400).json({ message: "Invalid category" });
        }

        const picklist = await PickList.findById(id);
        if (!picklist) {
            return res.status(404).json({ message: "Picklist item not found" });
        }

        // Verify if logged-in user is the owner
        if (picklist.user.toString() !== currentUserId.toString()) {
            return res.status(403).json({ message: "Unauthorized to update this picklist item" });
        }

        const updatedPicklist = await PickList.findByIdAndUpdate(
            id,
            { $set: { title, description, category } },
            { new: true }
        );

        res.status(200).json({ message: "Picklist item updated successfully", picklistItem: updatedPicklist });
    } catch (error) {
        console.error("Update Picklist Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = { CreatePickList, GetPickList, DeletePickList, UpdatePickList };
