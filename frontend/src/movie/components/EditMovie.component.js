import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import InputMovie from "./InputMovie.component";
import { useHttp } from "../../shared/hooks/useHttp";
import { useForm } from "../../shared/hooks/useForm";
import ImageUpload from "../../shared/components/ImageUpload.component";

const EditForm = (props) => {
  const navigate = useNavigate();
  const id = useParams().id;
  const [formState, onchangehandler, setformdata] = useForm({
    year: { value: "", valid: false },
    average_rating: { value: "", valid: false },
    image: {
      value: null,
      valid: false,
    },
    genre: [
      { id: 0, name: "action", value: "", valid: false },
      { id: 1, name: "adventure", value: "", valid: false },
      { id: 2, name: "animation", value: "", valid: false },
      { id: 3, name: "childrens", value: "", valid: false },
      { id: 4, name: "comedy", value: "", valid: false },
      { id: 5, name: "crime", value: "", valid: false },
      { id: 6, name: "documentary", value: "", valid: false },
      { id: 7, name: "drama", value: "", valid: false },
      { id: 8, name: "fantasy", value: "", valid: false },
      { id: 9, name: "horror", value: "", valid: false },
      { id: 10, name: "mystery", value: "", valid: false },
      { id: 11, name: "romance", value: "", valid: false },
      { id: 12, name: "scifi", value: "", valid: false },
      { id: 13, name: "thriller", value: "", valid: false },
    ],
    formIsValid: false,
  });
  const [movies, setmovies] = useState(0);
  const { isloading, error, sendRequest } = useHttp();
  //   const [formIsValid, setformIsValid] = useState(false);
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const movie = await sendRequest(`http://localhost:5000/movie/${id}`);
        // console.log("control");
        // console.log(user.genre);
        setformdata(movie);
        setmovies(movie);
      } catch (err) {
        console.log(err);
      }
    };
    fetchMovies();
  }, [sendRequest, id, setformdata]);
  const onsubmithandler = async (event) => {
    event.preventDefault();
    // console.log(formState);
    try {
      const formData = new FormData();
      formData.append("image", formState.image.value);
      const genre = {
        genre: {
          action: formState.genre[0].value,
          adventure: formState.genre[1].value,
          animation: formState.genre[2].value,
          childrens: formState.genre[3].value,
          comedy: formState.genre[4].value,
          crime: formState.genre[5].value,
          documentary: formState.genre[6].value,
          drama: formState.genre[7].value,  
          fantasy: formState.genre[8].value,
          horror: formState.genre[9].value,
          mystery: formState.genre[10].value,
          romance: formState.genre[11].value,
          scifi: formState.genre[12].value,
          thriller: formState.genre[13].value,
        },
      };
      formData.append("genre", JSON.stringify(genre.genre));
      // console.log(formData);
      formData.append("year", formState.year.value);
      formData.append("average_rating", formState.average_rating.value);
      await sendRequest(
        `http://localhost:5000/movie/edit/${id}`,
        "PUT",
        formData
      );
      //   console.log(responseData._id);
      navigate("../movies");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      {isloading && <h1>Loading...</h1>}
      {!isloading && error && <h1>{error}</h1>}
      {!isloading && !error && !!movies && (
        <form onSubmit={onsubmithandler}>
          <InputMovie
            id="year"
            name="year"
            onChange={onchangehandler}
            value={formState.year.value}
            year={true}
            initialvalue={movies.year}
            initialvalid={true}
          />
          <InputMovie
            id="average_rating"
            name="average_rating"
            onChange={onchangehandler}
            value={formState.average_rating.value}
            rating={true}
            initialvalue={movies.average_rating}
            initialvalid={true}
          />
          {formState.genre.map((genre) => (
            <InputMovie
              key={genre.id}
              id={genre.id}
              name={genre.name}
              onChange={onchangehandler}
              value={genre.value}
              // setformValidity={setformIsValid}
              // formvalidity={formIsValid}
              initialvalue={movies.genre[genre.name]}
              initialvalid={true}
            />
          ))}
          <ImageUpload
            id="image"
            errorText="Please select a valid image"
            onInput={onchangehandler}
            initialvalue={movies.image}
            initialvalid={true}
          />
          <button disabled={!formState.formIsValid} type="submit">
            Edit Movie
          </button>
          {/* <button type="submit">Edit User</button> */}
        </form>
      )}
    </div>
  );
};

export default EditForm;
