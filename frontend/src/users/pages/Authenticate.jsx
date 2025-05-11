import React, { useRef, useState } from "react";
import { useMutation } from "react-query";
import { useAuthContext } from "../../shared/context/auth-context";

import Card from "../../shared/components/card/Card";
import Input from "../../shared/components/input/Input";
import Button from "../../shared/components/button/Button";

import { signUpUser, loginUser } from "../api/users";

import "./Authenticate.css";

const Authenticate = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const { login } = useAuthContext();

  const signUpUserMutation = useMutation({
    mutationFn: signUpUser,
    onSuccess: (data) => {
      login(data.id, data.token);
    },
    onError: (error) => {
      console.error(error);
    }
  });

  const loginUserMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      login(data.id, data.token);
    },
    onError: (error) => {
      console.error(error);
    }
  });

  const switchModeHandler = () => {
    setIsLoginMode(prevMode => !prevMode);
  };

  const onSubmitHandler = event => {
    event.preventDefault();
    if (isLoginMode) {
      loginUserMutation.mutate({
        email: emailRef.current.value,
        password: passwordRef.current.value
      });
    } else {
      signUpUserMutation.mutate({
        name: nameRef.current.value,
        email: emailRef.current.value,
        password: passwordRef.current.value
      });
    }
  };


  return (
    <Card className="authentication">
      <h2>{isLoginMode ? "Login" : "Sign Up"}</h2>
      <form onSubmit={onSubmitHandler}>
        {!isLoginMode && (
          <Input id="name" ref={nameRef} type="text" label="Name" placeholder="Your name" />
        )}
        <Input id="email" ref={emailRef} type="text" label="Email" placeholder="Your email" />
        <Input id="password" ref={passwordRef} type="password" label="Password" placeholder="Your password" />
        <Button type="submit" disabled={isLoginMode ? loginUserMutation.isLoading : signUpUserMutation.isLoading}>
          {isLoginMode ? "LOGIN" : "SIGN UP"}
        </Button>
      </form>
      <Button inverse onClick={switchModeHandler}>
        {isLoginMode ? "Switch to Sign Up" : "Switch to Login"}
      </Button>
    </Card>
  );
};

export default Authenticate;
