import { db } from "../utils/firebase";
import styled, { keyframes } from "styled-components";
import {
  doc,
  collection,
  getDocs,
  getDoc,
  updateDoc,
  arrayUnion,
  setDoc,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import { Font, Display, Img, Button, Hr } from "../css/style";
import { TextField, Alert, Stack, Skeleton } from "@mui/material";
import location from "../image/location.png";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { Link } from "react-router-dom";
import Swal from "sweetalert2/dist/sweetalert2.js";
import alertIcon from "../image/alert.png";

const AnnouncementFontWrap = styled.div`
  width: 80%;
  line-height: 25px;
  margin-bottom: 20px;
`;

const Span = styled.span`
  font-size: 16px;
  margin-left: 6px;
  color: #797659;
`;

const ButtonWrap = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px 0px;
`;

const ImgWrap = styled.div`
  position: relative;
  width: 100%;
  height: 230px;
  border-radius: 20px;
  overflow: hidden;
`;

const Tag = styled.div`
  position: relative;
  bottom: 200px;
  left: 20px;
  width: 45px;
  height: 26px;
  padding-top: 2px;
  border-radius: 10px;
  background-color: #426765;
  border: 1.5px solid #cfc781;
  color: white;
  text-align: center;
`;

const SelectTag = styled.div`
  width: auto;
  height: 25px;
  padding: 2px 7px 0px 7px;
  border-radius: 10px;
  margin: 0px 4px;
  border: 1.5px solid #cfc781;

  background-color: #ebebeb;
  color: #797659;
`;

const breatheAnimation = keyframes`
0% { opacity: 0;
  transform: scale(0.3)    }
40% { opacity: 0.5;
  transform: scale(1.1)   }
  70% { opacity: 0.5;
  transform: scale(0.9)   }
100% { opacity: 1;
  transform: scale(1)    }
`;

const fadeIn = keyframes`
from {
  opacity: 0;
  transform: scale(0.3)   translateX(1.5rem)  ;
}
to {
  opacity: 1;
  transform: scale(1)  translateX(1) ;
}
`;

const GroupWrap = styled.div`
  display: flex;
  /* flex-direction: column; */
  width: 450px;
  display: flex;
  justify-content: center;
  margin: 50px auto;
  align-items: start;
  animation: ${breatheAnimation} 700ms ease-in-out;
`;

const LinkPrivate = styled(Link)`
  text-decoration: none;
  margin: 5px 5px;
  font-size: 14px;
  color: gray;
`;

const LinkOpen = styled.a`
  text-decoration: none;
  margin: 5px 5px;
  font-size: 14px;
  color: gray;
`;

function IsModal({
  modalIsOpen,
  setIsOpen,
  currentPosts,
  index,
  joinThisGroup,
  setRecommendIsOpen,
}) {

  const navigate = useNavigate();

  return (
    <div className='App'>
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
          {currentPosts[index] ? (
            <>
              <Font letterSpacing='3px'>介紹-即將加入露營團</Font>
              <Hr width='80%' m='10px 0px 20px 0px'></Hr>
              <AnnouncementFontWrap>
                <Font fontSize='14px'>{currentPosts[index].announcement}</Font>
              </AnnouncementFontWrap>
              <Font fontSize='18px' color='#426765'>
                注意事項
              </Font>
              <Hr width='80%' m='10px 0px 20px 0px'></Hr>
              <AnnouncementFontWrap>
                {currentPosts[index].notice.length !== 0 &&
                  currentPosts[index].notice.map((item) => (
                    <Display mb='15px' alignItems='start'>
                      <Img src={alertIcon} width='30px'></Img>
                      <Font fontSize='14px' marginLeft='10px'>
                        {item}
                      </Font>
                    </Display>
                  ))}
              </AnnouncementFontWrap>

              {currentPosts[index].privacy == "公開" && (
                <Display>
                  <Button
                    width='200px'
                    mt='30px'
                    bgc='white'
                    border='1px solid #CFC781'
                    onClick={() => {
                      setIsOpen(false);
                      setRecommendIsOpen(false);
                    }}>
                    我再考慮
                  </Button>
                  <Button
                    width='200px'
                    mt='30px'
                    ml='20px'
                    onClick={() => {
                      joinThisGroup(
                        index,
                        currentPosts[index].header_name,
                        currentPosts[index].max_member_number,
                        currentPosts[index].current_number
                      );
                    }}>
                    確認加入
                  </Button>
                </Display>
              )}
            </>
          ) : (
            <></>
          )}
        </Display>
      </Modal>
    </div>
  );
}

function FindGroup({ userId, userName, setGroupId, setRecommendIsOpen }) {
  const [userTag, setUserTag] = useState([]);
  const [allGroupInfo, setAllGroupInfo] = useState([]);
  const [allGroupSelectArr, setAllGroupSelectArr] = useState([]);
  const [findIndex, setFindIndex] = useState("");
  const [groupPassword, setGroupPassword] = useState("");
  const [backdropOpen, setbackdropOpen] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [recommendCardIsOpen, setRecommendCardIsOpen] = useState(true);

  const navigate = useNavigate();

  useEffect(async () => {
    const docRef = await getDoc(doc(db, "joinGroup", userId));
    if (docRef.exists()) {
      setUserTag(docRef.data().select_tag);
      console.log(docRef.data().select_tag);
    } else {
      console.log("nono~");
    }
  }, []);

  useEffect(async () => {
    const docRef = await getDocs(collection(db, "CreateCampingGroup"));
    let allSelectArr = [];
    let allInfoArr = [];
    docRef.forEach((doc) => {
      // allSelectArr.push(doc.data().select_tag);
      allInfoArr.push(doc.data());
    });

    const filterHeaderGroup = allInfoArr.filter((e, index) => {
      return e.header_id !== userId;
    });
    // console.log(filterHeaderGroup);

    const filterPrivacyGroup = filterHeaderGroup.filter((e, index) => {
      return e.privacy !== "私人";
    });

    const fullMemberGroup = filterPrivacyGroup.filter((e, index) => {
      console.log(e.max_member_number);
      console.log(e.current_number);
      return e.max_member_number.toString() !== e.current_number.toString();
    });

    console.log(fullMemberGroup);

    fullMemberGroup.map((item) => {
      allSelectArr.push(item.select_tag);
    });
    setAllGroupSelectArr(allSelectArr);
    setAllGroupInfo(fullMemberGroup);
  }, []);

  useEffect(() => {
    let mathArr = [];
    allGroupSelectArr.map(async (groupSelect) => {
      const find = groupSelect
        .map((item) => {
          return userTag.filter((e) => e == item);
        })
        .flat(Infinity);

      console.log(find);

      mathArr.push(find.length);
      const max = Math.max(...mathArr);
      const index = mathArr.indexOf(max);
      setFindIndex(index);
    });
  }, [allGroupSelectArr, allGroupInfo]);

  // const joinThisGroup = async (index, password, header_name) => {
  //   console.log(allGroupInfo);
  //   console.log(index);
  //   setGroupId(allGroupInfo[index].group_id.toString());
  //   setGroupPassword(password);
  //   const docRef = await doc(
  //     db,
  //     "CreateCampingGroup",
  //     allGroupInfo[index].group_id.toString()
  //   );

  //   const docRefMember = await doc(
  //     db,
  //     "CreateCampingGroup",
  //     allGroupInfo[index].group_id.toString(),
  //     "member",
  //     userId
  //   );

  //   const docSnap = await getDoc(docRef);
  //   if (docSnap.exists()) {
  //     if (docSnap.data().privacy == "私人") {
  //       // setIsOpen(true);
  //     }
  //   } else {
  //     // doc.data() will be undefined in this case
  //     console.log("No such document!");
  //   }
  //   setDoc(docRefMember, {
  //     role: "member",
  //     member_name: userName,
  //     member_id: userId,
  //   }).then(async () => {
  //     const querySnapshot = await getDocs(
  //       collection(
  //         db,
  //         "CreateCampingGroup",
  //         allGroupInfo[index].group_id.toString(),
  //         "member"
  //       )
  //     );
  //     let memberArrLength = [];
  //     querySnapshot.forEach((doc) => {
  //       // console.log(doc.id, " => ", doc.data());
  //       memberArrLength.push(doc.data());
  //     });
  //     console.log(memberArrLength.length);
  //     await updateDoc(docRef, {
  //       current_number: memberArrLength.length,
  //     });
  //   });

  //   const docRefJoinGroup = await doc(db, "joinGroup", userId);
  //   console.log(allGroupInfo[index].group_id);
  //   updateDoc(docRefJoinGroup, {
  //     group: arrayUnion(allGroupInfo[index].group_id),
  //   });

  //   updateDoc(doc(db, "joinGroup", allGroupInfo[index].header_id), {
  //     alert: arrayUnion({
  //       alert_content: `${userName}已加入「${allGroupInfo[index].group_title}」`,
  //       is_read: false,
  //     }),
  //   });
  // };

  // console.log(findIndex);

  const joinThisGroup = async (index, max_member_number, current_number) => {
    console.log(current_number);

    setbackdropOpen(true);

    if (current_number + 1 > max_member_number) {
      console.log(current_number + 1);
      Swal.fire({
        position: "center",
        icon: "warning",
        text: "已滿團",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    // setGroupId(allGroupInfo[index].group_id.toString());

    const docRef = await doc(
      db,
      "CreateCampingGroup",
      allGroupInfo[index].group_id.toString()
    );

    const docRefMember = await doc(
      db,
      "CreateCampingGroup",
      allGroupInfo[index].group_id.toString(),
      "member",
      userId
    );

    let userSelect;

    const docRefJoinGroup = doc(db, "joinGroup", userId);
    const docMemberInfo = await getDoc(docRefJoinGroup);

    if (docMemberInfo.exists()) {
      console.log(docMemberInfo.data().select_tag);
      userSelect = docMemberInfo.data().select_tag;
    }

    updateDoc(docRefJoinGroup, {
      group: arrayUnion(allGroupInfo[index].group_id),
    });
    updateDoc(doc(db, "joinGroup", allGroupInfo[index].header_id), {
      alert: arrayUnion({
        alert_content: `${userName}已加入「${allGroupInfo[index].group_title}」`,
        is_read: false,
      }),
    });

    setDoc(docRefMember, {
      role: "member",
      member_name: userName,
      member_id: userId,
      member_select: userSelect,
    }).then(async () => {
      const querySnapshot = await getDocs(
        collection(
          db,
          "CreateCampingGroup",
          allGroupInfo[index].group_id.toString(),
          "member"
        )
      );
      let memberArrLength = [];
      querySnapshot.forEach((doc) => {
        // console.log(doc.id, " => ", doc.data());
        memberArrLength.push(doc.data());
      });
      console.log(memberArrLength.length);
      await updateDoc(docRef, {
        current_number: memberArrLength.length,
      });
    });

    console.log(allGroupInfo[index].group_id);

    setTimeout(() => {
      navigate(`/joinGroup/${allGroupInfo[index].group_id}`);
    }, 500);
  };
  return (
    <div>
      <IsModal
        currentPosts={allGroupInfo}
        setIsOpen={setIsOpen}
        modalIsOpen={modalIsOpen}
        index={findIndex}
        joinThisGroup={joinThisGroup}
        setRecommendIsOpen={setRecommendIsOpen}
      />
      {/* <Font color="white" m="100px 0px 0px 0px" marginLeft="44%" letterSpacing="3px">- 最佳推薦 -</Font> */}
      {allGroupInfo.length !== 0 && (
        <>
          {recommendCardIsOpen && (
            <GroupWrap>
              <Card
                sx={{
                  height: "auto",
                  width: "100%",
                  boxShadow:
                    "0.2rem 0.2rem 0.2rem #CFC781 , -0.3rem -0.3rem 0.2rem #ffffff",
                  borderRadius: 5,
                  padding: 1,
                  margin: 5,
                  backgroundColor: "#F4F4EE",
                }}>
                <ImgWrap>
                  <CardMedia
                    sx={{
                      width: "100%",
                      height: "230px",
                    }}
                    component='img'
                    height='194'
                    image={allGroupInfo[findIndex].picture}
                    alt='Paella dish'
                  />
                  {allGroupInfo[findIndex].privacy == "私人" && <Tag>私</Tag>}
                </ImgWrap>
                <CardContent
                  sx={{
                    textAlign: "start",
                    height: "160px",
                  }}>
                  <Span>團長</Span>
                  <Span>{allGroupInfo[findIndex].header_name}</Span>
                  <Font fontSize='25px' m='6px 0px 6px 0px'>
                    {allGroupInfo[findIndex].group_title}
                  </Font>
                  <Font fontSize='16px' m='0px 0px 16px 0px'>
                    {
                      new Date(
                        allGroupInfo[findIndex].start_date.seconds * 1000
                      )
                        .toLocaleString()
                        .split(" ")[0]
                    }
                    ~
                    {
                      new Date(allGroupInfo[findIndex].end_date.seconds * 1000)
                        .toLocaleString()
                        .split(" ")[0]
                    }
                  </Font>
                  <Display justifyContent='space-between'>
                    <Display>
                      <Img src={location} width='26px'></Img>
                      <Span>{allGroupInfo[findIndex].city}</Span>
                    </Display>
                    <Display>
                      <Font>
                        {allGroupInfo[findIndex].current_number}/
                        {allGroupInfo[findIndex].max_member_number}
                      </Font>
                      <Span>人</Span>
                    </Display>
                  </Display>
                </CardContent>

                <ButtonWrap>
                  <Button
                    width='90%'
                    margin='auto'
                    group_id={allGroupInfo[findIndex].group_id}
                    variant='outlined'
                    onClick={(e) => {
                      setIsOpen(true);
                      setRecommendCardIsOpen(false);
                      // joinThisGroup(
                      //   findIndex,
                      //   allGroupInfo[findIndex].password,
                      //   allGroupInfo[findIndex].header_name,
                      //   allGroupInfo[findIndex].max_member_number,
                      //   allGroupInfo[findIndex].current_number
                      // );
                    }}>
                    {allGroupInfo[findIndex].privacy == "公開" &&
                      allGroupInfo[findIndex].header_name !== userName && (
                        // <LinkPrivate
                        //   to={`joinGroup/${allGroupInfo[findIndex].group_id}`}>
                        //   我要加入
                        // </LinkPrivate>
                        <LinkOpen>我要加入</LinkOpen>
                      )}
                  </Button>
                </ButtonWrap>

                <CardActions disableSpacing>
                  {allGroupInfo[findIndex].select_tag
                    .map((obj) => <SelectTag>{obj}</SelectTag>)
                    .slice(0, 3)}
                </CardActions>
              </Card>
            </GroupWrap>
          )}
        </>
      )}
    </div>
  );
}

export default FindGroup;
