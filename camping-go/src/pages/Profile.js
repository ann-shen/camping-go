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
  setDoc,
} from "firebase/firestore";
import { Font, Img, Display, Button, Wrap, Tag, ImgWrap } from "../css/style";
import Modal from "react-modal";
import "../css/modal.css";
import { TextField, Alert, Collapse, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { UserContext } from "../utils/userContext";
import Rating from "@mui/material/Rating";
import Header from "../component/Header";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { ProfilePicture } from "../component/ProfilePicture";
import location from "../image/location.png";
import MultipleSelectChip from "../component/MultipleSelectChip";
import { borderBottom } from "@mui/system";
Modal.setAppElement("#root");

const LinkRoute = styled(Link)`
  text-decoration: none;
  margin: 5px 5px;
  font-size: 14px;
  color: gray;
`;

const CheckCommentWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  position: relative;
  padding: 40px 10px;
  margin-right: 40px;
  overflow: scroll;

  /* ::-webkit-scrollbar {
    background-color: red;
    border-radius: 10px;
  } */

  ::-webkit-scrollbar {
    width: 6px;
    border-radius: 3px;
    border-left: 6px solid #e6ecf8;
  }
  ::-webkit-scrollbar-thumb {
    background-color: #eae5be;
  }
`;

const CommentTitleWrap = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  text-align: center;
`;

const DeleteModalButton = styled.button`
  width: 20px;
  position: absolute;
  top: 30px;
  left: 30px;
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
    const feedbackInCreateRef = doc(
      db,
      "CreateCampingGroup",
      groupId,
      "feedback",
      userId
    );
    await setDoc(feedbackInCreateRef, {
      name: userName,
      note: value,
      score: startValue,
      user_id: userId,
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
    // const commentRef = collection(db, "feedback", groupId, "comment");
    const commentRef = collection(
      db,
      "CreateCampingGroup",
      groupId,
      "feedback"
    );
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
      scoreArr.push(Number(item.score));
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
        <CheckCommentWrap>
          <DeleteModalButton onClick={() => setCommentIsOpen(false)}>
            X
          </DeleteModalButton>
          <CommentTitleWrap>
            <Font fontSize='30px'>你的評論</Font>
            <Display>
              <Font>總分</Font>
              <Font>{totalScore}</Font>
            </Display>
          </CommentTitleWrap>

          <div>
            {comment &&
              comment.map((item) => (
                <Box
                  sx={{
                    width: "500px",
                    height: "auto",
                    borderBottom: " 1.4px solid #EAE5BE",
                    padding: 3,
                    margin: 1,
                  }}>
                  <Font>{item.name}</Font>
                  <Font>{item.note}</Font>
                  <Font>{item.score}</Font>
                </Box>
              ))}
          </div>
        </CheckCommentWrap>
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
  const [withDrawGrop, setWithDrawGrop] = useState(false);

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
    //先抓joingroup團員參與過的團ID
    let participateGroupArr = [];
    const q = query(doc(db, "joinGroup", params.id));
    const docSnap = await getDoc(q);
    if (docSnap.exists()) {
      // console.log(docSnap.data());
      participateGroupArr = docSnap.data().group;
    } else {
      console.log("No such document!");
    }

    //拿這些groupID去跟createCampingGroup比對 抓相對應的資料
    const groups = [];
    participateGroupArr.map(async (item) => {
      const q = query(
        collection(db, "CreateCampingGroup"),
        where("group_id", "==", item)
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach((item) => {
          console.log(item.data());
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
          groups.push(item.data());
        });
        console.log(groups);
        setYourParticipateGroup(groups);
      });
      // let renderArr = [];
      // const docRef = await doc(db, "CreateCampingGroup", item);
      // const groupData = await getDoc(docRef);
      // if (groupData.exists()) {
      //   renderArr.push(groupData.data());
      //   setYourParticipateGroup(renderArr);
      // } else {
      //   console.log("No such document!");
      // }
    });
  }, [withDrawGrop]);

  useEffect(() => {
    const q = query(
      collection(db, "CreateCampingGroup"),
      where("header_id", "==", params.id)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const groups = [];
      querySnapshot.forEach((doc) => {
        groups.push(doc.data());
      });
      setYourCreateGroup(groups);
    });
  }, []);

  console.log(yourParticipateGroup);

  const memberWithdrawGroup = async (id, userId) => {
    await updateDoc(doc(db, "joinGroup", userId), {
      group: arrayRemove(id),
    });
    setWithDrawGrop(true);
  };

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

  return (
    <div>
      <Header ContextByUserId={ContextByUserId} />

      <Wrap
        width='100%'
        m='20px 40px 0px 12%'
        alignItems='center'
        boxShadow='none'>
        <ProfilePicture userId={userId} />
        <Wrap
          width='500px'
          direction='column'
          alignItems='start'
          m='0px 0px 0px 20px'
          boxShadow='none'>
          <Font
            fontSize='40px'
            margin='0px 0px 10px 20px'
            marginLeft='20px'
            color='#426765'>
            {userName}
          </Font>
          <Display>
            <MultipleSelectChip userId={userId} />
          </Display>
        </Wrap>
      </Wrap>

      <Box
        sx={{
          width: "75%",
          height: "auto",
          boxShadow:
            "0.8rem 0.8rem 2.2rem #E2E1D3 , -0.5rem -0.5rem 1rem #ffffff",
          borderRadius: 10,
          paddingTop: 8,
          margin: "auto",
          marginBottom: "100px",
          paddingBottom: "50px",
        }}>
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
            <Tab
              label='開團'
              {...a11yProps(0)}
              sx={{ fontSize: "20px", letterSpacing: "px" }}
            />
            <Tab
              label='加入'
              {...a11yProps(1)}
              sx={{ fontSize: "20px", letterSpacing: "px" }}
            />
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
                  width: "85%",
                  height: "auto",
                  boxShadow:
                    "0.8rem 0.8rem 3.2rem #E2E1D3 , -1.0rem -1.0rem 1rem #ffffff",
                  borderRadius: 6,
                  padding: 5,
                  margin: "auto",
                  marginTop: "30px",
                  border: "1px solid #CFC781 ",
                  justifyContent: "space-around",
                }}>
                <Display justifyContent='space-between' ml='20px'>
                  <LinkRoute to={`/joinGroup/${item.group_id}`}>
                    <Display direction='column' alignItems='start'>
                      <Display alignItems='start'>
                        <ImgWrap>
                          <Img src={item.picture} width='130%' m='0px'></Img>
                        </ImgWrap>
                        <Display
                          direction='column'
                          alignItems='start'
                          ml='30px'>
                          <Tag bgc='#CFC781' color='white'>
                            {item.status}{" "}
                          </Tag>
                          <Font fontSize='30px' m='10px 0px 10px 0px'>
                            {item.group_title}
                          </Font>
                          <Font fontSize='16px' m='0px 0px 15px 0px'>
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
                          <Display>
                            <Img
                              src={location}
                              width='24px'
                              m=' 0px 8px 0px -3px '></Img>
                            <Font fontSize='20px'>{item.city}</Font>
                          </Display>
                        </Display>
                      </Display>
                      <Display alignItems='center'>
                        <Font fontSize='40px'>{item.score}</Font>
                        <Font fontSize='20px'>分</Font>
                      </Display>
                    </Display>
                  </LinkRoute>
                  <Wrap
                    direction='column'
                    alignItems='end'
                    height='250px'
                    justifyContent='space-evenly'
                    m='20px'>
                    {item.status == "已結束" && (
                      <CheckCommentFromMember groupId={item.group_id} />
                    )}
                    <CheckOfGroupMember
                      setRenderParticipateArr={setRenderParticipateArr}
                      groupId={item.group_id}
                      userId={userId}
                    />
                    <Button
                      border='#CFC781'
                      bgc='#FFFEF4'
                      width='200px'
                      onClick={(id) => {
                        deleteThisGroup(item.group_id);
                      }}>
                      刪除此團
                    </Button>
                  </Wrap>
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
