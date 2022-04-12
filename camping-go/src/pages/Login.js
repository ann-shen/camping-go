import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setDoc, doc, updateDoc } from "firebase/firestore";
import styled from "styled-components";
import { db } from "../utils/firebase";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

const Title = styled.div`
  color: #333;
  font-size: 15px;
  letter-spacing: 0px;
`;
const Input = styled.input`
  height: 30px;
  width: 250px;
  margin-left: 10px;
  margin-bottom: 10px;
`;
const LoginButton = styled.button`
  height: 35px;
  width: 157px;
  margin: 10px 10px 0px 0px;
  padding: 3px;
  font-size: 18px;
  border-radius: 15px;
  border: none;
  color: #333;
  &:hover {
    background-color: #333;
    color: #999;
  }
`;

const LoginWrap = styled.div`
  margin-left: 10%;
  width: 30%;
`;

function Loogin({ setUserId, setUserName, userName }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [userName, setUserName] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // useEffect(() => {
  //   setPathName(window.location.pathname);
  // }, []);

  function handellogin() {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password, userName)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        navigate("/");
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        switch (error.code) {
          case "auth/invalid-email":
            setErrorMessage("信箱格式不正確");
            alert("信箱格式不正確");
            break;
          case "auth/user-not-found":
            setErrorMessage("信箱不存在");
            alert("信箱不存在");
            break;
          case "auth/wrong-password":
            setErrorMessage("密碼錯誤");
            alert("密碼錯誤");
            break;
          default:
        }
      });
  }

  function register() {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        setUserId(user.uid);
        const newUserRef = doc(db, "joinGroup", user.uid);
        await setDoc(newUserRef, {
          info: {
            email: user.email,
            user_name: userName,
          },
          favorite: [
            {
              group_id: "",
            },
          ],
          group: [
            {
              group_id: "",
            },
          ],
        });
        navigate("/");
        // console.log(user.email);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        switch (error.code) {
          case "auth/email-already-in-use":
            setErrorMessage("信箱已存在");
            alert("信箱已存在");
            break;
          case "auth/invalid-email":
            setErrorMessage("信箱格式不正確");
            alert("信箱格式不正確");
            break;
          case "auth/weak-password":
            setErrorMessage("密碼強度不足");
            alert("密碼強度不足");
            break;
          default:
        }
      });
  }

  return (
    <>
      <LoginWrap>
        <Title>
          username
          <Input
            onChange={(e) => {
              setUserName(e.target.value);
            }}></Input>
        </Title>
        <Title>
          email
          <Input
            onChange={(e) => {
              setEmail(e.target.value);
            }}></Input>
        </Title>
        <Title>
          password
          <Input
            onChange={(e) => {
              setPassword(e.target.value);
            }}></Input>
        </Title>
        <LoginButton onClick={handellogin}>登入</LoginButton>
        <LoginButton onClick={register}>註冊</LoginButton>
      </LoginWrap>
    </>
  );
}

export default Loogin;
