import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Input from "./Input.component";
import { useHttp } from "../../shared/hooks/useHttp";
import { useForm } from "../../shared/hooks/useForm";
import ImageUpload from "../../shared/components/ImageUpload.component";
import { AuthContext } from "../../shared/context/auth.context";

const EditForm = (props) => {
  const { userId, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formState, onchangehandler, setformdata] = useForm({
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
  const [user, setuser] = useState(0);
  const { isloading, error, sendRequest } = useHttp();
  //   const [formIsValid, setformIsValid] = useState(false);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const user = await sendRequest(
          `http://localhost:5000/user/${userId}`,
          // process.env.REACT_APP_BACKEND_URI + "/user/" + userId,
          "GET",
          null,
          {
            Authorization: "Bearer " + token,
          }
        );
        // console.log("control");
        // console.log(user.image);
        setformdata(user);
        setuser(user);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUsers();
  }, [sendRequest, userId, setformdata, token]);
  const onsubmithandler = async (event) => {
    event.preventDefault();
    // console.log(formState);
    try {
      const formData = new FormData();
      // console.log(formState.image.value);
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
      const responseData = await sendRequest(
        `http://localhost:5000/user/edit/${props.id}`,
        // process.env.REACT_APP_BACKEND_URI + "/user/edit/" + props.id,
        "PUT",
        formData,
        {
          Authorization: "Bearer " + token,
        }
      );
      //   console.log(responseData._id);
      navigate(`../user/${responseData._id}`, {
        state: { id: responseData._id },
      });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      {isloading && <h1>Loading...</h1>}
      {!isloading && error && <h1>{error}</h1>}
      {!isloading && !error && !!user && (
        <form onSubmit={onsubmithandler}>
          {formState.genre.map((genre) => (
            <Input
              key={genre.id}
              id={genre.id}
              name={genre.name}
              onChange={onchangehandler}
              value={genre.value}
              // setformValidity={setformIsValid}
              // formvalidity={formIsValid}
              initialvalue={user[genre.name]}
              initialvalid={true}
            />
          ))}
          <ImageUpload
            id="image"
            errorText="Please select a valid image"
            onInput={onchangehandler}
            initialvalue={user.image}
            initialvalid={true}
          />
          <button disabled={!formState.formIsValid} type="submit">
            Edit User
          </button>
          {/* <button type="submit">Edit User</button> */}
        </form>
      )}
    </div>
  );
};

export default EditForm;
