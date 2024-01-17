import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useHttp } from "../../shared/hooks/useHttp";
import Button from "../components/Button.component";
import Loginform from "../components/Login.component";
import { GoogleLogin } from "@react-oauth/google";
// import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../../shared/context/auth.context";

const Login = () => {
  const { login } = useContext(AuthContext);

  const navigate = useNavigate();
  const { isloading, error, sendRequest } = useHttp();
  const googleSuccess = async (response) => {
    try {
    //   console.log(jwtDecode(response.credential));
      const responseData = await sendRequest(
        // "http://localhost:5000/googlelogin",
        process.env.REACT_APP_BACKEND_URI + "googlelogin",
        "POST",
        JSON.stringify({
          tokenId: response.credential,
        }),
        {
          "Content-Type": "application/json",
        }
      );
      navigate("/");
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
  const googleFailure = (error) => {
    console.log(error);
    console.log("Error please try again");
  };
  return (
    <div>
      {isloading && <h1>Loading...</h1>}
      {!isloading && error && <h1>{error}</h1>}
      {!isloading && !error && (
        <div>
          <h1>Login</h1>
          <Loginform />
          <Button link="/register" text="New user?" />
          <GoogleLogin
            buttonText="Login"
            onSuccess={googleSuccess}
            onFailure={googleFailure}
            cookiePolicy={"single_host_origin"}
          />
        </div>
      )}
    </div>
  );
};

export default Login;
