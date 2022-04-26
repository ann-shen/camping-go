import { db } from "../utils/firebase";
import styled from "styled-components";
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
} from "firebase/firestore";
import { useState, useEffect, useRef, useContext } from "react";
import { useParams } from "react-router-dom";
import "../utils/data";
import { Label, AddButton, Font, Img, Display, Button } from "../css/style";
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
  justify-content: center;
  align-items: center;
  width: 50px;
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

function JoinGroupPage({ setAllMemberArr, allMemberArr, userName }) {
  const [homePageCampGroup, setHomePageCampGroup] = useState("");
  const [allTentArr, setAllTentArr] = useState([]);
  const [allSupplies, setAllSupplies] = useState([]);
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
      console.log(doc.id, " => ", doc.data());
      setRenderParticipateArr(true);
    });
  }, []);

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
    // console.log(allMemberArr);
  };

  //------------------------FIX ME ------------------------//

  const handleAddTentSection = () => {
    setAddNewTentSection(true);
  };

  //------------------------FIX ME ------------------------//

  return (
    <div>
      {
        <div>
          <Header ContextByUserId={ContextByUserId} />
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              // m: 10,
              mt: 10,
              ml: 35,
              pt: 8,
              "& > :not(style)": {
                m: 1,
                width: "80%",
                height: "auto",
              },
            }}>
            <Paper sx={{ p: 10 }}>
              <Display ml='25px'>
                <Img src={location} width='20px'></Img>
                {homePageCampGroup.city && (
                  <Font marginLeft='8px'>{homePageCampGroup.city} | </Font>
                )}
                <Label>
                  {homePageCampGroup &&
                    new Date(homePageCampGroup.start_date.seconds * 1000)
                      .toLocaleString()
                      .split(" ")[0]}{" "}
                  ~{" "}
                  {homePageCampGroup &&
                    new Date(homePageCampGroup.end_date.seconds * 1000)
                      .toLocaleString()
                      .split(" ")[0]}
                </Label>
              </Display>
              <Display justifyContent='space-between'>
                <Font fontSize='40px' marginLeft='25px'>
                  {homePageCampGroup.group_title}
                </Font>
                <Font fontSize='30px' marginLeft='25px'>
                  {homePageCampGroup.current_number}/
                  {homePageCampGroup.max_member_number}人
                </Font>
              </Display>
              <Display ml='25px'>
                <Font fontSize='16px' margin='10px'>
                  詳細地址
                </Font>
                <Font fontSize='16px'>{homePageCampGroup.position}</Font>
              </Display>
              <Display ml='25px'>
                <Font fontSize='16px' margin='10px'>
                  營區網站
                </Font>
                <Font fontSize='16px'>{homePageCampGroup.site}</Font>
              </Display>
              <Display ml='25px'>
                <Font fontSize='16px' margin='10px'>
                  集合時間
                </Font>
                <Font fontSize='16px'>
                  {homePageCampGroup &&
                    new Date(
                      homePageCampGroup.meeting_time.seconds * 1000
                    ).toLocaleString()}
                </Font>
              </Display>
              <Box>
                <Display ml='25px'>
                  <Font fontSize='16px' margin='10px'>
                    公告
                  </Font>
                  <Font fontSize='16px'>{homePageCampGroup.announcement}</Font>
                </Display>
              </Box>
              <br />
              <br />
              {allTentArr.map((item, index) => (
                <Box
                  sx={{
                    width: "400px",
                    height: "auto",
                    boxShadow: 3,
                    borderRadius: 6,
                    padding: 1,
                    margin: 1,
                  }}>
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
              </SourseContainer>
              <Button
                width='80px'
                height='80px'
                borderRadius='50%'
                ml='90%'
                fontSize='30px'
                bgc='#426765'
                color='#CFC781'
                boxShadow='none'
                onClick={handleAddTentSection}>
                +
              </Button>
              <br />
            </Paper>
          </Box>
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
            <Box>
              <Paper elevation={3} sx={{ p: 10 }}>
                <Label fontSize='30px'>需要大家幫忙帶的用品</Label>
                <br />
                <br />
                {allSupplies.map((item, index) => (
                  <div key={index}>
                    <Label>{item.supplies}</Label>
                    <Label fontSize='16px' ml='30px'>
                      {item.note}
                    </Label>
                    <Label ml='30px'>{item.bring_person}</Label>
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
              </Paper>
            </Box>
          </Box>
        </div>
      }
    </div>
  );
}

export default JoinGroupPage;
