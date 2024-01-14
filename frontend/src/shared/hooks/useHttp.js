import { useState, useCallback, useRef, useEffect } from "react";
require('dotenv').config()


export const useHttp = () => {
  const [isloading, setisloading] = useState(false);
  const [error, seterror] = useState();

  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}, file = false) => {
      setisloading(true);
      const httpAbortCtrl = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrl);

      // url=url.splice(0,23)
      // url=url+process.env.REACT_APP_BACKEND_URI


      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
        });
        let responseData;
        // console.log(response)

        if (!file ) {
          responseData = await response.json();
          // console.log(responseData)
        }
        else {
          responseData = await response.blob();
        } 

        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtrl) => reqCtrl !== httpAbortCtrl
        );

        // console.log(responseData)
        if (!response.ok) {
          throw new Error(responseData.message);
        }
        setisloading(false);
        return responseData;
      } catch (err) {
        seterror(err.message);
        setisloading(false);
        // console.log(err);
        throw err;
      }
    },
    []
  );

  useEffect(() => {
    return () => {
      activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort());
    };
  }, []);

  return { isloading, error, sendRequest };
};
