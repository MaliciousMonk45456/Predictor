import React from "react";
import { useHttp } from "../hooks/useHttp";
import { useForm } from "../hooks/useForm";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const Navigate = useNavigate();
  const { isloading, error, sendRequest } = useHttp();
  const [formState, onchangehandler] = useForm({
    email: { value: "", valid: false },
    formIsValid: false,
  });

  const onsubmithandler = async (event) => {
    event.preventDefault();
    // console.log(formState);
    try {
      await sendRequest(
        "http://localhost:5000/forgot/sendotp",
        // process.env.REACT_APP_BACKEND_URI + "/forgot/sendotp",
        "POST",
        JSON.stringify({
          email: formState.email.value,
        }),
        {
          "Content-Type": "application/json",
        }
      );
      Navigate("../otp", { state: { email: formState.email.value } });
      // console.log(responseData);
    } catch (err) {
      console.log(err);
    }
  };
  const checkvalidity = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
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
              onchangehandler("email", "email", event.target.value,checkvalidity(event.target.value))
            }
            value={formState.email.value}
          />
          <button disabled={!formState.formIsValid} type="submit">
            Send OTP
          </button>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
