// import { styled } from "@mui/material/styles";
import styled, { keyframes } from "styled-components";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Font, Display, Img, Button, Hr, Cloumn, Wrap } from "../css/style";
import { ExpandMore } from "./ReviewCard_Component/ExpanMore";
import location from "../image/location.png";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { TextField, Alert, AlertTitle, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import FindGroup from "../pages/FindGroup";
import landingpage04 from "../image/landingpage-04.png";
import landingpage03 from "../image/landingpage-03.png";
import alertIcon from "../image/alert.png";
import { height, width } from "@mui/system";

const Alink=styled.a`
text-decoration:none;`

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
  border-radius: 30px;
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
  margin-top: 10px;
  text-align: center;
`;

const SelectTag = styled.div`
  width: auto;
  height: 25px;
  padding: 4px 7px 0px 7px;
  border-radius: 10px;
  margin: 0px 4px;
  border: 1.5px solid #cfc781;
  background-color: #ebebeb;
  color: #797659;
  font-size: 14px;
`;

const GroupWrap = styled.div`
  display: flex;
  /* flex-direction: column; */
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 10px auto;
  align-items: start;
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
  border-radius: 30px;
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
  line-height: 30px;
  margin-bottom: 30px;
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
  const navigate = useNavigate();

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const checkPassword = (e) => {
    if (value == currentPosts[index].password) {
      joinThisGroup(index, currentPosts[index].header_name);
      navigate(`/joinGroup/${currentPosts[index].group_id}`);
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
              <Display mb='15px'>
                <Img src={alertIcon} width='30px'></Img>
                <Font fontSize='14px' marginLeft='10px'>
                  位於花蓮縣壽豐鄉的布萊頓霍夫莊園
                </Font>
              </Display>
              <Display>
                <Img src={alertIcon} width='30px'></Img>
                <Font fontSize='14px' marginLeft='10px'>
                  位於花蓮縣壽豐鄉的布萊頓霍夫莊園
                </Font>
              </Display>
              {currentPosts[index].privacy == "公開" && (
                <Display>
                  <Button
                    width='200px'
                    mt='30px'
                    onClick={() => setIsOpen(false)}>
                    我再考慮
                  </Button>
                  <Button
                    width='200px'
                    mt='30px'
                    ml='20px'
                    onClick={() => {
                      joinThisGroup(index, currentPosts[index].header_name);
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
                    helperText='此為私人團，請輸入密碼'
                    sx={{ marginTop: "40px", width: "200px" }}
                  />
                  {alert && (
                    <Stack sx={{ width: "60%"}} spacing={0}>
                      <Alert severity='error' variant='outlined' >
                        密碼錯誤 <strong>請再輸入一次!</strong>
                      </Alert>
                    </Stack>
                  )}
                  <Display>
                    <Button
                      width='200px'
                      mt='30px'
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
  // const navigate = useNavigate();
  return (
    <div className='App'>
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
            Expanded={Expanded}
            userId={userId}
            setGroupId={setGroupId}
          />
        </Display>
      </Modal>
    </div>
  );
}

// function Expanded({ expanded, currentPosts, targetIndex }) {
//   // console.log(targetIndex);
//   // console.log(currentPosts[targetIndex]);
//   return (
//     <Collapse in={expanded} timeout='auto' unmountOnExit>
//       <CardContent>
//         {targetIndex !== "" && (
//           <>
//             <Typography paragraph>注意事項:</Typography>
//             <Typography paragraph>
//               {targetIndex ? (
//                 <p>{currentPosts[targetIndex].announcement}</p>
//               ) : (
//                 <p>{currentPosts[targetIndex].announcement}</p>
//               )}
//             </Typography>
//           </>
//         )}
//       </CardContent>
//     </Collapse>
//   );
// }

export default function ReviewCard({
  currentPosts,
  joinThisGroup,
  userName,
  setIsOpen,
  modalIsOpen,
  userId,
  setGroupId,
}) {
  const [expandedArr, setExpandedArr] = useState(
    Array(currentPosts.length).fill(false)
  );
  const [recommendIsOpen, setRecommendIsOpen] = useState(false);
  const [targetIndex, setTargetIndex] = useState("");

  // console.log(currentPosts);
  // console.log(Array(currentPosts.length).fill(false));

  const handleExpandClick = (index, e) => {
    // console.log(index);
    setTargetIndex(index);
    let cloneExpandedArr = [...expandedArr];
    cloneExpandedArr[index] = !cloneExpandedArr[index];
    let prev = cloneExpandedArr.slice(0, index).fill(false);
    let after = cloneExpandedArr
      .slice(index + 1, cloneExpandedArr.length)
      .fill(false);
    setExpandedArr([...prev, cloneExpandedArr[index], ...after]);
  };

  const confirmJoinThisGroup = (index) => {
    console.log(index);
    setTargetIndex(index);
    setIsOpen(true);
  };

  return (
    <>
      <GroupWrap>
        {currentPosts.map((item, index) => (
          <Card
            sx={{
              width: "23%",
              height: "auto",
              boxShadow:
                "0.8rem 0.8rem 2.2rem #E2E1D3 , -0.5rem -0.5rem 1rem #ffffff",
              borderRadius: 7.5,
              padding: 1,
              margin: 4,
              marginTop: 0,
              backgroundColor: "#F4F4EE",
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
              {item.privacy == "私人" && <Tag>私</Tag>}
            </ImgWrap>
            <CardContent
              sx={{
                textAlign: "start",
                height: "140px",
              }}>
              <Alink href={`./profile/${item.header_id}`}>
                <Span>團長</Span>
                <Span>{item.header_name}</Span>
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
                  <Img src={location} width='26px'></Img>{" "}
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
              <Button
                width='90%'
                margin='auto'
                group_id={item.group_id}
                variant='outlined'
                onClick={() => {
                  confirmJoinThisGroup(index);
                }}>
                {item.status == "進行中" && <LinkOpen>我要加入</LinkOpen>}

                {item.status == "已結束" && (
                  <LinkOpen style={{ cursor: "not-allowed" }}>
                    已結束哭哭
                  </LinkOpen>
                )}
              </Button>
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
              {/* <ExpandMore
                sx={{ zIndex: "10" }}
                name='gogo'
                expand={expandedArr[index]}
                onClick={(e) => {
                  handleExpandClick(index, e);
                }}
                aria-expanded={expandedArr[index]}
                aria-label='show more'>
                <ExpandMoreIcon
                  sx={{ pointerEvents: "none", cursor: "not-allowed" }}
                />
              </ExpandMore> */}
            </CardActions>
            {/* <Expanded
              expanded={expandedArr[index]}
              currentPosts={currentPosts}
              targetIndex={targetIndex}
            /> */}
          </Card>
        ))}
      </GroupWrap>
      <Wrap
        width='90%'
        m='20px 0px 30px 8%'
        direction='column'
        alignItems='start'>
        <Img src={landingpage04} width='120px'></Img>
        <Hr width='90%' m='0px'></Hr>
      </Wrap>

      <Font letterSpacing='3px'>找不到喜愛的？一鍵找尋你的最佳推薦露營團</Font>
      <FindGroupButton
        onClick={() => {
          setRecommendIsOpen(true);
        }}>
        最佳推薦
      </FindGroupButton>
      <Recommend
        recommendIsOpen={recommendIsOpen}
        setRecommendIsOpen={setRecommendIsOpen}
        joinThisGroup={joinThisGroup}
        userName={userName}
        userId={userId}
        setGroupId={setGroupId}
      />
      <Wrap width='100%' justifyContent='end' m=' -80px 0px 0px 0px'>
        <Img src={landingpage03} width='300px'></Img>
      </Wrap>
    </>
  );
}
