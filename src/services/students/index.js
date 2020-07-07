const express = require("express")
const fs = require("fs")
const path = require("path")
const uniqid = require("uniqid")
const readFile = require("../utilities")

const router = express.Router()

const studentsPath = path.join(__dirname, "students.json")

router.get("/", (req, res) => {
  const students = readFile(studentsPath)
  if (students.length > 0) {
    res.send(students)
  } else {
    res.status(404).send("We are sorry but we dont have any students yet!")
  }
})

router.get("/:id", (req, res) => {
  const students = readFile(studentsPath)
  if (students.length > 0) {
    const student = students.filter((student) => student.id === req.params.id)
    if (student.length > 0) {
      res.status(200).send(student)
    } else {
      res.status(404).send("We cant find a student with this ID")
    }
  } else {
    res.status(404).send("We are sorry but we dont have any students yet!")
  }
})

router.post("/", (req, res) => {
  newStudent = {
    id: uniqid(),
    ...req.body,
    numberOfProjects: 0,
    createdAt: new Date(),
  }
  const students = readFile(studentsPath)
  students.push(newStudent)
  fs.writeFileSync(studentsPath, JSON.stringify(students))
  res.status(201).send(students)
})

router.post("/checkEmail", (req, res) => {
  newStudent = req.body
  const studentsData = readFile(studentsPath)
  const students = studentsData.filter(
    (student) => student.id !== newStudent.id
  )
  if (students.length > 0) {
    const filteredStudents = students.filter(
      (student) => student.email === newStudent.email
    )
    if (filteredStudents.length > 0) {
      res.status(400).send(false)
    } else {
      res.status(200).send(true)
    }
  } else {
    res.status(200).send(true)
  }
})

router.put("/:id", (req, res) => {
  const students = readFile(studentsPath)
  if (students.length > 0) {
    const filteredStudents = students.filter(
      (student) => student.id !== req.params.id
    )
    const student = { id: req.params.id, ...req.body }

    filteredStudents.push(student)

    fs.writeFileSync(studentsPath, JSON.stringify(filteredStudents))
    res.send(student)
  } else {
    res.status(404).send("We are sorry but we dont have any students yet!")
  }
})

router.delete("/:id", (req, res) => {
  const students = readFile(studentsPath)
  if (students.length > 0) {
    const filteredStudents = students.filter(
      (student) => student.id !== req.params.id
    )
    fs.writeFileSync(studentsPath, JSON.stringify(filteredStudents))
    res.send("That student was deleted!")
  } else {
    res.status(404).send("We are sorry but we dont have any students yet!")
  }
})

router.get("/:id/projects", (req, res) => {
  const projects = readFile(path.join(__dirname, "../projects/projects.json"))

  res.send(projects.filter((proj) => proj.studentID === req.params.id))
})

module.exports = router
