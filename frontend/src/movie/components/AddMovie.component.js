import React from "react";
import { useNavigate } from "react-router-dom";
import InputMovie from "./InputMovie.component";
import { useHttp } from "../../shared/hooks/useHttp";
import { useForm } from "../../shared/hooks/useForm";
import Button from "../../shared/components/Button.component";
import ImageUpload from "../../shared/components/ImageUpload.component";

const AddForm = (props) => {
  const navigate = useNavigate();
  const [formState, onchangehandler] = useForm({
    year: { value: "", valid: false },
    average_rating: { value: "", valid: false },
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
    image: {
      value: null,
      valid: false,
    },
    formIsValid: false,
  });
  const { isloading, error, sendRequest } = useHttp();
  //   const [formIsValid, setformIsValid] = useState(false);
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
        // "http://localhost:5000/movie/new",
        process.env.REACT_APP_BACKEND_URI + "movie/new",
        "POST",
        formData,
      );
      // console.log(responseData);
      navigate("../movies");
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
          <form onSubmit={onsubmithandler}>
            <InputMovie
              id="year"
              name="year"
              onChange={onchangehandler}
              value={formState.year.value}
              year={true}
            />
            <InputMovie
              id="average_rating"
              name="average_rating"
              onChange={onchangehandler}
              value={formState.average_rating.value}
              rating={true}
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
              />
            ))}
            <ImageUpload
              id="image"
              onInput={onchangehandler}
              errorText="Please select a valid image"
            />
            <button disabled={!formState.formIsValid} type="submit">
              Add Movie
            </button>
          </form>
          <Button link="../addmovie/existing" text="Add existing movie" />
        </div>
      )}
    </div>
  );
};

export default AddForm;
