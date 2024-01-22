import React, { useContext, useState } from "react";
import { useHttp } from "../../shared/hooks/useHttp";
import { AuthContext } from "../../shared/context/auth.context";
import { useNavigate } from "react-router-dom";

const JoinRoom = ({ socket }) => {
  const navigate = useNavigate();
  const { userId, token } = useContext(AuthContext);
  const [roomId, setroomId] = useState("");
  const [formIsValid, setformIsValid] = useState(false);
  const { isloading, error, sendRequest } = useHttp();

  console.log("userId" + userId);

  const onsubmithandler = async (event) => {
    event.preventDefault();
    // console.log(formState);
    try {
      if (formIsValid) {
        socket.emit("join-room", { roomId, userId });
      }
      navigate("/chat", { replace: true });
      // console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  const onchangehandler = (event) => {
    setroomId(event.target.value);
    setformIsValid(true);
  };

  return (
    <div>
      {isloading && <h1>Loading...</h1>}
      {!isloading && error && <h1>{error}</h1>}
      {!isloading && !error && (
        <form onSubmit={onsubmithandler}>
          <select onChange={onchangehandler}>
            <option value="Movies">Movies</option>
            <option value="Users">Users</option>
          </select>
          <button disabled={!formIsValid} type="submit">
            Join room
          </button>
        </form>
      )}
    </div>
  );
};

export default JoinRoom;
