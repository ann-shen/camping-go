import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setDoc, doc } from "firebase/firestore";
import styled from "styled-components";
import { db } from "../utils/firebase";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import login from "../css/login.css";
import { Display, Font, Wrap } from "../css/style";
import * as React from "react";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

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

function TabPanel(props) {
  const { children, value, index, setUserName, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}>
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

function Login({setUserId, setUserName, userName}) {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const [email, setEmail] = useState("moon@gmail.com");
  const [password, setPassword] = useState("moonmo");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  function handellogin() {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        navigate("/");
        const user = userCredential.user;
        console.log(user.displayName);
        updateProfile(auth.currentUser, {
          displayName: user.displayName,
        });
        setUserName(user.displayName);
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

  const register = () => {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        console.log(user);
        console.log(user.uid);
        console.log(userName);

        // setUserId(user.uid);

        updateProfile(auth.currentUser, {
          displayName: userName,
        });
        const newUserRef = doc(db, "joinGroup", user.uid);
        await setDoc(newUserRef, {
          info: {
            email: user.email,
            user_name: userName,
            user_id: user.uid,
          },
          profile_img: `https://joeschmoe.io/api/v1/${user.uid}`,
          select_tag: [],
          group: [],

          second_hand: [],
          alert: [],
        });
        navigate("/");
        // console.log(user.email);
      })
      .catch((error) => {
        console.log(error);
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
  };

  console.log(userName);

  return (
    <Box
      sx={{
        width: "60%",
        height: "500px",
        boxShadow:
          "0.8rem 0.8rem 2.2rem #E2E1D3 , -0.5rem -0.5rem 1rem #ffffff",
        borderRadius: 10,
        paddingTop: 8,
        margin: "auto",
        marginBottom: "100px",
        marginTop: "100px",
        paddingBottom: "50px",
      }}>
      <AppBar position='static' sx={{ bgcolor: "#426765" }}>
        <Tabs
          TabIndicatorProps={{
            style: {
              backgroundColor: "#CFC781",
            },
          }}
          value={value}
          onChange={handleChange}
          indicatorColor='secondary'
          textColor='inherit'
          variant='fullWidth'
          aria-label='full width tabs example'>
          <Tab label='Sign In' {...a11yProps(0)} />
          <Tab label='Sign Up' {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}>
        <TabPanel value={value} index={0} dir={theme.direction}>
          <div className='orderListWrapn'>
            <div className='top_wrap'></div>
            <Font>歡迎來到 camping go</Font>
            <Font fontSize='16px'>請登入您的帳號</Font>
            <Wrap width='auto' m='40px 0px 0px 0px' direction='column'>
              <label htmlFor=''>UserEmail</label>
              <input
                type='text'
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <label htmlFor=''>Password</label>
              <input
                value={password}
                type='password'
                name='password'
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <div className='btnWrap'>
                <button onClick={handellogin}>Login In</button>
                <br />
              </div>
            </Wrap>
          </div>
        </TabPanel>
        <TabPanel
          value={value}
          index={1}
          dir={theme.direction}
          setUserName={setUserName}
          setUserId={setUserId}>
          <div className='orderListWrapn' id='signup'>
            <Font>歡迎來到 camping go</Font>
            <Font>註冊成為會員</Font>
            <label htmlFor=''>Username</label>
            <input
              type='text'
              onChange={(e) => {
                console.log(e.target.value);
                setUserName(e.target.value);
              }}
            />
            <label htmlFor=''>Email</label>
            <input
              type='text'
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <label htmlFor=''>Password</label>
            <input
              type='password'
              name='password'
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            {/* <label htmlFor=''>Confirm Password</label>
            <input
              type='password'
              name='password'
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            /> */}
            <div className='btnWrap'>
              <button onClick={register}>Sign up</button>
            </div>
          </div>
        </TabPanel>
      </SwipeableViews>
    </Box>
  );
}

// function Login({ setUserId, setUserName, userName }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const navigate = useNavigate();
//   const [loginStatus, setLoginStatus] = useState(true);

//   // useEffect(() => {
//   //   setPathName(window.location.pathname);
//   // }, []);

//   function handellogin() {
//     const auth = getAuth();
//     signInWithEmailAndPassword(auth, email, password)
//       .then((userCredential) => {
//         // Signed in
//         const user = userCredential.user;
//         console.log(user.displayName);
//         updateProfile(auth.currentUser, {
//           displayName: user.displayName,
//         });
//         setUserName(user.displayName);
//         navigate("/");
//         // ...
//       })
//       .catch((error) => {
//         const errorCode = error.code;
//         const errorMessage = error.message;
//         switch (error.code) {
//           case "auth/invalid-email":
//             setErrorMessage("信箱格式不正確");
//             alert("信箱格式不正確");
//             break;
//           case "auth/user-not-found":
//             setErrorMessage("信箱不存在");
//             alert("信箱不存在");
//             break;
//           case "auth/wrong-password":
//             setErrorMessage("密碼錯誤");
//             alert("密碼錯誤");
//             break;
//           default:
//         }
//       });
//   }

//   function register() {
//     const auth = getAuth();
//     createUserWithEmailAndPassword(auth, email, password)
//       .then(async (userCredential) => {
//         const user = userCredential.user;
//         setUserId(user.uid);
//         updateProfile(auth.currentUser, {
//           displayName: userName,
//         });
//         const newUserRef = doc(db, "joinGroup", user.uid);
//         await setDoc(newUserRef, {
//           info: {
//             email: user.email,
//             user_name: userName,
//           },
//           select_tag: [],
//           group: [
//             {
//               group_id: "",
//             },
//           ],
//         });
//         navigate("/");
//         // console.log(user.email);
//       })
//       .catch((error) => {
//         const errorCode = error.code;
//         const errorMessage = error.message;
//         switch (error.code) {
//           case "auth/email-already-in-use":
//             setErrorMessage("信箱已存在");
//             alert("信箱已存在");
//             break;
//           case "auth/invalid-email":
//             setErrorMessage("信箱格式不正確");
//             alert("信箱格式不正確");
//             break;
//           case "auth/weak-password":
//             setErrorMessage("密碼強度不足");
//             alert("密碼強度不足");
//             break;
//           default:
//         }
//       });
//   }

//   return (
//     <>
//       <div className='login_wrap'>
//         <section id='login'></section>
//         <br />
//         <section className='orderListWrapn'>
//           <div className='top_wrap'>
//             <p>Don't you have an account?</p>
//             {/* <a href='#signup'>
//               <button onClick={()=>{setLoginStatus(false)}}>Sign Up</button>
//             </a> */}
//           </div>
//           <h1>歡迎來到 camping go</h1>
//           <h5>請登入您的帳號</h5>
//           <label htmlFor=''>UserEmail</label>
//           <input
//             type='text'
//             onChange={(e) => {
//               setEmail(e.target.value);
//             }}
//           />
//           <label htmlFor=''>Password</label>
//           <input
//             type='password'
//             name='password'
//             onChange={(e) => {
//               setPassword(e.target.value);
//             }}
//           />
//           <div className='btnWrap'>
//             <button onClick={handellogin}>Login In</button>
//             <br />
//           </div>
//         </section>
//         {loginStatus && (
//           <section className='orderListWrapn' id='signup'>
//             <div className='top_wrap'>
//               <p>already have an account?</p>
//               <a href='#login'>
//                 <button>Sign In</button>
//               </a>
//             </div>
//             <h1>歡迎來到 camping go</h1>
//             <h5>註冊成為會員</h5>
//             <label htmlFor=''>Username</label>
//             <input
//               type='text'
//               onChange={(e) => {
//                 setUserName(e.target.value);
//               }}
//             />
//             <label htmlFor=''>Email</label>
//             <input
//               type='text'
//               onChange={(e) => {
//                 setEmail(e.target.value);
//               }}
//             />
//             <label htmlFor=''>Password</label>
//             <input
//               type='password'
//               name='password'
//               value={password}
//               onChange={(e) => {
//                 setPassword(e.target.value);
//               }}
//             />
//             <label htmlFor=''>Confirm Password</label>
//             <input
//               type='password'
//               name='password'
//               onChange={(e) => {
//                 setPassword(e.target.value);
//               }}
//             />
//             <div className='btnWrap'>
//               <button onClick={register}>Sign up</button>
//             </div>
//           </section>
//         )}
//       </div>
//     </>
//   );
// }

export default Login;
