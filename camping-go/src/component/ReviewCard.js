// import { styled } from "@mui/material/styles";
import styled, { keyframes } from "styled-components";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import {
  Font,
  Display,
  Img,
  Button,
  Hr,
  Cloumn,
  Wrap,
  Tag,
} from "../css/style";
import location from "../image/location.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { TextField, Alert, Stack, Skeleton } from "@mui/material";
import { Link } from "react-router-dom";
import FindGroup from "../pages/FindGroup";
import landingpage04 from "../image/landingpage-04.png";
import landingpage03 from "../image/landingpage-03.png";
import alertIcon from "../image/alert.png";
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
  /* flex-direction: column; */
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
  /* border: 2px solid #cfc781; */
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
  header_name,
}) {
  const [value, setValue] = useState("");
  const [alert, setAlert] = useState(false);
  const handleChange = (event) => {
    setValue(event.target.value);
  };
  console.log(`點擊到的是${index}`);

  const checkPassword = (e) => {
    if (value == currentPosts[index].password) {
      joinThisGroup(
        index,
        currentPosts[index].header_name,
        currentPosts[index].max_member_number,
        currentPosts[index].current_number
      );
    } else {
      setAlert(true);
    }
  };
  
  // console.log(currentPosts[index]);

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
                        currentPosts[index].current_number
                      );
                    }}>
                    確認加入
                  </Button>
                </Display>
              )}

              {currentPosts[index].privacy == "私人" ? (
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
              ) : (
                <></>
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

function Recommend({
  recommendIsOpen,
  setRecommendIsOpen,
  groupId,
  joinThisGroup,
  userName,
  Expanded,
  userId,
  setGroupId,
}) {
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
          userName={userName}
          userId={userId}
          setGroupId={setGroupId}
          setRecommendIsOpen={setRecommendIsOpen}
        />
      </Display>
    </Modal>
  );
}

export default function ReviewCard({
  currentPosts,
  joinThisGroup,
  userName,
  setIsOpen,
  modalIsOpen,
  userId,
  setGroupId,
}) {
  const [recommendIsOpen, setRecommendIsOpen] = useState(false);
  const [targetIndex, setTargetIndex] = useState("");

  const navigate = useNavigate();
  const confirmJoinThisGroup = (index) => {
    if (!userId) {
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
    console.log(index);
    setTargetIndex(index);
    setIsOpen(true);
  };

  if (window.location.pathname !== "/") {
    console.log("ohya");
  }

  let loadingArr = [1, 2, 3];

  return (
    <>
      <GroupWrap>
        {currentPosts.length == 0 && (
          <Wrap width='80%' justifyContent='space-between'>
            {loadingArr.map((load) => (
              <Stack spacing={2} style={{ marginRight: 30 }}>
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
            }}>
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
              {item.privacy == "私人" && <PrivicyTag>私</PrivicyTag>}
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
              {item.status == ("進行中" || "") && (
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
              {/* {item.status == "" && (
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
              )} */}
              {item.status == "已結束" && (
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
              {item.select_tag
                .map((obj) => <SelectTag>{obj}</SelectTag>)
                .slice(0, 3)}
            </CardActions>
          </Card>
        ))}
      </GroupWrap>

      <GroupWrap>
        <Card
          sx={{
            width: "80%",
            height: "150px",
            boxShadow:
              "0.8rem 0.8rem 1.8rem #E2E1D3 , -0.5rem -0.5rem 0.7rem #ffffff",
            borderRadius: 5,
            padding: 1,
            margin: 4,
            marginTop: 15,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#F8F8F2",
            border: "1px solid #CFC781 ",
            "@media (max-width: 580px)": {
              marginTop: 10,
              marginBottom:10,
              marginLeft:"20px",
            },
          }}>
          <Font letterSpacing='3px' fontSize='16px'>
            找不到喜愛的？一鍵找尋你的最佳推薦露營團
          </Font>
          <FindGroupButton
            onClick={() => {
              if (!userId) {
                Swal.fire({
                  // title: "尚未登入",
                  text: "尚未登入",
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#426765",
                  cancelButtonColor: "#EAE5BE",
                  confirmButtonText: "前往登入",
                }).then((result) => {
                  if (result.isConfirmed) {
                    navigate("/login");
                    // Swal.fire("Deleted!", "Your file has been deleted.", "success");
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
        userName={userName}
        userId={userId}
        setGroupId={setGroupId}
      />
      <Wrap width='95%' justifyContent='end' m=' -160px 00px 0px 0px'>
        <TentImg src={landingpage03} />
      </Wrap>
    </>
  );
}
