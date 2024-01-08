import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useHttp } from "../../shared/hooks/useHttp";

const PredictedMovie = () => {
  let navigate = useNavigate();
  const { isloading, error, sendRequest } = useHttp();
  const [predictions, setpredictions] = useState();
  const id = useParams().id;
  const location = useLocation();
  const datasetID = location.state.datasetID;
  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/movie/suggest/${id}`
        );
        // console.log("control");
        // console.log(user);
        setpredictions(responseData);
      } catch (err) {
        console.log(err);
      }
    };
    const fetchPredictionsdataset = async () => {
        try {
          const responseData = await sendRequest(
            `http://localhost:5000/movie/suggest/existing/${id}`
          );
          // console.log("control");
          // console.log(user);
          setpredictions(responseData);
        } catch (err) {
          console.log(err);
        }
      };
    if (datasetID===-1) {
      fetchPredictions();
    } else {
      fetchPredictionsdataset();
    }
  }, [sendRequest, id, datasetID]);

  return (
    <div>
      {isloading && <h1>Loading...</h1>}
      {!isloading && error && <h1>{error}</h1>}
      {!isloading && !error && (
        <div>
          <h3>Similar movies to the movie are</h3>
          {JSON.stringify(predictions)}
          <button
            onClick={() => {
              navigate("../../../movies/", { state: { id: id } });
            }}
          >
            Go back
          </button>
        </div>
      )}
    </div>
  );
};

export default PredictedMovie;
