const express = require("express");
const { connectToDb, getDb } = require("./db");
const { ObjectId } = require("mongodb");

// init app & middleware
const app = express();
app.use(express.json());

// db connection
let db;
connectToDb((err) => {
  if (!err) {
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
    db = getDb();
  }
});

// routes
app.get("/books", (req, res) => {
  let books = [];

  db.collection("books")
    .find()
    .sort({ author: 1 })
    .forEach((book) => books.push(book))
    .then(() => {
      res.status(200).json(books);
    })
    .catch(() => {
      res.status(500).json({ error: "Error fetching books" });
    });
});

app.get("/books/:id", (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    db.collection("books")
      .findOne({ _id: new ObjectId(req.params.id) })
      .then((doc) => {
        if (!doc) {
          return res.status(404).json({ error: "Not a valid document id" });
        }
        res.status(200).json(doc);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: `Error fetching book with id ${req.params.id}` });
      });
  } else {
    res.status(404).json({ error: "Not a valid document id" });
  }
});

app.post("/books", (req, res) => {
  const book = req.body;

  db.collection("books")
    .insertOne(book)
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Could not create a new book" });
    });
});

app.delete("/books/:id", (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    db.collection("books")
      .deleteOne({ _id: new ObjectId(req.params.id) })
      .then((result) => res.status(200).json(result))
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: "Could not delete the document" });
      });
  } else {
    res.status(404).json({ error: "Not a valid document id" });
  }
});

app.patch("/books/:id", (req, res) => {
  const updates = req.body;

  if (ObjectId.isValid(req.params.id)) {
    db.collection("books")
      .updateOne({_id: new ObjectId(req.params.id)}, {$set: updates})
      .then((result) => res.status(200).json(result))
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: "Could not update the document" });
      });
  } else {
    res.status(404).json({ error: "Not a valid document id" });
  }
});
