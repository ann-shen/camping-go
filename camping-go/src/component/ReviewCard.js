// import { styled } from "@mui/material/styles";
import styled from "styled-components";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Font, Display, Img, Button } from "../css/style";
import { ExpandMore } from "./ReviewCard_Component/ExpanMore";
import location from "../image/location.png";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { TextField, Alert, AlertTitle, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import FindGroup from "../pages/FindGroup";

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

const GroupWrap = styled.div`
  display: flex;
  /* flex-direction: column; */
  width: 90%;
  display: flex;
  justify-content: center;
  margin: 50px auto;
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

function IsModal({ modalIsOpen, setIsOpen, groupId, groupPassword }) {
  const [value, setValue] = useState("");
  const [alert, setAlert] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const checkPassword = (e) => {
    if (value == groupPassword) {
      navigate(`/joinGroup/${groupId}`);
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
          <TextField
            required
            id='outlined-required'
            label='Required'
            defaultValue=''
            onChange={handleChange}
          />
          {alert && (
            <Stack sx={{ width: "100%" }} spacing={2}>
              <Alert severity='error'>
                <AlertTitle>Error</AlertTitle>
                密碼錯誤 <strong>請再輸入一次!</strong>
              </Alert>
            </Stack>
          )}
          <Button onClick={checkPassword} width=' 200px' boxShadow='none'>
            送出
          </Button>
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
          afterOpen: "content-after",
          beforeClose: "content-before",
        }}
        closeTimeoutMS={500}>
        <Display direction='column'>
          <FindGroup
            joinThisGroup={joinThisGroup}
            userName={userName}
            Expanded={Expanded}
          />
        </Display>
      </Modal>
    </div>
  );
}

function Expanded({ expanded }) {
  return (
    <Collapse in={expanded} timeout='auto' unmountOnExit>
      <CardContent>
        <Typography paragraph>注意事項:</Typography>
        <Typography paragraph>提供帳篷租借</Typography>

        <Typography paragraph>
          Add rice and stir very gently to distribute. Top with artichokes and
          peppers, and cook without stirring, until most of the liquid is
          absorbed, 15 to 18 minutes. Reduce heat to medium-low, add reserved
          shrimp and mussels, tucking them down into the rice, and cook again
          without stirring, until mussels have opened and rice is just tender, 5
          to 7 minutes more. (Discard any mussels that don&apos;t open.)
        </Typography>
        <Typography>
          Set aside off of the heat to let rest for 10 minutes, and then serve.
        </Typography>
      </CardContent>
    </Collapse>
  );
}

export default function ReviewCard({
  currentPosts,
  joinThisGroup,
  groupId,
  userName,
  setIsOpen,
  modalIsOpen,
  groupPassword,
  userId,
}) {
  const [expandedArr, setExpandedArr] = useState(
    Array(currentPosts.length).fill(false)
  );
  const [recommendIsOpen, setRecommendIsOpen] = useState(false);
  // console.log(currentPosts);
  // console.log(Array(currentPosts.length).fill(false));

  const handleExpandClick = (index, e) => {
    console.log(index);
    let cloneExpandedArr = [...expandedArr];
    cloneExpandedArr[index] = !cloneExpandedArr[index];
    let prev = cloneExpandedArr.slice(0, index).fill(false);
    let after = cloneExpandedArr
      .slice(index + 1, cloneExpandedArr.length)
      .fill(false);
    console.log(prev, after);
    setExpandedArr([...prev, cloneExpandedArr[index], ...after]);
  };

  useEffect(() => {
    console.log(expandedArr);
  }, [expandedArr]);

  

  return (
    <>
      <GroupWrap>
        {currentPosts.map((item, index) => (
          <Card
            sx={{
              width: "24%",
              height: "auto",
              boxShadow:
                "0.8rem 0.8rem 2.2rem #E2E1D3 , -0.5rem -0.5rem 1rem #ffffff",
              borderRadius: 7.5,
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
                image={item.picture}
                alt='Paella dish'
              />
              {item.privacy == "私人" && <Tag>私</Tag>}
            </ImgWrap>
            <CardContent
              sx={{
                textAlign: "start",
                height: "160px",
              }}>
              <Span>團長</Span>
              <Span>{item.header_name}</Span>
              <Font fontSize='25px' m='6px 0px 6px 0px'>
                {item.group_title}
              </Font>
              <Font fontSize='16px' m='0px 0px 16px 0px'>
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
                onClick={(e) => {
                  joinThisGroup(index, item.password, item.header_name);
                }}>
                {item.privacy == "公開" && item.header_name !== userName && (
                  <LinkPrivate to={`joinGroup/${item.group_id}`}>
                    我要加入
                  </LinkPrivate>
                )}
                {item.privacy == "私人" && item.header_name !== userName && (
                  <LinkOpen>我要加入</LinkOpen>
                )}
                {item.header_name == userName && <LinkOpen>我要加入</LinkOpen>}
              </Button>
            </ButtonWrap>
            <IsModal
              modalIsOpen={modalIsOpen}
              setIsOpen={setIsOpen}
              groupId={groupId}
              groupPassword={groupPassword}
            />
            <CardActions disableSpacing>
              {item.select_tag
                .map((obj) => <SelectTag>{obj}</SelectTag>)
                .slice(0, 3)}
              <ExpandMore
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
              </ExpandMore>
            </CardActions>
            <Expanded expanded={expandedArr[index]} />
          </Card>
        ))}
      </GroupWrap>
      <Button
      width="150px"
        onClick={() => {
          setRecommendIsOpen(true);
        }}>
        最佳推薦
      </Button>
      <Recommend
        recommendIsOpen={recommendIsOpen}
        setRecommendIsOpen={setRecommendIsOpen}
        joinThisGroup={joinThisGroup}
        userName={userName}
        Expanded={Expanded}
      />
    </>
  );
}
