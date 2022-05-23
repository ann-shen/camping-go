import styled from "styled-components";
import { useContext } from "react";
import { UserContext } from "../../utils/userContext";
import { Link } from "react-router-dom";
import {
  Font,
  Img,
  Display,
  Button,
  Wrap,
  Tag,
  ImgWrap,
  ProfileBox,
} from "../../css/style";
import "../../css/modal.css";
import { Box } from "@mui/material";
import location from "../../image/location.png";
import useMediaQuery from "@mui/material/useMediaQuery";

const LinkRoute = styled(Link)`
  text-decoration: none;
  margin: 5px 5px;
  font-size: 14px;
  color: gray;
`;

const MobileImgWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 25vh;
  border-radius: 20px;
  overflow: hidden;
`;

const MobileImg = styled.img`
  width: 100%;
  @media (max-width: 1024px) {
    width: 115%;
    border-radius: 15px;
  }
`;

const MobileInfoWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-self: start;
  margin-top: 10px;
`;

const MobileButtonWrap = styled.div`
  display: flex;
  flex-direction: column;
  height: 25vh;
  width: 100%;
  justify-content: space-evenly;
  align-items: center;
  margin-top: 10px;
`;

function YourParticipateGroup({
  yourParticipateGroup,
  memberWithdrawGroup,
  SentCommentToHeader,
}) {
  const Context = useContext(UserContext);
  const matches = useMediaQuery("(max-width:1050px)");

  return (
    <>
      {!matches && yourParticipateGroup && (
        <>
          {yourParticipateGroup.map((item, index) => (
            <Box key={index} sx={ProfileBox}>
              <Display justifyContent='space-between' ml='20px'>
                <LinkRoute to={`/joinGroup/${item.group_id}`}>
                  <Display direction='column' alignItems='start'>
                    <Display alignItems='start'>
                      <ImgWrap>
                        <Img src={item.picture} width='110%' m='0px'></Img>
                      </ImgWrap>
                      <Display direction='column' alignItems='start' ml='30px'>
                        <Tag bgc='#CFC781' color='white'>
                          {item.status}
                        </Tag>
                        <Font
                          fontSize='25px'
                          letterSpacing='3px'
                          m='5px 0px 3px 0px'>
                          {item.group_title}
                        </Font>
                        <Font fontSize='14px' m='0px 0px 15px 0px'>
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
                        <Display>
                          <Img
                            src={location}
                            width='24px'
                            m=' 0px 8px 0px -3px '></Img>
                          <Font fontSize='16px'>{item.city}</Font>
                        </Display>
                      </Display>
                    </Display>
                    <Display alignItems='center'></Display>
                  </Display>
                </LinkRoute>
                <Wrap
                  direction='column'
                  alignItems='end'
                  height='250px'
                  justifyContent='space-evenly'
                  m='20px'>
                  {item.status == "已結束" && (
                    <SentCommentToHeader
                      groupId={item.group_id}
                      userName={Context.userName}
                      userId={Context.userId}
                    />
                  )}
                  {item.status == "進行中" && (
                    <Button
                      border='#CFC781'
                      bgc='#FFFEF4'
                      width='150px'
                      onClick={(id) => {
                        memberWithdrawGroup(
                          item.group_id,
                          Context.userId,
                          index,
                          yourParticipateGroup
                        );
                      }}>
                      我要退團
                    </Button>
                  )}
                </Wrap>
              </Display>
            </Box>
          ))}
        </>
      )}
      {matches && (
        <>
          {yourParticipateGroup.map((item, index) => (
            <Box
              key={index}
              sx={{
                width: "38%",
                height: "auto",
                boxShadow:
                  "0.8rem 0.8rem 3.2rem #E2E1D3 , -1.0rem -1.0rem 1rem #ffffff",
                borderRadius: 6,
                padding: 3,
                margin: 1,
                marginTop: "30px",
                border: "1px solid #CFC781 ",
                display: "flex",
                flexDirection: "column",
                justifyContent: "start",
                "@media (max-width: 764px)": {
                  width: "80%",
                },
              }}>
              <LinkRoute to={`/joinGroup/${item.group_id}`}>
                <Display direction='column' alignItems='start'>
                  <MobileImgWrap>
                    <MobileImg src={item.picture} />
                  </MobileImgWrap>
                  <MobileInfoWrap>
                    <Tag bgc='#CFC781' color='white'>
                      {item.status}
                    </Tag>
                    <Font
                      fontSize='20px'
                      letterSpacing='1px'
                      m='10px 0px 0px 0px'>
                      {item.group_title}
                    </Font>
                    <Font fontSize='14px' m='0px 0px 15px 0px'>
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
                    <Display>
                      <Img
                        src={location}
                        width='20px'
                        m=' 0px 8px 0px -3px '></Img>
                      <Font fontSize='16px'>{item.city}</Font>
                    </Display>
                  </MobileInfoWrap>
                </Display>
              </LinkRoute>
              <MobileButtonWrap>
                {item.status == "已結束" && (
                  <SentCommentToHeader
                    groupId={item.group_id}
                    userName={Context.userName}
                    userId={Context.userId}
                  />
                )}
                {item.status == "進行中" && (
                  <Button
                    border='#CFC781'
                    bgc='#FFFEF4'
                    width='150px'
                    onClick={(id) => {
                      memberWithdrawGroup(
                        item.group_id,
                        Context.userId,
                        index,
                        yourParticipateGroup
                      );
                    }}>
                    我要退團
                  </Button>
                )}
              </MobileButtonWrap>
            </Box>
          ))}
        </>
      )}
    </>
  );
}

export default YourParticipateGroup;
