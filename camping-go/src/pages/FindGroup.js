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
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Font, Display, Img, Button } from "../css/style";
import { ExpandMore } from "../component/ReviewCard_Component/ExpanMore";
import location from "../image/location.png";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { TextField, Alert, AlertTitle, Stack } from "@mui/material";
import { Link } from "react-router-dom";

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

const GroupWrap = styled.div`
  display: flex;
  /* flex-direction: column; */
  width: 1200px;
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

function Expanded({ expanded, findIndex, allGroupInfo }) {
  // console.log(targetIndex);
  // console.log(currentPosts[targetIndex]);
  return (
    <Collapse in={expanded} timeout='auto' unmountOnExit>
      <CardContent>
        <>
          <Typography paragraph>注意事項:</Typography>
          <Typography paragraph>
            {findIndex ? (
              <p>{allGroupInfo[findIndex].announcement}</p>
            ) : (
              <p>{allGroupInfo[findIndex].announcement}</p>
            )}
          </Typography>
        </>
      </CardContent>
    </Collapse>
  );
}

function FindGroup({ userId, userName, setGroupId }) {
  const [userTag, setUserTag] = useState([]);
  const [allGroupInfo, setAllGroupInfo] = useState([]);
  const [allGroupSelectArr, setAllGroupSelectArr] = useState([]);
  const [findIndex, setFindIndex] = useState("");
  const [IsExpended, setIsExpended] = useState(false);
  const [groupPassword, setGroupPassword] = useState("");

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

    filterHeaderGroup.map((item) => {
      allSelectArr.push(item.select_tag);
    });
    setAllGroupSelectArr(allSelectArr);
    setAllGroupInfo(filterHeaderGroup);
  }, []);

  useEffect(() => {
    let mathArr = [];
    allGroupSelectArr.map(async (groupSelect) => {
      const find = groupSelect
        .map((item) => {
          return userTag.filter((e) => e == item);
        })
        .flat(Infinity);

      mathArr.push(find.length);
      const max = Math.max(...mathArr);
      const index = mathArr.indexOf(max);
      setFindIndex(index);
    });
  }, [allGroupSelectArr, allGroupInfo]);

  const joinThisGroup = async (index, password, header_name) => {
    console.log(allGroupInfo);
    console.log(index);
    setGroupId(allGroupInfo[index].group_id.toString());
    setGroupPassword(password);
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

    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      if (docSnap.data().privacy == "私人") {
        // setIsOpen(true);
      }
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
    setDoc(docRefMember, {
      role: "member",
      member_name: userName,
      member_id: userId,
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

    const docRefJoinGroup = await doc(db, "joinGroup", userId);
    console.log(allGroupInfo[index].group_id);
    updateDoc(docRefJoinGroup, {
      group: arrayUnion(allGroupInfo[index].group_id),
    });
    
    updateDoc(doc(db, "joinGroup", allGroupInfo[index].header_id), {
      alert: arrayUnion({
        alert_content: `${userName}已加入「${allGroupInfo[index].group_title}」`,
        is_read: false,
      }),
    });
  };

  // console.log(findIndex);

  return (
    <div>
      {findIndex !== "" && <div>{findIndex}</div>}
      {/* <Font color="white" m="100px 0px 0px 0px" marginLeft="44%" letterSpacing="3px">- 最佳推薦 -</Font> */}
      {allGroupInfo.length !== 0 && (
        <GroupWrap>
          <Card
            sx={{
              width: "35%",
              height: "auto",
              boxShadow:
                "0.2rem 0.2rem 0.2rem #CFC781 , -0.3rem -0.3rem 0.4rem #ffffff",
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
                  new Date(allGroupInfo[findIndex].start_date.seconds * 1000)
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
                  joinThisGroup(
                    findIndex,
                    allGroupInfo[findIndex].password,
                    allGroupInfo[findIndex].header_name
                  );
                }}>
                {allGroupInfo[findIndex].privacy == "公開" &&
                  allGroupInfo[findIndex].header_name !== userName && (
                    <LinkPrivate
                      to={`joinGroup/${allGroupInfo[findIndex].group_id}`}>
                      我要加入
                    </LinkPrivate>
                  )}
                {allGroupInfo[findIndex].privacy == "私人" &&
                  allGroupInfo[findIndex].header_name !== userName && (
                    <LinkOpen>我要加入</LinkOpen>
                  )}
                {allGroupInfo[findIndex].header_name == userName && (
                  <LinkOpen>我要加入</LinkOpen>
                )}
              </Button>
            </ButtonWrap>
            {/* <IsModal
              modalIsOpen={modalIsOpen}
              setIsOpen={setIsOpen}
              groupId={groupId}
              groupPassword={groupPassword}
            /> */}
            <CardActions disableSpacing>
              {allGroupInfo[findIndex].select_tag
                .map((obj) => <SelectTag>{obj}</SelectTag>)
                .slice(0, 3)}
              <ExpandMore
                sx={{ zIndex: "10" }}
                name='gogo'
                expand={IsExpended}
                onClick={() => {
                  setIsExpended(!IsExpended);
                }}
                aria-expanded={IsExpended}
                aria-label='show more'>
                <ExpandMoreIcon
                  sx={{ pointerEvents: "none", cursor: "not-allowed" }}
                />
              </ExpandMore>
            </CardActions>
            <Expanded
              expanded={IsExpended}
              allGroupInfo={allGroupInfo}
              findIndex={findIndex}
            />
          </Card>
        </GroupWrap>
      )}
    </div>
  );
}

export default FindGroup;
