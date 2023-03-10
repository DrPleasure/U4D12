import express from "express"
import listEndpoints from "express-list-endpoints"
import cors from "cors"
import mongoose from "mongoose"
import postsRouter from "./api/posts/index.js"
import usersRouter from "./api/users/index.js"
import passport from "passport"
import googleStrategy from "./lib/auth/google.js"
import {
  forbiddenErrorHandler,
  genericErroHandler,
  notFoundErrorHandler,
  unauthorizedErrorHandler,
} from "./errorHandlers.js"

const server = express()
const port = process.env.PORT || 3001

passport.use("google", googleStrategy)

// ******************************* MIDDLEWARES ****************************************
server.use(cors())
server.use(express.json())

// ******************************** ENDPOINTS *****************************************
server.use("/posts", postsRouter)
server.use("/users", usersRouter)

// ***************************** ERROR HANDLERS ***************************************
server.use(notFoundErrorHandler)
server.use(unauthorizedErrorHandler)
server.use(forbiddenErrorHandler)
server.use(genericErroHandler)



mongoose.connect(process.env.MONGO_URL)

mongoose.connection.on("connected", () => {
  console.log("Successfully connected to Mongo!")
  server.listen(port, () => {
    console.table(listEndpoints(server))
    console.log(`Server is running on port ${port}`)
  })
})