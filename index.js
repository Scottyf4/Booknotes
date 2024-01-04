import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import pg from "pg";

const app = express();
const port = 3000;
const API_URL = "https://covers.openlibrary.org/b/ISBN/1594130078-M.jpg";

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "bookNotes",
  password: "Creaks1981",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [];
let stars = [];




app.get("/", async (req, res) => {
    try {
        const results = await db.query("SELECT * FROM books ORDER BY publish_year ASC");
        items = results.rows;
        stars = results.rows.star_rating;
        console.log(items);
        
        
        res.render("index.ejs", {
          allitems: items,
      });
      } catch (err) {
        console.log(err)
      }
});



app.post("/sort", async (req, res) => {
  
  const response = req.body.filterType;
  
  
  
  try {
    if (response === "star_rating ASC"){
      const request = await db.query("SELECT * FROM books ORDER BY star_rating ASC");
      items = request.rows;
    } else if (response === "star_rating DESC") {
      const request = await db.query("SELECT * FROM books ORDER BY star_rating DESC");
      items = request.rows;
    } else if (response === "publish_year ASC") {
      const request = await db.query("SELECT * FROM books ORDER BY publish_year ASC");
      items = request.rows;
    } else if (response === "publish_year DESC") {
      const request = await db.query("SELECT * FROM books ORDER BY publish_year DESC");
      items = request.rows;
    } else if (response === "book_name ASC") {
      const request = await db.query("SELECT * FROM books ORDER BY book_name ASC");
      items = request.rows;
    } else if (response === "book_name DESC"){
      const request = await db.query("SELECT * FROM books ORDER BY book_name DESC");
      items = request.rows;
    }
    
    res.render("index.ejs", {
      allitems: items,
    });
  } catch (err) {
    console.log(err)
  }
});

app.post("/review", async (req, res) => {
  try {
    res.render("review.ejs")
  } catch (err){
    console.log(err)
  }
});

app.post("/submit", async (req, res) => {

  const title = req.body.booktitle;
  const isbn = req.body.bookisbn;
  const author = req.body.bookauthor;
  const year = req.body.bookpublished;
  const review = req.body.bookreview;
  const star = req.body.starrating;
  
  try {
    await db.query("INSERT INTO books (book_name, isbn, publish_year, author, review, star_rating ) VALUES ($1, $2, $3, $4, $5, $6)",[title, isbn, year, author, review, star]);
    
    res.redirect("/");
     
  } catch (err) {
    console.log(err);
  }  

});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
  