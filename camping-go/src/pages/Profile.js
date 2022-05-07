import * as React from "react";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material/styles";
import { AppBar, Tabs, Tab, Typography, Box } from "@mui/material";
import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { db } from "../utils/firebase";
import {
  getDocs,
  collection,
  query,
  where,
  doc,
  deleteDoc,
  onSnapshot,
  updateDoc,
  arrayRemove,
  setDoc,
  increment,
  getDoc,
  arrayUnion,
} from "firebase/firestore";
import {
  Font,
  Img,
  Display,
  Button,
  Wrap,
  Tag,
  ImgWrap,
  Cloumn,
  Hr,
} from "../css/style";
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
import { signOut, getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

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
`;

const ScrollWrap = styled.div`
  height: 280px;
  margin-top: 30px;
  overflow: scroll;
  ::-webkit-scrollbar {
    height: 0px;
    width: 6px;
    border-radius: 3px;
    border-left: 6px solid #e6ecf8;
  }
  ::-webkit-scrollbar-thumb {
    background-color: #eae5be;
  }
`;

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

const CommentTitleWrap = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  text-align: center;
`;

const DeleteModalButton = styled.button`
  width: 30px;
  height: 30px;
  position: absolute;
  top: 30px;
  left: 30px;
  border: none;
  color: #426765;
  background-color: #eae5be;
  border-radius: 10px;
  cursor: pointer;
  &:hover {
    color: #cfc781;
  }
`;

const ProfileWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
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
  const [alertOpen, setAlertOpen] = useState(false);
  const [value, setValue] = useState("Controlled");
  const [startValue, setStartValue] = React.useState(2);
  const [profileImg, setProfileImg] = useState("");

  // console.log(groupId);
  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const sendComment = async () => {
    // console.log(groupId);
    setAlertOpen(true);

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
      console.log(docMemberInfo.data().profile_img);
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

      // console.log(totalScore);

      updateDoc(doc(db, "CreateCampingGroup", groupId), {
        total_score: totalScore / scoreArr.length,
        comment: commentArr,
      });
    });

    setTimeout(() => {
      setAlertOpen(false);
    }, 1000);
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
        <SendCommentWrap>
          <DeleteModalButton onClick={() => setIsOpen(false)}>
            X
          </DeleteModalButton>
          <Font>評論</Font>
          <Hr width='60%'></Hr>
          <TextField
            sx={{ width: "60%" }}
            id='filled-multiline-static'
            label=''
            multiline
            rows={4}
            defaultValue=''
            variant='filled'
            onChange={handleChange}
          />
          <Rating
            name='size-large'
            defaultValue={2}
            size='large'
            value={startValue}
            sx={{ margin: "30px" }}
            onChange={(event, newValue) => {
              console.log(newValue);
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

function CheckCommentFromMember({ groupId }) {
  const [commentIsOpen, setCommentIsOpen] = useState(false);
  const [comment, setComment] = useState([]);
  const [totalScore, setTotalScore] = useState("");

  const checkComment = async () => {
    console.log(groupId);
    let commentArr = [];
    setCommentIsOpen(true);
    const commentRef = collection(
      db,
      "CreateCampingGroup",
      groupId,
      "feedback"
    );
    const querySnapshot = await getDocs(commentRef);
    querySnapshot.forEach((doc) => {
      commentArr.push(doc.data());
    });
    setComment(commentArr);
  };

  useEffect(() => {
    if (comment.length !== 0) {
      console.log("hi");
      let scoreArr = [];
      comment.map((item) => {
        console.log(item.score);
        scoreArr.push(Number(item.score));
      });
      let totalScoreNumber = scoreArr.reduce(function (total, e) {
        return total + e;
      }, 0);
      setTotalScore(totalScoreNumber / comment.length);
    } else {
      return;
    }
  }, [comment]);

  // useEffect(() => {
  //   updateDoc(doc(db, "CreateCampingGroup", groupId), {
  //     total_score: totalScore,
  //   });
  // }, [totalScore]);

  return (
    <div className='App'>
      <Button
        width=' 150px'
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
          {/* <CommentTitleWrap> */}
          <Font fontSize='20px' letterSpacing='3px'>
            你的評論
          </Font>
          <Hr width='60%'></Hr>
          <Display>
            {totalScore ? (
              <div>
                <Display>
                  <Font fontSize='16px'>總分</Font>
                  <Font fontSize='35px' marginLeft='3px'>
                    {totalScore}
                  </Font>
                </Display>
              </div>
            ) : (
              <Font>尚未有回饋唷！</Font>
            )}
          </Display>
          {/* </CommentTitleWrap> */}

          {totalScore && (
            <ScrollWrap>
              {comment &&
                comment.map((item) => (
                  <Box
                    sx={{
                      width: "500px",
                      height: "auto",
                      padding: 1,
                      margin: 1,
                    }}>
                    <Wrap
                      width='500px'
                      borderBottom='1.4px solid #EAE5BE'
                      paddingBottom='20px'>
                      <Wrap justifyContent='space-between' width='500px'>
                        <Display>
                          <Wrap
                            direction='column'
                            width='100px'
                            m='0px 40px 0px 0px'>
                            <ProfileWrap>
                              <Img src={item.profile_img}></Img>
                            </ProfileWrap>
                            <Font fontSize='14px'>{item.name}</Font>
                          </Wrap>
                          <Wrap width='200px'>
                            <Font fontSize='14px'>{item.note}</Font>
                          </Wrap>
                        </Display>
                        <Font marginLeft='100px'>{item.score}分</Font>
                      </Wrap>
                    </Wrap>
                  </Box>
                ))}
            </ScrollWrap>
          )}
        </CheckCommentWrap>
      </Modal>
    </div>
  );
}

function CheckOfGroupMember({ groupId, setRenderParticipateArr, group_title }) {
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

  const removeMember = async (index, role, member_id) => {
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
    const docRefJoinGroup = doc(db, "joinGroup", member_id);
    updateDoc(docRefJoinGroup, {
      group: arrayRemove(groupId),
    });

    const docRefCreateGroup = doc(db, "CreateCampingGroup", groupId);
    updateDoc(docRefCreateGroup, {
      current_number: increment(-1),
    });

    updateDoc(doc(db, "joinGroup", member_id), {
      alert: arrayUnion({
        alert_content: `哭哭，你已被移除「${group_title}」。`,
        is_read: false,
      }),
    });
    setRenderParticipateArr(true);
  };

  return (
    <div>
      <Button
        width=' 150px'
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
        <CheckCommentWrap>
          <DeleteModalButton onClick={() => setMemberIsOpen(false)}>
            X
          </DeleteModalButton>
          <Font fontSize='20px'>你的團員</Font>
          <Hr width='60%'></Hr>

          {member.map((item, index) => (
            <Box
              sx={{
                width: "500px",
                height: "auto",
                borderBottom: " 1.4px solid #EAE5BE",
                padding: 3,
                margin: 1,
                display: "flex",
                justifyContent: "space-between",
              }}>
              <Display>
                {item.role == "header" && (
                  <Tag
                    width='35px'
                    p='3px 0px 0px 5px'
                    fontSize='14px'
                    height='25px'
                    m='0px 10px 0px 0px'>
                    團長
                  </Tag>
                )}
                <Font>{item.member_name}</Font>
              </Display>
              {item.role == "member" && (
                <Button
                  width='150px'
                  mt='10px'
                  ml='20px'
                  boxShadow='none'
                  onClick={() => {
                    removeMember(index, item.role, item.member_id);
                  }}>
                  移除成員
                </Button>
              )}
            </Box>
          ))}
        </CheckCommentWrap>
      </Modal>
    </div>

    /* <Modal
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
      </Modal> */
  );
}

export default function Profile({ userName, userId, getLogout }) {
  let params = useParams();
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const [yourCreateGroup, setYourCreateGroup] = useState([]);
  const [yourParticipateGroup, setYourParticipateGroup] = useState([]);
  const [renderParticipateArr, setRenderParticipateArr] = useState(false);
  const [withDrawGrop, setWithDrawGrop] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

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
    console.log(yourParticipateGroup);
    setWithDrawGrop(false);
    const groups = [];
    //先抓joingroup團員參與過的團ID
    let participateGroupArr = [];
    const q = query(doc(db, "joinGroup", params.id));
    const docSnap = await getDoc(q);
    if (docSnap.exists()) {
      participateGroupArr = docSnap.data().group;
    } else {
      console.log("noway");
    }
    console.log(participateGroupArr);

    if (participateGroupArr.length === 0) {
      setYourParticipateGroup([]);
    }

    let showGroupArr = [];
    participateGroupArr.map(async (item) => {
      const docRef = await getDoc(doc(db, "CreateCampingGroup", item));
      if (docRef.exists()) {
        console.log(docRef.data());
        showGroupArr.push(docRef.data());
        setYourParticipateGroup(showGroupArr);
      } else {
        showGroupArr.push(docRef.data());
      }
    });

    //拿這些groupID去跟createCampingGroup比對 抓相對應的資料
    // if (participateGroupArr.length == 0) {
    //   setYourParticipateGroup([]);
    // } else {
    //   participateGroupArr.map((item) => {
    //     const q = query(
    //       collection(db, "CreateCampingGroup"),
    //       where("group_id", "==", item)
    //     );
    //     const unsubscribe = onSnapshot(q, (querySnapshot) => {
    //       querySnapshot.forEach((item) => {
    //         // console.log(item.data());
    //         groups.push(item.data());
    //       });
    //       setYourParticipateGroup(groups);
    //     });
    //   });
    // }
  }, [withDrawGrop]);

  console.log(yourParticipateGroup);

  useEffect(() => {
    const q = query(
      collection(db, "CreateCampingGroup"),
      where("header_id", "==", params.id)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const groups = [];
      querySnapshot.forEach((item) => {
        console.log(item.data());
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
  }, []);

  const memberWithdrawGroup = async (id, userId, index) => {
    await updateDoc(doc(db, "joinGroup", userId), {
      group: arrayRemove(id),
    });
    await updateDoc(doc(db, "CreateCampingGroup", id), {
      current_number: increment(-1),
    });
    await deleteDoc(doc(db, "CreateCampingGroup", id, "member", userId));

    updateDoc(doc(db, "joinGroup", yourParticipateGroup[index].header_id), {
      alert: arrayUnion({
        alert_content: `${userName}已退出「${yourParticipateGroup[index].group_title}」`,
        is_read: false,
      }),
    });

    const q = query(
      collection(db, "CreateCampingGroup", id, "tent"),
      where("member", "array-contains", userName)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((item) => {
      console.log(item.id, " => ", item.data());
      updateDoc(doc(db, "CreateCampingGroup", id, "tent", item.id), {
        current_number: increment(-1),
        member: arrayRemove(userName),
      });
    });

    const getSupplies = query(
      collection(db, "CreateCampingGroup", id, "supplies"),
      where("bring_person", "==", userName)
    );
    const querySupplies = await getDocs(getSupplies);
    querySupplies.forEach((item) => {
      console.log(item.id, " => ", item.data());
      updateDoc(doc(db, "CreateCampingGroup", id, "supplies", item.id), {
        bring_person: " ",
      });
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

  function getLogout() {
    signOut(auth)
      .then(() => {})
      .catch((error) => {});
    navigate("/login");
    // setToken("");
  }

  return (
    <>
      {userId == params.id && (
        <div>
          <Header ContextByUserId={ContextByUserId} />
          <Wrap
            maxWidth='1440px'
            width='75%'
            m='20px 40px 0px 12%'
            alignItems='center'
            justifyContent='space-between'
            boxShadow='none'>
            <Display>
              <ProfilePicture userId={userId} />
              <Wrap
                width='500px'
                direction='column'
                alignItems='start'
                m='0px 0px 0px 60px'
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
            </Display>
            {params.id == userId ? (
              <Button width='100px' onClick={getLogout}>
                登出
              </Button>
            ) : (
              <></>
            )}
          </Wrap>
          {userId == params.id ? (
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
                                <Img
                                  src={item.picture}
                                  width='100%'
                                  m='0px'></Img>
                              </ImgWrap>
                              <Display
                                direction='column'
                                alignItems='start'
                                ml='30px'>
                                <Tag bgc='#CFC781' color='white'>
                                  {item.status}
                                </Tag>
                                <Font
                                  fontSize='25px'
                                  letterSpacing='3px'
                                  m='10px 0px 0px 0px'>
                                  {item.group_title}
                                </Font>
                                <Font fontSize='14px' m='0px 0px 15px 0px'>
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
                                    width='20px'
                                    m=' 0px 8px 0px -3px '></Img>
                                  <Font fontSize='16px'>{item.city}</Font>
                                </Display>
                              </Display>
                            </Display>
                            <Display alignItems='center'>
                              {/* {item.score && (
                          <Display>
                            <Font fontSize='40px'>{item.score}</Font>
                            <Font fontSize='20px'>分</Font>
                          </Display>
                        )} */}
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
                            group_title={item.group_title}
                          />
                          <Button
                            border='#CFC781'
                            bgc='#FFFEF4'
                            width='150px'
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
                                  <Img
                                    src={item.picture}
                                    width='100%'
                                    m='0px'></Img>
                                </ImgWrap>
                                <Display
                                  direction='column'
                                  alignItems='start'
                                  ml='30px'>
                                  <Tag bgc='#CFC781' color='white'>
                                    {item.status}
                                  </Tag>
                                  <Font
                                    fontSize='25px'
                                    letterSpacing='3px'
                                    m='5px 0px 3px 0px'>
                                    {item.group_title}
                                  </Font>
                                  <Font fontSize='14px' m='0px 0px 15px 0px'>
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
                                    <Font fontSize='16px'>{item.city}</Font>
                                  </Display>
                                </Display>
                              </Display>
                              <Display alignItems='center'>
                                {/* {item.score && (
                            <Display>
                              <Font fontSize='40px'>{item.score}</Font>
                              {item.score && <Font fontSize='20px'>分</Font>}
                            </Display>
                          )} */}
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
                              <SentCommentToHeader
                                groupId={item.group_id}
                                userName={userName}
                                userId={userId}
                              />
                            )}
                            {item.status == "進行中" && (
                              <Button
                                border='#CFC781'
                                bgc='#FFFEF4'
                                width='200px'
                                onClick={(id) => {
                                  memberWithdrawGroup(
                                    item.group_id,
                                    userId,
                                    index
                                  );
                                }}>
                                我要退團
                              </Button>
                            )}
                          </Wrap>
                        </Display>
                      </Box>
                    ))}
                  </div>
                )}
                <TabPanel
                  value={value}
                  index={1}
                  dir={theme.direction}></TabPanel>
              </SwipeableViews>
            </Box>
          ) : (
            <div>123</div>
          )}
        </div>
      )}
      {userId !== params.id && (
        <div>
          <Header ContextByUserId={ContextByUserId} />
          <Wrap
            maxWidth='1440px'
            width='75%'
            m='20px 40px 0px 12%'
            alignItems='center'
            justifyContent='space-between'
            boxShadow='none'>
            <Display>
              {yourCreateGroup.length !== 0 && (
                <ProfilePicture userId={yourCreateGroup[0].header_id} />
              )}

              <Wrap
                width='500px'
                direction='column'
                alignItems='start'
                m='0px 0px 0px 60px'
                boxShadow='none'>
                <Font
                  fontSize='40px'
                  margin='0px 0px 10px 20px'
                  marginLeft='20px'
                  color='#426765'>
                  {yourCreateGroup.length !== 0 &&
                    yourCreateGroup[0].header_name}
                </Font>
              </Wrap>
            </Display>
          </Wrap>
          {userId !== params.id ? (
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
                                <Img
                                  src={item.picture}
                                  width='100%'
                                  m='0px'></Img>
                              </ImgWrap>
                              <Display
                                direction='column'
                                alignItems='start'
                                ml='30px'>
                                <Tag bgc='#CFC781' color='white'>
                                  {item.status}
                                </Tag>
                                <Font
                                  fontSize='25px'
                                  letterSpacing='3px'
                                  m='10px 0px 0px 0px'>
                                  {item.group_title}
                                </Font>
                                <Font fontSize='14px' m='0px 0px 15px 0px'>
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
                                    width='20px'
                                    m=' 0px 8px 0px -3px '></Img>
                                  <Font fontSize='16px'>{item.city}</Font>
                                </Display>
                              </Display>
                            </Display>
                            <Display alignItems='center'>
                              {/* {item.score && (
                          <Display>
                            <Font fontSize='40px'>{item.score}</Font>
                            <Font fontSize='20px'>分</Font>
                          </Display>
                        )} */}
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
                        </Wrap>
                      </Display>
                    </Box>
                  ))}
                </TabPanel>
              </SwipeableViews>
            </Box>
          ) : (
            <div></div>
          )}
        </div>
      )}
    </>
  );
}
