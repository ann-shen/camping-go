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
  onSnapshot,
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
import PaginationBar from "../component/Pagination";
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

const Tag = styled.div`
  width: 60px;
  height: 25px;
  background-color: #797659;
  color: white;
  border-radius: 10px;
  padding-top: 3px;
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

function CampingGroup({ setGroupId, userId, userName, groupId }) {
  const [homePageCampGroup, sethomePageCampGroup] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [groupPassword, setGroupPassword] = useState("");
  const [currentMemberAmount, setCurrentMemberAmount] = useState("");
  const ContextByUserId = useContext(UserContext);
  const [pagination, setPaagination] = useState({
    loading: false,
    currentPage: 1,
    posts_per_page: 3,
  });
  const navigate = useNavigate();

  //render all camping group
  useEffect(async () => {
    let arr = [];
    const citiesRef = collection(db, "CreateCampingGroup");
    const q = query(citiesRef, orderBy("start_date"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      arr.push(doc.data());
    });
    sethomePageCampGroup(arr);
    setPaagination((prevState) => ({
      ...prevState,
      loading: false,
    }));
  }, []);

  const indexOfLastPost = pagination.currentPage * pagination.posts_per_page;
  const indexOfFirstPost = indexOfLastPost - pagination.posts_per_page;
  const currentPosts = homePageCampGroup.slice(
    indexOfFirstPost,
    indexOfLastPost
  );
  const paginate = (pageNumber) =>
    setPaagination((prevState) => ({
      ...prevState,
      currentPage: pageNumber,
    }));

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

  useEffect(async () => {
    if (currentMemberAmount) {
      console.log(currentMemberAmount);
      await updateDoc(doc(db, "CreateCampingGroup", groupId), {
        current_number: currentMemberAmount,
      });
    }
  }, [currentMemberAmount]);

  const joinThisGroup = async (index, password, header_name) => {
    if (header_name == userName) {
      alert("你是此團團長，不能加入唷！顆顆");
      return;
    }
    setGroupId(homePageCampGroup[index].group_id.toString());
    setGroupPassword(password);
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
    }).then(async () => {
      const querySnapshot = await getDocs(
        collection(
          db,
          "CreateCampingGroup",
          homePageCampGroup[index].group_id.toString(),
          "member"
        )
      );
      let memberArrLength = [];
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        // memberArrLength.push(doc.data());
      });
      console.log(memberArrLength.length);
      await updateDoc(docRef, {
        current_number: memberArrLength.length,
      });

      // setCurrentMemberAmount(memberArrLength.length);
    });
    // .then(async() => {
    //   if(currentMembeAmount !== "" ){
    //     console.log(currentMembeAmount);
    //     await updateDoc(docRef, {
    //       current_number: currentMembeAmount,
    //     });
    //   }
    // });

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
        {currentPosts.map((item, index) => (
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
              {item.privacy == "私人" && <Tag>私人</Tag>}

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
                groupId={groupId}
                groupPassword={groupPassword}
              />
              <Button
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
            </Grid>
          </Box>
        ))}
      </GroupWrap>
      <PaginationBar
        pagination={pagination}
        totalPosts={homePageCampGroup.length}
        paginate={paginate}
      />
      <Button
        width='80px'
        height='80px'
        borderRadius='50%'
        ml='90%'
        fontSize='30px'
        bgc='#426765'
        color='#CFC781'
        boxShadow='none'
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
