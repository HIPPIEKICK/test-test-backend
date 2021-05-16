import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

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

// const API_KEY = "YOUR_API_KEY";
// console.log(new Date(Date.now()))
const data = {
  isLocked: true,
  roomNamePrefix: "/matilda",
  roomNamePattern: "human-short",
  startDate: new Date(Date.now()),
  endDate: "3022-05-15T13:56:00.000Z",
  fields: ["hostRoomUrl"],
};

function getResponse() {
    return fetch("https://api.whereby.dev/v1/meetings", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${process.env.API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
}

getResponse().then(async res => {
    console.log("Status code:", res.status);
    const data = await res.json();
    console.log("Room URL:", data.roomUrl);
    console.log("Host room URL:", data.hostRoomUrl);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
