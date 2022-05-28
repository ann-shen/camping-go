import { UserContext } from "./utils/userContext";
import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import CreateGroup from "./pages/CreateGroup";
import JoinGroupPage from "./pages/JoinGroupPage";
import CampingGroup from "./pages/CampingGroup";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import CityCamping from "./pages/CityCamping";
import FindGroup from "./pages/FindGroup";
import SecondHand from "./pages/SecondHand";

import ScrollToTop from "./component/ScrollToTop";
import NotFound from "./pages/NotFound";

function App() {
  const [userName, setUserName] = useState("");
  const [groupId, setGroupId] = useState("");
  const [userId, setUserId] = useState("");
  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName);
        setUserId(user.uid);
        console.log("login");
      } else {
        console.log("logout");
      }
    });
  }, []);

  const value = {
    userId,
    userName,
    personName: "",
  };

  return (
    <div className='App'>
      <UserContext.Provider value={value}>
        <BrowserRouter>
          <ScrollToTop>
          <Routes>
            <Route
              path='/create_group'
              element={
                <CreateGroup userId={userId} userName={userName} />
              }></Route>
            <Route
              path='/'
              element={<CampingGroup setGroupId={setGroupId} />}></Route>
            <Route
              path='joinGroup/:id'
              element={<JoinGroupPage userName={userName} />}></Route>
            <Route
              path='profile/:id'
              element={<Profile />}></Route>
            <Route
              path='login'
              element={
                <Login
                  setUserId={setUserId}
                  setUserName={setUserName}
                  userName={userName}
                />
              }></Route>
            <Route
              path='/:city'
              element={<CityCamping groupId={groupId} userId={userId} />}
            />
            <Route path='find_group' element={<FindGroup />} />
            <Route
              path='second_hand'
              element={<SecondHand userName={userName} userId={userId} />}
            />
            <Route path='/*' element={<NotFound />} />
          </Routes>
          </ScrollToTop>
        </BrowserRouter>
      </UserContext.Provider>
    </div>
  );
}

export default App;
