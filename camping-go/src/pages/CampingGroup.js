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
import { Font, Display, Img, Button, Cloumn, Hr, Wrap } from "../css/style";
import location_big from "../image/location_big.png";
import group_people from "../image/group_people.png";
import landingpage from "../image/landingpage.png";
import logoColor from "../image/logoColor2.png";
import Modal from "react-modal";
import { UserContext } from "../utils/userContext";
import PaginationBar from "../component/Pagination";
import ReviewCard from "../component/ReviewCard";
import AddIcon from "@mui/icons-material/Add";

Modal.setAppElement("#root");

const LinkRoute = styled(Link)`
  text-decoration: none;
  margin: 5px 5px;
  font-size: 14px;
  color: gray;
  margin-left: ${(props) => props.ml || "53%"};
  display: flex;
`;

const NavFont = styled.p`
  margin: 0px 0px -10px 0px;
  font-size: 16px;
  &:hover {
    color: #426765;
  }
`;

const NavFontSetGroup = styled.p`
  margin: 0px 0px -10px 25px;
  font-size: 16px;
  &:hover {
    color: #426765;
  }
`;

const LogoImgWrap = styled.div`
  display: flex;
  /* justify-content: start; */
  align-items: center;
  width: 100%;
  margin: 15px 60px;
  z-index: 6;
`;

const HeaderSection = styled.div`
  margin: 0px;
  width: 100%;
  height: auto;
  position: relative;
`;

const LandingImg = styled.img`
  width: 66%;
  z-index: -10;
`;

const LandingSubTitleWrap = styled.div`
  position: absolute;
  text-align: start;
  top: 130px;
  left: 145px;
  line-height: 30px;
`;

const LandingImgWrap = styled.div`
  display: flex;
  justify-content: end;
  align-items: start;
  width: 100%;
  height: 540px;
  overflow: hidden;
  z-index: -1;
  /* margin-top: -180px; */
`;

const Tag = styled.div`
  width: 60px;
  height: 25px;
  background-color: #797659;
  color: white;
  border-radius: 10px;
  padding-top: 3px;
`;

const Section = styled.div`
  width: 90%;
  height: auto;
  margin: 100px auto;
  justify-content: center;
`;

const ImgGroupPeopleWrap = styled.div`
  display: flex;
  justify-content: start;
  margin: 60px 0px 0px 9%;
`;

const TitleWrap = styled.div`
  display: flex;
  align-items: start;
  flex-direction: column;
  margin-left: 15px;
`;

// function IsModal({ modalIsOpen, setIsOpen, groupId, groupPassword }) {
//   const [value, setValue] = useState("");
//   const [alert, setAlert] = useState(false);
//   const navigate = useNavigate();

//   const handleChange = (event) => {
//     setValue(event.target.value);
//   };

//   const checkPassword = (e) => {
//     if (value == groupPassword) {
//       navigate(`/joinGroup/${groupId}`);
//     } else {
//       setAlert(true);
//     }
//   };

//   return (
//     <div className='App'>
//       <Modal
//         isOpen={modalIsOpen}
//         onRequestClose={() => setIsOpen(false)}
//         overlayClassName={{
//           base: "overlay-base",
//           afterOpen: "overlay-after",
//           beforeClose: "overlay-before",
//         }}
//         className={{
//           base: "content-base",
//           afterOpen: "content-after",
//           beforeClose: "content-before",
//         }}
//         closeTimeoutMS={500}>
//         <Display direction='column'>
//           <TextField
//             required
//             id='outlined-required'
//             label='Required'
//             defaultValue=''
//             onChange={handleChange}
//           />
//           {alert && (
//             <Stack sx={{ width: "100%" }} spacing={2}>
//               <Alert severity='error'>
//                 <AlertTitle>Error</AlertTitle>
//                 密碼錯誤 <strong>請再輸入一次!</strong>
//               </Alert>
//             </Stack>
//           )}
//           <Button onClick={checkPassword} width=' 200px' boxShadow='none'>
//             送出
//           </Button>
//         </Display>
//       </Modal>
//     </div>
//   );
// }

function CampingGroup({ setGroupId, userId, userName, groupId }) {
  const [homePageCampGroup, sethomePageCampGroup] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [currentMemberAmount, setCurrentMemberAmount] = useState("");
  const ContextByUserId = useContext(UserContext);
  const [pagination, setPaagination] = useState({
    loading: false,
    currentPage: 1,
    posts_per_page: 3,
  });
  const navigate = useNavigate();
  const [navSize, setnavSize] = useState("6rem");
  const [navColor, setnavColor] = useState("transparent");
  const [navFontColor, setnavFontColor] = useState("gray");

  const listenScrollEvent = () => {
    window.scrollY > 10 ? setnavColor("#426765") : setnavColor("transparent");
    window.scrollY > 10 ? setnavSize("5rem") : setnavSize("7rem");
    window.scrollY > 10 ? setnavFontColor("#F4F4EE") : setnavFontColor("gray");
  };
  useEffect(() => {
    window.addEventListener("scroll", listenScrollEvent);
    return () => {
      window.removeEventListener("scroll", listenScrollEvent);
    };
  }, []);

  //render all camping group
  useEffect(async () => {
    let arr = [];
    const citiesRef = collection(db, "CreateCampingGroup");
    const q = query(citiesRef, orderBy("start_date"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((item) => {
      arr.push(item.data());
      if (
        new Date().getTime() <
        new Date(
          new Date(item.data().end_date.seconds * 1000)
            .toLocaleString()
            .split(" ")[0]
        ).getTime()
      ) {
        updateDoc(doc(db, "CreateCampingGroup", item.data().group_id), {
          status: "進行中",
        });
      } else {
        updateDoc(doc(db, "CreateCampingGroup", item.data().group_id), {
          status: "已結束",
        });
      }
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

  const joinThisGroup = async (index, header_name) => {
    console.log(index);
    if (header_name == userName) {
      alert("你是此團團長，不能加入唷！顆顆");
      return;
    }
    // setIsOpen(true);

    setGroupId(currentPosts[index].group_id.toString());

    const docRef = await doc(
      db,
      "CreateCampingGroup",
      currentPosts[index].group_id.toString()
    );

    const docRefMember = await doc(
      db,
      "CreateCampingGroup",
      currentPosts[index].group_id.toString(),
      "member",
      userId
    );

    let userSelect;
    const docRefJoinGroup = doc(db, "joinGroup", userId);
    const docMemberInfo = await getDoc(docRefJoinGroup);
    if (docMemberInfo.exists()) {
      console.log(docMemberInfo.data().select_tag);
      userSelect = docMemberInfo.data().select_tag;
    }
    updateDoc(docRefJoinGroup, {
      group: arrayUnion(currentPosts[index].group_id),
    });
    console.log(userSelect);

    setDoc(docRefMember, {
      role: "member",
      member_name: userName,
      member_id: userId,
      member_select: userSelect,
    }).then(async () => {
      const querySnapshot = await getDocs(
        collection(
          db,
          "CreateCampingGroup",
          currentPosts[index].group_id.toString(),
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

    // console.log(currentPosts[index].group_id);

    navigate(`/joinGroup/${currentPosts[index].group_id}`);
  };

  return (
    <>
      <HeaderSection>
        {/* <Header ContextByUserId={ContextByUserId} /> */}
        <nav
          style={{
            backgroundColor: navColor,
            height: navSize,
            transition: "all 1s",
            position: "fixed",
            zIndex: "99",
            width: "100%",
          }}>
          <LogoImgWrap>
            <Img src={logoColor} width='240px'></Img>
            <LinkRoute to={`/profile/${userId}`}>
              <NavFont style={{ color: navFontColor }}>我的露營團</NavFont>
            </LinkRoute>
            {/* <LinkRoute to={`/personal_header/${userId}`}>
              <NavFont
                style={{ color: navFontColor }}
                m='0px 0px -10px 0px'
                fontSize='16px'>
                開團歷史紀錄
              </NavFont>
            </LinkRoute> */}
            <LinkRoute to={`/create_group`} ml='10%'>
              <AddIcon sx={{ marginBottom: "-10px" }}></AddIcon>
              <NavFont style={{ color: navFontColor }}>建立露營團</NavFont>
            </LinkRoute>
            {!userId && (
              <LinkRoute to={`/login`} ml='10%'>
                <NavFontSetGroup style={{ color: navFontColor }}>
                  登入
                </NavFontSetGroup>
              </LinkRoute>
            )}
          </LogoImgWrap>
        </nav>

        <LandingSubTitleWrap>
          <Font fontSize='14px'>揪團去露營。</Font>
          <Font fontSize='14px'>忙碌的都市生活之餘，</Font>
          <Font fontSize='14px'>
            讓大自然調劑你緊湊的生活步伐，來場「森」呼吸。
          </Font>
          <Button mt='70px' width='150px'>
            立即探索
          </Button>
        </LandingSubTitleWrap>

        <LandingImgWrap>
          <LandingImg src={landingpage}></LandingImg>
        </LandingImgWrap>
      </HeaderSection>

      <Section>
        <ImgGroupPeopleWrap>
          <Img width='35px' src={group_people} />
          <TitleWrap>
            <Font fontSize='20px' letterSpacing='3px'>
              尋找你的露營趴 所有好玩的都在這。
            </Font>
            <Font fontSize='16px' color='#BFBB92'>
              忙碌的都市生活之餘，讓大自然調劑你緊湊的生活步伐，來場「森」呼吸。
            </Font>
          </TitleWrap>
        </ImgGroupPeopleWrap>
        <Hr width='80%' m='20px 0px 30px 8%'></Hr>

        <ReviewCard
          homePageCampGroup={homePageCampGroup}
          currentPosts={currentPosts}
          joinThisGroup={joinThisGroup}
          userName={userName}
          setIsOpen={setIsOpen}
          modalIsOpen={modalIsOpen}
          userId={userId}
          setGroupId={setGroupId}
        />
        <PaginationBar
          pagination={pagination}
          totalPosts={homePageCampGroup.length}
          paginate={paginate}
        />

        {/* <Button
          width='80px'
          height='80px'
          borderRadius='50%'
          mt='90px'
          ml='90%'
          fontSize='30px'
          bgc='#426765'
          color='#CFC781'
          boxShadow='none'
          onClick={() => {
            navigate("/createGroup");
          }}>
          +
        </Button> */}
        <Display justifyContnet='start' ml='8%' m='60px 0px 0px 0px'>
          <Display>
            <Img src={location_big} alt='' width='40px' />
            <TitleWrap>
              <Font fontSize='20px' letterSpacing='3px'>
                點擊嚮往縣市
              </Font>
              <Font fontSize='16px' color='#BFBB92'>
                忙碌的都市生活之餘，讓大自然調劑你緊湊的生活步伐，來場「森」呼吸。
              </Font>
            </TitleWrap>
          </Display>
        </Display>
        <Hr width='80%' m='20px 0px 0px 8%'></Hr>
        <Taiwan />
      </Section>
    </>
  );
}

export default CampingGroup;
