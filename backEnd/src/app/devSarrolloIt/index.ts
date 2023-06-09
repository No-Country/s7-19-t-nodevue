import { resolve } from "node:path"

import cors from "cors"
import dotenv from "dotenv"
import express, { json, urlencoded } from "express"

import { connectToDatabase } from "../../config/connectToDatabase"
import { errorHandler } from "../shared/framework/middleware/errorHandler"

import helmet from "helmet"
import { disconnect } from "mongoose"
import { mainRouter } from "./routers"

dotenv.config({ path: resolve(__dirname, "../../../.env") })

const missing = ["PORT", "DB_URI", "JWT_PASS"].filter(
  (env) => !process.env[env],
)

if (missing.length) {
  throw new Error(`Missing environment variables: ${missing.join(", ")}.`)
}

connectToDatabase()

const app = express()

const port = process.env.PORT

app.use(helmet())

app.use(cors())
app.use(json())
app.use(urlencoded({ extended: true }))
app.use("/api", mainRouter)

app.use(errorHandler)

const server = app.listen(port, () => {
  console.info(`server run on port http://localhost:${port}/api`)
})

const shutdown = () => {
  console.log("Closing http server.")

  server.close(() => {
    console.log("Http server closed. Closing MongoDB connection.")

    disconnect(() => {
      console.log("MongoDB connection closed.")

      process.exit(0)
    })
  })
}

const signals = ["SIGINT", "SIGTERM"]
signals.forEach((signal) => {
  process.on(signal, shutdown)
})
