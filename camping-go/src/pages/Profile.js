import * as React from "react";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material/styles";
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
import firebase from "../utils/firebaseConfig";
import CloseIcon from "@mui/icons-material/Close";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import { UserContext } from "../utils/userContext";
import Header from "../component/Header";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { ProfilePicture } from "../component/ProfilePicture";
import MultipleSelectChip from "../component/MultipleSelectChip";
import location from "../image/location.png";
import { signOut, getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import SecondHand from "./SecondHand";
import Swal from "sweetalert2/dist/sweetalert2.js";
import Footer from "../component/Footer";
import initial from "../image/initial-09.png";
import loading from "../image/loading.gif";
import Backdrop from "@mui/material/Backdrop";

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

const ProfileWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
`;

const Span = styled.span`
  font-size: 20px;
  color: #cfc781;
  font-weight: 900;
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
          <Hr width='60%' m='20px 0px'></Hr>
          <TextField
            sx={{
              width: "70%",
              backgroundColor: "#E0DCBA",
              boxShadow:
                "0.3rem 0.3rem 0.8rem #E2E1D3 , -0.2rem -0.2rem 0.2rem #ffffff",
            }}
            multiline
            // label='評論'
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
      setTotalScore((totalScoreNumber / comment.length).toFixed(1));
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
                      width: "600px",
                      height: "auto",
                      padding: 0,
                      margin: 1,
                    }}>
                    <Wrap
                      width='500px'
                      borderBottom='1.4px solid #EAE5BE'
                      paddingBottom='20px'>
                      <Wrap justifyContent='space-around' width='500px'>
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
                          <Wrap width='280px'>
                            <Font fontSize='14px'>{item.note}</Font>
                          </Wrap>
                        </Display>
                        <Font marginLeft='20px'>{item.score}分</Font>
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

function CheckOfGroupMember({
  groupId,
  setRenderParticipateArr,
  group_title,
  userName,
}) {
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
      // console.log(doc.id, " => ", doc.data());
      memberArr.push(doc.data());
    });

    const removeHeaderArr = memberArr.filter((e, index) => {
      return e.role !== "header";
    });
    const getHeaderArr = memberArr.filter((e, index) => {
      return e.role == "header";
    });
    removeHeaderArr.unshift(getHeaderArr[0]);

    console.log(removeHeaderArr);

    setMember(removeHeaderArr);
  };

  const removeMember = async (index, role, member_id, member_name) => {
    console.log(userName);
    Swal.fire({
      title: "確定移除？",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#426765",
      cancelButtonColor: "#EAE5BE",
      confirmButtonText: "移除",
    }).then(async (result) => {
      if (result.isConfirmed) {
        firebase
          .deleteMember(groupId, member[index].member_id)
          .then(async () => {
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

        const q = query(
          collection(db, "CreateCampingGroup", groupId, "tent"),
          where("member", "array-contains", member_name)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((item) => {
          console.log(item.id, " => ", item.data());
          updateDoc(doc(db, "CreateCampingGroup", groupId, "tent", item.id), {
            current_number: increment(-1),
            member: arrayRemove(member_name),
          });
        });
        const getSupplies = query(
          collection(db, "CreateCampingGroup", groupId, "supplies"),
          where("bring_person", "==", member_name)
        );
        const querySupplies = await getDocs(getSupplies);
        querySupplies.forEach((item) => {
          console.log(item.id, " => ", item.data());
          updateDoc(
            doc(db, "CreateCampingGroup", groupId, "supplies", item.id),
            {
              bring_person: "",
            }
          );
        });

        // updateDoc(doc(db, "joinGroup", member_id), {
        //   alert: arrayUnion({
        //     alert_content: `移除成功`,
        //     is_read: false,
        //   }),
        // });
        setRenderParticipateArr(true);
      }
    });
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
          <ScrollWrap>
            {member.map((item, index) => (
              <Box
                sx={{
                  width: "500px",
                  height: "50px",
                  borderBottom: " 1.4px solid #EAE5BE",
                  padding: 1,
                  margin: 1,
                  display: "flex",
                  justifyContent: "space-between",
                }}>
                <Display>
                  {item.role == "header" && (
                    <Tag
                      width='40px'
                      p='3px 0px 0px 1px'
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
                    mt='0px'
                    ml='20px'
                    boxShadow='none'
                    onClick={() => {
                      removeMember(
                        index,
                        item.role,
                        item.member_id,
                        item.member_name
                      );
                    }}>
                    移除成員
                  </Button>
                )}
              </Box>
            ))}
          </ScrollWrap>
        </CheckCommentWrap>
      </Modal>
    </div>
  );
}

function SecondHandInvitation({
  inviteIsOpen,
  setInviteIsOpen,
  inviteInfo,
  inviteInfoIndex,
  userId,
  setShowBuyerSection,
}) {
  console.log(inviteInfo[inviteInfoIndex]);

  const rejectInvite = async () => {
    inviteInfo[inviteInfoIndex].buyer_name = "";
    inviteInfo[inviteInfoIndex].buyer_id = "";
    inviteInfo[inviteInfoIndex].change_supplies_picture = "";
    inviteInfo[inviteInfoIndex].change_supplies = "";
    inviteInfo[inviteInfoIndex].invite = false;

    const docRef = doc(db, "joinGroup", userId);
    await updateDoc(docRef, { second_hand: inviteInfo });

    setInviteIsOpen(false);
  };

  const acceptInvite = async () => {
    inviteInfo[inviteInfoIndex].invite = false;
    inviteInfo[inviteInfoIndex].change_status = true;

    const docRef = doc(db, "joinGroup", userId);
    await updateDoc(docRef, { second_hand: inviteInfo });

    const inviteDocRef = doc(
      db,
      "joinGroup",
      inviteInfo[inviteInfoIndex].buyer_id
    );
    const getInviteDocRef = await getDoc(inviteDocRef);
    if (getInviteDocRef.exists()) {
      console.log(getInviteDocRef.data().second_hand);

      const getBuyerSpuuliesIndex = getInviteDocRef
        .data()
        .second_hand.filter(
          (e, index) => e.name == inviteInfo[inviteInfoIndex].change_supplies
        );
      console.log(getBuyerSpuuliesIndex[0]);

      let data = getInviteDocRef.data().second_hand;
      getBuyerSpuuliesIndex[0].change_status = true;
      getBuyerSpuuliesIndex[0].buyer_name =
        inviteInfo[inviteInfoIndex].seller_name;
      getBuyerSpuuliesIndex[0].buyer_id = inviteInfo[inviteInfoIndex].seller_id;
      getBuyerSpuuliesIndex[0].change_supplies =
        inviteInfo[inviteInfoIndex].name;
      console.log(getBuyerSpuuliesIndex[0]);
      console.log(data);

      console.log(
        `${inviteInfo[inviteInfoIndex].seller_name}已接受${getBuyerSpuuliesIndex.name}的二手換物邀請」`
      );

      updateDoc(inviteDocRef, {
        second_hand: getBuyerSpuuliesIndex,
        alert: arrayUnion({
          alert_content: `${inviteInfo[inviteInfoIndex].seller_name}已接受${getBuyerSpuuliesIndex[0].name}的二手換物邀請」`,
          is_read: false,
        }),
      });
    }

    // updateDoc(doc(db, "joinGroup", getBuyerSpuuliesIndex.seller_id), {
    //   alert: arrayUnion({
    //     alert_content: `${inviteInfo[inviteInfoIndex].seller_name}已接受${getBuyerSpuuliesIndex.name}的二手換物邀請」`,
    //     is_read: false,
    //   }),
    // });

    Swal.fire({
      position: "center",
      icon: "success",
      title: "成功交換",
      showConfirmButton: false,
      timer: 1500,
    });
    setInviteIsOpen(false);
    setShowBuyerSection(false);
  };
  return (
    <>
      <Modal
        isOpen={inviteIsOpen}
        onRequestClose={() => setInviteIsOpen(false)}
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
          <DeleteModalButton onClick={() => setInviteIsOpen(false)}>
            X
          </DeleteModalButton>
          {inviteInfo ? (
            <>
              <Wrap
                width='100%'
                justifyContent='center'
                direction='column'
                alignItems='center'>
                <Font>{inviteInfo[inviteInfoIndex].buyer_name}想要用</Font>
                <Hr width='70%'></Hr>
                <Wrap width='auto' m='30px 0px 50px 0px'>
                  <Wrap width='200px' direction='column' m='0px 30px 0px 30px'>
                    <ImgWrap width='170px' height='120px'>
                      <Img
                        width='100%'
                        src={
                          inviteInfo[inviteInfoIndex].change_supplies_picture
                        }></Img>
                    </ImgWrap>
                    <Font fontSize='16px' m='15px 0px 0px 0px'>
                      {inviteInfo[inviteInfoIndex].change_supplies}
                    </Font>
                    <Font fontSize='14px'>
                      {inviteInfo[inviteInfoIndex].change_note}
                    </Font>
                  </Wrap>
                  <Cloumn>
                    <Font fontSize='16px'>跟你換</Font>
                    <CompareArrowsIcon
                      sx={{
                        fontSize: "70px",
                        color: "#426765",
                      }}></CompareArrowsIcon>
                  </Cloumn>
                  <Wrap width='200px' direction='column' m='0px 0px 0px 30px'>
                    <ImgWrap width='170px' height='120px'>
                      <Img
                        width='100%'
                        src={inviteInfo[inviteInfoIndex].picture}></Img>
                    </ImgWrap>
                    <Font fontSize='16px' m='15px 0px 0px 0px'>
                      {inviteInfo[inviteInfoIndex].name}
                    </Font>
                  </Wrap>
                </Wrap>
                <Display>
                  <Button onClick={acceptInvite} width='150px'>
                    確認交換
                  </Button>
                  <Button onClick={rejectInvite} width='150px' ml='40px'>
                    忍痛拒絕
                  </Button>
                </Display>
              </Wrap>
            </>
          ) : (
            <></>
          )}
        </CheckCommentWrap>
      </Modal>
      )
    </>
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
  const [inviteIsOpen, setInviteIsOpen] = useState(false);
  const [inviteInfo, setInviteInfo] = useState("");
  const [inviteInfoIndex, setInviteInfoIndex] = useState("");
  const [sendInvite, setSendInvite] = useState("");
  const [personName, setPersonName] = useState([]);
  const [showBuyerSection, setShowBuyerSection] = useState(false);
  const [paramsInfo, setParamsInfo] = useState("");
  const [backdropOpen, setbackdropOpen] = useState(true);

  const navigate = useNavigate();
  const auth = getAuth();

  const ContextByUserId = useContext(UserContext);

  console.log(userId);
  useEffect(() => {
    if (userId) {
      const unsub = onSnapshot(doc(db, "joinGroup", userId), (doc) => {
        setInviteInfo(doc.data().second_hand);
        doc.data().second_hand.map((item, index) => {
          if (item.invite == true) {
            setInviteInfoIndex(index);
            console.log(`${index}ohmygodddddddddddddddd`);
            setInviteIsOpen(true);
          }
        });
      });
    }
  }, []);

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
    // console.log(yourParticipateGroup);
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
    } else if (participateGroupArr[0].group_id == "") {
      return;
    }

    let showGroupArr = [];
    participateGroupArr.map(async (item) => {
      const docRef = await getDoc(doc(db, "CreateCampingGroup", item));
      if (docRef.exists()) {
        // console.log(docRef.data());
        showGroupArr.push(docRef.data());
        setYourParticipateGroup(showGroupArr);
      } else {
        showGroupArr.push(docRef.data());
      }
    });
  }, [withDrawGrop]);

  // console.log(yourParticipateGroup);

  useEffect(() => {
    if (sendInvite !== "") {
      console.log(`這邊 ${sendInvite}`);
    }
  }, [sendInvite]);

  useEffect(() => {
    const q = query(
      collection(db, "CreateCampingGroup"),
      where("header_id", "==", params.id)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const groups = [];
      querySnapshot.forEach((item) => {
        // console.log(item.data());
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

  //get param_id profie data
  useEffect(async () => {
    const paramIdProfile = await getDoc(doc(db, "joinGroup", params.id));
    if (paramIdProfile.exists()) {
      console.log(paramIdProfile.data().info);
      setParamsInfo(paramIdProfile.data());
    }
  }, []);

  const memberWithdrawGroup = async (id, userId, index) => {
    Swal.fire({
      // title: "確定要退團？",
      text: "確定要退團？",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#426765",
      cancelButtonColor: "#EAE5BE",
      confirmButtonText: "確定退團",
    }).then(async (result) => {
      if (result.isConfirmed) {
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
            bring_person: "",
          });
        });
        setWithDrawGrop(true);
        Swal.fire({
          icon: "success",
          confirmButtonColor: "#426765",
          text: `成功退出${yourParticipateGroup[index].group_title}`,
          // title: `成功退出${yourParticipateGroup[index].group_title}`,
          // footer: '<a href="/">繼續尋找你的露營團</a>',
        });
      }
    });
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  const deleteThisGroup = async (id) => {
    console.log(id);
    Swal.fire({
      title: "確定要刪除此團？",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#426765",
      cancelButtonColor: "#EAE5BE",
      confirmButtonText: "刪除",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteDoc(doc(db, "CreateCampingGroup", id));
        Swal.fire({
          icon: "success",
          confirmButtonColor: "#426765",
          title: `成功刪除`,
          // footer: '<a href="/">繼續尋找你的露營團</a>',
        });
      }
    });
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
          {inviteIsOpen && (
            <SecondHandInvitation
              setInviteIsOpen={setInviteIsOpen}
              setShowBuyerSection={setShowBuyerSection}
              showBuyerSection={showBuyerSection}
              inviteIsOpen={inviteIsOpen}
              inviteInfo={inviteInfo}
              inviteInfoIndex={inviteInfoIndex}
              userId={userId}
              sendInvite={sendInvite}></SecondHandInvitation>
          )}
          <Wrap
            maxWidth='1440px'
            width='75%'
            m='100px 40px 0px 12%'
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
                  <MultipleSelectChip
                    userId={userId}
                    setPersonName={setPersonName}
                    personName={personName}
                  />
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
                borderRadius: 5,
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
                    <>
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
                                <CheckCommentFromMember
                                  groupId={item.group_id}
                                />
                              )}
                              <CheckOfGroupMember
                                setRenderParticipateArr={
                                  setRenderParticipateArr
                                }
                                groupId={item.group_id}
                                userId={userId}
                                group_title={item.group_title}
                                userName={userName}
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
                    </>
                  ) : (
                    <>
                      <Img
                        src={initial}
                        width='300px'
                        m='100px 10px 0px 0px'></Img>
                      <Font m='30px 0px 0px 0px' letterSpacing='2px'>
                        點選<Span>建立露營團揪</Span>大家一起露營吧！
                      </Font>
                    </>
                  )}
                </TabPanel>
                <TabPanel value={value} index={1} dir={theme.direction}>
                  {yourParticipateGroup.length !== 0 ? (
                    <>
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
                                      <Font
                                        fontSize='14px'
                                        m='0px 0px 15px 0px'>
                                        {
                                          new Date(
                                            item.start_date.seconds * 1000
                                          )
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
                    </>
                  ) : (
                    <>
                      <Img
                        src={initial}
                        width='300px'
                        m='100px 10px 0px 0px'></Img>
                      <Font m='30px 0px 0px 0px' letterSpacing='2px'>
                        還沒找到適合的露營團？首頁點選<Span>最佳推薦</Span>
                        搜尋最適合你的露營團
                      </Font>
                    </>
                  )}
                </TabPanel>
                <TabPanel value={value} index={2} dir={theme.direction}>
                  <SecondHand
                    userId={userId}
                    userName={userName}
                    current_userId={params.id}
                    setSendInvite={setSendInvite}
                    sendInvite={sendInvite}
                    setShowBuyerSection={setShowBuyerSection}
                    showBuyerSection={showBuyerSection}
                  />
                </TabPanel>
              </SwipeableViews>
            </Box>
          ) : (
            <div>載入中</div>
          )}
        </div>
      )}
      {userId !== params.id && (
        <div>
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={backdropOpen}
            // onClick={handleClose}
          >
            <Img src={loading}></Img>
          </Backdrop>
          <Header ContextByUserId={ContextByUserId} />
          {paramsInfo && (
            <Wrap
              maxWidth='1440px'
              width='75%'
              m='100px 40px 0px 12%'
              alignItems='center'
              justifyContent='space-between'
              boxShadow='none'>
              <Display>
                <ProfilePicture userId={paramsInfo.info.user_id} />
                <Wrap
                  width='500px'
                  direction='column'
                  justifyContent='start'
                  alignItems='start'
                  m='0px 0px 0px 60px'
                  boxShadow='none'>
                  <Font
                    fontSize='40px'
                    margin='0px 0px 10px 0px'
                    marginLeft='3px'
                    color='#426765'>
                    {paramsInfo.info.user_name}
                  </Font>
                  <Display>
                    {paramsInfo.select_tag.map((item) => (
                      <Tag
                        width='53px'
                        m='3px'
                        height='18px'
                        borderRadius='12px'>
                        <Font fontSize='14px'>{item}</Font>
                      </Tag>
                    ))}
                  </Display>
                </Wrap>
              </Display>
            </Wrap>
          )}

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
                  <Tab
                    label='查看二手交換物品'
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
                        </Wrap>
                      </Display>
                    </Box>
                  ))}
                </TabPanel>
                <TabPanel value={value} index={1} dir={theme.direction}>
                  <SecondHand
                    userId={params.id}
                    current_userId={userId}
                    userName={userName}
                    sendInvite={sendInvite}
                    setSendInvite={setSendInvite}
                    // userName={yourCreateGroup[0].header_name}
                  />
                </TabPanel>
              </SwipeableViews>
            </Box>
          ) : (
            <div></div>
          )}
        </div>
      )}
      <Footer />
    </>
  );
}
