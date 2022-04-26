import * as React from "react";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material/styles";
import { AppBar, Tabs, Tab, Typography, Box } from "@mui/material";
import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { db } from "../utils/firebase";
import {
  getDoc,
  getDocs,
  collection,
  query,
  where,
  doc,
  addDoc,
  deleteDoc,
  onSnapshot,
  updateDoc,
  arrayRemove,
} from "firebase/firestore";
import { Font, Img, Display, Button } from "../css/style";
import Modal from "react-modal";
import "../css/modal.css";
import { TextField, Alert, Collapse, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { UserContext } from "../utils/userContext";
import Rating from "@mui/material/Rating";
import Header from "../component/Header";
import { Link } from "react-router-dom";
import styled from "styled-components";
import ProfilePicture from "../component/ProfilePicture"

Modal.setAppElement("#root");

const LinkRoute = styled(Link)`
  text-decoration: none;
  margin: 5px 5px;
  font-size: 14px;
  color: gray;
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
          <Typography>{children}</Typography>
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

function SentCommentToHeader({ groupId, userName, userId }) {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(true);
  const [value, setValue] = useState("Controlled");
  const [startValue, setStartValue] = React.useState(2);

  // console.log(groupId);
  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const sendComment = async () => {
    console.log(groupId);
    setAlertOpen(true);
    const docRef = collection(db, "feedback", groupId, "comment");
    await addDoc(docRef, {
      name: userName,
      note: value,
      score: startValue,
      user_iD: userId,
    });
  };

  return (
    <div className='App'>
      <Button onClick={() => setIsOpen(true)} width=' 200px'>
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
        <Display direction='column'>
          <Font onClick={() => setIsOpen(false)}>X</Font>
          <Font>評論</Font>
          <hr></hr>
          <TextField
            id='filled-multiline-static'
            label='建議'
            multiline
            rows={4}
            defaultValue=''
            variant='filled'
            onChange={handleChange}
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
          <Box>
            <Rating
              name='size-large'
              defaultValue={2}
              size='large'
              value={startValue}
              onChange={(event, newValue) => {
                console.log(newValue);
                setStartValue(newValue);
              }}
            />
          </Box>

          <Button bgc='#426765' color='#eae5be' onClick={sendComment}>
            送出評論
          </Button>
        </Display>
      </Modal>
    </div>
  );
}

function CheckCommentFromMember({ groupId }) {
  const [commentIsOpen, setCommentIsOpen] = useState(false);
  const [comment, setComment] = useState([]);
  const [totalScore, setTotalScore] = useState("");

  const checkComment = async () => {
    console.log(groupId);
    let commentArr = [];
    setCommentIsOpen(true);
    const commentRef = collection(db, "feedback", groupId, "comment");
    const querySnapshot = await getDocs(commentRef);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, " => ", doc.data());
      commentArr.push(doc.data());
    });
    setComment(commentArr);
  };

  useEffect(() => {
    let scoreArr = [];
    comment.map((item) => {
      console.log(item.score);
      scoreArr.push(item.score);
    });
    let totalScore = scoreArr.reduce(function (total, e) {
      return total + e;
    }, 0);

    setTotalScore(totalScore / comment.length);
  }, [comment]);

  return (
    <div className='App'>
      <Button
        width=' 200px'
        onClick={checkComment}
        setCommentIsOpen={setCommentIsOpen}>
        查看評論
      </Button>
      <Modal
        isOpen={commentIsOpen}
        onRequestClose={() => setCommentIsOpen(false)}
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
        <Display direction='column'>
          <Font onClick={() => setCommentIsOpen(false)}>X</Font>
          <Font>你的評論</Font>
          <Font>總分</Font>
          <Font>{totalScore}</Font>
          <div className='setScroll'>
            {comment &&
              comment.map((item) => (
                <Box
                  sx={{
                    width: "600px",
                    height: "auto",
                    boxShadow: 3,
                    borderRadius: 6,
                    padding: 1,
                    margin: 1,
                  }}>
                  <Font>{item.name}</Font>
                  <Font>{item.note}</Font>
                  <Font>{item.score}</Font>
                </Box>
              ))}
          </div>
        </Display>
      </Modal>
    </div>
  );
}

function CheckOfGroupMember({ groupId, userId, setRenderParticipateArr }) {
  const [memberIsOpen, setMemberIsOpen] = useState(false);
  const [member, setMember] = useState([]);
  const checkMemberList = async () => {
    setMemberIsOpen(true);
    const docRef = await collection(
      db,
      "CreateCampingGroup",
      groupId,
      "member"
    );
    let memberArr = [];

    const memberData = await getDocs(docRef);
    memberData.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      memberArr.push(doc.data());
    });
    setMember(memberArr);
  };

  const removeMember = async (index) => {
    console.log(groupId);
    await deleteDoc(
      doc(db, "CreateCampingGroup", groupId, "member", member[index].member_id)
    ).then(async () => {
      let afterDeleteMemberArr = [];
      const commentRef = collection(
        db,
        "CreateCampingGroup",
        groupId,
        "member"
      );
      const querySnapshot = await getDocs(commentRef);
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        afterDeleteMemberArr.push(doc.data());
      });
      setMember(afterDeleteMemberArr);
    });
    const docRefJoinGroup = await doc(db, "joinGroup", userId);
    updateDoc(docRefJoinGroup, {
      group: arrayRemove(groupId),
    });
    setRenderParticipateArr(true);
  };

  return (
    <div className='App'>
      <Button
        width=' 200px'
        onClick={checkMemberList}
        setMemberIsOpen={setMemberIsOpen}>
        查看團員名單
      </Button>
      <Modal
        isOpen={memberIsOpen}
        onRequestClose={() => setMemberIsOpen(false)}
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
        <Display direction='column'>
          <Font onClick={() => setMemberIsOpen(false)}>X</Font>
          <Font>你的團員</Font>
          <div className='setScroll'>
            {member.map((item, index) => (
              <Display>
                <Font>{item.member_name}</Font>
                <Button
                  width='150px'
                  mt='10px'
                  ml='20px'
                  bgc='white'
                  boxShadow='none'
                  onClick={() => {
                    removeMember(index);
                  }}>
                  移除成員
                </Button>
              </Display>
            ))}
          </div>
        </Display>
      </Modal>
    </div>
  );
}

export default function Profile({ userName, userId }) {
  let params = useParams();
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const [yourCreateGroup, setYourCreateGroup] = useState([]);
  const [yourParticipateGroup, setYourParticipateGroup] = useState([]);
  const [renderParticipateArr, setRenderParticipateArr] = useState(false);

  const ContextByUserId = useContext(UserContext);

  useEffect(async () => {
    const q = query(
      collection(db, "CreateCampingGroup"),
      where("header_id", "==", params.id)
    );
    const querySnapshot = await getDocs(q);
    let Arr = [];
    querySnapshot.forEach((doc) => {
      // console.log(doc.id, " => ", doc.data());
      Arr.push(doc.data());
    });
    setYourCreateGroup(Arr);
  }, []);

  useEffect(async () => {
    let participateGroupArr = [];
    let renderArr = [];
    const q = query(doc(db, "joinGroup", params.id));
    const docSnap = await getDoc(q);
    if (docSnap.exists()) {
      participateGroupArr = docSnap.data().group;
    } else {
      console.log("No such document!");
    }
    const groups = [];
    participateGroupArr.map(async (item) => {
      const q = query(
        collection(db, "CreateCampingGroup"),
        where("group_id", "==", item)
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach(async (item) => {
          console.log(item.data());
          if (
            new Date().getTime() <
            new Date(
              new Date(item.data().end_date.seconds * 1000)
                .toLocaleString()
                .split(" ")[0]
            ).getTime()
          ) {
            await updateDoc(
              doc(db, "CreateCampingGroup", item.data().group_id),
              {
                status: "進行中",
              }
            );
          } else {
            await updateDoc(
              doc(db, "CreateCampingGroup", item.data().group_id),
              {
                status: "已結束",
              }
            );
          }
          groups.push(item.data());
        });
        console.log(groups);
        setYourParticipateGroup(groups);
      });
      // const docRef = await doc(db, "CreateCampingGroup", item);
      // const groupData = await getDoc(docRef);
      // if (groupData.exists()) {
      //   renderArr.push(groupData.data());
      //   setYourParticipateGroup(renderArr);
      // } else {
      //   console.log("No such document!");
      // }
    });
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  const deleteThisGroup = async (id) => {
    console.log(id);
    await deleteDoc(doc(db, "CreateCampingGroup", id));
  };

  const memberWithdrawGroup = async (id, userId) => {
    await updateDoc(doc(db, "joinGroup", userId), {
      group: arrayRemove(id),
    });

    let participateGroupArr = [];
    const q = query(doc(db, "joinGroup", params.id));
    const docSnap = await getDoc(q);
    if (docSnap.exists()) {
      participateGroupArr = docSnap.data().group;
    } else {
      console.log("No such document!");
    }
    participateGroupArr.map(async (item) => {
      console.log(item);
      let renderArr = [];
      const docRef = doc(db, "CreateCampingGroup", item);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        renderArr.push(docSnap.data());
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
      console.log(renderArr);
      setYourParticipateGroup(renderArr);

      //   const unsub = onSnapshot(doc(db, "CreateCampingGroup", item), (doc) => {
      //     console.log("Current data: ", doc.data());
      //     renderArr.push(doc.data());
      //     console.log(renderArr);
      //   });
      //   setYourParticipateGroup(renderArr);
    });
  };

  const q = query(
    collection(db, "CreateCampingGroup"),
    where("header_id", "==", params.id)
  );

  useEffect(() => {
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const groups = [];
      querySnapshot.forEach((doc) => {
        groups.push(doc.data());
      });
      setYourCreateGroup(groups);
    });
  }, []);

  return (
    <div>
      <Header ContextByUserId={ContextByUserId} />
      <h1>{userName}</h1>
      <ProfilePicture/>
      <Box sx={{ bgcolor: "background.paper", width: "100%" }}>
        <AppBar position='static' sx={{ bgcolor: "#426765" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            // indicatorColor='secondary'
            textColor='inherit'
            variant='fullWidth'
            aria-label='full width tabs example'
            TabIndicatorProps={{
              style: {
                backgroundColor: "#CFC781",
              },
            }}>
            <Tab label='我開的團' {...a11yProps(0)} />
            <Tab label='加入的團' {...a11yProps(1)} />
          </Tabs>
        </AppBar>
        <SwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={value}
          onChangeIndex={handleChangeIndex}>
          <TabPanel value={value} index={0} dir={theme.direction}>
            {yourCreateGroup.map((item, index) => (
              <Box
                key={index}
                sx={{
                  width: "80%",
                  height: "auto",
                  boxShadow:
                    "0.8rem 0.8rem 3.2rem #E2E1D3 , -0.5rem -0.5rem 1rem #ffffff",
                  borderRadius: 6,
                  padding: 3,
                  margin: 3,
                }}>
                <Display justifyContent='space-around'>
                  <LinkRoute to={`/joinGroup/${item.group_id}`}>
                    <Display direction='column' alignItems='start'>
                      {item.status}
                      <Img src={item.picture} width='300px'></Img>
                      <Font>{item.group_title}</Font>
                      <Font>
                        {
                          new Date(item.start_date.seconds * 1000)
                            .toLocaleString()
                            .split(" ")[0]
                        }
                        ~
                        {
                          new Date(item.end_date.seconds * 1000)
                            .toLocaleString()
                            .split(" ")[0]
                        }
                      </Font>
                      <Font>{item.city}</Font>
                    </Display>
                  </LinkRoute>
                  <Display direction='column' alignItems='end'>
                    {item.status == "已結束" && (
                      <CheckCommentFromMember groupId={item.group_id} />
                    )}
                    <CheckOfGroupMember
                      setRenderParticipateArr={setRenderParticipateArr}
                      groupId={item.group_id}
                      userId={userId}
                    />
                    <Button
                      width='200px'
                      onClick={(id) => {
                        deleteThisGroup(item.group_id);
                      }}>
                      刪除此團
                    </Button>
                  </Display>
                </Display>
              </Box>
            ))}
          </TabPanel>
          {yourParticipateGroup && (
            <div>
              {yourParticipateGroup.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    width: "80%",
                    height: "auto",
                    boxShadow: 2,
                    borderRadius: 6,
                    padding: 3,
                    margin: 3,
                  }}>
                  <Display justifyContent='space-around'>
                    <LinkRoute to={`/joinGroup/${item.group_id}`}>
                      <Display direction='column' alignItems='start'>
                        {item.status}
                        <Img src={item.picture} width='300px'></Img>
                        <Font>{item.group_title}</Font>
                        <Font>
                          {item.start_date.seconds &&
                            new Date(item.start_date.seconds * 1000)
                              .toLocaleString()
                              .split(" ")[0]}
                          ~
                          {item.end_date.seconds &&
                            new Date(item.end_date.seconds * 1000)
                              .toLocaleString()
                              .split(" ")[0]}
                        </Font>
                        <Font>{item.city}</Font>
                      </Display>
                    </LinkRoute>

                    <Display direction='column' alignItems='end'>
                      <Button
                        width='200px'
                        onClick={() => {
                          memberWithdrawGroup(item.group_id, userId);
                        }}>
                        我要退團
                      </Button>
                      {item.status == "已結束" && (
                        <SentCommentToHeader
                          groupId={item.group_id}
                          userName={userName}
                          userId={userId}
                        />
                      )}
                    </Display>
                  </Display>
                </Box>
              ))}
            </div>
          )}
          <TabPanel value={value} index={1} dir={theme.direction}></TabPanel>
        </SwipeableViews>
      </Box>
    </div>
  );
}
