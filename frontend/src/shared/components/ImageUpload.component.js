import React, { useState, useRef, useEffect } from "react";

const ImageUpload = (props) => {
  const [file, setFile] = useState();
  const initialpreviewURL=props.initialvalue?props.initialvalue:null
  const [previewUrl, setPreviewUrl] = useState(initialpreviewURL);
  const [isValid, setIsValid] = useState(false||props.initialvalid);
  const [isTouched, setIsTouched] = useState(false);
  const filePickerRef = useRef();

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  const pickedHandler = (event) => {
    let pickedFile;
    let fileIsValid = isValid;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFile(pickedFile);
      setIsValid(true);
      if(props.setter){
        props.setter(pickedFile)
      }
      fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = false;
    }
    // Need to manually update the validity as setIsValid is not async and will take time to update
    // console.log(pickedFile);
    props.onInput(props.id, "image", pickedFile, fileIsValid);
  };

  const touchHandler = () => {
    setIsTouched(true);
  };

  return (
    <div>
      <input
        id={props.id}
        ref={filePickerRef}
        style={{ display: "none" }}
        type="file"
        accept=".jpg,.png,.jpeg"
        onChange={pickedHandler}
        // onFocus={touchHandler}
      />
      <div>
        {previewUrl ? (
          <img src={previewUrl} alt="Preview" />
        ) : (
          <p>Please pick an image.</p>
        )}
        <button type="button" onClick={pickImageHandler} onBlur={touchHandler}>
          Pick Image
        </button>
        {!isValid && isTouched && <p>{props.errorText}</p>}
      </div>
    </div>
  );
};

export default ImageUpload;
