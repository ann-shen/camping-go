import * as React from "react";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material/styles";
import { AppBar, Tabs, Tab, Typography, Box } from "@mui/material";
import { useState, useEffect } from "react";
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
} from "firebase/firestore";
import {
  Font,
  Img,
  Display,
  Button,
} from "../css/style";
import Modal from "react-modal";
import "../css/modal.css";
import { TextField, Alert, Collapse, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import Header from "../component/Header";

Modal.setAppElement("#root");

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

function IsModal({ groupId, userName, userId }) {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(true);
  const [value, setValue] = useState("Controlled");
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
      score: 2.3,
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
          <Button bgc='#426765' color='#eae5be' onClick={sendComment}>
            送出評論
          </Button>
        </Display>
      </Modal>
    </div>
  );
}

function IsComment({ groupId, userName, userId }) {
  const [commentIsOpen, setCommentIsOpen] = useState(false);
  const [comment, setComment] = useState([]);

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

export default function Profile({ userName, userId }) {
  const theme = useTheme();
  const [value, setValue] = useState(0);
  let params = useParams();
  const [yourCreateGroup, setYourCreateGroup] = useState([]);
  const [yourParticipateGroup, setYourParticipateGroup] = useState([]);

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
    participateGroupArr.map(async (item) => {
      const docRef = await doc(db, "CreateCampingGroup", item);
      const groupData = await getDoc(docRef);
      if (groupData.exists()) {
        renderArr.push(groupData.data());
        setYourParticipateGroup(renderArr);
      } else {
        console.log("No such document!");
      }
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

  const q = query(
    collection(db, "CreateCampingGroup"),
    where("header_id", "==", params.id)
  );

  useEffect(() => {
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const cities = [];
      querySnapshot.forEach((doc) => {
        cities.push(doc.data());
        setYourCreateGroup(cities);
      });
      console.log(cities);
    });
  }, []);

  return (
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
                boxShadow: 2,
                borderRadius: 6,
                padding: 3,
                margin: 3,
              }}>
              <Display justifyContent='space-around'>
                <Display direction='column' alignItems='start'>
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
                <Display direction='column' alignItems='end'>
                  <IsComment groupId={item.group_id} />
                  {/* <Button>查看評論</Button> */}
                  <Button width='200px'>查看團友名單</Button>
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
                  <Display direction='column' alignItems='start'>
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
                  <Display direction='column' alignItems='end'>
                    <IsModal
                      groupId={item.group_id}
                      userName={userName}
                      userId={userId}
                    />
                  </Display>
                </Display>
              </Box>
            ))}
          </div>
        )}
        <TabPanel value={value} index={1} dir={theme.direction}></TabPanel>
      </SwipeableViews>
    </Box>
  );
}
