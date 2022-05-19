import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

import Swal from "sweetalert2/dist/sweetalert2.js";
import { useState, useEffect } from "react";
import CreateGroup from "./pages/CreateGroup";
import JoinGroupPage from "./pages/JoinGroupPage";
import CampingGroup from "./pages/CampingGroup";
import PersonalOfHeader from "./pages/PersonalOfHeader";
import Login from "./pages/Login";
import GoogleMapBasic from "./component/GoogleMapBasic";
import Member from "./component/Member";
import Profile from "./pages/Profile";
import CityCamping from "./pages/CityCamping";
import { UserContext } from "./utils/userContext";
import FindGroup from "./pages/FindGroup";
import SecondHand from "./pages/SecondHand";
import ScrollToTop from "./component/ScrollToTop";

function App() {
  const [userName, setUserName] = useState("");
  const [groupId, setGroupId] = useState("");
  const [userId, setUserId] = useState("");
  const [allMemberArr, setAllMemberArr] = useState([]);
  const auth = getAuth();

  console.log(groupId);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user.displayName);
        setUserName(user.displayName);
        setUserId(user.uid);
        console.log("yes");
      } else {
        console.log("no!");
      }
    });
  }, []);

  const value = {
    userId,
    userName,
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
                    userName={userName}
                  />
                }></Route>
              <Route path='/member' element={<Member />}></Route>
              <Route
                path='joinGroup/:id'
                element={
                  <JoinGroupPage userName={userName} userId={userId} />
                }></Route>
              <Route
                path='profile/:id'
                element={
                  <Profile userName={userName} userId={userId} />
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
              <Route
                path='/:city'
                element={
                  <CityCamping
                    userName={userName}
                    groupId={groupId}
                    userId={userId}
                  />
                }></Route>
              <Route
                path='googlemap_basic'
                element={<GoogleMapBasic />}></Route>
              <Route
                path='personal_header/:id'
                element={<PersonalOfHeader />}></Route>
              <Route
                path='find_group'
                element={<FindGroup userId={userId} />}></Route>
              <Route
                path='second_hand'
                element={
                  <SecondHand userName={userName} userId={userId} />
                }></Route>
            </Routes>
          </ScrollToTop>
        </BrowserRouter>
      </UserContext.Provider>
    </div>
  );
}

export default App;
