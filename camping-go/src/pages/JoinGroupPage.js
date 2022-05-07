import { db } from "../utils/firebase";
import styled, { keyframes } from "styled-components";
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
} from "firebase/firestore";
import { useState, useEffect, useRef, useContext } from "react";
import { useParams } from "react-router-dom";
import "../utils/data";
import {
  Label,
  AddButton,
  Font,
  Img,
  Display,
  Button,
  Cloumn,
  Wrap,
  Tag,
  Hr,
} from "../css/style";
import Tent from "../component/Tent";
import Header from "../component/Header";
import { Box, Paper } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import location from "../image/location.png";
import alert from "../image/alert.png";
import tentColor from "../image/tentColor.png";
import tent from "../image/tent.png";
import { v4 as uuidv4 } from "uuid";
import { UserContext } from "../utils/userContext";
import { useNavigate } from "react-router-dom";


const TargetContainer = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  border: "2.3px dashed #426765",
  width: "60px",
  height: "55px",
  backgroundColor: "#f5f4e8",
  borderRadius: "18px",
  margin: "10px",
  paddingTop: "5px",
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
  width: 30px;
  height: 30px;
  border-radius: 60%;
  margin-left: 20px;
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
  border-radius: 20px;
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
  padding: 10px;
  flex-direction: column;
  margin: 20px;
`;

const AllMemberWrap = styled.div`
  width: 90%;
  display: flex;
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
  font-size: 25px;
  color: #797659;
  position: absolute;
  top: 20px;
  left: 40px;
`;

const TentSectionWrap = styled.div`
  width: 100%;
  display: flex;
  /* justify-content:center; */
  flex-wrap: wrap;
`;

const IsMemberInTheTentFont = styled.p`
  font-size: 22px;
  color: #cfc781;
  font-weight: 900;
  margin: 0px;
  padding-right: 5px;
`;

const SuppliesWrap = styled.div`
  display: flex;
  justify-content: space-between;
  width: 90%;
  margin: 10px 0px 0px 6%;
  border-bottom: 1px dashed #f3ea98;
  padding-bottom: 20px;
`;

function JoinGroupPage({ setAllMemberArr, allMemberArr, userName, userId }) {
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
  const [IsMemberInTheTent, setRenderParticipateArr] = useState(false);

  const [currentTentId, setCurrentTentId] = useState("");
  const [alreadyTentId, setAlreadyTentId] = useState("");
  const ContextByUserId = useContext(UserContext);

  //------------------------DND ------------------------//

  const dragSource = useRef();
  const dropTarget = useRef();
  const navigate = useNavigate();

  let params = useParams();

  // useEffect(async () => {
  //   if (!userId) {
  //     navigate("/");
  //     console.log("return");
  //     return;
  //   } else{
  //     const docRefMember = collection(
  //       db,
  //       "CreateCampingGroup",
  //       params.id,
  //       "member"
  //     );
  //     const querySnapshot = await getDocs(docRefMember);
  //     let memberArr = [];
  //     querySnapshot.forEach((doc) => {
  //       console.log(doc.data().member_id);
  //       memberArr.push(doc.data().member_id);
  //     });
  //     if (memberArr.includes(userId) == false) {
  //       navigate("/");
  //     }
  //   }
  // }, []);




  const dragStart = async (e) => {
    e.dataTransfer.setData("text/plain", e.target.id);
    e.target.style = "drop-shadow(0px 0px 0px white)";

    let secondTargetTentId = e.target.getAttribute("data-key");
    setAlreadyTentId(secondTargetTentId);
    console.log("dragStart");
    console.log("前一頂帳篷", currentTentId);
  };
  const drop = async (e) => {
    onDragOver(e);
    console.log("drop");
    //前一頂帳篷
    console.log(currentTentId);
    let id = e.dataTransfer.getData("text");
    e.target.appendChild(document.querySelector("#" + id));
    e.target.style = "backgroundColor:white ; border:4px solid #f5f4e8;";
    let targetTentId = e.target.getAttribute("data-key");
    console.log(targetTentId);
    await updateDoc(
      doc(db, "CreateCampingGroup", params.id, "tent", targetTentId),
      {
        current_number: increment(1),
        member: arrayUnion(userName),
      }
    ).then(async () => {
      let tentsArr = [];
      const citiesRef = collection(db, "CreateCampingGroup", params.id, "tent");
      const q = query(citiesRef, orderBy("create_time", "desc"));
      const querySnapshot = await getDocs(
        collection(db, "CreateCampingGroup", params.id, "tent")
      );
      querySnapshot.forEach((doc) => {
        // console.log(doc.id, " => ", doc.data());
        tentsArr.push(doc.data());
      });
      setAllTentArr(tentsArr);
    });
    //設定前一頂帳篷進state
    setCurrentTentId(targetTentId);

    if (currentTentId == " ") {
      console.log("minus");
      await updateDoc(
        doc(db, "CreateCampingGroup", params.id, "tent", currentTentId),
        {
          current_number: increment(-1),
          member: arrayRemove(userName),
        }
      ).then(async () => {
        console.log("+1");
        let tentsArr = [];
        const citiesRef = collection(
          db,
          "CreateCampingGroup",
          params.id,
          "tent"
        );
        const q = query(citiesRef, orderBy("create_time", "desc"));
        const querySnapshot = await getDocs(
          collection(db, "CreateCampingGroup", params.id, "tent")
        );
        querySnapshot.forEach((doc) => {
          // console.log(doc.id, " => ", doc.data());
          tentsArr.push(doc.data());
        });
        setAllTentArr(tentsArr);
      });
    } else if (alreadyTentId) {
      await updateDoc(
        doc(db, "CreateCampingGroup", params.id, "tent", alreadyTentId),
        {
          current_number: increment(-1),
          member: arrayRemove(userName),
        }
      ).then(async () => {
        console.log("+1");
        let tentsArr = [];
        const citiesRef = collection(
          db,
          "CreateCampingGroup",
          params.id,
          "tent"
        );
        const q = query(citiesRef, orderBy("create_time", "desc"));
        const querySnapshot = await getDocs(
          collection(db, "CreateCampingGroup", params.id, "tent")
        );
        querySnapshot.forEach((doc) => {
          // console.log(doc.id, " => ", doc.data());
          tentsArr.push(doc.data());
        });
        setAllTentArr(tentsArr);
      });
    } else return;
  };

  const onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  const onDragEnter = (e) => {
    console.log("enter");
    e.target.style.transform = "scale(1.1)";
    e.target.style.backgroundColor = "#426765";
    e.target.style.transition =
      "border-width 0.2s, transform 0.2s, background-color 0.4s";
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  const onDragLeave = async (e) => {
    console.log("leave");
    e.target.style.backgroundColor = "#f5f4e8";
    e.target.style.border = "3px dotted #426765";
  };

  //render all camping group
  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "CreateCampingGroup", params.id),
      (doc) => {
        // console.log("Current data: ", doc.data().meeting_time.seconds);
        setHomePageCampGroup(doc.data());
      }
    );
  }, []);
  //getTentData
  useEffect(async () => {
    let tentsArr = [];
    const querySnapshot = await getDocs(
      collection(db, "CreateCampingGroup", params.id, "tent")
    );
    querySnapshot.forEach((doc) => {
      // console.log(doc.id, " => ", doc.data());
      tentsArr.push(doc.data());
    });
    setAllTentArr(tentsArr);
  }, []);
  //getSuppliesData
  useEffect(() => {
    const eventListenerpage = query(
      collection(db, "CreateCampingGroup", params.id, "supplies")
    );
    onSnapshot(eventListenerpage, (snapshot) => {
      let suppliesArr = [];
      snapshot.docChanges().forEach(async (change) => {
        if (change.type === "added") {
          suppliesArr.push(change.doc.data());
        }
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
      setRenderParticipateArr(true);
    });
  }, []);


  //getMember
  // async function getinfo(id) {
  //   const docRef = doc(db, "joinGroup", id);
  //   const docSnap = await getDoc(docRef);
  //   return docSnap.data();
  // }

  // useEffect(async () => {
  //   const memberShot = await getDocs(
  //     collection(db, "CreateCampingGroup", params.id, "member")
  //   );
  //   let memberIdArr = [];
  //   memberShot.forEach((doc) => {
  //     memberIdArr.push(doc.data().member_id);
  //   });
  //   let memberInfoArr = [];
  //   memberIdArr.map((item) => {
  //     getinfo(item)
  //       .then((res) => {
  //         console.log(res);
  //         memberInfoArr.push(res);
  //       })
  //       .then(() => {
  //         setAllMember(memberInfoArr);
  //       });
  //   });
  // }, [allTentArr]);

  useEffect(async () => {
    const q = query(
      collection(db, "joinGroup"),
      where("group", "array-contains", params.id)
    );
    // const unsubscribe = onSnapshot(q, (querySnapshot) => {
    //   querySnapshot.forEach((doc) => {
    //     thisGroupMemberArr.push(doc.data());
    //   });
    //   console.log(thisGroupMemberArr);
    // });

    const querySnapshot = await getDocs(q);
    let thisGroupMemberArr = [];
    querySnapshot.forEach((doc) => {
      console.log(doc.data().info);
      thisGroupMemberArr.push(doc.data());
    });
    // console.log(thisGroupMemberArr);
    setThisGroupMember(thisGroupMemberArr);
  }, []);

  // console.log(thisGroupMember);

  const takeAway = async (id) => {
    console.log(id);
    console.log(userName);

    await updateDoc(doc(db, "CreateCampingGroup", params.id, "supplies", id), {
      bring_person: userName,
    }).then(async () => {
      let takeAwayArr = [];
      const takeAwayRef = collection(
        db,
        "CreateCampingGroup",
        params.id,
        "supplies"
      );
      const querySnapshot = await getDocs(takeAwayRef);
      querySnapshot.forEach((doc) => {
        // console.log(doc.id, " => ", doc.data());
        takeAwayArr.push(doc.data());
      });
      setAllSupplies(takeAwayArr);
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
        member: allMemberArr,
        create_time: serverTimestamp(),
      }
    ).then(async () => {
      let tentsArr = [];
      const citiesRef = collection(db, "CreateCampingGroup", params.id, "tent");
      const q = query(citiesRef, orderBy("create_time", "desc"));
      const querySnapshot = await getDocs(
        db,
        "CreateCampingGroup",
        params.id,
        "tent"
      );
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        tentsArr.push(doc.data());
      });
      setAllTentArr(tentsArr);
      console.log(tentsArr);
    });
    setAllMemberArr("");
  };

  //------------------------FIX ME ------------------------//

  const handleAddTentSection = () => {
    setAddNewTentSection(true);
  };

  //------------------------FIX ME ------------------------//
  return (
    <div>
      <div>
        <Header ContextByUserId={ContextByUserId} />

        <Box
          sx={{
            width: "70%",
            height: "auto",
            // boxShadow:
            //   "0.8rem 0.8rem 2.2rem #E2E1D3 , -0.5rem -0.5rem 1rem #ffffff",
            borderRadius: 10,
            paddingTop: 8,
            margin: "auto",
            marginBottom: 10,
          }}>
          <GroupTitle>
            <Display>
              <HeaderName> 團長：{homePageCampGroup.header_name}</HeaderName>
              <Display>
                {homePageCampGroup.select_tag
                  ? homePageCampGroup.select_tag.map((item) => (
                      <>
                        <Tag m='3px'>{item}</Tag>
                      </>
                    ))
                  : ""}
              </Display>
            </Display>

            <Display alignItems='center' m='20px 0px '>
              <Img src={location} width='20px'></Img>
              {homePageCampGroup.city && (
                <Font marginLeft='15px'>{homePageCampGroup.city} | </Font>
              )}
              <Label mt='0px'>
                {homePageCampGroup && (
                  <Font fontSize='18px' letterSpacing='2px' marginLeft='15px'>
                    {
                      new Date(homePageCampGroup.start_date.seconds * 1000)
                        .toLocaleString()
                        .split(" ")[0]
                    }
                    ~
                    {homePageCampGroup &&
                      new Date(homePageCampGroup.end_date.seconds * 1000)
                        .toLocaleString()
                        .split(" ")[0]}
                  </Font>
                )}
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
                <Font fontSize='20px' m='10px 0px' color='#F3EA98'>
                  詳細地址
                </Font>
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
                <Font fontSize='20px'>
                  {homePageCampGroup &&
                    new Date(homePageCampGroup.meeting_time.seconds * 1000)
                      .toLocaleString()
                      .split(" ")[0]}
                </Font>
                <Font fontSize='35px'>
                  {homePageCampGroup &&
                    new Date(homePageCampGroup.meeting_time.seconds * 1000)
                      .toLocaleString()
                      .split(" ")[1]
                      .split(":")[0]}
                  :
                  {homePageCampGroup &&
                    new Date(homePageCampGroup.meeting_time.seconds * 1000)
                      .toLocaleString()
                      .split(" ")[1]
                      .split(":")[1]}
                </Font>
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
                <Hr width='100px'></Hr>
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
                <Display mb='20px'>
                  <Img src={alert} alt='' width='40px' />
                  <Font fontSize='16px' marginLeft='10px'>
                    營區提供租借帳篷
                  </Font>
                </Display>
                <Display mb='20px'>
                  <Img src={alert} alt='' width='40px' />
                  <Font fontSize='16px' marginLeft='10px'>
                    自行準備晚餐/隔天早餐
                  </Font>
                </Display>
                <Display mb='20px'>
                  <Img src={alert} alt='' width='40px' />
                  <Font fontSize='16px' marginLeft='10px'>
                    營區提供租借帳篷
                  </Font>
                </Display>
              </Cloumn>
            </Box>
          </Display>

          <Cloumn>
            <Font fontSize='20px'>加入帳篷</Font>
            <Hr width='100px'></Hr>
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
                }}>
                <TentIndexNumber>{index + 1}</TentIndexNumber>
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
                            m='0px 10px 10px 0px'
                            mb='20px'>
                            <Font margin='10px' marginLeft='10px'>
                              {seat !== userName && (
                                <Font fontSize='18px' m='0px 0px 20px 0px'>
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
                                color='primary'
                                fontSize='large'></AccountCircleIcon>
                            )}
                            {seat === userName && (
                              <PersonWrap
                                data-key={item.tent_id}
                                id='drag-source'
                                draggable='true'
                                onDragStart={dragStart}>
                                <AssignmentIndIcon
                                  sx={{
                                    pointerEvents: "none",
                                    cursor: "not-allowed",
                                  }}
                                  fontSize='large'></AssignmentIndIcon>
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
              {!IsMemberInTheTent && (
                <PersonWrap
                  id='drag-source'
                  draggable='true'
                  onDragStart={dragStart}>
                  <AssignmentIndIcon
                    sx={{ pointerEvents: "none", cursor: "not-allowed" }}
                    color='primary'
                    fontSize='large'></AssignmentIndIcon>
                </PersonWrap>
              )}
              <Display>
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
              <Box
                sx={{
                  width: "100%",
                  height: "auto",
                  boxShadow:
                    "0.8rem 0.8rem 2.2rem #E2E1D3 , -0.5rem -0.5rem 1rem #ffffff",
                  borderRadius: 10,
                  padding: 3,
                  paddingLeft: 6,
                  alignItems: "center",
                  marginTop: 3,
                  marginBottom: 5,
                }}>
                <Font fontSize='20px' alignSelf='start'>
                  新增帳篷
                </Font>
                <Display>
                  <Tent
                    setTentInfo={setTentInfo}
                    tentInfo={tentInfo}
                    setAllMemberArr={setAllMemberArr}
                    allMemberArr={allMemberArr}
                  />
                  <Button width='100px' onClick={addNewTent}>
                    新增
                  </Button>
                </Display>
                {/* {tentArr.map((_, index) => (
            <div key={index}>
              <Tent setTentInfo={setTentInfo} tentInfo={tentInfo} />
            </div>
          ))} */}
              </Box>
            )}
          </Wrap>
          <Cloumn>
            <Font fontSize='20px'>需要大家幫忙帶的用品</Font>
            <Hr width='100px'></Hr>
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
                  <Font color='#F4F4EE' marginLeft='10%'>
                    項目
                  </Font>
                  <Font color='#F4F4EE' marginLeft='20%'>
                    備註
                  </Font>
                  <Font color='#F4F4EE' marginLeft='20%'>
                    認領
                  </Font>
                </Display>
                {allSupplies.map((item, index) => (
                  <SuppliesWrap key={index}>
                    <Label fontSize='16px' color='#F3EA98' ml='5%'>
                      {item.supplies}
                    </Label>
                    <Label fontSize='16px' ml='20%' color='#F3EA98'>
                      {item.note}
                    </Label>
                    <Label ml='20%' color='#F3EA98'>
                      {item.bring_person}
                    </Label>
                    <Button
                      width='150px'
                      fontSize='16px'
                      ml='20%'
                      onClick={() => {
                        takeAway(item.supplies_id);
                      }}>
                      我可以幫忙帶
                    </Button>
                  </SuppliesWrap>
                ))}
              </Box>
            </Box>
          </Display>
          <Button
            width='80px'
            height='80px'
            borderRadius='50%'
            fontSize='30px'
            bgc='#426765'
            color='#CFC781'
            boxShadow='none'
            ml='20px'>
            +
          </Button>

          <Cloumn>
            <Font fontSize='20px'>團員</Font>
            <Hr width='100px'></Hr>
          </Cloumn>
          <AllMemberWrap>
            {thisGroupMember.map((item) => (
              <MemberWrap>
                <ProfileImgWrap>
                  <ProfileImg src={item.profile_img} />
                </ProfileImgWrap>
                <Font>{item.info.user_name}</Font>
                <Display m='3px'>
                  {item.select_tag
                    .map((obj) => (
                      <Tag width='auto' m='3px'>
                        {obj}
                      </Tag>
                    ))
                    .slice(0, 3)}
                </Display>
              </MemberWrap>
            ))}
          </AllMemberWrap>
        </Box>
      </div>
    </div>
  );
}

export default JoinGroupPage;
