const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();

// const requestLogger = (request, response, next) => {
//   console.log("Method:", request.method);
//   console.log("Path:  ", request.path);
//   console.log("Body:  ", request.body);
//   console.log("---");
//   next();
// };
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(express.json());
app.use(cors());
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

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (req, res) => {
  res.send("<h1>Phonebook application</h1>");
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/info", (req, res) => {
  const num = persons.length;
  const timestamp = new Date();
  res.send(`<p>Phonebook has info for ${num} people<br />${timestamp}</p>`);
});

const generateId = () => {
  return Math.floor(Math.random() * 100000000);
};

app.post("/api/persons", (req, response) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number is missing",
    });
  }

  if (persons.find((person) => person.name === body.name)) {
    return response.status(409).json({
      error: "name must be unique",
    });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };
  persons = persons.concat(person);

  response.json(person);
});

app.get("/api/persons/:id", (req, response) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, response) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});
app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
