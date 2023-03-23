let express = require("express");
let { open } = require("sqlite");

let dataBasePath = require("path");
let path = dataBasePath.join(__dirname, "moviesData.db");

let sqlite3 = require("sqlite3");

let app = express();
app.use(express.json());

let database = null;

let start = async () => {
  try {
    database = await open({
      filename: path,
      driver: sqlite3.Database,
    });

    app.listen(3000, () => {
      console.log("Server Running at http://localhost/3000");
    });
  } catch (e) {
    console.log(`DataBase Error ${e.message}`);
    process.exit(1);
  }
};
start();

//API 1

app.get("/movies/", async (request, response) => {
  try {
    let getAllMoviesList = `
        SELECT
        *
        FROM 
        movies 

      WHERE 
      
      movie_name`;

    let result = await database.all(getAllMoviesList);
    response.send(result);
  } catch (e) {
    console.log(`DataBase Error ${e.message}`);
    process.exit(1);
  }
});

let snakecase_to_camelCase = (DATAbase) => {
  return {
    directorId: DATAbase.director_id,
    movieName: DATAbase.movie_name,
    leadActor: DATAbase.lead_actor,
  };
};

//API 2

app.post("/movies/:movieId", async (request, response) => {
  let { directorId, movieName, leadActor } = request.body;

  try {
    let adding = `
    INSERT INTO
    movie(director_id,movie_name,lead_actor)
    
    VALUES
    (
       '${directorId}',
       ${movieName},
       '${leadActor}',
    );`;
    let result = await database.run(adding);
    let movie_id = result.lastID;
    response.send("Movie Successfully Added");
  } catch (e) {
    console.log(`DataBase eRRor ${e.message}`);
  }
});

//API 3

app.get("/movies/:movieId", async (request, response) => {
  let { directorId, movieName, leadActor } = request.body;

  try {
    let getMovie = `
        SELECT 
        *
        FROM 
        movie

        WHERE
         movie_id = ${movieId};`;

    let a = await DATAbase.get(getMovie);
    response.send(a);
  } catch (e) {
    console.log(`DATABASE ERROR ${e.message}`);
  }
});

//API 4

app.put("/movies/:movieId", async (request, response) => {
  let { movieId } = request.params;

  let { movieNAME } = request.body;

  let { directorId, movieName, leadActor } = movieNAME;

  let updateMovie = `
        UPDATE
         
        movie
       
        SET 

        director_id = '${directorId}',
        movie_name = '${movieNAME}',
        leader_actor = ${lead_actor};`;

  await database.get(updateMovie);
  response.send("Movie Details Updated");
});
//API 5

app.delete("/movies/:movieId", async (request, response) => {
  let { movieId } = request.params;

  try {
    let DELETEbook = `
       
       DELETE 

       FROM
       movie

        WHERE 
        movie_id = ${movieId};`;

    await DATAbase.get(DELETEbook);
    response.send("Movie Removed");
  } catch (e) {
    console.log(`database error ${e.message}`);
  }
});
// API 6//

app.get("/directors/", async (request, response) => {
  try {
    let directorsLIST = `
    SELECT 
    *
    FROM 
    director
    `;
    let x = await DATAbase.get(directorsLIST);
    response.send(x);
  } catch (e) {
    console.log(`DATABASE ERROR ${e.message}`);
  }
});

//API 7

app.get("/directors/:directorId/movies/", async (request, response) => {
  let { directorId } = request.params;

  let { movieName } = request.body;
  try {
    let getMOVIENAME = `
    SELECT 
    *
     FROM
    director
    WHERE 
    director_id =${directorID};`;

    let y = await DATAbase.all(getMOVIENAME);
    response.send(y);
  } catch (e) {
    console.log(`DATAbase error ${e.message}`);
  }
});
