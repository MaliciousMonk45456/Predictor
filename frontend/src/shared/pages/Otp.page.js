import React,{useState} from "react";
import { useHttp } from "../hooks/useHttp";
import { useForm } from "../hooks/useForm";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Otp = () => {
  const Navigate = useNavigate();
  const email = useLocation().state.email;
  const { isloading, error, sendRequest } = useHttp();
  const [touched, setTouched] = useState(false);
  const [formState, onchangehandler] = useForm({
    otp: "",
    password: { value: "", valid: false },
    formIsValid: false,
  });

  const onsubmithandler = async (event) => {
    event.preventDefault();
    // console.log(formState);
    try {
      await sendRequest(
        // "http://localhost:5000/forgot/verifyotp",
        process.env.REACT_APP_BACKEND_URI + "forgot/verifyotp",
        "POST",
        JSON.stringify({
          email: email,
          otp: formState.otp.value,
          password: formState.password.value,
        }),
        {
          "Content-Type": "application/json",
        }
      );
      Navigate("..");
      // console.log(responseData);
    } catch (err) {
      console.log(err);
    }
  };

  const validator = (password) => {
    return password.match(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/
    );
  };
  return (
    <div>
      {isloading && <h1>Loading...</h1>}
      {!isloading && error && <h1>{error}</h1>}
      {!isloading && !error && (
        <form onSubmit={onsubmithandler}>
          <label htmlFor="Otp">OTP</label>
          <input
            id="otp"
            name="otp"
            onChange={(event) =>
              onchangehandler(
                event.target.id,
                event.target.name,
                event.target.value,
                true
              )
            }
            value={formState.otp.value}
          />
          <label htmlFor="Password">Password</label>
          <input
            id="password"
            name="password"
            onChange={(event) =>
              onchangehandler(
                event.target.id,
                event.target.name,
                event.target.value,
                validator(event.target.value)
              )
            }
            onBlur={() =>setTouched(true)}
            value={formState.password.value}
          />
          {(!formState.password.valid&&touched) && (
            <p>Password must contain atleast 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 special character</p>
          )}
          <button disabled={!formState.formIsValid} type="submit">Verify OTP</button>
        </form>
      )}
    </div>
  );
};

export default Otp;
