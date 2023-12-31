const mongoose = require("mongoose");

if (process.argv.length !== 3 && process.argv.length < 5) {
  console.log("give password, name and phonenumber as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://higuchiy0519:${password}@cluster0.8ymdabt.mongodb.net/?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Phonebook", phonebookSchema);

if (process.argv.length >= 5) {
  const name = process.argv[3];
  const phone = process.argv[4];
  const person = new Person({
    name: name,
    number: phone,
  });
  person.save().then((result) => {
    console.log(`added ${name} number ${phone} to phonebook`);
    mongoose.connection.close();
  });
} else {
  console.log("phonebook:");
  Person.find({}).then((persons) => {
    persons.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
}
