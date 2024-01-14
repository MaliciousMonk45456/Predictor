import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useHttp } from "../../shared/hooks/useHttp";
import { AuthContext } from "../../shared/context/auth.context";

const PredictedUser = () => {
  const { token } = useContext(AuthContext);
  let navigate = useNavigate();
  const { isloading, error, sendRequest } = useHttp();
  const [predictions, setpredictions] = useState();
  const id = useParams().id;
  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const responseData = await sendRequest(
          // `http://localhost:5000/user/predict/${id}`,
          process.env.REACT_APP_BACKEND_URI + "/user/predict/" + id,
          "GET",
          null,
          {
            Authorization: "Bearer " + token,
          }
        );
        // console.log("control");
        // console.log(user);
        setpredictions(responseData);
      } catch (err) {
        console.log(err);
      }
    };
    fetchPredictions();
  }, [sendRequest, id, token]);

  return (
    <div>
      {isloading && <h1>Loading...</h1>}
      {!isloading && error && <h1>{error}</h1>}
      {!isloading && !error && (
        <div>
          <h3>Predicted movies for the user {id}</h3>
          {JSON.stringify(predictions)}
          <button
            onClick={() => {
              navigate(`../../../user/${id}`, { state: { id: id } });
            }}
          >
            Go back
          </button>
        </div>
      )}
    </div>
  );
};

export default PredictedUser;
