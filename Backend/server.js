const config = require("./src/config/config");
const app = require("./src/app");
const connectDB = require("./src/db/db");


connectDB();

const port = config.PORT;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});