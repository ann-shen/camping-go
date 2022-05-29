import MultipleSelectChip from "../MultipleSelectChip";
import { useContext, useEffect, useState } from "react";
import { ProfilePicture } from "../ProfilePicture";
import { UserContext } from "../../utils/userContext";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import firebase from "../../utils/firebaseConfig";
import useMediaQuery from "@mui/material/useMediaQuery";

import styled from "styled-components";
import { Font, Display, Wrap, Tag } from "../../css/style";

const MatchesInfoWrap = styled.div`
  max-width: 1024px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

function InfoSection() {
  const Context = useContext(UserContext);
  const navigate = useNavigate();
  const auth = getAuth();
  let params = useParams();
  const matches = useMediaQuery("(max-width:1024px)");

  const [paramsInfo, setParamsInfo] = useState("");

  useEffect(async () => {
    firebase.getDocJoinGroupOfMember(params.id).then((res) => {
      setParamsInfo({ ...res });
    });
  }, []);

  return (
    <>
      {Context.userId == params.id && !matches ? (
        <Wrap
          maxWidth='1440px'
          width='75%'
          m='100px 40px 0px 12%'
          alignItems='center'
          justifyContent='space-between'
          boxShadow='none'>
          <Display>
            <ProfilePicture userId={Context.userId} />
            <Wrap
              width='500px'
              direction='column'
              alignItems='start'
              m='0px 0px 0px 60px'
              boxShadow='none'>
              <Font
                fontSize='40px'
                margin='0px 0px 10px 20px'
                marginLeft='20px'
                color='#426765'>
                {Context.userName}
              </Font>
              <Display>
                <MultipleSelectChip userId={Context.userId} condiion={"profile"}/>
              </Display>
            </Wrap>
          </Display>
        </Wrap>
      ) : (
        <Wrap
          maxWidth='1440px'
          width='75%'
          m='100px 40px 0px 12%'
          alignItems='center'
          justifyContent='space-between'
          boxShadow='none'>
          {paramsInfo && !matches && (
            <Display>
              <ProfilePicture userId={paramsInfo.info.user_id} />
              <Wrap
                width='500px'
                direction='column'
                justifyContent='start'
                alignItems='start'
                m='0px 0px 0px 60px'
                boxShadow='none'>
                <Font
                  fontSize='40px'
                  margin='0px 0px 10px 0px'
                  marginLeft='3px'
                  color='#426765'>
                  {paramsInfo.info.user_name}
                </Font>
                <Display>
                  {paramsInfo.select_tag.map((item) => (
                    <Tag width='53px' m='3px' height='18px' borderRadius='12px'>
                      <Font fontSize='14px'>{item}</Font>
                    </Tag>
                  ))}
                </Display>
              </Wrap>
            </Display>
          )}
        </Wrap>
      )}
      {Context.userId === params.id && matches ? (
        <>
          <MatchesInfoWrap>
            <ProfilePicture userId={Context.userId} />
            <Font
              fontSize='40px'
              margin='0px 0px 10px 20px'
              marginLeft='20px'
              color='#426765'>
              {Context.userName}
            </Font>
            <MultipleSelectChip userId={Context.userId} />
          </MatchesInfoWrap>
        </>
      ) : (
        <>
          {paramsInfo && matches && (
            <MatchesInfoWrap>
              <ProfilePicture userId={paramsInfo.info.user_id} />
              <Font
                fontSize='40px'
                margin='0px 0px 10px 0px'
                marginLeft='20px'
                color='#426765'>
                {paramsInfo.info.user_name}
              </Font>
              <Display ml='20px'>
                {paramsInfo.select_tag.map((item) => (
                  <Tag width='53px' m='3px' height='18px' borderRadius='12px'>
                    <Font fontSize='14px'>{item}</Font>
                  </Tag>
                ))}
              </Display>
            </MatchesInfoWrap>
          )}
        </>
      )}
    </>
  );
}

export default InfoSection;
