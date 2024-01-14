import React, { useEffect, useState, useContext } from "react";
import { useHttp } from "../../shared/hooks/useHttp";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "../../shared/components/Button.component";
import { AuthContext } from "../../shared/context/auth.context";

const Users = () => {
  const { isloading, error, sendRequest } = useHttp();
  const { userId, token } = useContext(AuthContext);
  const [users, setusers] = useState();
  const [img, setimg] = useState();
  let location = useLocation();
  const state = location.state;
  const id = state.id;
  // console.log("id" + id);
  // console.log("userId" + userId);
  let navigate = useNavigate();
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const user = await sendRequest(
          `http://localhost:5000/user/${userId}`,
          "GET",
          null,
          {
            Authorization: "Bearer " + token,
          }
        );
        // console.log("control");
        // console.log(user);
        setusers(user);
        // console.log(user.image)
        setimg(user.image);
      } catch (err) {
        console.log(err);
      }
    };
    if (!!userId) {
      fetchUsers();
    }
  }, [sendRequest, userId, token]);

  const handleClick = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(`http://localhost:5000/user/${id}`, "DELETE", null, {
        Authorization: "Bearer " + token,
      });
      //   console.log(responseData);
      navigate("../");
    } catch (err) {
      console.log(err);
    }
  };
  
  return (
    <div>
      {isloading && <h1>Loading...</h1>}
      {!isloading && error && <h1>{error}</h1>}
      {!isloading && !error && !!img && (
        <div>
          <img src={`http://localhost:5000/${img}`} alt="Preview" />
          {JSON.stringify(users)}
          <Button link="../../edituser/" text="Edit User Genre" id={id} />
          <button onClick={handleClick}>Delete User Genre</button>
          <Button
            link="../../predicted/user/"
            text="Predicted Movies for user"
            id={id}
          />
        </div>
      )}
    </div>
  );
};

export default Users;
