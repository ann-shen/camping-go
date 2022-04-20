import styled from "styled-components";
import { db } from "../utils/firebase";
import {
  setDoc,
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  updateDoc,
  orderBy,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Taiwan from "./Taiwan";
import { Box, Grid } from "@mui/material";
import { Font, Display, Img, Button } from "../css/style";
import location from "../image/location.png";
import landingpage from "../image/landingpage.jpeg";
import Header from "../component/Header";

const LinkRoute = styled(Link)`
  text-decoration: none;
  margin: 5px 5px;
  font-size: 14px;
  color: gray;
`;

const GroupWrap = styled.div`
  display: flex;
  /* flex-direction: column; */
  margin: 100px;
`;

const Group = styled.div`
  width: 200px;
  margin-left: 100px;
`;

const Label = styled.label`
  font-size: 16px;
`;

const ImgWrap = styled.div`
width: 100%;
height: 300px;
overflow:hidden;`

function CampingGroup({ setGroupId, userId, groupId, userName }) {
  console.log(userName);
  const [homePageCampGroup, sethomePageCampGroup] = useState([]);
  const navigate = useNavigate();

  //render all camping group
  useEffect(async () => {
    let arr = [];
    const citiesRef = collection(db, "CreateCampingGroup");
    const q = query(citiesRef, orderBy("create_time", "desc"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.data());
      arr.push(doc.data());
    });
    sethomePageCampGroup(arr);
  }, []);

  //particular city
  useEffect(async () => {
    const q = query(
      collection(db, "CreateCampingGroup"),
      where("city", "==", "新竹縣")
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // console.log(doc.id, " => ", doc.data());
    });
  }, []);

  const addCurrentMember = async (index) => {
    let currentNumber;
    //current_number+1
    const docRef = await doc(
      db,
      "CreateCampingGroup",
      homePageCampGroup[index].group_id.toString()
    );

    const docRefMember = await doc(
      db,
      "CreateCampingGroup",
      homePageCampGroup[index].group_id.toString(),
      "member",
      userId
    );

    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data().current_number);
      currentNumber = docSnap.data().current_number + 1;
      setGroupId(docSnap.data().group_id);
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }

    setDoc(docRefMember, {
      role: "member",
      member_name: userName,
      member_id: userId,
    });

    updateDoc(docRef, {
      current_number: currentNumber,
    });

    // console.log(groupId);
  };

  useEffect(async () => {
    //set JoinGroup
    const docRefJoinGroup = await doc(db, "joinGroup", userId);
    console.log(groupId);
    updateDoc(docRefJoinGroup, {
      group: [
        {
          group_id: groupId,
        },
      ],
    });
  }, [groupId]);

  // console.log(homePageCampGroup[0].id);
  return (
    <div>
      <Header />
      <Box
        sx={{
          width: "100%",
          height: 400,
          "&:hover": {
            border: 1,
            opacity: [0.9, 0.8, 0.7],
          },
          boxShadow: 3,
          overflow: "hidden",
        }}>
        <Img src={landingpage} width='100%'></Img>
      </Box>
      <GroupWrap>
        {homePageCampGroup.map((item, index) => (
          <Box
            sx={{
              width: 1000,
              height: "auto",
              "&:hover": {
                border: 1,
                opacity: [0.9, 0.8, 0.7],
              },
              boxShadow: 3,
              borderRadius: 6,
              padding: 3,
              margin: 3,
            }}
            key={index}>
            <Grid item xs={4} md={8}>
              <div>
                <span>團長{item.header_name}</span>
              </div>
              <ImgWrap>
                <Img src={item.picture} width='100%' alt='圖片' />
              </ImgWrap>
              <Font
                fontSize='24px'
                color='#797659'
                marginLeft='0px'
                margin='8px'>
                {item.group_title}
              </Font>
              <div>
                <Label ml='8px'>
                  {
                    new Date(item.start_date.seconds * 1000)
                      .toLocaleString()
                      .split(" ")[0]
                  }
                  ~
                </Label>
                <Label>
                  {
                    new Date(item.end_date.seconds * 1000)
                      .toLocaleString()
                      .split(" ")[0]
                  }
                </Label>
              </div>
              <div>
                <Display justifyContent='space-between'>
                  <Display>
                    <Img src={location} width='26px'></Img>
                    <Font fontSize='16px' marginLeft='10px'>
                      {item.city}{" "}
                    </Font>
                  </Display>
                  <div>
                    <Display>
                      <Font fontSize='35px'>
                        {item.current_number}/{item.max_member_number}人
                      </Font>
                    </Display>
                  </div>
                </Display>
              </div>
              <Button
                variant='outlined'
                onClick={(e) => {
                  addCurrentMember(index);
                }}>
                <LinkRoute to={`joinGroup/${item.group_id}`}>
                  我要加入
                </LinkRoute>
              </Button>

              {/* <button
                onClick={(e) => {
                  addCurrentMember(index);
                }}>
                <LinkRoute to={`joinGroup/${item.group_id}`}>
                  我要加入
                </LinkRoute>
              </button> */}
            </Grid>
          </Box>
        ))}
      </GroupWrap>
      <Button
        width='80px'
        height='80px'
        borderRadius='50%'
        ml='90%'
        fontSize='30px'
        bgc='#426765'
        color='#CFC781'
        onClick={() => {
          navigate("/createGroup");
        }}>
        +
      </Button>
      <Taiwan />
    </div>
  );
}

export default CampingGroup;
