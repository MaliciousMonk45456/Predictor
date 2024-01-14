import React, { useContext, useState, useEffect } from "react";
import { useHttp } from "../../shared/hooks/useHttp";
import { AuthContext } from "../../shared/context/auth.context";

const AddFile = () => {
  const { token } = useContext(AuthContext);
  const [fileId, setFileId] = useState(null);
  const { isloading, error, sendRequest } = useHttp();
  useEffect(() => {
    const fetchfile = async () => {
      try {
        const file = await sendRequest(
          // `http://localhost:5000/file/check`,
          process.env.REACT_APP_BACKEND_URL + "/file/check",
          "GET",
          null,
          {
            Authorization: "Bearer " + token,
          }
        );
        // console.log("control");
        // console.log(user);
        if (file.file !== null) {
          setFileId(file);
        }
        console.log(file);
        // console.log(user.image)
      } catch (err) {
        console.log(err);
      }
    };
    fetchfile();
  }, [sendRequest, token]);

  const onsubmithandler = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("file", event.target.file.files[0]);
    const responseData = await sendRequest(
      // "http://localhost:5000/file/upload",
      // process.env.REACT_APP_BACKEND_URL + "/file/upload",
      "POST",
      formData,
      {
        Authorization: "Bearer " + token,
      }
    );
    // console.log(responseData.file.id);
    setFileId(responseData.file.id);
    // console.log(responseData);
  };
  const clickHandler = async (event) => {
    event.preventDefault();
    const responseData = await sendRequest(
      // `http://localhost:5000/file/download/${fileId}`,
      process.env.REACT_APP_BACKEND_URL + `/file/download/${fileId}`,
      "GET",
      null,
      {
        Authorization: "Bearer " + token,
      },
      true
    );
    const file = new Blob([responseData], { type: "application/pdf" });
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL);
    console.log(responseData);
  };

  const handleDelete = async (event) => {
    event.preventDefault();
    await sendRequest(
      // `http://localhost:5000/file/delete`,
      process.env.REACT_APP_BACKEND_URL + "/file/delete",
      "DELETE",
      null,
      {
        Authorization: "Bearer " + token,
      }
    );
    // console.log(responseData);
    setFileId(null);
  };
  return (
    <div>
      {isloading && <h1>Loading...</h1>}
      {!isloading && error && <h1>{error}</h1>}
      {!isloading && !error && (
        <div>
          <form onSubmit={onsubmithandler}>
            <input type="file" name="file" accept=".pdf" />
            {fileId === "" ? (
              <button type="submit">Submit</button>
            ) : (
              <button type="submit">Update</button>
            )}
          </form>
          {fileId !== null && (
            <div>
              <button onClick={clickHandler}>View File</button>
              <button onClick={handleDelete}>Delete File</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AddFile;
