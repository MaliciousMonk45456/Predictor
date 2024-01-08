import { useState, useEffect, useCallback } from "react";

let logoutTimer;

export const useAuth = () => {
  const [token, setToken] = useState(false);
  const [userId, setUserId] = useState(null);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [payment, setpayment] = useState(null);

  const setterpayment = useCallback((value) => {
    // console.log("Value"+value)
    setpayment(value);
  }, []);

  const login = useCallback((uid, token, expirationDate,payment) => {
    // console.log("payment"+payment);
    setToken(token);
    setUserId(uid);
    setpayment(payment);
    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(tokenExpirationDate);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: uid,
        token: token,
        expiration: tokenExpirationDate.toISOString(),
        payment:payment,
      })
    );
  }, []);

  const logout = useCallback(() => {
    // console.log("Logged OUT");
    setToken(false);
    setUserId(null);
    setTokenExpirationDate(null);
    setpayment(null);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    // console.log(storedData);
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(
        storedData.userId,
        storedData.token,
        new Date(storedData.expiration),
        storedData.payment,
      );
    }
  }, [login]);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      // console.log(tokenExpirationDate);
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      // console.log(remainingTime);
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  return { token, login, logout, userId,setterpayment,payment };
};
