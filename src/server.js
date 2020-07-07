const express = require("express")
const listEndpoints = require("express-list-endpoints")
const cors = require("cors")
const studentsRoute = require("./services/students")
const projectsRoute = require("./services/projects")

const server = express()

server.use(cors())

server.use(express.json())

server.use("/students", studentsRoute)
server.use("/projects", projectsRoute)

console.log(listEndpoints(server))

server.listen(3003, () => {
  console.log("Server running at port 3003")
})
