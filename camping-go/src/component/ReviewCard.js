import styled, { keyframes } from "styled-components";
import { useState, useContext } from "react";
import { UserContext } from "../utils/userContext";
import { useNavigate } from "react-router-dom";

import {
  setDoc,
  doc,
  getDoc,
  getDocs,
  collection,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../utils/firebase";

import {
  Font,
  Display,
  Img,
  Button,
  Hr,
  Wrap,
  Tag,
  CardByGroup,
} from "../css/style";
import {
  TextField,
  Alert,
  Stack,
  Skeleton,
  Card,
  CardMedia,
  CardContent,
  CardActions,
} from "@mui/material";

import location from "../image/location.png";
import landingpage03 from "../image/landingpage-03.png";
import alertIcon from "../image/alert.png";

import Modal from "react-modal";
import FindGroup from "../pages/FindGroup";
import Swal from "sweetalert2/dist/sweetalert2.js";

const Alink = styled.a`
  text-decoration: none;
`;

const Span = styled.span`
  font-size: 14px;
  margin-left: 6px;
  color: #797659;
`;

const ButtonWrap = styled.div`
  display: flex;
  justify-content: center;
  margin: 5px;
`;

const ImgWrap = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  border-radius: 15px;
  overflow: hidden;
`;

const PrivicyTag = styled.div`
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
  margin-top: 10px;
  text-align: center;
`;

const SelectTag = styled.div`
  width: auto;
  height: 20px;
  padding: 1px 7px 0px 7px;
  border-radius: 8px;
  margin: 10px 4px;
  border: 1.5px solid #cfc781;
  background-color: transparent;
  color: #797659;
  font-size: 13px;
`;

const GroupWrap = styled.div`
  display: flex;
  width: 100%;
  display: flex;
  justify-content: start;
  margin: 10px auto;
  align-items: start;
  flex-wrap: wrap;
  margin-left: 6%;
  @media (max-width: 1280px) {
    margin-left: 3%;
  }
  @media (max-width: 580px) {
    margin-left: 5%;
  }
`;

const LinkOpen = styled.a`
  text-decoration: none;
  margin: 5px 5px;
  font-size: 14px;
  color: gray;
`;

const fadeIn = keyframes`
from {
  opacity: 0.1;
  transform: scale(1);
}
to {
  opacity: 1;
  transform: scale(1.2);
}
`;

const FindGroupButton = styled.button`
  width: 150px;
  height: 35px;
  border: none;
  background-color: #eae5be;
  letter-spacing: 3px;
  font-size: 14px;
  padding: 3px;
  margin-top: 40px;
  box-shadow: 0.2rem 0.2rem 0.7rem #eae5be, -0.2rem -0.2rem 0.2rem #fffef4;
  border-radius: 10px;
  color: #797659;
  animation: ${fadeIn} 2.5s infinite linear;
  cursor: pointer;
  &:hover {
    color: #cfc781;
    border: 3px solid #cfc781;
    background-color: #426765;
    box-shadow: none;
    animation: ${fadeIn} 0.5s ease-in-out;
  }
`;

const AnnouncementFontWrap = styled.div`
  width: 80%;
  line-height: 25px;
  margin-bottom: 20px;
`;

const TentImg = styled.img`
  width: 280px;
  @media (max-width: 768px) {
    width: 200px;
    margin-top: 30px;
    margin-right: -30px;
  }
  @media (max-width: 580px) {
    display: none;
  }
`;

function IsModal({
  modalIsOpen,
  setIsOpen,
  currentPosts,
  index,
  joinThisGroup,
}) {
  const [value, setValue] = useState("");
  const [alert, setAlert] = useState(false);
  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const checkPassword = (e) => {
    if (value === currentPosts[index].password) {
      joinThisGroup(
        index,
        currentPosts[index].header_name,
        currentPosts[index].max_member_number,
        currentPosts[index].current_number,
        currentPosts
      );
    } else {
      setAlert(true);
    }
  };

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
          {currentPosts[index] && (
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
                  currentPosts[index].notice.map((item, index) => (
                    <Display mb='15px' alignItems='start' key={index}>
                      <Img src={alertIcon} width='30px'></Img>
                      <Font fontSize='14px' marginLeft='10px'>
                        {item}
                      </Font>
                    </Display>
                  ))}
              </AnnouncementFontWrap>

              {currentPosts[index].privacy === "公開" && (
                <Display>
                  <Button
                    width='200px'
                    mt='30px'
                    bgc='white'
                    border='1px solid #CFC781'
                    onClick={() => setIsOpen(false)}>
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
                        currentPosts[index].current_number,
                        currentPosts
                      );
                    }}>
                    確認加入
                  </Button>
                </Display>
              )}

              {currentPosts[index].privacy === "私人" && (
                <>
                  <TextField
                    required
                    id='outlined-required'
                    label='Required'
                    defaultValue=''
                    onChange={handleChange}
                    size='small'
                    type='password'
                    helperText='此為私人團，請輸入密碼'
                    sx={{ marginTop: "0px", width: "200px" }}
                  />
                  {alert && (
                    <Stack sx={{ width: "60%" }} spacing={0}>
                      <Alert severity='error' variant='outlined'>
                        密碼錯誤 <strong>請再輸入一次!</strong>
                      </Alert>
                    </Stack>
                  )}
                  <Display>
                    <Button
                      width='200px'
                      bgc='white'
                      mt='20px'
                      border='1px solid #CFC781'
                      onClick={() => setIsOpen(false)}>
                      我再考慮
                    </Button>
                    <Button
                      mt='30px'
                      ml='20px'
                      onClick={checkPassword}
                      width=' 200px'
                      boxShadow='none'>
                      確認加入
                    </Button>
                  </Display>
                </>
              )}
            </>
          )}
        </Display>
      </Modal>
    </div>
  );
}

function Recommend({ recommendIsOpen, setRecommendIsOpen, joinThisGroup }) {
  return (
    <Modal
      isOpen={recommendIsOpen}
      onRequestClose={() => setRecommendIsOpen(false)}
      overlayClassName={{
        base: "overlay-base",
        afterOpen: "overlay-after",
        beforeClose: "overlay-before",
      }}
      className={{
        base: "content-base",
        afterOpen: "recommend-after",
        beforeClose: "content-before",
      }}
      closeTimeoutMS={500}>
      <Display direction='column'>
        <FindGroup
          joinThisGroup={joinThisGroup}
          setRecommendIsOpen={setRecommendIsOpen}
        />
      </Display>
    </Modal>
  );
}

export default function ReviewCard({
  currentPosts,
  setIsOpen,
  modalIsOpen,
  setGroupId,
}) {
  const [recommendIsOpen, setRecommendIsOpen] = useState(false);
  const [targetIndex, setTargetIndex] = useState("");
  const Context = useContext(UserContext);
  const navigate = useNavigate();

  const confirmJoinThisGroup = (index) => {
    if (!Context.userId) {
      Swal.fire({
        text: "尚未登入",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#426765",
        cancelButtonColor: "#EAE5BE",
        confirmButtonText: "前往登入",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
      return;
    }
    setTargetIndex(index);
    setIsOpen(true);
  };

  let loadingArr = [1, 2, 3];

  const popUpAlertWithcheckIsHeader = (header_name, userName) => {
    if (header_name === userName) {
      Swal.fire({
        position: "center",
        icon: "warning",
        text: "你是此團團長，不能加入唷！請至我的露營團-開團，查看頁面",
        showConfirmButton: false,
        timer: 2500,
      });
      navigate("/");
    }
  };

  const popUpAlertWithisFullGroup = () => {
    Swal.fire({
      position: "center",
      icon: "warning",
      text: "已滿團",
      showConfirmButton: false,
      timer: 800,
    });
    setIsOpen(false);
  };

  const addMemberSelectTag = async () => {
    let userSelect;
    const docRefJoinGroup = doc(db, "joinGroup", Context.userId);
    const docMemberInfo = await getDoc(docRefJoinGroup);
    if (docMemberInfo.exists()) {
      userSelect = docMemberInfo.data().select_tag;
    }
    return userSelect;
  };

  const addNewMemberInfo = async (index, cardData) => {
    const docRefMember = doc(
      db,
      "CreateCampingGroup",
      cardData[index].group_id.toString(),
      "member",
      Context.userId
    );

    addMemberSelectTag().then(async (res) => {
      setDoc(docRefMember, {
        role: "member",
        member_name: Context.userName,
        member_id: Context.userId,
        member_select: res,
      });
    });
  };

  const updateCurrentMemberNumber = async (index, cardData) => {
    const docRef = doc(
      db,
      "CreateCampingGroup",
      cardData[index].group_id.toString()
    );

    const querySnapshot = await getDocs(
      collection(
        db,
        "CreateCampingGroup",
        cardData[index].group_id.toString(),
        "member"
      )
    );
    let memberArrLength = [];
    querySnapshot.forEach((doc) => {
      memberArrLength.push(doc.data());
    });
    await updateDoc(docRef, {
      current_number: memberArrLength.length,
    });
  };

  const addAlertToThisGroupHeader = async (index, cardData) => {
    updateDoc(doc(db, "joinGroup", cardData[index].header_id), {
      alert: arrayUnion({
        alert_content: `${Context.userName}已加入「${cardData[index].group_title}」`,
        is_read: false,
      }),
    });
  };

  const updateUserJoinGroupList = async (index, cardData) => {
    const docRefJoinGroup = doc(db, "joinGroup", Context.userId);
    updateDoc(docRefJoinGroup, {
      group: arrayUnion(cardData[index].group_id),
    });
  };

  const joinThisGroup = async (
    index,
    header_name,
    max_member_number,
    current_number,
    cardData
  ) => {
    if (header_name === Context.userName) {
      popUpAlertWithcheckIsHeader(header_name, Context.userName);
      return;
    }
    if (current_number + 1 > max_member_number) {
      popUpAlertWithisFullGroup(current_number);
      return;
    }
    setGroupId(cardData[index].group_id.toString());
    addNewMemberInfo(index, cardData);
    updateUserJoinGroupList(index, cardData);
    updateCurrentMemberNumber(index, cardData);
    addAlertToThisGroupHeader(index, cardData);
    navigate(`/joinGroup/${cardData[index].group_id}`);
  };

  const splitDate = (start, end) => {
    let newDate = `${new Date(start * 1000).toLocaleString().split(" ")[0]}~ ${
      new Date(end * 1000).toLocaleString().split(" ")[0]
    }`;
    return <>{newDate}</>;
  };

  return (
    <>
      <GroupWrap>
        {currentPosts.length === 0 && (
          <Wrap
            width='80%'
            justifyContent='space-between'
            display='wrap'
            flexWrap='wrap'>
            {loadingArr.map((_, index) => (
              <Stack spacing={2} style={{ marginRight: 30 }} key={index}>
                <Skeleton
                  variant='rectangular'
                  width={290}
                  height={188}
                  style={{ marginTop: 10 }}
                />
                <Skeleton
                  variant='text'
                  height={30}
                  style={{ marginTop: 20 }}
                />
                <Skeleton variant='text' width='60%' height={30} />
                <Skeleton
                  variant='text'
                  width='60%'
                  height={30}
                  style={{ marginBottom: 20 }}
                />
                <Skeleton variant='text' height={80} />
              </Stack>
            ))}
          </Wrap>
        )}
        {currentPosts.map((item, index) => (
          <Card
            sx={{
              width: "23%",
              height: "auto",
              boxShadow:
                "0.8rem 0.8rem 2.2rem #E2E1D3 , -0.5rem -0.5rem 1rem #ffffff",
              borderRadius: 5,
              padding: 1,
              margin: 4,
              marginTop: 0,
              backgroundColor: "#F4F4EE",
              "&:hover": {
                transition: "0.7s",
                opacity: "0.7",
              },
              "@media (max-width: 1280px)": {
                width: "27%",
                margin: 2,
              },
              "@media (max-width: 860px)": {
                width: "40%",
                margin: 2,
              },
              "@media (max-width: 580px)": {
                width: "80%",
                margin: 2,
              },
            }}
            key={index}>
            <ImgWrap>
              <CardMedia
                sx={{
                  width: "100%",
                  height: "200px",
                }}
                component='img'
                height='194'
                image={item.picture}
                alt='Paella dish'
              />
              {item.privacy === "私人" && <PrivicyTag>私</PrivicyTag>}
            </ImgWrap>
            <CardContent
              sx={{
                textAlign: "start",
                height: "140px",
              }}>
              <Alink href={`./profile/${item.header_id}`}>
                <Tag
                  width='90px'
                  height='18px'
                  fontSize='13px'
                  p='0px 0px 1px 0px'
                  borderRadius='8px'>
                  團長｜{item.header_name}
                </Tag>
              </Alink>

              <Font fontSize='20px' m='6px 0px 6px 0px'>
                {item.group_title}
              </Font>
              <Font fontSize='14px' m='0px 0px 16px 0px'>
                {splitDate(item.start_date.seconds, item.end_date.seconds)}
              </Font>
              <Display justifyContent='space-between'>
                <Display>
                  <Img src={location} width='20px'></Img>
                  <Span>{item.city}</Span>
                </Display>
                <Display>
                  <Font>
                    {item.current_number}/{item.max_member_number}
                  </Font>
                  <Span>人</Span>
                </Display>
              </Display>
            </CardContent>

            <ButtonWrap>
              {item.status === ("進行中" || "") && (
                <Button
                  width='90%'
                  margin='auto'
                  group_id={item.group_id}
                  variant='outlined'
                  onClick={() => {
                    confirmJoinThisGroup(index);
                  }}>
                  <LinkOpen>我要加入</LinkOpen>
                </Button>
              )}

              {item.status === "已結束" && (
                <Button
                  width='90%'
                  margin='auto'
                  variant='outlined'
                  style={{ cursor: "not-allowed" }}>
                  <LinkOpen>已結束</LinkOpen>
                </Button>
              )}
            </ButtonWrap>
            <IsModal
              currentPosts={currentPosts}
              modalIsOpen={modalIsOpen}
              setIsOpen={setIsOpen}
              joinThisGroup={joinThisGroup}
              index={targetIndex}
              header_name={item.header_name}
            />
            <CardActions disableSpacing>
              {item.select_tag && item.select_tag
                .map((obj, index) => <SelectTag key={index}>{obj}</SelectTag>)
                .slice(0, 3)}
            </CardActions>
          </Card>
        ))}
      </GroupWrap>

      <GroupWrap>
        <Card sx={CardByGroup}>
          <Font letterSpacing='1px' fontSize='16px'>
            找不到喜愛的？一鍵找尋你的最佳推薦露營團
          </Font>
          <FindGroupButton
            onClick={() => {
              if (!Context.userId) {
                Swal.fire({
                  text: "尚未登入",
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#426765",
                  cancelButtonColor: "#EAE5BE",
                  confirmButtonText: "前往登入",
                }).then((result) => {
                  if (result.isConfirmed) {
                    navigate("/login");
                  }
                });
                return;
              }
              setRecommendIsOpen(true);
            }}>
            最佳推薦
          </FindGroupButton>
        </Card>
      </GroupWrap>
      <Recommend
        recommendIsOpen={recommendIsOpen}
        setRecommendIsOpen={setRecommendIsOpen}
        joinThisGroup={joinThisGroup}
      />
      <Wrap width='95%' justifyContent='end' m=' -160px 00px 0px 0px'>
        <TentImg src={landingpage03} />
      </Wrap>
    </>
  );
}
