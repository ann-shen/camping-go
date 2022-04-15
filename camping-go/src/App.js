import { BrowserRouter, Route, Routes } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import "rsuite/dist/rsuite.min.css";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { useState, useEffect } from "react";
import CreateGroup from "./pages/CreateGroup";
import JoinGroupPage from "./pages/JoinGroupPage";
import CampingGroup from "./component/CampingGroup";
import Taiwan from "./component/Taiwan";
import Login from "./pages/Login";
import MaterialUIPickers from "./component/Calanders";
import { GoogleMap } from "@react-google-maps/api";
import GoogleMapTest from "./component/GoogleMapTest";
import GoogleMapBasic from "./component/GoogleMapBasic";

function App() {
  const [userName, setUserName] = useState("");
  const [groupId, setGroupId] = useState("");
  const [userId, setUserId] = useState("");
  const [allMemberArr, setAllMemberArr] = useState([]);

  console.log(userName);
  const auth = getAuth();
  // console.log(groupId);
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        setUserId(user.uid);
        console.log("yes");
      } else {
        console.log("no!");
        // User is signed out
        // ...
      }
    });
  }, []);

  function getLogout() {
    signOut(auth)
      .then(() => {})
      .catch((error) => {});
    // setToken("");
  }
  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route
            path='/createGroup'
            element={
              <CreateGroup
                userId={userId}
                setUserName={setUserName}
                userName={userName}
                setAllMemberArr={setAllMemberArr}
                allMemberArr={allMemberArr}
              />
            }></Route>
          <Route
            path='/'
            element={
              <CampingGroup
                setGroupId={setGroupId}
                userId={userId}
                groupId={groupId}
                setUserName={setUserName}
                userName={userName}
              />
            }></Route>
          <Route path='/taiwan' element={<Taiwan />}></Route>
          <Route
            path='joinGroup/:id'
            element={
              <JoinGroupPage
                setAllMemberArr={setAllMemberArr}
                allMemberArr={allMemberArr}
              />
            }></Route>
          <Route
            path='login'
            element={
              <Login
                setUserId={setUserId}
                setUserName={setUserName}
                userName={userName}
              />
            }></Route>
          <Route path='googlemap' element={<GoogleMapTest />}></Route>
          <Route path='googlemap_basic' element={<GoogleMapBasic />}></Route>
        </Routes>
        <button onClick={getLogout}>登出</button>
      </BrowserRouter>
      {/* <MaterialUIPickers></MaterialUIPickers> */}
    </div>
  );
}

export default App;
