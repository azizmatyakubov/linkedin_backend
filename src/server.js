import express from "express";
import listendpoints from "express-list-endpoints";
import experiencesRouter from "./experiences/experienceIndex.js";

const server = express();
const PORT = process.env.PORT || 3002;

<<<<<<< Updated upstream
console.log(PORT)


server.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
    console.table(listendpoints(server))
})
=======
server.use("/experiences", experiencesRouter);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.table(listendpoints(server));
});
>>>>>>> Stashed changes
