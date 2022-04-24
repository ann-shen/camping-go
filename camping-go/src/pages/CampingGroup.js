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
  arrayUnion,
} from "firebase/firestore";
import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Taiwan from "../component/Taiwan";
import { Box, Grid, TextField, Alert, AlertTitle, Stack } from "@mui/material";
import { Font, Display, Img, Button } from "../css/style";
import location from "../image/location.png";
import landingpage from "../image/landingpage.jpeg";
import Header from "../component/Header";
import Modal from "react-modal";
import { UserContext } from "../utils/userContext";

Modal.setAppElement("#root");

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
  height: 200px;
  overflow: hidden;
  margin-bottom: 20px;
`;

function IsModal({ password, modalIsOpen, setIsOpen, groupId }) {
  const [value, setValue] = useState("");
  const [alert, setAlert] = useState(false);
  const navigate = useNavigate();

  console.log(value);
  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const checkPassword = (e) => {
    if (value == password) {
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
          <Button onClick={checkPassword} width=' 200px'>
            送出
          </Button>
        </Display>
      </Modal>
    </div>
  );
}

function CampingGroup({ setGroupId, userId, userName, groupId }) {
  console.log(groupId);
  const [homePageCampGroup, sethomePageCampGroup] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const ContextByUserId = useContext(UserContext);
  const navigate = useNavigate();

  //render all camping group
  useEffect(async () => {
    let arr = [];
    const citiesRef = collection(db, "CreateCampingGroup");
    const q = query(citiesRef, orderBy("start_date"));
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

  const addCurrentMember = async (index, e) => {
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
      console.log(docSnap.data().privacy);
      currentNumber = docSnap.data().current_number + 1;
      setGroupId(docSnap.data().group_id);
      if (docSnap.data().privacy == "私人") {
        setIsOpen(true);
      }
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

    const docRefJoinGroup = await doc(db, "joinGroup", userId);
    console.log(homePageCampGroup[index].group_id);
    updateDoc(docRefJoinGroup, {
      group: arrayUnion(homePageCampGroup[index].group_id),
    });
  };

  // console.log(homePageCampGroup[0].id);
  return (
    <div>
      <Header ContextByUserId={ContextByUserId} />
      <Box
        sx={{
          width: "100%",
          height: 400,
          "&:hover": {
            border: 1,
            opacity: [0.9, 0.8, 0.7],
          },
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
              boxShadow:
                "0.8rem 0.8rem 2.2rem #E2E1D3 , -0.5rem -0.5rem 1rem #ffffff",
              "&:hover": {
                border: 1,
                opacity: [0.9, 0.8, 0.7],
              },
              borderRadius: 6,
              padding: 3,
              margin: 3,
            }}
            key={index}>
            <Grid item xs={4} md={8}>
              <ImgWrap>
                <Img src={item.picture} width='120%' alt='圖片' />
              </ImgWrap>
              <Display direction='column' alignItems='start' mb='30px'>
                <span>團長{item.header_name}</span>
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
              </Display>

              <div>
                <Display justifyContent='space-between'>
                  <Display>
                    <Img src={location} width='26px'></Img>
                    <Font fontSize='16px' marginLeft='10px'>
                      {item.city}
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
              <IsModal
                modalIsOpen={modalIsOpen}
                setIsOpen={setIsOpen}
                password={item.password}
                groupId={groupId}
              />
              <Button
                group_id={item.group_id}
                variant='outlined'
                onClick={(e) => {
                  addCurrentMember(index, e);
                }}>
                {item.privacy == "公開" && (
                  <LinkPrivate to={`joinGroup/${item.group_id}`}>
                    我要加入
                  </LinkPrivate>
                )}
                {item.privacy == "私人" && <LinkOpen>我要加入</LinkOpen>}
              </Button>
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
      {ContextByUserId}
    </div>
  );
}

export default CampingGroup;
