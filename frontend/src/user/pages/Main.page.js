import React, { useContext, useEffect, useState } from "react";
import Button from "../../shared/components/Button.component";
import { AuthContext } from "../../shared/context/auth.context";
import { useHttp } from "../../shared/hooks/useHttp";
require("dotenv").config();

const Main = () => {
  const { isloading, error, sendRequest } = useHttp();
  const { isLoggedIn, logout, userId, token, setterpayment, payment } =
    useContext(AuthContext);
  const [users, setusers] = useState(null);
  // const [paymendId, setpaymendId] = useState(null);
  // const [payment, setpayment] = useState(false);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const user = await sendRequest(
          // `http://localhost:5000/user/check/${userId}`
          process.env.REACT_APP_BACKEND_URI + `user/check/${userId}`,
        );
        // console.log("control");
        // console.log(user.payment);
        setusers(user.data);
        // setpayment(user.payment);
        setterpayment(user.payment);
        // console.log(!payment)
        // setusers(user)
        // console.log(user.image)
      } catch (err) {
        console.log(err);
      }
    };
    if (!!userId) {
      fetchUsers();
    }
  }, [sendRequest, userId, setterpayment]);

  const initPay = (data) => {
    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY,
      amount: data.amount,
      currency: data.currency,
      description: "Payment of 10 Rupees",
      order_id: data.id,
      name: "Recommendation System",
      // image:
      //   "https://footballtoday.com/wp-content/uploads/2023/02/fbl-eur-c1-psg-bayern-munich-4-2048x1365.jpg",
      retry: {
        enabled: false,
      },
      timeout: 300,
      handler: async (response) => {
        try {
          // console.log(response);
          // console.log(token)
          await sendRequest(
            // "http://localhost:5000/payment/verify",
            process.env.REACT_APP_BACKEND_URI + "payment/verify",
            "POST",
            JSON.stringify({
              razorpay_orderID: response.razorpay_order_id,
              razorpay_paymentID: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
            {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            }
          );
          // setpayment(true);
          setterpayment(response.razorpay_payment_id);
          // console.log(data);
        } catch (error) {
          console.log(error);
        }
      },
      // prefill: {
      //   name: "Aryan",
      //   email: "aryantripathi020403@gmail.com",
      //   contact: "8734093409",
      // },
      notes: {
        address: "DAIICT",
      },
      theme: {
        color: "#000000",
      },
    };
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  const handlePay = async () => {
    try {
      // console.log(token)
      const data = await sendRequest(
        // "http://localhost:5000/payment/create",
        process.env.REACT_APP_BACKEND_URI + "payment/create",
        "POST",
        JSON.stringify({
          amount: 10,
        }),
        {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        }
      );
      console.log(data);
      initPay(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRefund = async () => {
    try {
      const data = await sendRequest(
        "http://localhost:5000/payment/refund",
        "POST",
        JSON.stringify({
          paymentId: payment,
          amount: 10,
        }),
        {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        }
      );
      console.log(data);
      setterpayment(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleReceipt = async () => {
    try {
      const responseData = await sendRequest(
        `http://localhost:5000/uploads/receipts/receipt_${payment}.pdf`,
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
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {isloading && <h1>Loading...</h1>}
      {!isloading && error && <h1>{error}</h1>}
      {!isloading && !error && (
        <div>
          <h1>Home</h1>
          {isLoggedIn ? (
            <div>
              {!!users ? (
                <div>
                  {/* <Link to={`/user/${userId}`}>See User Genre</Link> */}
                  <Button
                    active={!!!payment}
                    link="/user/"
                    text="See User Genre"
                    id={users}
                  />
                </div>
              ) : (
                <Button
                  active={!!!payment}
                  link="/adduser"
                  text="Add User Genre"
                />
              )}
              <Button active={!!!payment} link="/addfile" text="File" />
              {!!payment ? (
                <div>
                  <button onClick={handleReceipt}>View Receipt</button>
                  <button onClick={handleRefund}>Get Refund</button>
                </div>
              ) : (
                <button onClick={handlePay}>Payment</button>
              )}
              <button onClick={logout}>Logout</button>
            </div>
          ) : (
            <div>
              <Button link="/login" text="Login" />
              <Button link="/forgot" text="Forgot Password" />
            </div>
          )}
          <Button link="/addmovie" text="Add Movie Genre" />
        </div>
      )}
    </div>
  );
};

export default Main;
