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
import Modal from "react-modal";
import { UserContext } from "../utils/userContext";
import PaginationBar from "../component/Pagination";
import ReviewCard from "../component/ReviewCard";
import NavBar from "../component/NavBar";
Modal.setAppElement("#root");



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


const Section = styled.div`
  width: 90%;
  height: auto;
  margin: 50px auto;
  justify-content: center;
`;

const ImgGroupPeopleWrap = styled.div`
  display: flex;
  justify-content: start;
  margin: 0px 0px 0px 9%;
`;

const TitleWrap = styled.div`
  display: flex;
  align-items: start;
  flex-direction: column;
  margin-left: 15px;
`;


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
    updateDoc(doc(db, "joinGroup", currentPosts[index].header_id), {
      alert: arrayUnion({
        alert_content: `${userName}已加入「${currentPosts[index].group_title}」`,
        is_read: false,
      }),
    });

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
        <NavBar userId={userId} />
        {/* <nav
          style={{
            backgroundColor: navColor,
            height: navSize,
            transition: "all 1s",
            position: "fixed",
            zIndex: "99",
            width: "100%",
          }}>
          <LogoImgWrap>
            <Img src={logoColor} width='240px' height='100%'></Img>
            <LinkRoute to={`/create_group`} ml='45%'>
              <AddIcon sx={{ marginBottom: "-10px" }}></AddIcon>
              <NavFont style={{ color: navFontColor }}>建立露營團</NavFont>
            </LinkRoute>
            <LinkRoute to={`/profile/${userId}`} ml='5%'>
              <NavFont style={{ color: navFontColor }}>我的露營團</NavFont>
            </LinkRoute>
            <Alert userId={userId}></Alert>
            {!userId && (
              <LinkRoute to={`/login`} ml='10%'>
                <NavFontSetGroup style={{ color: navFontColor }}>
                  登入
                </NavFontSetGroup>
              </LinkRoute>
            )}
          </LogoImgWrap>
        </nav> */}

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
