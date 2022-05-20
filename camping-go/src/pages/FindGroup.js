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
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../utils/userContext";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import { Font, Display, Img, Button, Hr } from "../css/style";
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
  setIsOpen,
  modalIsOpen,
  allGroupInfo,
  index,
  joinThisGroup,
  setRecommendIsOpen,
}) {
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
          {allGroupInfo[index] && (
            <>
              <Font letterSpacing='3px'>介紹-即將加入露營團</Font>
              <Hr width='80%' m='10px 0px 20px 0px'></Hr>
              <AnnouncementFontWrap>
                <Font fontSize='14px'>{allGroupInfo[index].announcement}</Font>
              </AnnouncementFontWrap>
              <Font fontSize='18px' color='#426765'>
                注意事項
              </Font>
              <Hr width='80%' m='10px 0px 20px 0px'></Hr>
              <AnnouncementFontWrap>
                {allGroupInfo[index].notice.length !== 0 &&
                  allGroupInfo[index].notice.map((item) => (
                    <Display mb='15px' alignItems='start'>
                      <Img src={alertIcon} width='30px'></Img>
                      <Font fontSize='14px' marginLeft='10px'>
                        {item}
                      </Font>
                    </Display>
                  ))}
              </AnnouncementFontWrap>

              {allGroupInfo[index].privacy == "公開" && (
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
                        allGroupInfo[index].header_name,
                        allGroupInfo[index].max_member_number,
                        allGroupInfo[index].current_number,
                        allGroupInfo
                      );
                    }}>
                    確認加入
                  </Button>
                </Display>
              )}
            </>
          )}
        </Display>
      </Modal>
    </div>
  );
}

function FindGroup({ userId, userName, setRecommendIsOpen, joinThisGroup }) {
  const [userTag, setUserTag] = useState([]);
  const [allGroupInfo, setAllGroupInfo] = useState([]);
  const [allGroupSelectArr, setAllGroupSelectArr] = useState([]);
  const [findIndex, setFindIndex] = useState("");
  const [backdropOpen, setbackdropOpen] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [recommendCardIsOpen, setRecommendCardIsOpen] = useState(true);
  const Context = useContext(UserContext);

  useEffect(async () => {
    const docRef = await getDoc(doc(db, "joinGroup", userId));
    if (docRef.exists()) {
      setUserTag(docRef.data().select_tag);
    }
  }, []);

  const pushfilteredGroupsSelsetTagInNewArr = (arr) => {
    let allSelectArr = [];
    arr.map((item) => {
      allSelectArr.push(item.select_tag);
    });
    return allSelectArr;
  };

  const handleGroupSelectArr = (arr) => {
    setAllGroupSelectArr(pushfilteredGroupsSelsetTagInNewArr(arr));
    setAllGroupInfo(arr);
  };

  useEffect(async () => {
    const docRef = await getDocs(collection(db, "CreateCampingGroup"));
    let allInfoArr = [];
    docRef.forEach((doc) => {
      allInfoArr.push(doc.data());
    });
    const filterHeaderGroup = allInfoArr.filter((e) => {
      return e.header_id !== userId;
    });

    const filterPrivacyGroup = filterHeaderGroup.filter((e) => {
      return e.privacy !== "私人";
    });

    const filterfullMemberGroup = filterPrivacyGroup.filter((e) => {
      return e.max_member_number.toString() !== e.current_number.toString();
    });
    handleGroupSelectArr(filterfullMemberGroup);
  }, []);

  useEffect(() => {
    let mathArr = [];
    allGroupSelectArr.map((groupSelect) => {
      const find = groupSelect
        .map((item) => {
          return userTag.filter((e) => e == item);
        })
        .flat(Infinity);
      mathArr.push(find.length);
    });
    const max = Math.max(...mathArr);
    const index = mathArr.indexOf(max);
    setFindIndex(index);
  }, [allGroupSelectArr, allGroupInfo]);

  return (
    <div>
      <IsModal
        setIsOpen={setIsOpen}
        modalIsOpen={modalIsOpen}
        allGroupInfo={allGroupInfo}
        index={findIndex}
        joinThisGroup={joinThisGroup}
        setRecommendIsOpen={setRecommendIsOpen}
      />
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
                    }}>
                    {allGroupInfo[findIndex].privacy == "公開" &&
                      allGroupInfo[findIndex].header_name !==
                        Context.userName && <LinkOpen>我要加入</LinkOpen>}
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
