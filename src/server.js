import express from "express";
import { join } from "path";
import listEndpoints from "express-list-endpoints";
// import experiencesRouter from "./services/experiences/experienceIndex.js"
import profileRouter from "./services/profiles/index.js";
import postRouter from "./services/posts/index.js";
import cors from "cors";
import mongoose from "mongoose";
import Yaml from "yamljs";
import swaggerUiExpress from "swagger-ui-express";

const server = express();
const PORT = process.env.PORT || 3002;

const yamlDocument = Yaml.load(join(process.cwd(), "./src/apiDocs.yml"));

//middlewares
server.use(cors());
server.use(express.json());

//endpoints
// server.use("/experiences", experiencesRouter)
server.use("/profile", profileRouter);
server.use("/post", postRouter);
server.use(
  "/docs",
  swaggerUiExpress.serve,
  swaggerUiExpress.setup(yamlDocument)
);

mongoose.connect(process.env.MONGO_CONNECTION);

mongoose.connection.on("connected", () => {
  console.log("Succesfully connected to Mongo!");

  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.table(listEndpoints(server));
  });
});
