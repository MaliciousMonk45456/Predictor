import React from "react";  
import Button from "../components/Button.component";  
import Registerform from "../components/Register.component";  

const Register = () => {
    return (
        <div>
        <h1>Register</h1>
        <Registerform />
        <Button link="/login" text="Already registered?" />
        </div>
    );
    };

export default Register;