import styled from "styled-components";
import { useContext } from "react";
import { UserContext } from "../../utils/userContext";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
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

const LinkRoute = styled(Link)`
  text-decoration: none;
  margin: 5px 5px;
  font-size: 14px;
  color: gray;
`;

function YourParticipateGroup({
  yourParticipateGroup,
  memberWithdrawGroup,
  SentCommentToHeader,
}) {
  const Context = useContext(UserContext);
  let params = useParams();
  console.log(yourParticipateGroup);

  return (
    <div>
      {yourParticipateGroup && (
        <>
          {yourParticipateGroup.map((item, index) => (
            <Box key={index} sx={ProfileBox}>
              <Display justifyContent='space-between' ml='20px'>
                <LinkRoute to={`/joinGroup/${item.group_id}`}>
                  <Display direction='column' alignItems='start'>
                    <Display alignItems='start'>
                      <ImgWrap>
                        <Img src={item.picture} width='100%' m='0px'></Img>
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
                      width='200px'
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
    </div>
  );
}

export default YourParticipateGroup;
