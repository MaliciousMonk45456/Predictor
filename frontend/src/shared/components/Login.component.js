import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useHttp } from "../../shared/hooks/useHttp";
import { useForm } from "../../shared/hooks/useForm";
import { AuthContext } from "../../shared/context/auth.context";

const Loginform = (props) => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formState, onchangehandler] = useForm({
    email: { value: "", valid: false },
    password: { value: "", valid: false },
  });
  const { isloading, error, sendRequest } = useHttp();
  //   const [formIsValid, setformIsValid] = useState(false);
  const onsubmithandler = async (event) => {
    event.preventDefault();
    // console.log(formState);
    try {
      const responseData = await sendRequest(
        // "http://localhost:5000/login",
        "https://predictor-backend.vercel.app/login",
        // process.env.REACT_APP_BACKEND_URI + "/login",
        "POST",
        JSON.stringify({
          email: formState.email.value,
          password: formState.password.value,
        }),
        {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        }
      );
      //   console.log(responseData);
      navigate(`..`);
      login(
        responseData.Authuser,
        responseData.token,
        false,
        responseData.payment
      );
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
          <label htmlFor="Email">Email</label>
          <input
            name="email"
            onChange={(event) =>
              onchangehandler("email", "email", event.target.value, true)
            }
            value={formState.email.value}
          />
          <label htmlFor="Password">Password</label>
          <input
            name="password"
            onChange={(event) =>
              onchangehandler("password", "password", event.target.value, true)
            }
            value={formState.password.value}
          />
          <button type="submit">Login</button>
        </form>
      )}
    </div>
  );
};

export default Loginform;
