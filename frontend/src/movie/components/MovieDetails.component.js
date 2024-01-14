import React from "react";
import Button from "../../shared/components/Button.component";
import { useHttp } from "../../shared/hooks/useHttp";

const MovieDetails = (props) => {
  const { isloading,error,sendRequest } = useHttp();
  const handleClick = async (event) => {
    try {
      const movies = await sendRequest(
        `http://localhost:5000/movie/${props.movie._id}`,
        "DELETE"
      );
      //   console.log(movies.movies);
      props.movieChange(movies.movies);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
    {isloading && <h1>Loading...</h1>}
      {!isloading && error && <h1>{error}</h1>}
      {!isloading && !error && (
        <div>
      <h3>{props.movie._id}</h3>
      <p>
        {props.movie.year} {props.movie.average_rating} {props.movie.datasetID}
      </p>
      <p>
        {props.movie.genre.action} {props.movie.genre.adventure}{" "}
        {props.movie.genre.animation} {props.movie.genre.childrens}{" "}
        {props.movie.genre.comedy} {props.movie.genre.crime}{" "}
        {props.movie.genre.documentary} {props.movie.genre.drama}{" "}
        {props.movie.genre.fantasy} {props.movie.genre.horror}{" "}
        {props.movie.genre.mystery} {props.movie.genre.romance}{" "}
        {props.movie.genre.scifi} {props.movie.genre.thriller}
      </p>
      {props.movie.datasetID === -1 ? (
        <div>
          {!!props.movie.image && (
            <img
              src={"http://localhost:5000/" + props.movie.image}
              alt="preview"
            />
          )}
          <Button link="../editmovie/" text="Edit Movie" id={props.movie._id} />
        </div>
      ) : null}
      <button onClick={handleClick}>Delete Movie</button>
      <Button
        link="../../similar/movie/"
        text="Similar movies to this movie"
        id={props.movie._id}
        datasetID={props.movie.datasetID}
      />
      </div>)}
    </div>
  );
};

export default MovieDetails;
