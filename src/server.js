import express from 'express'
import { append } from 'express/lib/response'

const server = express()
const PORT = process.env.PORT || 3002



server.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`)
})

