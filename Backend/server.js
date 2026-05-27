const config = require("./src/config/config");
const app = require("./src/app");
const connectDB = require("./src/db/db");
const initSocket = require("./src/socket/app.socket");
const { createServer } = require("http");


connectDB();

const httpServer = createServer(app);
initSocket(httpServer);


const port = config.PORT;

httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
