import React from "react";
import { Link } from "react-router-dom";

const Button = (props) => {
  return (
    <button disabled={props.active}>
      {props.active ? (
        props.text
      ) : props.id ? (
        <Link
          to={props.link + props.id}
          state={{ datasetID: props.datasetID, id: props.id }}
        >
          {props.text}
        </Link>
      ) : (
        <Link to={props.link}>{props.text}</Link>
      )}
    </button>
  );
};

export default Button;
