import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AddUser from "./user/pages/AddUser.page";
import Main from "./user/pages/Main.page";
import Users from "./user/pages/Users.page";
import EditUser from "./user/pages/EditUser.page";
import PredictedUser from "./user/pages/PredictedUser.page";
import AddMovie from "./movie/pages/AddMovie.page";
import Movies from "./movie/pages/Movies.page";
import AddMovieExisting from "./movie/pages/AddMovieExisting.page";
import EditMovie from "./movie/pages/EditMovie.page";
import PredictedMovie from "./movie/pages/PredictedMovie.page";
import { AuthContext } from "./shared/context/auth.context";
import Login from "./shared/pages/Login.page";
import Register from "./shared/pages/Register.page";
import { useAuth } from "./shared/hooks/useAuth";
import ForgotPassword from "./shared/pages/ForgotPassword.page";
import Otp from "./shared/pages/Otp.page";
import AddFile from "./user/pages/AddFile.page";

import "./App.css";
import React from "react";

require("dotenv").config();

function App() {
  const { token, login, logout, userId, setterpayment, payment } = useAuth();
  console.log(process.env.REACT_APP_GOOGLE_CLIENT_ID)
  let routes;
  if (token && payment) {
    routes = (
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/addfile" element={<AddFile />} />
        <Route path="/adduser" element={<AddUser />} />
        <Route path="/user/:id" element={<Users />} />
        <Route path="/edituser/:id" element={<EditUser />} />
        <Route path="/predicted/user/:id" element={<PredictedUser />} />
        <Route path="/addmovie" element={<AddMovie />} />
        <Route path="/addmovie/existing" element={<AddMovieExisting />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/editmovie/:id" element={<EditMovie />} />
        <Route path="/similar/movie/:id" element={<PredictedMovie />} />
      </Routes>
    );
  } else if (token && !payment) {
    routes = (
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/addmovie" element={<AddMovie />} />
        <Route path="/addmovie/existing" element={<AddMovieExisting />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/editmovie/:id" element={<EditMovie />} />
        <Route path="/similar/movie/:id" element={<PredictedMovie />} />
      </Routes>
    );
  } else {
    routes = (
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/otp" element={<Otp />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/addmovie" element={<AddMovie />} />
        <Route path="/addmovie/existing" element={<AddMovieExisting />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/editmovie/:id" element={<EditMovie />} />
        <Route path="/similar/movie/:id" element={<PredictedMovie />} />

        <Route path="*" element={<Main />} />
      </Routes>
    );
  }
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <Router>
        <AuthContext.Provider
          value={{
            isLoggedIn: !!token,
            token: token,
            userId: userId,
            login: login,
            logout: logout,
            setterpayment: setterpayment,
            payment: payment,
          }}
        >
          <main>{routes}</main>
        </AuthContext.Provider>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
