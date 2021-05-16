import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import data from "./rooms.json"

const Room = mongoose.model("Room", {
  id: Number,
  roomName: String,
  numClients: Number,
  // url: String
})

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Room.deleteMany({})
    data.forEach((room) => {
      new Room(room).save()
    })
  }
  seedDatabase()
}

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/rooms"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise



// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 1800
const app = express()

const dotenv = require('dotenv')
dotenv.config()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})

const fetch = require("node-fetch");

// Match the raw body to content type application/json
app.post('/webhook', bodyParser.raw({type: 'application/json'}), async (req, res) => {
  const event = req.body;

  // Handle the event
  if (event.type === 'room.client.joined') {
    console.log("user joined: ", event.data)
    const room = await Room.findOne(roomName)
    console.log(room)
  } else if (event.type === 'room.client.left') {
    console.log("user left: ", event.data)
  } else {
    console.log(`Unhandled event type ${event.type}`)
  }

  // Return a response to acknowledge receipt of the event
  res.json({received: true});
});

app.get("/rooms", async (req, res) => {
  const rooms = await Room.find()
  if (rooms) {
    res.json(rooms)
  } else {
    res.status(404).json({ error: "rooms not found" })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
