import { useReducer, useCallback } from "react";

const formReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE_OTP":
      return {
        ...state,
        otp: { value: action.payload.value },
      };
    case "CHANGE":
      const newState = {
        ...state,
      };
      if (newState.genre) {
        newState.genre[action.payload.id].value = action.payload.value;
        newState.genre[action.payload.id].valid = action.payload.valid;
      }
      for (const i in newState.genre) {
        if (!newState.genre[i].valid) {
          newState.formIsValid = false;
          break;
        }
        newState.formIsValid = true;
      }
      if (newState.year && newState.average_rating) {
        newState.formIsValid =
          newState.formIsValid &&
          newState.year.valid &&
          newState.average_rating.valid &&
          newState.image.valid;
      }
      if (newState.image) {
        newState.formIsValid = newState.formIsValid && newState.image.valid;
      }
      return newState;
    case "CHANGE_YEAR":
      // console.log(action.payload.valid);
      let formIsValidnew = true;
      for (const i in state.genre) {
        if (!state.genre[i].valid) {
          formIsValidnew = false;
          break;
        }
      }
      return {
        ...state,
        year: { value: action.payload.value, valid: action.payload.valid },
        formIsValid:
          formIsValidnew &&
          action.payload.valid &&
          state.average_rating.valid &&
          state.image.valid,
      };
    case "CHANGE_RATING":
      let formIsValid2 = true;
      for (const i in state.genre) {
        if (!state.genre[i].valid) {
          formIsValid2 = false;
          break;
        }
      }
      return {
        ...state,
        average_rating: {
          value: action.payload.value,
          valid: action.payload.valid,
        },
        formIsValid:
          formIsValid2 &&
          action.payload.valid &&
          state.image.valid &&
          state.year.valid,
      };
    case "CHANGE_EXISTING":
      return {
        ...state,
        datasetID: { value: action.payload.value, valid: action.payload.valid },
        formIsValid: action.payload.valid,
      };
    case "CHANGE_IMAGE":
      let formIsValid = true;
      for (const i in state.genre) {
        if (!state.genre[i].valid) {
          formIsValid = false;
          break;
        }
      }
      if (state.year && state.average_rating) {
        formIsValid =
          formIsValid && state.year.valid && state.average_rating.valid;
      }
      return {
        ...state,
        image: { value: action.payload.value, valid: action.payload.valid },
        formIsValid: formIsValid && action.payload.valid,
      };
    case "CHANGE_EMAIL":
      let formvalidity = true;
      if (state.name) {
        formvalidity = state.password.valid && state.name.valid;
      }
      return {
        ...state,
        email: { value: action.payload.value, valid: action.payload.valid },
        formIsValid: formvalidity && action.payload.valid,
      };
    case "CHANGE_PASSWORD":
      let formvalidity2 = true;
      if (state.name) {
        formvalidity2 = state.email.valid && state.name.valid;
      }
      console.log(action.payload.valid)
      return {
        ...state,
        password: { value: action.payload.value, valid: action.payload.valid },
        formIsValid: formvalidity2 && action.payload.valid,
      };
    case "CHANGE_NAME":
      let formvalidity3 = true;
      formvalidity3 = state.password.valid && state.email.valid;
      return {
        ...state,
        name: { value: action.payload.value, valid: action.payload.valid },
        formIsValid: formvalidity3 && action.payload.valid,
      };
    case "SET":
      const newstate = {
        ...state,
      };
      for (const i in state.genre) {
        const name = state.genre[i].name;
        newstate.genre[i].value = action.payload.genre[name];
        newstate.genre[i].valid = true;
        // console.log(action.payload)
      }
      newstate.formIsValid = true;
      if (action.payload.year && action.payload.average_rating) {
        newstate.year.value = action.payload.year;
        newstate.year.valid = true;
        newstate.average_rating.value = action.payload.average_rating;
        newstate.average_rating.valid = true;
      }
      if (action.payload.image) {
        newstate.image.value = action.payload.image;
        newstate.image.valid = true;
      }
      // console.log(newstate);
      return newstate;
    default:
      return state;
  }
};

export const useForm = (initialState) => {
  const [formState, dispatch] = useReducer(formReducer, initialState);
  const onchangehandler = (id, name, value, valid) => {
    // console.log(formState)
    if (id === "otp") {
      // console.log(value)
      dispatch({
        type: "CHANGE_OTP",
        payload: { value: value },
      });
    }
    if (id === "email") {
      dispatch({
        type: "CHANGE_EMAIL",
        payload: { value: value, valid: valid },
      });
      return;
    }
    if (name === "password") {
      dispatch({
        type: "CHANGE_PASSWORD",
        payload: { value: value, valid: valid },
      });
      return;
    }
    if (id === "name") {
      dispatch({
        type: "CHANGE_NAME",
        payload: { value: value, valid: valid },
      });
      return;
    }
    if (name === "datasetID") {
      // valid=formState.formIsValid&&valid
      dispatch({
        type: "CHANGE_EXISTING",
        payload: { value: value, valid: valid },
      });
      return;
    }
    if (name === "year") {
      // valid=formState.formIsValid&&valid
      dispatch({
        type: "CHANGE_YEAR",
        payload: { value: value, valid: valid },
      });
      return;
    }
    if (name === "average_rating") {
      // valid=formState.formIsValid&&valid
      dispatch({
        type: "CHANGE_RATING",
        payload: { value: value, valid: valid },
      });
      return;
    }
    if (name === "image") {
      dispatch({
        type: "CHANGE_IMAGE",
        payload: { value: value, valid: valid },
      });
      return;
    }
    dispatch({
      type: "CHANGE",
      payload: { id: id, name: name, value: value, valid: valid },
    });
  };

  const setformdata = useCallback((data) => {
    dispatch({
      type: "SET",
      payload: data,
    });
  }, []);

  return [formState, onchangehandler, setformdata];
};
