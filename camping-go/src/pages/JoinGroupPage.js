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
} from "../css/style";
import Tent from "../component/Tent";
import Header from "../component/Header";
import { Box, Paper } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import location from "../image/location.png";
import tent from "../image/tent.png";
import { v4 as uuidv4 } from "uuid";
import { UserContext } from "../utils/userContext";

const TargetContainer = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  border: "3px dotted #426765",
  width: "60px",
  height: "60px",
  backgroundColor: "#f5f4e8",
  borderRadius: "10px",
  margin: "10px",
  paddingTop: "5px",
};

const SourseContainer = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  width: 300px;
  height: 80px;
  margin: 10px;
`;

const PersonWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  background-color: white;
  border: 2px solid #797659;
  border-radius: 5px;
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
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin: 10px;
  background: #ffda72;
  &:before {
    background: #ffda72;
    content: "";
    display: block;
    position: absolute;
    left: -5px;
    top: -5px;
    width: 50px;
    height: 50px;
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
  height: 30px;
  border-radius: 10px;
  padding-top: 7px;
  background-color: #426765;
  color: white;
`;

const ImagesWrap = styled.div`
  width: 500px;
  height: 300px;
  border-radius: 20px;
  margin: 40px 0px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const GroupImg = styled.img`
  width: 105%;
`;

const ProfileImgWrap = styled.div`
  width: 60px;
  height: auto;
  overflow: hidden;
  border-radius: 50%;
`;
const ProfileImg = styled.img`
  width: 60px;
  height: 60px;
`;

function JoinGroupPage({ setAllMemberArr, allMemberArr, userName }) {
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
  let params = useParams();

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
      where("group", "array-contains", "xyzHE3Fuv8CS6oRVirez")
    );
    const querySnapshot = await getDocs(q);
    let thisGroupMemberArr = [];
    querySnapshot.forEach((doc) => {
      // console.log(doc.data().info)
      thisGroupMemberArr.push(doc.data());
    });
    // console.log(thisGroupMemberArr);
    setThisGroupMember(thisGroupMemberArr);
  }, []);

  console.log(thisGroupMember);

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
        collection(db, "CreateCampingGroup", params.id, "tent")
      );
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        tentsArr.push(doc.data());
      });
      setAllTentArr(tentsArr);
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
        {thisGroupMember.map((item) => (
          <Cloumn>
            <ProfileImgWrap>
              <ProfileImg src={item.profile_img} />
            </ProfileImgWrap>
            {item.info.user_name}
            {item.select_tag.map((obj) => (
              <div>{obj}</div>
            )).slice(0,3)}
          </Cloumn>
        ))}

        <Box
          sx={{
            width: "75%",
            height: "auto",
            // boxShadow:
            //   "0.8rem 0.8rem 2.2rem #E2E1D3 , -0.5rem -0.5rem 1rem #ffffff",
            borderRadius: 10,
            paddingTop: 8,
            margin: "auto",
            marginBottom: 10,
          }}>
          <GroupTitle>
            <HeaderName> 團長：{homePageCampGroup.header_name}</HeaderName>
            <Display alignItems='center' m='20px 0px '>
              <Img src={location} width='20px'></Img>
              {homePageCampGroup.city && (
                <Font marginLeft='8px'>{homePageCampGroup.city} | </Font>
              )}
              <Label mt='0px'>
                {homePageCampGroup &&
                  new Date(homePageCampGroup.start_date.seconds * 1000)
                    .toLocaleString()
                    .split(" ")[0]}
                ~
                {homePageCampGroup &&
                  new Date(homePageCampGroup.end_date.seconds * 1000)
                    .toLocaleString()
                    .split(" ")[0]}
              </Label>
            </Display>
          </GroupTitle>
          <Display justifyContent='space-between'>
            <Font fontSize='35px' letterSpacing='3px'>
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
                height: "200px",
                borderRadius: 15,
                padding: 5,
                marginTop: 3,
                justifyContent: "start",
                backgroundColor: "#426765",
              }}>
              <Cloumn>
                <Font fontSize='20px' m='10px 0px' color='#F3EA98'>
                  詳細地址
                </Font>
                <Font fontSize='20px' m='0px 0px 25px 0px' color='#F3EA98'>
                  {homePageCampGroup.position}
                </Font>
              </Cloumn>
              <Display>
                <Cloumn>
                  <Font fontSize='20px' m='10px 0px' color='#F3EA98'>
                    營區網站
                  </Font>
                  <Font fontSize='20px' color='#F3EA98'>
                    {homePageCampGroup.site}
                  </Font>
                </Cloumn>
              </Display>
            </Box>

            <Box
              sx={{
                width: "30%",
                height: "200px",
                boxShadow:
                  "0.8rem 0.8rem 2.2rem #E2E1D3 , -0.5rem -0.5rem 1rem #ffffff",
                borderRadius: 10,
                padding: 5,
                marginTop: 3,
                marginLeft: 5,
                justifyContent: "start",
              }}>
              <Cloumn>
                <Font fontSize='20px' m='10px'>
                  集合時間
                </Font>
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

          <Box
            sx={{
              width: "95%",
              height: "auto",
              boxShadow:
                "0.8rem 0.8rem 2.2rem #E2E1D3 , -0.5rem -0.5rem 1rem #ffffff",
              borderRadius: 10,
              padding: 2,
              marginTop: 8,
              marginBottom: 8,
              justifyContent: "start",
            }}>
            <Cloumn>
              <Font fontSize='16px'>公告</Font>
              <Font fontSize='16px'>{homePageCampGroup.announcement}</Font>
            </Cloumn>
          </Box>
          <Cloumn>
            <Font fontSize='30px'>加入帳篷</Font>
            <Font fontSize='16px'>
              請選擇想加入的帳篷！如有自備帳篷請按加號，並輸入預計可容納人數。
            </Font>
          </Cloumn>
          <Display justifyContent='center'>
            {allTentArr.map((item, index) => (
              <Box
                sx={{
                  width: "100%",
                  height: "350px",
                  boxShadow:
                    "0.3rem 0.3rem 0.8rem #E0DCBA , -0.5rem -0.5rem 0.6rem #ffffff",
                  borderRadius: 10,
                  paddingTop: 5,
                  paddingBottom: 5,
                  margin: 2,
                  backgroundColor: "#EAE5BE",
                }}>
                <Font>{index + 1}</Font>
                <Display key={index} direction='column'>
                  <Img src={tent}></Img>
                  <Label fontSize='35px'>
                    {item.current_number}/{item.max_number}
                  </Label>
                  <Font fontSize='16px'>
                    還有
                    {Number(item.max_number) - Number(item.current_number)}
                    個位置
                  </Font>
                  <Display>
                    {item.member &&
                      item.member.map((seat, index) => (
                        <Display direction='column' justifyContent='center'>
                          <Font margin='10px' marginLeft='10px'>
                            {seat !== userName && <div>{seat}</div>}
                            {seat === userName && <div>{seat}</div>}
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
              </Box>
            ))}
          </Display>
          <Box
            sx={{
              width: "auto",
              height: "auto",
              boxShadow:
                "0.8rem 0.8rem 2.2rem #E2E1D3 , -0.5rem -0.5rem 1rem #ffffff",
              borderRadius: 10,
              padding: 2,
              marginTop: 8,
              marginBottom: 8,
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
                <Font fontSize='14px'>拖移小人偶至指定帳篷</Font>
                <AnimationIndicators />
              </Display>
            </SourseContainer>
          </Box>
          <Button
            width='80px'
            height='80px'
            borderRadius='50%'
            fontSize='30px'
            bgc='#426765'
            color='#CFC781'
            boxShadow='none'
            ml='90%'
            onClick={handleAddTentSection}>
            +
          </Button>
          {addNewTentSection && (
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                // m: 10,
                mt: 2,
                ml: 35,
                "& > :not(style)": {
                  m: 1,
                  width: "80%",
                  height: "auto",
                },
              }}>
              <Paper elevation={3} sx={{ p: 10 }}>
                <Tent
                  setTentInfo={setTentInfo}
                  tentInfo={tentInfo}
                  setAllMemberArr={setAllMemberArr}
                  allMemberArr={allMemberArr}
                />
                <AddButton onClick={addNewTent}>新增</AddButton>
                {/* {tentArr.map((_, index) => (
            <div key={index}>
              <Tent setTentInfo={setTentInfo} tentInfo={tentInfo} />
            </div>
          ))} */}
              </Paper>
            </Box>
          )}
          <Display>
            <Box
              sx={{
                width: "100%",
                height: "200px",
                borderRadius: 15,
                padding: 5,
                marginTop: 3,
                justifyContent: "start",
                backgroundColor: "#426765",
              }}>
              <Box>
                <Font fontSize='30px' m='10px 0px' color='#F3EA98'>
                  需要大家幫忙帶的用品
                </Font>
                <br />
                <br />
                {allSupplies.map((item, index) => (
                  <div key={index}>
                    <Label fontSize='16px' color='#F3EA98'>
                      {item.supplies}
                    </Label>
                    <Label fontSize='16px' ml='30px' color='#F3EA98'>
                      {item.note}
                    </Label>
                    <Label ml='30px' color='#F3EA98'>
                      {item.bring_person}
                    </Label>
                    {/* onClick=
              {(index) => {
                takeAway(index);
              }} */}
                    <Button
                      width='150px'
                      fontSize='16px'
                      ml='40px'
                      onClick={() => {
                        takeAway(item.supplies_id);
                      }}>
                      我可以幫忙帶
                    </Button>
                  </div>
                ))}
              </Box>
            </Box>
            <Box
              sx={{
                width: "50%",
                height: "200px",
                boxShadow:
                  "0.8rem 0.8rem 2.2rem #E2E1D3 , -0.5rem -0.5rem 1rem #ffffff",
                borderRadius: 10,
                padding: 5,
                marginTop: 3,
                marginLeft: -13,
                justifyContent: "start",
                zIndex: -1,
              }}>
              <Cloumn></Cloumn>
            </Box>
          </Display>
        </Box>
      </div>
    </div>
  );
}

export default JoinGroupPage;
