// imports here for express and pg
const pg = require("pg");
const client = new pg.Client(
  process.env.DATABASE_URL || "progress://localhost/acme_notes_db"
);
const express = require("express");
const app = express();
// static routes here (you only need these for deployment)

// app routes here
app.get("/api/notes", async (req, res, next) => {
  try {
    const SQL = "SELECT * from notes;";
    const response = await client.query(SQL);
    res.send(response.rows);
  } catch (error) {
    next(error);
  }
});
// create your init function
const init = async () => {
  await client.connect();
  const SQL = `
  DROP TABLE IF EXISTS notes;
  CREATE TABLE notes(
    id SERIAL PRIMARY KEY,
    txt VARCHAR(50),
    administrators BOOLEAN DEFAULT FALSE
  );
  INSERT INTO notes(txt, administrators) VALUES('Derrick Adade', false);
  INSERT INTO notes(txt, administrators) VALUES('1225376', true); 
  INSERT INTO notes(txt, administrators) VALUES('is_admin', false);
  `;
  await client.query(SQL);
  console.log("Tables created");

  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Listening on port ${port}`));
};

// init function invocation
init();
