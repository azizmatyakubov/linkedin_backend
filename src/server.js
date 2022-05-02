import express from "express";
import listEndpoints from "express-list-endpoints";
import experiencesRouter from "./services/experiences/experienceIndex.js";
import profileRouter from "./services/profiles/index.js";

const server = express();
const PORT = process.env.PORT || 3002;

server.use("/experiences", experiencesRouter);
server.use("/profile", profileRouter);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.table(listEndpoints(server));
});
