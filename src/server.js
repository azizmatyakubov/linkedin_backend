import express from "express"
import listendpoints from "express-list-endpoints"
import profileRouter from "./services/profiles/index.js"
import cors from "cors"
import mongoose from "mongoose"

const server = express()
const PORT = process.env.PORT || 3002



server.use(cors())
server.use(express.json())

server.use("/profile", profileRouter)

mongoose.connect(process.env.MONGO_CONNECTION)

mongoose.connection.on("connected", () => {
  console.log("Succesfully connected to Mongo!")

  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    console.table(listendpoints(server))
  })
})
