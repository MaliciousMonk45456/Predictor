import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import InputMovie from "../../movie/components/InputMovie.component";
import { useHttp } from "../../shared/hooks/useHttp";
import { useForm } from "../../shared/hooks/useForm";
import { AuthContext } from "../../shared/context/auth.context";

const RegisterForm = (props) => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formState, onchangehandler] = useForm({
    email: { value: "", valid: false },
    password: { value: "", valid: false },
    name: { value: "", valid: false },
    formIsValid: false,
  });
  const { isloading, error, sendRequest } = useHttp();
  //   const [formIsValid, setformIsValid] = useState(false);
  const onsubmithandler = async (event) => {
    event.preventDefault();
    // console.log(formState);
    try {
      const responseData = await sendRequest(
        "http://localhost:5000/register",
        // process.env.REACT_APP_BACKEND_URI + "/register",
        "POST",
        JSON.stringify({
          email: formState.email.value,
          password: formState.password.value,
          name: formState.name.value,
        }),
        {
          "Content-Type": "application/json",
        },
      );  
      navigate(`..`);
      login(responseData.Authuser, responseData.token,false,null);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      {isloading && <h1>Loading...</h1>}
      {!isloading && error && <h1>{error}</h1>}
      {!isloading && !error && (
        <form onSubmit={onsubmithandler}>
          <InputMovie
            id="email"
            name="email"
            onChange={onchangehandler}
            value={formState.email.value}
            email={true}
            // setformValidity={setformIsValid}
            // formvalidity={formIsValid}
          />
          <InputMovie
            id="password"
            name="password"
            onChange={onchangehandler}
            value={formState.password.value}
            password={true}
            // setformValidity={setformIsValid}
            // formvalidity={formIsValid}
          />
          <InputMovie
            id="name"
            name="name"
            onChange={onchangehandler}
            value={formState.name.value}
            username={true}
            // setformValidity={setformIsValid}
            // formvalidity={formIsValid}
          />

          <button disabled={!formState.formIsValid} type="submit">
            Register
          </button>
        </form>
      )}
    </div>
  );
};

export default RegisterForm;
