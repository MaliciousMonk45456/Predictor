import React, { useEffect, useState } from "react";
import { useHttp } from "../../shared/hooks/useHttp";
import MovieDetails from "../components/MovieDetails.component";

const Movies = () => {
  const { isloading, error, sendRequest } = useHttp();
  const [movies, setmovies] = useState();
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const movie = await sendRequest(process.env.REACT_APP_BACKEND_URI + "movie");
        // const movie = await sendRequest("http://localhost:5000/movie");
        // console.log(user);
        setmovies(movie);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUsers();
  }, [sendRequest]);

  return (
    <div>
      {isloading && <h1>Loading...</h1>}
      {!isloading && error && <h1>{error}</h1>}
      {!isloading && !error&& !!movies && (
        <div>
          {movies?.map((movie) => {
            return (
              <MovieDetails
                key={movie._id}
                movie={movie}
                movieChange={setmovies}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Movies;
