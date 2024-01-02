require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const app = express();
const Person = require("./models/phone");

const unknownEndpoint = (req, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(express.json());
app.use(cors());
app.use(express.static("build"));
app.use(express.static("dist"));
//app.use(morgan("tiny"));

morgan.token("body", function (req, res) {
  if (req.method == "POST") {
    return JSON.stringify({ name: req.body.name, number: req.body.number });
  }
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.get("/", (req, res) => {
  res.send("<h1>Phonebook application</h1>");
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get("/info", (req, res) => {
  Person.find({}).then((persons) => {
    const num = persons.length;
    const timestamp = new Date();
    res.send(`<p>Phonebook has info for ${num} people<br />${timestamp}</p>`);
  });
});

app.post("/api/persons", (req, response) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number is missing",
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

app.get("/api/persons/:id", (req, response) => {
  Person.findById(req.params.id).then((person) => {
    response.json(person);
  });
});

app.delete("/api/persons/:id", (req, response) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.use(unknownEndpoint);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
