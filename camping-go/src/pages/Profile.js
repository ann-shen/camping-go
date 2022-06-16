import * as React from "react";
import styled from "styled-components";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material/styles";
import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../utils/userContext";
import { useNavigate } from "react-router-dom";

import {
  getDocs,
  collection,
  query,
  where,
  doc,
  onSnapshot,
  updateDoc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { signOut, getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../utils/firebase";

import { Font, Img, Button, Hr, BoxWrap } from "../css/style";
import Modal from "react-modal";
import "../css/modal.css";
import {
  TextField,
  Alert,
  Collapse,
  IconButton,
  Rating,
  AppBar,
  Tabs,
  Tab,
  Typography,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Header from "../component/Header";
import SecondHand from "./SecondHand";
import Footer from "../component/Footer";
import initial from "../image/initial-09.png";
import InfoSection from "../component/profile_component/InfoSection";
import YourCreateGroup from "../component/profile_component/YourCreateGroup";
import YourParticipateGroup from "../component/profile_component/YourParticipateGroup";
import SecondHandInvitation from "../component/profile_component/SecondHamdInvitation";
import Swal from "sweetalert2/dist/sweetalert2.js";
import firebase from "../utils/firebaseConfig";

Modal.setAppElement("#root");

const SendCommentWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  position: relative;
  padding: 40px 10px;
  margin-right: 40px;
`;

const DeleteModalButton = styled.button`
  width: 30px;
  height: 30px;
  position: absolute;
  top: 0px;
  right: 10px;
  border: none;
  color: white;
  background-color: #dedab4;
  border-radius: 50%;
  cursor: pointer;
  &:hover {
    color: #cfc781;
    transform: scale(1.2);
    transition: 500ms;
  }
`;

const Span = styled.span`
  font-size: 20px;
  color: #cfc781;
  font-weight: 900;
`;

const DefaultWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}>
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography
            sx={{
              display: "flex",
              justifyContent: "start",
              flexWrap: "wrap",
              marginLeft: "3%",
            }}>
            {children}
          </Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

let ifClick = true;
function SentCommentToHeader({ groupId, userName, userId }) {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [value, setValue] = useState("Controlled");
  const [startValue, setStartValue] = React.useState(2);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const sendComment = async () => {
    if (ifClick === true) {
      console.log("已傳送")
      setAlertOpen(true);
      ifClick = false;
      const feedbackInCreateRef = doc(
        db,
        "CreateCampingGroup",
        groupId,
        "feedback",
        userId
      );

      let profile_img;

      const docRefJoinGroup = doc(db, "joinGroup", userId);
      const docMemberInfo = await getDoc(docRefJoinGroup);
      if (docMemberInfo.exists()) {
        profile_img = docMemberInfo.data().profile_img;
      }

      await setDoc(feedbackInCreateRef, {
        name: userName,
        note: value,
        score: startValue,
        user_id: userId,
        profile_img: profile_img,
      }).then(async () => {
        let scoreArr = [];
        let commentArr = [];
        const commentRef = collection(
          db,
          "CreateCampingGroup",
          groupId,
          "feedback"
        );

        const querySnapshot = await getDocs(commentRef);
        querySnapshot.forEach((doc) => {
          scoreArr.push(Number(doc.data().score));
          commentArr.push(doc.data().note);
        });
        let totalScore = scoreArr.reduce(function (total, e) {
          return total + e;
        }, 0);

        updateDoc(doc(db, "CreateCampingGroup", groupId), {
          total_score: totalScore / scoreArr.length,
          comment: commentArr,
        });
      });

      setTimeout(() => {
        setAlertOpen(false);
      }, 1000);
      setTimeout(() => {
        ifClick = true;
      }, 3000);
    }
  };

  return (
    <div className='App'>
      <Button onClick={() => setIsOpen(true)} width=' 150px'>
        評論
      </Button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setIsOpen(false)}
        overlayClassName={{
          base: "overlay-base",
          afterOpen: "overlay-after",
          beforeClose: "overlay-before",
        }}
        className={{
          base: "content-base",
          afterOpen: "content-after",
          beforeClose: "content-before",
        }}
        closeTimeoutMS={500}>
        <SendCommentWrap>
          <DeleteModalButton onClick={() => setIsOpen(false)}>
            X
          </DeleteModalButton>
          <Font>評論</Font>
          <Hr width='60%' m='20px 0px'></Hr>
          <TextField
            sx={{
              width: "70%",
              backgroundColor: "#E0DCBA",
              boxShadow:
                "0.3rem 0.3rem 0.8rem #E2E1D3 , -0.2rem -0.2rem 0.2rem #ffffff",
            }}
            multiline
            rows={4}
            variant='filled'
            onChange={handleChange}
            color='action'
          />
          <Font fontSize='16px' m='20px 20px 10px 0px' marginLeft='20px'>
            給這次的體驗星星數吧~
          </Font>
          <Rating
            name='size-large'
            defaultValue={2}
            size='large'
            value={startValue}
            sx={{ marginBottom: "50px", color: "#FFE588", fontSize: "40px" }}
            onChange={(event, newValue) => {
              setStartValue(newValue);
            }}
          />
          <Collapse in={alertOpen}>
            <Alert
              action={
                <IconButton
                  aria-label='close'
                  color='inherit'
                  size='small'
                  onClick={() => {
                    setAlertOpen(false);
                  }}>
                  <CloseIcon fontSize='inherit' />
                </IconButton>
              }
              sx={{ mb: 2 }}>
              已送出
            </Alert>
          </Collapse>
          <Button
            bgc='#426765'
            color='#eae5be'
            width='150px'
            onClick={sendComment}>
            送出評論
          </Button>
        </SendCommentWrap>
      </Modal>
    </div>
  );
}

export default function Profile({ userName }) {
  let params = useParams();
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const [yourCreateGroup, setYourCreateGroup] = useState([]);
  const [yourParticipateGroup, setYourParticipateGroup] = useState([]);
  const [withDrawGrop, setWithDrawGrop] = useState(false);
  const [inviteIsOpen, setInviteIsOpen] = useState(false);
  const [inviteInfo, setInviteInfo] = useState("");
  const [inviteInfoIndex, setInviteInfoIndex] = useState("");
  const auth = getAuth();
  const Context = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (Context.userId) {
      const unsub = onSnapshot(doc(db, "joinGroup", Context.userId), (doc) => {
        setInviteInfo(doc.data().second_hand);
        doc.data().second_hand.forEach((item, index) => {
          if (item.invite === true) {
            setInviteInfoIndex(index);
            setInviteIsOpen(true);
          }
        });
      });
      return () => {
        unsub();
      };
    }
  }, []);

  useEffect(() => {
    const getCreateGroupArr = async () => {
      const q = query(
        collection(db, "CreateCampingGroup"),
        where("header_id", "==", params.id)
      );
      const querySnapshot = await getDocs(q);
      let Arr = [];
      querySnapshot.forEach((doc) => {
        Arr.push(doc.data());
      });
      setYourCreateGroup(Arr);
    };
    getCreateGroupArr();
  }, []);

  useEffect(() => {
    setWithDrawGrop(false);
    const getParticipateGroupArr = async () => {
      let participateGroupArr = [];
      const q = query(doc(db, "joinGroup", params.id));
      const docSnap = await getDoc(q);
      if (docSnap.exists()) {
        participateGroupArr = docSnap.data().group;
      }

      if (participateGroupArr.length === 0) {
        setYourParticipateGroup([]);
      } else if (participateGroupArr[0].group_id == "") {
        return;
      }

      let showGroupArr = [];
      participateGroupArr.map(async (item) => {
        const docRef = await getDoc(doc(db, "CreateCampingGroup", item));
        if (docRef.exists()) {
          showGroupArr.push(docRef.data());
          setYourParticipateGroup(showGroupArr);
        } else {
          showGroupArr.push(docRef.data());
        }
      });
    };
    getParticipateGroupArr();
  }, [withDrawGrop]);

  useEffect(() => {
    const q = query(
      collection(db, "CreateCampingGroup"),
      where("header_id", "==", params.id)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const groups = [];
      querySnapshot.forEach((item) => {
        groups.push(item.data());
        if (
          new Date().getTime() <
          new Date(
            new Date(item.data().end_date.seconds * 1000)
              .toLocaleString()
              .split(" ")[0]
          ).getTime()
        ) {
          updateDoc(doc(db, "CreateCampingGroup", item.data().group_id), {
            status: "進行中",
          });
        } else {
          updateDoc(doc(db, "CreateCampingGroup", item.data().group_id), {
            status: "已結束",
          });
        }
      });
      setYourCreateGroup(groups);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        return;
      } else {
        navigate("/login");
      }
    });
  }, []);

  async function sweatAlertTowithDrawGrop(id, userId, index) {
    Swal.fire({
      text: "確定要退團？",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#426765",
      cancelButtonColor: "#EAE5BE",
      confirmButtonText: "確定退團",
    }).then(async (result) => {
      if (result.isConfirmed) {
        firebase.updateDocUserGroupId(userId, id);
        firebase.updateDocIncrementCurrentOfMember(id);
        firebase.deleteMemberOfGroup(id, userId);
        firebase.updateDocAlertToHeaderOfGroup(
          yourParticipateGroup[index].header_id,
          Context.userName,
          yourParticipateGroup[index].group_title
        );
        firebase.updateDocIncrementTentOfMember(id, userName);
        firebase.updateDocSuppliesOfMember(id, userName);

        setWithDrawGrop(true);
        Swal.fire({
          icon: "success",
          confirmButtonColor: "#426765",
          text: `成功退出${yourParticipateGroup[index].group_title}`,
        });
      }
    });
    setWithDrawGrop(true);
  }

  const memberWithdrawGroup = async (id, userId, index) => {
    sweatAlertTowithDrawGrop(id, userId, index);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  function getLogout() {
    signOut(auth)
      .then(() => {})
      .catch((error) => {});
    navigate("/login");
  }
  
  return (
    <>
      <Header ContextByUserId={Context} />
      {inviteIsOpen && (
        <SecondHandInvitation
          setInviteIsOpen={setInviteIsOpen}
          inviteIsOpen={inviteIsOpen}
          inviteInfo={inviteInfo}
          inviteInfoIndex={inviteInfoIndex}
          userId={Context.userId}></SecondHandInvitation>
      )}
      <InfoSection />
      <Box sx={BoxWrap}>
        <AppBar position='static' sx={{ bgcolor: "#426765" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            textColor='inherit'
            variant='fullWidth'
            aria-label='full width tabs example'
            TabIndicatorProps={{
              style: {
                backgroundColor: "#CFC781",
              },
            }}>
            <Tab
              label='開團'
              {...a11yProps(0)}
              sx={{ fontSize: "20px", letterSpacing: "px" }}
            />
            {Context.userId == params.id && (
              <Tab
                label='加入'
                {...a11yProps(1)}
                sx={{ fontSize: "20px", letterSpacing: "px" }}
              />
            )}
            <Tab
              label='二手交換'
              {...a11yProps(2)}
              sx={{ fontSize: "20px", letterSpacing: "px" }}
            />
          </Tabs>
        </AppBar>
        <SwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={value}
          onChangeIndex={handleChangeIndex}>
          <TabPanel value={value} index={0} dir={theme.direction}>
            {yourCreateGroup.length !== 0 ? (
              <YourCreateGroup />
            ) : (
              <DefaultWrap>
                <Img src={initial} width='300px' m='100px 10px 0px 0px'></Img>
                <Font m='30px 0px 0px 0px' letterSpacing='2px'>
                  點選<Span>建立露營團揪</Span>大家一起露營吧！
                </Font>
              </DefaultWrap>
            )}
          </TabPanel>
          <TabPanel value={value} index={1} dir={theme.direction}>
            {Context.userId === params.id ? (
              <>
                {yourParticipateGroup.length !== 0 ? (
                  <YourParticipateGroup
                    yourParticipateGroup={yourParticipateGroup}
                    memberWithdrawGroup={memberWithdrawGroup}
                    SentCommentToHeader={SentCommentToHeader}
                  />
                ) : (
                  <DefaultWrap>
                    <Img
                      src={initial}
                      width='300px'
                      m='100px 10px 0px 0px'></Img>
                    <Font m='30px 0px 0px 0px' letterSpacing='2px'>
                      還沒找到適合的露營團？首頁點選<Span>最佳推薦</Span>
                      搜尋最適合你的露營團
                    </Font>
                  </DefaultWrap>
                )}
              </>
            ) : (
              <SecondHand userId={params.id} userName={userName} />
            )}
          </TabPanel>
          <TabPanel value={value} index={2} dir={theme.direction}>
            {Context.userId === params.id && (
              <SecondHand userId={Context.userId} userName={userName} />
            )}
          </TabPanel>
        </SwipeableViews>
      </Box>
      {Context.userId === params.id && (
        <Button width='100px' onClick={getLogout}>
          登出
        </Button>
      )}
      <Footer />
    </>
  );
}
