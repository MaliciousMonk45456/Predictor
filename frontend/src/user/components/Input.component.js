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

const Input = (props) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.value || props.initialvalue,
    valid: props.initialvalid,
    touched: false,
  });
  

  const validate = (event) => {
    if (
      event.target.value < 0 ||
      event.target.value > 5 ||
      event.target.value % 0.5 !== 0 ||
      event.target.value === ""
    ) {
      return false;
      // props.setformValidity(props.formvalidity&&false)
    } else {
      return true;
      // props.setformValidity(props.formvalidity&&true)
    }
  };

  const changeHandler = (event) => {
    dispatch({
      type: "CHANGE",
      payload: { value: event.target.value, valid: validate(event) },
    });
    props.onChange(props.id, props.name,event.target.value, validate(event));
  };
  const touchHandler = () => {
    dispatch({
      type: "TOUCH",
    });
  };

  return (
    <div>
      <label htmlFor={props.name}>{props.name} rating:</label>
      <input
        type="number"
        placeholder={`Enter ${props.name} Rating`}
        name={props.id}
        value={inputState.value}
        onChange={changeHandler}
        onBlur={touchHandler}
      />
      {!inputState.valid && inputState.touched &&<p>Invalid {props.name} rating</p>}
      <br />
    </div>
  );
};

export default Input;
