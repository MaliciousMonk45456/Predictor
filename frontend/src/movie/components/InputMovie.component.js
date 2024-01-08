import React, { useReducer } from "react";

const inputReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.payload.value,
        valid: action.payload.valid,
      };
    case "TOUCH":
      return {
        ...state,
        touched: true,
      };
    default:
      return state;
  }
};

const InputMovie = (props) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.value || props.initialvalue,
    valid: props.initialvalid,
    touched: false,
  });

  const validate = (event) => {
    if (event.target.value === "") {
      return false;
      // props.setformValidity(props.formvalidity&&false)
    } else {
      return true;
      // props.setformValidity(props.formvalidity&&true)
    }
  };

  const validate2 = (event) => {
    if (
      event.target.value < 1900 ||
      event.target.value > 2021 ||
      event.target.value === ""
    ) {
      return false;
    } else {
      return true;
    }
  };

  const validate3 = (event) => {
    if (
      event.target.value < 0 ||
      event.target.value > 5 ||
      event.target.value === ""
    ) {
      return false;
    } else {
      return true;
    }
  };

  const validate4 = (event) => {
    if (event.target.value === "" || event.target.value < 0) {
      return false;
    } else {
      return true;
    }
  };

  const validate5 = (event) => {
    if (event.target.value === "") {
      return false;
    } else {
      return true;
    }
  };

  const validate6 = (event) => {
    if (
      event.target.value === "" ||
      !event.target.value.match(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/
      )
    ) {
      return false;
    } else {
      return true;
    }
  };

  const validate7 = (event) => {
    if (event.target.value === "") {
      return false;
    } else {
      return true;
    }
  };

  const changeHandler = (event, validator) => {
    dispatch({
      type: "CHANGE",
      payload: { value: event.target.value, valid: validator(event) },
    });
    props.onChange(props.id, props.name, event.target.value, validator(event));
  };

  const touchHandler = () => {
    dispatch({
      type: "TOUCH",
    });
  };

  if (props.email) {
    return (
      <div>
        <label htmlFor={props.name}>{props.name}:</label>
        <input
          type="email"
          placeholder={`Enter ${props.name}`}
          name={props.id}
          value={inputState.value}
          onChange={(event) => changeHandler(event, validate5)}
          onBlur={touchHandler}
        />
        {!inputState.valid && inputState.touched && <p>Invalid {props.name}</p>}
        <br />
      </div>
    );
  }
  if (props.password) {
    return (
      <div>
        <label htmlFor={props.name}>{props.name}:</label>
        <input
          type="email"
          placeholder={`Enter ${props.name}`}
          name={props.id}
          value={inputState.value}
          onChange={(event) => changeHandler(event, validate6)}
          onBlur={touchHandler}
        />
        {!inputState.valid && inputState.touched && (
          <p>
            Password must consist of 1 lowercase, 1 uppercase, 1 digit and 1
            special character{" "}
          </p>
        )}
        <br />
      </div>
    );
  }
  if (props.username) {
    return (
      <div>
        <label htmlFor={props.name}>{props.name}:</label>
        <input
          type="text"
          placeholder={`Enter ${props.name}`}
          name={props.id}
          value={inputState.value}
          onChange={(event) => changeHandler(event, validate7)}
          onBlur={touchHandler}
        />
        {!inputState.valid && inputState.touched && <p>Invalid {props.name}</p>}
        <br />
      </div>
    );
  }

  if (props.datasetID) {
    return (
      <div>
        <label htmlFor={props.name}>{props.name}:</label>
        <input
          type="number"
          placeholder={`Enter ${props.name} of release`}
          name={props.id}
          value={inputState.value}
          onChange={(event) => changeHandler(event, validate4)}
          onBlur={touchHandler}
        />
        {!inputState.valid && inputState.touched && <p>Invalid {props.name}</p>}
        <br />
      </div>
    );
  }

  if (props.year) {
    return (
      <div>
        <label htmlFor={props.name}>{props.name}:</label>
        <input
          type="number"
          placeholder={`Enter ${props.name} of release`}
          name={props.id}
          value={inputState.value}
          onChange={(event) => changeHandler(event, validate2)}
          onBlur={touchHandler}
        />
        {!inputState.valid && inputState.touched && <p>Invalid {props.name}</p>}
        <br />
      </div>
    );
  }

  if (props.rating) {
    return (
      <div>
        <label htmlFor={props.name}>{props.name}:</label>
        <input
          type="number"
          placeholder={`Enter ${props.name} of release`}
          name={props.id}
          value={inputState.value}
          onChange={(event) => {
            changeHandler(event, validate3);
          }}
          onBlur={touchHandler}
        />
        {!inputState.valid && inputState.touched && <p>Invalid {props.name}</p>}
        <br />
      </div>
    );
  }

  return (
    <div>
      <label htmlFor={props.name}>{props.name}:</label>
      <select
        name={props.id}
        value={inputState.value}
        onChange={(event) => {
          changeHandler(event, validate);
        }}
        onBlur={touchHandler}
      >
        <option value="">Select</option>
        <option value="0">Not Genre</option>
        <option value="1">Genre</option>
      </select>
      {!inputState.valid && inputState.touched && (
        <p>Invalid {props.name} genre</p>
      )}
      <br />
    </div>
  );
};

export default InputMovie;
