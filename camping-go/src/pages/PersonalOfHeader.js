import {
  getDoc,
  getDocs,
  collection,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import { Font, Img, Display, ImgWrap, Tag, Wrap, Cloumn } from "../css/style";
import { Box } from "@mui/material";
import { useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { db } from "../utils/firebase";
import Header from "../component/Header";
import { UserContext } from "../utils/userContext";
import { Link } from "react-router-dom";
import styled from "styled-components";
import location from "../image/location.png";

const LinkRoute = styled(Link)`
  text-decoration: none;
  margin: 5px 5px;
  font-size: 14px;
  color: gray;
`;
const CommentWrap = styled.div`
  width: 150px;
  border-bottom: 1px solid #cfc781;
  text-align: start;
  padding: 8px 0px;
`;

const NumberWrap = styled.div`
  margin: 10px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: start;
`;

const ProfileImgWrap = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 130px;
  height: 130px;
  border-radius: 50%;
  overflow: hidden;
  border: 5px solid #dcd8b3;
`;

function PersonalOfHeader() {
  const [yourCreateGroup, setYourCreateGroup] = useState([]);
  const ContextByUserId = useContext(UserContext);

  let params = useParams();

  //先去找團長開的團資訊
  useEffect(async () => {
    const q = query(
      collection(db, "CreateCampingGroup"),
      where("header_id", "==", params.id)
    );
    const querySnapshot = await getDocs(q);
    let CreateGroupArr = [];
    querySnapshot.forEach((doc) => {
      CreateGroupArr.push(doc.data());
    });
    //render出開團的ID Arr
    setYourCreateGroup(CreateGroupArr);
  }, []);

  console.log(yourCreateGroup);

  return (
    <>
      <Header ContextByUserId={ContextByUserId} />
      <Wrap
        maxWidth='1440px'
        width='75%'
        m='20px 40px 100px 12%'
        alignItems='center'
        display='flex'
        direction='column'
        justifyContent='space-between'
        boxShadow='none'>
        {yourCreateGroup.length !== 0 && (
          <Wrap
            maxWidth='1440px'
            width='90%'
            m='20px 40px 0px 0px'
            alignItems='start'
            justifyContent='start'
            boxShadow='none'>
            <Display>
              <ProfileImgWrap>
                <Img
                  src={`https://joeschmoe.io/api/v1/${yourCreateGroup[0].header_id}`}
                  width='auto'
                  height='115%'
                />
              </ProfileImgWrap>
              <Wrap
                width='500px'
                direction='column'
                alignItems='start'
                m='0px 0px 0px 20px'
                boxShadow='none'>
                <Font
                  fontSize='40px'
                  margin='0px 0px 10px 20px'
                  marginLeft='20px'
                  color='#426765'>
                  {yourCreateGroup[0].header_name}
                </Font>
              </Wrap>
            </Display>
          </Wrap>
        )}

        {yourCreateGroup.map((item, index) => (
          <>
            <Box
              key={index}
              sx={{
                width: "85%",
                height: "auto",
                boxShadow:
                  "0.8rem 0.8rem 3.2rem #E2E1D3 , -1.0rem -1.0rem 1rem #ffffff",
                borderRadius: 6,
                padding: 5,
                paddingBottom: 3,
                margin: "auto",
                marginTop: "30px",
                border: "1px solid #CFC781 ",
                justifyContent: "space-around",
              }}>
              <Display justifyContent='space-between' ml='20px'>
                <LinkRoute to={`/joinGroup/${item.group_id}`}>
                  <Display alignItems='start'>
                    <Display alignItems='start'>
                      <ImgWrap>
                        <Img src={item.picture} width='100%' m='0px'></Img>
                      </ImgWrap>
                      <Display direction='column' alignItems='start' ml='30px'>
                        <Tag bgc='#CFC781' color='white'>
                          {item.status}
                        </Tag>
                        <Font
                          fontSize='22px'
                          letterSpacing='1px'
                          m='15px 0px 3px 0px'>
                          {item.group_title}
                        </Font>
                        <Font
                          fontSize='14px'
                          m='0px 0px 10px 0px'
                          letterSpacing='2px'>
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
                    <Display ml='100px'>
                      {item.comment.length !== 0 ? (
                        <div>
                          <Font letterSpacing='3px'>評論</Font>
                          {item.comment.map((item, index) => (
                            <CommentWrap key={index}>
                              <Font fontSize='16px'>{item}</Font>
                            </CommentWrap>
                          ))}
                        </div>
                      ) : (
                        <p>露營還沒結束尚未開評論唷！</p>
                      )}
                    </Display>
                  </Display>
                  {item.total_score && (
                    <NumberWrap>
                      <Display>
                        <Font fontSize='40px' m='10px'>
                          {item.total_score}
                        </Font>
                        <Font>分</Font>
                      </Display>
                    </NumberWrap>
                  )}
                </LinkRoute>
              </Display>
            </Box>
          </>
        ))}
      </Wrap>
    </>
  );
}

export default PersonalOfHeader;
