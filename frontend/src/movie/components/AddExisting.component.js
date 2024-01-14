import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "../../shared/hooks/useForm";
import { useHttp } from "../../shared/hooks/useHttp";
import InputMovie from "./InputMovie.component";

const AddExisting = () => {
  const navigate = useNavigate();
  const [formState, onchangehandler] = useForm({
    datasetID: { value: "", valid: false },
    formIsValid: false,
  });
  const { isloading, error, sendRequest } = useHttp();
  //   const [formIsValid, setformIsValid] = useState(false);
  const onsubmithandler = async (event) => {
    event.preventDefault();
    // console.log(formState);
    try {
      await sendRequest(
        // "http://localhost:5000/movie/existing",
        process.env.REACT_APP_BACKEND_URI + "/movie/existing",
        "POST",
        JSON.stringify({
          datasetID: formState.datasetID.value,
        }),
        {
          "Content-Type": "application/json",
        }
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
              id="datasetID"
              name="datasetID"
              onChange={onchangehandler}
              value={formState.datasetID.value}
              datasetID={true}
            />
            <button disabled={!formState.formIsValid} type="submit">
              Add Movie
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddExisting;
