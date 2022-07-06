import styled from "styled-components";
import { useState, useEffect, useContext, useRef } from "react";
import { UserContext } from "../utils/userContext";
import {
  doc,
  getDocs,
  collection,
  query,
  updateDoc,
  orderBy,
} from "firebase/firestore";
import { db } from "../utils/firebase";

import { Font, Display, Hr } from "../css/style";

import location_big from "../image/location_big.png";
import group_people from "../image/group_people.png";
import landingpage from "../image/landingpage10-01.png";

import Modal from "react-modal";
import Taiwan from "../component/Taiwan";
import PaginationBar from "../component/Pagination";
import ReviewCard from "../component/ReviewCard";
import NavBar from "../component/NavBar";
import Footer from "../component/Footer";
import PropTypes from "prop-types";

Modal.setAppElement("#root");

const HeaderSection = styled.div`
  margin: 0px;
  width: 100%;
  height: auto;
  position: relative;
`;

const LandingImg = styled.img`
  width: 87%;
  z-index: -10;
  margin-right: -10px;
  @media (max-width: 768px) {
    width: 100%;
  }
  @media (max-width: 680px) {
    width: 140%;
  }
`;

const LandingSubTitleWrap = styled.div`
  position: absolute;
  text-align: start;
  top: 150px;
  left: 145px;
  line-height: 30px;

  @media (max-width: 1280px) {
    left: 120px;
  }
  @media (max-width: 1024px) {
    top: 100px;
    left: 70px;
    width: 220px;
  }
  @media (max-width: 768px) {
    top: 90px;
    left: 60px;
    line-height: 24px;
  }
  @media (max-width: 700px) {
    display: none;
  }
`;

const LandingImgWrap = styled.div`
  display: flex;
  justify-content: end;
  align-items: start;
  width: 100%;
  height: 80%;
  overflow: hidden;
  z-index: -1;
`;

const Section = styled.div`
  width: 90%;
  height: auto;
  margin: 50px auto 200px auto;
  justify-content: center;
`;

const ImgGroupPeopleWrap = styled.div`
  position: relative;
  display: flex;
  justify-content: start;
  margin: 0px 0px 0px 9%;
  width: 85%;
  @media (max-width: 768px) {
    width: 80%;
  }
`;

const TitleWrap = styled.div`
  display: flex;
  align-items: start;
  flex-direction: column;
  margin-left: 15px;
  font-size: 16px;
`;

const FindGroupButton = styled.button`
  &:hover {
    color: #ffffff;
    background-color: #dcd8b3;
    box-shadow: none;
  }
  &:active {
    color: #797659;
    background-color: #eae5be;
    box-shadow: inset 0.2rem 0.2rem 1rem #bdb991,
      inset -0.2rem -0.2rem 1rem #fffef4;
  }
  width: 150px;
  height: 40px;
  border-radius: 10px;
  background-color: #eae5be;
  font-size: 16px;
  color: #797659;
  cursor: pointer;
  padding: 5px;
  letter-spacing: 2px;
  margin-top: 70px;
  border: none;

  @media (max-width: 1024px) {
    margin-top: 40px;
  }

  @media (max-width: 768px) {
    margin-top: 30px;
  }
`;

const FindImg = styled.img`
  color: #bfbb92;
  width: 35px;
  height: 50px;
  margin: 0px;
  @media (max-width: 768px) {
    width: 25px;
    height: 35px;
  }
`;

const SubTitle = styled.p`
  color: #bfbb92;
  font-size: 14px;
  margin: 0px;
  text-align: start;
  @media (max-width: 768px) {
    margin-left: 0px;
  }
`;

const Title = styled.p`
  color: #797659;
  font-size: 16px;
  letter-spacing: 1px;
  text-align: start;
  margin: 0px;
`;

function CampingGroup({ setGroupId }) {
  const [homePageCampGroup, sethomePageCampGroup] = useState([]);
  // const [modalIsOpen, setIsOpen] = useState(false);
  const [pagination, setPaagination] = useState({
    loading: false,
    currentPage: 1,
    posts_per_page: 6,
  });

  const immediatelyRef = useRef(null);
  const Context = useContext(UserContext);

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

  useEffect(() => {
    const updateGroupStatus = async () => {
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
    };
    updateGroupStatus()
  }, []);

  const toTaiwanMap = () => {
    if (immediatelyRef.current) {
      window.scrollTo({
        top: 1600,
        behavior: "smooth",
      });
    } else {
      return;
    }
  };

  return (
    <>
      <HeaderSection>
        <NavBar userId={Context.userId} />
        <LandingSubTitleWrap>
          <Font fontSize='14px'>揪團去露營。</Font>
          <Font fontSize='14px'>忙碌的都市生活之餘，</Font>
          <Font fontSize='14px'>
            讓大自然調劑你緊湊的生活步伐，來場「森」呼吸。
          </Font>
          <FindGroupButton onClick={toTaiwanMap}>立即探索</FindGroupButton>
        </LandingSubTitleWrap>

        <LandingImgWrap>
          <LandingImg src={landingpage} loading='lazy'></LandingImg>
        </LandingImgWrap>
      </HeaderSection>
      <Section>
        <ImgGroupPeopleWrap>
          <FindImg src={group_people} />
          <TitleWrap>
            <Title>尋找你的露營趴 所有好玩的都在這。</Title>
            <SubTitle>
              忙碌的都市生活之餘，讓大自然調劑你緊湊的生活步伐，來場「森」呼吸。
            </SubTitle>
          </TitleWrap>
        </ImgGroupPeopleWrap>
        <Hr width='80%' m='20px 0px 30px 8%'></Hr>

        <ReviewCard
          currentPosts={currentPosts}
          setGroupId={setGroupId}
        />
        <PaginationBar
          pagination={pagination}
          totalPosts={homePageCampGroup.length}
          paginate={paginate}
        />
        <Display justifyContnet='start' ml='8%' m='140px 0px 0px 0px'>
          <Display>
            <FindImg src={location_big} alt='' width='40px' />
            <TitleWrap>
              <Title fontSize='20px' letterSpacing='3px'>
                點擊你想前往的城市
              </Title>
              <SubTitle fontSize='16px' color='#BFBB92'>
                忙碌的都市生活之餘，讓大自然調劑你緊湊的生活步伐，來場「森」呼吸。
              </SubTitle>
            </TitleWrap>
          </Display>
        </Display>
        <Hr width='80%' m='20px 0px 0px 8%' ref={immediatelyRef}></Hr>
        <Taiwan />
      </Section>
      <Footer />
    </>
  );
}

CampingGroup.propTypes = {
  setGroupId: PropTypes.func,
};
export default CampingGroup;
