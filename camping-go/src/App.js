import { BrowserRouter, Route, Routes } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

import "rsuite/dist/rsuite.min.css";
import { useState,useEffect } from "react";
import CreateGroup from "./pages/CreateGroup";
import JoinGroupPage from "./pages/JoinGroupPage";
import CampingGroup from "./component/CampingGroup";
import Taiwan from "./component/Taiwan";
import Login from "./pages/Login";
import StaticDateRangePickerDemo from "./component/Calander";

function App() {
  const [groupId, setGroupId] = useState("");
  const [userId, setUserId] = useState("");
  const auth = getAuth();
console.log(groupId);
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        setUserId(user.uid);
        console.log(user.email);
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
            element={<CreateGroup userId={userId} />}></Route>
          <Route
            path='/'
            element={
              <CampingGroup
                setGroupId={setGroupId}
                userId={userId}
                groupId={groupId}
              />
            }></Route>
          <Route path='/taiwan' element={<Taiwan />}></Route>
          <Route
            path='joinGroup/:id'
            element={<JoinGroupPage />}></Route>
          <Route path='login' element={<Login setUserId={setUserId} />}></Route>
        </Routes>
        <StaticDateRangePickerDemo></StaticDateRangePickerDemo>
        <button onClick={getLogout}>登出</button>
      </BrowserRouter>
    </div>
  );
}

export default App;
