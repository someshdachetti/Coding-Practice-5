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

let converted_snakecase_to_camel_case = (dataobject) => {
  return {
    movieId: dataobject.movie_id,
    movieName: dataobject.movie_name,
    directorId: dataobject.director_id,
    leadActor: dataobject.lead_actor,
  };
};

//API 1

app.get("/movies/", async (request, response) => {
  let getmovie = `
    SELECT
   movie_name
    FROM
    movie `;

  const x = await database.all(getmovie);
  response.send(x.map((eachmovie) => ({ movieName: eachmovie.movie_name })));
});

//API 2

app.post("/movies/", async (request, response) => {
  const { directorId, movieName, leadActor } = request.body;
  const postMovieQuery = `
  INSERT INTO
    movie ( director_id, movie_name, lead_actor)
  VALUES
    (${directorId}, '${movieName}', '${leadActor}');`;
  await database.run(postMovieQuery);
  response.send("Movie Successfully Added");
});

//API 3

app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  try {
    const y = `
    SELECT 
    *
    FROM 
    movie

   WHERE
   movie_id = ${movieId};`;

    const a = await database.get(y);
    response.send(converted_snakecase_to_camel_case(a));
  } catch (e) {
    console.log(`DATABAE ${e.message}`);
  }
});

//API 4

app.put("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const { directorId, movieName, leadActor } = request.body;
  try {
    const z = `
    UPDATE movie
    SET
 
     director_id =${directorId},
 
     movie_name = '${movieName}',
  
       lead_actor = '${leadActor}'
    
    WHERE
    movie_id = ${movieId};`;
    await database.run(z);
    response.send("Movie Details Updated");
  } catch (e) {
    console.log(`${e.message}`);
  }
});

//API 5

app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const zz = `
  DELETE FROM
    movie
  WHERE
    movie_id = ${movieId};`;
  await database.run(zz);
  response.send("Movie Removed");
});

//API 6

app.get("/directors/", async (request, response) => {
  const zz = `
    SELECT *
    FROM director;`;

  const a = await database.get(zz);
  response.send(a);
});

app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;

  const yy = `
    SELECT
    movie_name 

    FROM
    movie
    
    WHERE
    director_id = ${directorId};`;

  let aa = await database.all(yy);
  response.send(
    aa.map((eachMOVIEnAME) => ({ movieName: eachMOVIEnAME.movie_name }))
  );
});

module.exports = app;
