const express = require("express")
const fs = require("fs")
const path = require("path")
const uniqid = require("uniqid")
const readFile = require("../utilities")

const router = express.Router()

const projectsFilePath = path.join(__dirname, "projects.json")

router.get("/", (req, res) => {
  const projects = readFile(projectsFilePath)
  if (projects.length > 0) {
    res.send(projects)
  } else {
    res.status(404).send("The list of projects is empty!")
  }
})

router.get("/:id", (req, res) => {
  const projects = readFile(projectsFilePath)
  const project = projects.find((project) => project.id === req.params.id)
  if (project) {
    res.status(200).send(project)
  } else {
    res.status(404).send(`Project with id ${req.params.id} not found!`)
  }
})

router.post("/", (req, res) => {
  newProject = { id: uniqid(), ...req.body }
  const projects = readFile(projectsFilePath)
  projects.push(newProject)
  fs.writeFileSync(projectsFilePath, JSON.stringify(projects))

  const studentsFilePath = path.join(__dirname, "../students/students.json")
  const students = readFile(studentsFilePath)

  const selectedStudent = students.find(
    (student) => student.id === newProject.studentID
  )
  selectedStudent.numberOfProjects += 1
  const filteredStudents = students.filter(
    (student) => student.id !== newProject.studentID
  )
  filteredStudents.push(selectedStudent)
  fs.writeFileSync(studentsFilePath, JSON.stringify(filteredStudents))
  res.status(201).send(projects)
})

router.put("/:id", (req, res) => {
  const projects = readFile(projectsFilePath)
  const filteredprojects = projects.filter(
    (project) => project.id !== req.params.id
  )
  if (filteredprojects.length > 0) {
    const project = { id: req.params.id, ...req.body, createdAt: new Date() }

    filteredprojects.push(project)

    fs.writeFileSync(projectsFilePath, JSON.stringify(filteredprojects))
    res.send(project)
  } else {
    res.status(404).send(`Project with id ${req.params.id} not found!`)
  }
})

router.delete("/:id", (req, res) => {
  const projects = readFile(projectsFilePath)
  const filteredprojects = projects.filter(
    (project) => project.id !== req.params.id
  )
  if (filteredprojects.length > 0) {
    fs.writeFileSync(projectsFilePath, JSON.stringify(filteredprojects))
    res.send("Deletion successful!")
  } else {
    res.status(404).send(`Project with id ${req.params.id} not found!`)
  }
})

module.exports = router
