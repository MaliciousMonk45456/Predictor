import React from "react";
import { useParams } from "react-router-dom";
import EditForm from "../components/EditUser.component";

const EditUser = () => {
  const id = useParams().id;
  return <EditForm id={id} />;
};

export default EditUser;
