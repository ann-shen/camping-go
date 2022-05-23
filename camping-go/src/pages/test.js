import { db } from "../utils/firebase";
import styled, { keyframes } from "styled-components";
import { useState, useEffect, useRef, useContext } from "react";
import { useParams } from "react-router-dom";
import {
  doc,
  onSnapshot,
  collection,
  query,
  updateDoc,
  setDoc,
  getDocs,
  serverTimestamp,
  orderBy,
  arrayUnion,
  arrayRemove,
  increment,
  where,
  getDoc,
  deleteDoc,
} from "firebase/firestore";

import "../utils/data";
import { UserContext } from "../utils/userContext";
import {
  Label,
  Font,
  Img,
  Display,
  Button,
  Cloumn,
  Wrap,
  Tag,
  Hr,
  suppliesSectionByJoinGroup,
} from "../css/style";
import { Box, Tooltip, IconButton } from "@mui/material";
import "../css/member.css";
import Tent from "../component/Tent";
import Header from "../component/Header";
import CampSupplies from "../component/CampSupplies";
import Footer from "../component/Footer";
import SecondHandSection from "../component/joinGroup_component/SecondHandSection";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";

import location from "../image/location.png";
import alert from "../image/alert.png";
import tentColor from "../image/tentColor.png";

import { v4 as uuidv4 } from "uuid";
import Swal from "sweetalert2/dist/sweetalert2.js";

const Alink = styled.a`
  text-decoration: none;
`;

const TargetContainer = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  border: "2.3px dashed #426765",
  width: "57px",
  height: "57px",
  backgroundColor: "#f5f4e8",
  borderRadius: "18px",
  margin: "10px",
};

const SourseContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: auto;
  height: 80px;
  margin: 10px;
`;

const PersonWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 60px;
  background-color: rgb(245, 244, 232);
  border: 2px solid #cfc781;
  border-radius: 18px;
  margin-bottom: 5px;
  cursor: pointer;
  &:hover {
    background-color: #eae5be;
  }
`;

const pulse = keyframes`
  from {
      transform: scale(0.5);
      opacity: 1;
    }
    to {
      transform: scale(1.5);
      opacity: 0;
    }
`;

const AnimationIndicators = styled.span`
  position: relative;
  display: inline-block;
  width: 25px;
  height: 25px;
  border-radius: 60%;
  margin-left: 0px;
  background: #ffda72;
  z-index: -1;
  &:before {
    background: #ffda72;
    content: "";
    display: block;
    position: absolute;
    left: -5px;
    top: -5px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    animation: ${pulse} 1.5s infinite ease-in;
  }
`;
const GroupTitle = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const HeaderName = styled.div`
  width: 130px;
  height: 25px;
  border-radius: 10px;
  padding-top: 3px;
  background-color: #426765;
  color: white;
`;

const ImagesWrap = styled.div`
  width: 100%;
  height: 400px;
  border-radius: 50px;
  margin: 40px 0px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const GroupImg = styled.img`
  width: 100%;
`;

const ProfileImgWrap = styled.div`
  width: 60px;
  height: auto;
  overflow: hidden;
  border-radius: 50%;
  border: 2px solid #eae5be;
`;
const ProfileImg = styled.img`
  width: 60px;
  height: 60px;
`;

const MemberWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
  flex-direction: column;
  margin: 10px;
  width: 180px;
  &:hover {
    background-color: #fffef0;
    color: white;
    border-radius: 10px;
    transition: 700ms;
  }
`;

const AllMemberWrap = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
  align-items: center;
  padding: 10px;
`;

const FontDetail = styled.p`
  font-size: 16px;
  line-height: 30px;
  color: #797659;
`;

const TentIndexNumber = styled.p`
  font-size: 16px;
  color: #797659;
  position: absolute;
  top: 30px;
  left: 30px;
`;

const TentSectionWrap = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
`;

const IsMemberInTheTentFont = styled.p`
  font-size: 16px;
  color: #cfc781;
  font-weight: 900;
  margin: 0px;
  margin-bottom: 3px;
  padding-right: 5px;
`;

const SuppliesWrap = styled.div`
  display: flex;
  justify-content: start;
  width: 90%;
  margin: 10px 0px 0px 6%;
  border-bottom: 1px dashed #f3ea98;
  padding-bottom: 20px;
`;

const SuppliesNotAllowedButton = styled.button`
  width: 180px;
  height: 40px;
  font-size: 16px;
  background-color: #426765;
  color: #ebebeb;
  border: 1px solid #ebebeb;
  margin-left: 5%;
  cursor: not-allowed;
  border-radius: 15px;
`;

const DeleteTentButton = styled.button`
  width: 25px;
  height: 25px;
  font-size: 16px;
  position: absolute;
  top: 30px;
  right: 30px;
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
  font-size: 14px;
  color: #cfc781;
  font-weight: 900;
  margin-left: 10px;
  letter-spacing: 1px;
`;

function JoinGroupPage({ userName }) {
  const [homePageCampGroup, setHomePageCampGroup] = useState("");
  const [allTentArr, setAllTentArr] = useState([]);
  const [allSupplies, setAllSupplies] = useState([]);
  const [thisGroupMember, setThisGroupMember] = useState([]);
  const [tentInfo, setTentInfo] = useState({
    current_number: 0,
    max_number: 0,
    member: [],
    create_time: serverTimestamp(),
  });
  const [addNewTentSection, setAddNewTentSection] = useState(false);
  const [addNewSuppliesSection, setAddNewSuppliesSection] = useState(false);
  const [isMemberInTheTent, setIsMemberInTheTent] = useState(false);

  const [currentTentId, setCurrentTentId] = useState("");
  const [alreadyTentId, setAlreadyTentId] = useState("");
  const ContextByUserId = useContext(UserContext);
  const [campSupplies, setCampSupplies] = useState({
    bring_person: "",
    note: "",
    supplies: "",
  });

  const dragSource = useRef();
  const dropTarget = useRef();

  let params = useParams();

  const dragStart = async (e) => {
    e.dataTransfer.setData("text/plain", e.target.id);
    e.target.style = "drop-shadow(0px 0px 0px white)";

    let secondTargetTentId = e.target.getAttribute("data-key");
    setAlreadyTentId(secondTargetTentId);
    console.log("前一頂帳篷", currentTentId);
  };

  const drop = async (e) => {
    let targetTentId = e.target.getAttribute("data-key");
    if (currentTentId === targetTentId) {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "不能移動至同頂帳篷",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
    onDragOver(e);
    console.log("drop");
    let id = e.dataTransfer.getData("text");
    e.target.appendChild(document.querySelector("#" + id));
    e.target.style = "backgroundColor:white ; border:4px solid #f5f4e8;";

    await updateDoc(
      doc(db, "CreateCampingGroup", params.id, "tent", targetTentId),
      {
        current_number: increment(1),
        member: arrayUnion(userName),
      }
    );
    setCurrentTentId(targetTentId);
    if (currentTentId == " ") {
      await updateDoc(
        doc(db, "CreateCampingGroup", params.id, "tent", currentTentId),
        {
          current_number: increment(-1),
          member: arrayRemove(userName),
        }
      );
    } else if (alreadyTentId) {
      await updateDoc(
        doc(db, "CreateCampingGroup", params.id, "tent", alreadyTentId),
        {
          current_number: increment(-1),
          member: arrayRemove(userName),
        }
      );
    } else return;
  };

  const onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  const onDragEnter = (e) => {
    let targetTentId = e.target.getAttribute("data-key");
    if (targetTentId == alreadyTentId) {
      return;
    }
    e.target.style.transform = "scale(1.2)";
    e.target.style.backgroundColor = "#EAE5BE";
    e.target.style.transition =
      "border-width 0.2s, transform 0.2s, background-color 0.4s";
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  const onDragLeave = async (e) => {
    console.log("leave");
    e.target.style.backgroundColor = "#f5f4e8";
    e.target.style.transform = "scale(1)";
  };

  useEffect(() => {
    onSnapshot(doc(db, "CreateCampingGroup", params.id), (doc) => {
      setHomePageCampGroup(doc.data());
    });
  }, []);

  useEffect(async () => {
    const q = query(
      collection(db, "joinGroup"),
      where("group", "array-contains", params.id)
    );
    const querySnapshot = await getDocs(q);
    let thisGroupMemberArr = [];
    querySnapshot.forEach((doc) => {
      thisGroupMemberArr.push(doc.data());
    });
    const docRef = doc(db, "joinGroup", homePageCampGroup.header_id);
    const getHeaderInfo = await getDoc(docRef);
    if (getHeaderInfo.exists()) {
      thisGroupMemberArr.push(getHeaderInfo.data());
    }
    setThisGroupMember(thisGroupMemberArr);
  }, [allTentArr, homePageCampGroup]);

  useEffect(() => {
    const eventListenertent = query(
      collection(db, "CreateCampingGroup", params.id, "tent")
    );
    const q = query(eventListenertent, orderBy("create_time", "desc"));

    onSnapshot(q, (snapshot) => {
      let tentsArr = [];
      snapshot.forEach((doc) => {
        tentsArr.push(doc.data());
      });
      setAllTentArr(tentsArr);
    });
  }, []);

  useEffect(() => {
    const eventListenerpage = query(
      collection(db, "CreateCampingGroup", params.id, "supplies")
    );
    onSnapshot(eventListenerpage, (snapshot) => {
      let suppliesArr = [];
      snapshot.forEach((doc) => {
        suppliesArr.push(doc.data());
      });
      setAllSupplies(suppliesArr);
    });
  }, []);

  useEffect(async () => {
    const docRefTentMember = await collection(
      db,
      "CreateCampingGroup",
      params.id,
      "tent"
    );
    const tent = query(
      docRefTentMember,
      where("member", "array-contains", userName)
    );
    const querySnapshot = await getDocs(tent);
    querySnapshot.forEach((doc) => {
      setIsMemberInTheTent(true);
    });
  }, []);

  const takeAway = async (id) => {
    await updateDoc(doc(db, "CreateCampingGroup", params.id, "supplies", id), {
      bring_person: userName,
    });
  };

  const addNewTent = async () => {
    const ondocRefNewTent = doc(
      collection(db, "CreateCampingGroup", params.id, "tent")
    );
    await setDoc(ondocRefNewTent, tentInfo);
    updateDoc(
      doc(db, "CreateCampingGroup", params.id, "tent", ondocRefNewTent.id),
      {
        tent_id: ondocRefNewTent.id,
        member: [],
        create_time: serverTimestamp(),
        who_create: userName,
      }
    );
  };

  const addSupplies = async () => {
    const ondocRefNewSupplies = doc(
      collection(db, "CreateCampingGroup", params.id, "supplies")
    );
    await setDoc(ondocRefNewSupplies, campSupplies);
    updateDoc(
      doc(
        db,
        "CreateCampingGroup",
        params.id,
        "supplies",
        ondocRefNewSupplies.id
      ),
      {
        supplies_id: ondocRefNewSupplies.id,
      }
    );

    setCampSupplies((prevState) => ({ ...prevState, note: "", supplies: "" }));
  };

  const handleAddTentSection = () => {
    setAddNewTentSection(true);
  };

  const deleteThisTent = async (index) => {
    await deleteDoc(
      doc(
        db,
        "CreateCampingGroup",
        params.id,
        "tent",
        allTentArr[index].tent_id
      )
    );
    allTentArr.splice(index, 1);
  };

  const splitDate = (start, end) => {
    let newDate = `${new Date(start * 1000).toLocaleString().split(" ")[0]}~ ${
      new Date(end * 1000).toLocaleString().split(" ")[0]
    }`;
    return <>{newDate}</>;
  };

  const splitMeetingTime = (meetingTime) => {
    let newMeetingTime = new Date(meetingTime * 1000)
      .toLocaleString()
      .split(" ");
    return (
      <>
        <Font>{newMeetingTime[0]}</Font>
        <Font fontSize='35px'>
          {`${newMeetingTime[1].split(":")[0]}:${
            newMeetingTime[1].split(":")[1]
          }`}
        </Font>
      </>
    );
  };

  return (
    <div>
      <div>
        <Header ContextByUserId={ContextByUserId} />
        {homePageCampGroup && (
          <Box
            sx={{
              width: "70%",
              height: "auto",
              borderRadius: 10,
              paddingTop: 8,
              margin: "auto",
              marginTop: "40px",
              marginBottom: 10,
            }}>
            <GroupTitle>
              <Display>
                <HeaderName> 團長：{homePageCampGroup.header_name}</HeaderName>
                <Display>
                  {homePageCampGroup.select_tag &&
                    homePageCampGroup.select_tag.map((item, index) => (
                      <Tag m='3px' key={index}>
                        {item}
                      </Tag>
                    ))}
                </Display>
              </Display>

              <Display alignItems='center' m='20px 0px '>
                <Img src={location} width='20px' />
                <Font marginLeft='15px'>{homePageCampGroup.city} | </Font>
                <Label mt='0px'>
                  <Font fontSize='18px' letterSpacing='2px' marginLeft='15px'>
                    {splitDate(
                      homePageCampGroup.start_date.seconds,
                      homePageCampGroup.end_date.seconds
                    )}
                  </Font>
                </Label>
              </Display>
            </GroupTitle>
            <Display justifyContent='space-between'>
              <Font fontSize='30px' letterSpacing='3px' m='10px 0px 0px 0px '>
                {homePageCampGroup.group_title}
              </Font>
              <Font fontSize='30px' letterSpacing='3px'>
                {homePageCampGroup.current_number}/
                {homePageCampGroup.max_member_number}人
              </Font>
            </Display>
            <ImagesWrap>
              <GroupImg src={homePageCampGroup.picture} alt='' />
            </ImagesWrap>
            <Display>
              <Font letterSpacing='3px' fontSize='20px'>
                露營團基本資訊
              </Font>
            </Display>
            <Display>
              <Box
                sx={{
                  width: "50%",
                  height: "140px",
                  borderRadius: 15,
                  padding: 3,
                  paddingBottom: 8,
                  paddingLeft: 7,
                  marginTop: 3,
                  justifyContent: "start",
                  backgroundColor: "#426765",
                  alignItems: "center",
                }}>
                <Cloumn>
                  <Font fontSize='20px' m='10px 0px' color='#F3EA98'></Font>
                  <Font fontSize='16px' m='0px 0px 25px 0px' color='#F3EA98'>
                    {homePageCampGroup.position}
                  </Font>
                </Cloumn>
                <Display>
                  <Cloumn>
                    <Font fontSize='20px' m='10px 0px' color='#F3EA98'>
                      營區網站
                    </Font>
                    <Font fontSize='16px' color='#F3EA98'>
                      {homePageCampGroup.site}
                    </Font>
                  </Cloumn>
                </Display>
              </Box>

              <Box
                sx={{
                  width: "30%",
                  height: "140px",
                  borderRadius: 15,
                  border: "2px solid #CFC781",
                  padding: 5,
                  marginTop: 3,
                  marginLeft: 5,
                  justifyContent: "start",
                }}>
                <Cloumn>
                  <Font fontSize='20px'>集合時間</Font>
                  <Hr width='280px'></Hr>
                  {splitMeetingTime(homePageCampGroup.meeting_time.seconds)}
                </Cloumn>
              </Box>
            </Display>
            <Display>
              <Box
                sx={{
                  width: "60%",
                  height: "auto",
                  marginTop: 6,
                  marginBottom: 8,
                  justifyContent: "start",
                  textAlign: "start",
                }}>
                <Cloumn>
                  <Font fontSize='20px'>介紹</Font>
                  <Hr width='100%'></Hr>
                  <FontDetail>{homePageCampGroup.announcement}</FontDetail>
                </Cloumn>
              </Box>
              <Box
                sx={{
                  width: "38%",
                  height: "140px",
                  marginLeft: 7,
                  justifyContent: "start",
                  textAlign: "start",
                }}>
                <Cloumn>
                  {homePageCampGroup.notice.map((item, index) => (
                    <Display key={index} mb='20px'>
                      <Img src={alert} alt='' width='40px' />
                      <Font fontSize='16px' marginLeft='10px'>
                        {item}
                      </Font>
                    </Display>
                  ))}
                </Cloumn>
              </Box>
            </Display>

            <Cloumn>
              <Font fontSize='20px'>加入帳篷</Font>
              <Hr width='100%'></Hr>
              <Font fontSize='14px'>
                請選擇想加入的帳篷！如有自備帳篷請按加號，並輸入預計可容納人數。
              </Font>
            </Cloumn>
            <TentSectionWrap justifyContent='center'>
              {allTentArr.map((item, index) => (
                <Box
                  sx={{
                    width: "47%",
                    height: "330px",
                    borderRadius: 15,
                    paddingTop: 2,
                    paddingBottom: 2,
                    margin: 3,
                    marginLeft: 0,
                    border: "2px solid #CFC781",
                    position: "relative",
                  }}
                  key={uuidv4()}>
                  <DeleteTentButton
                    onClick={() => {
                      deleteThisTent(index);
                    }}>
                    x
                  </DeleteTentButton>
                  <Font fontSize='14px'>{item.who_create} の 帳篷</Font>
                  <Display key={index} direction='column'>
                    <Img src={tentColor} width='200px'></Img>
                    <Label fontSize='35px'>
                      {item.current_number}/{item.max_number}
                    </Label>
                    <Font fontSize='16px' letterSpacing='2px'>
                      還有
                      {Number(item.max_number) - Number(item.current_number)}
                      個位置
                    </Font>
                    <Display m='20px 0px 0px 0px'>
                      <Display>
                        {item.member &&
                          item.member.map((seat, index) => (
                            <Display
                              direction='column'
                              justifyContent='center'
                              alignItems='center'
                              m='0px 20px 10px 0px'
                              mb='20px'
                              key={uuidv4()}>
                              <Font margin='10px' marginLeft='10px'>
                                {seat !== userName && (
                                  <Font fontSize='18px' m='0px 0px 10px 0px'>
                                    {seat}
                                  </Font>
                                )}
                                {seat === userName && (
                                  <IsMemberInTheTentFont>
                                    {seat}
                                  </IsMemberInTheTentFont>
                                )}
                              </Font>
                              {seat !== userName && (
                                <AccountCircleIcon
                                  key={index}
                                  fontSize='large'
                                  sx={{
                                    color: "#CFC781",
                                    marginBottom: "16px",
                                    fontSize: "45px",
                                  }}></AccountCircleIcon>
                              )}
                              {seat === userName && (
                                <PersonWrap
                                  data-key={item.tent_id}
                                  id='drag-source'
                                  draggable='true'
                                  onDragStart={dragStart}>
                                  <EmojiPeopleIcon
                                    sx={{
                                      pointerEvents: "none",
                                      cursor: "not-allowed",
                                      color: "#426765",
                                      fontSize: "45px",
                                    }}
                                    fontSize='large'></EmojiPeopleIcon>
                                </PersonWrap>
                              )}
                            </Display>
                          ))}
                      </Display>
                      <Display>
                        {Array(
                          Number(item.max_number) - Number(item.current_number)
                        )
                          .fill(null)
                          .map(() => (
                            <label key={uuidv4()}>
                              <div
                                data-key={item.tent_id}
                                style={TargetContainer}
                                ref={dropTarget}
                                onDrop={drop}
                                onDragEnter={onDragEnter}
                                onDragOver={onDragOver}
                                onDragLeave={onDragLeave}></div>
                            </label>
                          ))}
                      </Display>
                    </Display>
                  </Display>
                </Box>
              ))}
            </TentSectionWrap>
            <Box
              sx={{
                width: "auto",
                height: "auto",
                borderRadius: 10,
                padding: 0,
                marginTop: 0,
                marginBottom: 5,
              }}>
              <SourseContainer id='source-container' ref={dragSource}>
                <Display>
                  {!isMemberInTheTent && (
                    <Tooltip title='請移至方格'>
                      <IconButton
                        id='drag-source'
                        draggable='true'
                        onDragStart={dragStart}>
                        <EmojiPeopleIcon
                          sx={{
                            pointerEvents: "none",
                            cursor: "not-allowed",
                            color: "#426765",
                            fontSize: "65px",
                          }}
                          color='primary'
                          fontSize='large'></EmojiPeopleIcon>
                      </IconButton>
                    </Tooltip>
                  )}
                  <AnimationIndicators />
                  <Font fontSize='14px' marginLeft='10px'>
                    拖移小人偶至帳篷
                  </Font>
                </Display>
                <Display>
                  <Cloumn>
                    <Font fontSize='14px'>有自帶帳篷？</Font>
                    <Font fontSize='14px'>請按新增按鈕</Font>
                  </Cloumn>

                  <Button
                    width='80px'
                    height='80px'
                    borderRadius='50%'
                    fontSize='30px'
                    bgc='#426765'
                    color='#CFC781'
                    boxShadow='none'
                    ml='20px'
                    onClick={handleAddTentSection}>
                    +
                  </Button>
                </Display>
              </SourseContainer>
            </Box>
            <Wrap width='100%'>
              {addNewTentSection && (
                <Box sx={suppliesSectionByJoinGroup}>
                  <Font fontSize='20px' alignSelf='start' m='0px 0px 30px 0px'>
                    新增帳篷
                  </Font>
                  <Display justifyContent='center'>
                    <Tent setTentInfo={setTentInfo} tentInfo={tentInfo} />
                    <Button width='100px' onClick={addNewTent}>
                      新增
                    </Button>
                  </Display>
                </Box>
              )}
            </Wrap>
            <Cloumn>
              <Font fontSize='20px'>需要大家幫忙帶的用品</Font>
              <Hr width='100%'></Hr>
              <Font fontSize='14px'>
                請選擇能幫忙帶的露營用品，有你的幫忙，讓這次旅程更完整～
              </Font>
            </Cloumn>

            <Display>
              <Box
                sx={{
                  width: "100%",
                  height: "auto",
                  borderRadius: 15,
                  padding: 5,
                  marginTop: 3,
                  marginBottom: 5,
                  justifyContent: "start",
                  backgroundColor: "#426765",
                }}>
                <Box>
                  <Display justifyContent='start'>
                    <Font color='#F4F4EE' marginLeft='7%'>
                      項目
                    </Font>
                    <Font color='#F4F4EE' marginLeft='15%'>
                      備註
                    </Font>
                    <Font color='#F4F4EE' marginLeft='32%'>
                      認領
                    </Font>
                  </Display>
                  {allSupplies.map((item, index) => (
                    <Wrap
                      width='100%'
                      justifyContent='space-between'
                      key={index}>
                      <SuppliesWrap>
                        <Wrap width='150px' justifyContent='start'>
                          <Label fontSize='16px' color='#F3EA98' ml='5%'>
                            {item.supplies}
                          </Label>
                        </Wrap>
                        <Wrap
                          width='250px'
                          m='0px 0px 0px 5%'
                          justifyContent='start'>
                          <Label fontSize='16px' color='#F3EA98'>
                            {item.note}
                          </Label>
                        </Wrap>
                        <Label ml='15%' color='#F3EA98'>
                          {item.bring_person}
                        </Label>
                      </SuppliesWrap>

                      {item.bring_person == "" ? (
                        <Button
                          width='180px'
                          fontSize='16px'
                          ml='5%'
                          onClick={() => {
                            takeAway(item.supplies_id);
                          }}>
                          我可以幫忙帶
                        </Button>
                      ) : (
                        <SuppliesNotAllowedButton
                          width='180px'
                          fontSize='16px'
                          bgc='#426765'
                          color='#EBEBEB'
                          border='1px solid #EBEBEB'
                          ml='5%'
                          cursor='not-allowed'>
                          已認領
                        </SuppliesNotAllowedButton>
                      )}
                    </Wrap>
                  ))}
                </Box>
              </Box>
            </Display>
            <Display justifyContent='end'>
              <Button
                width='80px'
                height='80px'
                borderRadius='50%'
                fontSize='30px'
                bgc='#426765'
                color='#CFC781'
                boxShadow='none'
                ml='20px'
                onClick={() => {
                  setAddNewSuppliesSection(true);
                }}>
                +
              </Button>
            </Display>
            {addNewSuppliesSection && (
              <Box sx={suppliesSectionByJoinGroup}>
                <Font m='0px 0px 30px 0px'>新增需要團員們認領的物品</Font>
                <Display justifyContent='center' mb='30px'>
                  <CampSupplies
                    setCampSupplies={setCampSupplies}
                    campSupplies={campSupplies}
                  />
                </Display>
                <Button onClick={addSupplies} width='100px'>
                  新增
                </Button>
              </Box>
            )}

            <Cloumn>
              <Display>
                <Font fontSize='20px'>團員</Font>
                <Span>點擊頭像查看團員二手換區</Span>
              </Display>
              <Hr width='100%'></Hr>
            </Cloumn>
            <AllMemberWrap>
              {thisGroupMember.map((item, index) => (
                <Alink href={`/profile/${item.info.user_id}`}>
                  <MemberWrap key={index}>
                    <ProfileImgWrap>
                      <ProfileImg src={item.profile_img} />
                    </ProfileImgWrap>
                    <Font>{item.info.user_name}</Font>
                    <Display m='3px'>
                      {item.select_tag
                        .map((obj) => (
                          <Tag
                            width='40px'
                            m='3px'
                            height='18px'
                            borderRadius='12px'>
                            <Font fontSize='13px'>{obj}</Font>
                          </Tag>
                        ))
                        .slice(0, 3)}
                    </Display>
                  </MemberWrap>
                </Alink>
              ))}
            </AllMemberWrap>
            <SecondHandSection thisGroupMember={thisGroupMember} />
          </Box>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default JoinGroupPage;