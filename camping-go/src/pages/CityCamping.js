import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../utils/userContext";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import {
  getDocs,
  collection,
  query,
  where,
  updateDoc,
  doc,
  arrayUnion,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "../utils/firebase";

import { Font, Display, Img, Button, Wrap, Hr, Tag } from "../css/style";
import {
  TextField,
  Alert,
  Stack,
  Card,
  CardMedia,
  CardContent,
  CardActions,
} from "@mui/material";

import location_big from "../image/location_big.png";
import alertIcon from "../image/alert.png";
import location from "../image/location.png";

import Header from "../component/Header";
import Swal from "sweetalert2/dist/sweetalert2.js";
import Modal from "react-modal";

const Alink = styled.a`
  text-decoration: none;
`;

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

const LinkOpen = styled.a`
  text-decoration: none;
  margin: 5px 5px;
  font-size: 14px;
  color: gray;
`;

const AnnouncementFontWrap = styled.div`
  width: 80%;
  line-height: 30px;
  margin-bottom: 30px;
`;

const Section = styled.div`
  width: 90%;
  height: auto;
  margin: 50px auto;
  justify-content: center;
`;

const PrivicyTag = styled.div`
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
  margin-top: 10px;
  text-align: center;
`;

const GroupWrap = styled.div`
  display: flex;
  width: 100%;
  display: flex;
  justify-content: start;
  margin: 10px auto;
  align-items: start;
  flex-wrap: wrap;
  margin-left: 6%;
  @media (max-width: 1280px) {
    margin-left: 3%;
  }
  @media (max-width: 580px) {
    margin-left: 5%;
  }
`;

function TaiwanMapModal({ modalIsOpen, setIsOpen, currentPosts, index, userId }) {
  const [value, setValue] = useState("");
  const [alert, setAlert] = useState(false);
  const navigate = useNavigate();
  const Context = useContext(UserContext);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const checkPassword = (e) => {
    if (value === currentPosts[index].password) {
      joinThisGroup(
        index,
        currentPosts[index].header_name,
        currentPosts[index].max_member_number,
        currentPosts[index].current_number
      );
    } else {
      setAlert(true);
    }
  };

  const joinThisGroup = async (
    index,
    header_name,
    max_member_number,
    current_number
  ) => {
    if (header_name === Context.userName) {
      Swal.fire({
        position: "center",
        icon: "warning",
        text: "你是此團團長，不能加入唷！請至我的露營團-開團，查看頁面",
        showConfirmButton: false,
        timer: 1500,
      });
      setIsOpen(false);
      return;
    }

    if (current_number + 1 > max_member_number) {
      Swal.fire({
        position: "center",
        icon: "warning",
        text: "已滿團",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    const docRef = doc(
      db,
      "CreateCampingGroup",
      currentPosts[index].group_id.toString()
    );

    const docRefMember = doc(
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
      userSelect = docMemberInfo.data().select_tag;
    }

    updateDoc(docRefJoinGroup, {
      group: arrayUnion(currentPosts[index].group_id),
    });
    updateDoc(doc(db, "joinGroup", currentPosts[index].header_id), {
      alert: arrayUnion({
        alert_content: `${Context.userName}已加入「${currentPosts[index].group_title}」`,
        is_read: false,
      }),
    });

    setDoc(docRefMember, {
      role: "member",
      member_name: Context.userName,
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
        memberArrLength.push(doc.data());
      });
      await updateDoc(docRef, {
        current_number: memberArrLength.length,
      });
    });

    navigate(`/joinGroup/${currentPosts[index].group_id}`);
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
          {currentPosts[index] && (
            <>
              <Font letterSpacing='3px'>介紹-即將加入露營團</Font>
              <Hr width='80%' m='10px 0px 20px 0px'></Hr>
              <AnnouncementFontWrap>
                <Font fontSize='14px'>{currentPosts[index].announcement}</Font>
              </AnnouncementFontWrap>
              <Font fontSize='18px' color='#426765'>
                注意事項
              </Font>
              <Hr width='80%' m='10px 0px 20px 0px'></Hr>
              <div>
                {currentPosts[index].notice.length !== 0 &&
                  currentPosts[index].notice.map((item) => (
                    <Display mb='15px'>
                      <Img src={alertIcon} width='30px'></Img>
                      <Font fontSize='14px' marginLeft='10px'>
                        {item}
                      </Font>
                    </Display>
                  ))}
              </div>

              {currentPosts[index].privacy == "公開" && (
                <Display>
                  <Button
                    width='200px'
                    mt='30px'
                    onClick={() => setIsOpen(false)}>
                    我再考慮
                  </Button>
                  <Button
                    width='200px'
                    mt='30px'
                    ml='20px'
                    onClick={() => {
                      joinThisGroup(
                        index,
                        currentPosts[index].header_name,
                        currentPosts[index].max_member_number,
                        currentPosts[index].current_number
                      );
                    }}>
                    確認加入
                  </Button>
                </Display>
              )}

              {currentPosts[index].privacy == "私人" && (
                <>
                  <TextField
                    required
                    id='outlined-required'
                    label='Required'
                    defaultValue=''
                    onChange={handleChange}
                    size='small'
                    helperText='此為私人團，請輸入密碼'
                    sx={{ marginTop: "40px", width: "200px" }}
                  />
                  {alert && (
                    <Stack sx={{ width: "60%" }} spacing={0}>
                      <Alert severity='error' variant='outlined'>
                        密碼錯誤 <strong>請再輸入一次!</strong>
                      </Alert>
                    </Stack>
                  )}
                  <Display>
                    <Button
                      width='200px'
                      mt='30px'
                      onClick={() => setIsOpen(false)}>
                      我再考慮
                    </Button>
                    <Button
                      mt='30px'
                      ml='20px'
                      onClick={checkPassword}
                      width=' 200px'
                      boxShadow='none'>
                      確認加入
                    </Button>
                  </Display>
                </>
              )}
            </>
          )}
        </Display>
      </Modal>
    </div>
  );
}

function CityCamping({ userId }) {
  const [targetCity, setTargetCity] = useState("");
  const [targetCityArr, setTargetCityArr] = useState([]);
  const ContextByUserId = useContext(UserContext);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [targetIndex, setTargetIndex] = useState("");
  const Context = useContext(UserContext);

  let params = useParams();
  let navigate = useNavigate();

  var place_data = [
    {
      tag: "taipei_city",
      place: "台北市",
      low: 16,
      high: 24,
      weather: "Rainy",
    },

    {
      tag: "new_taipei_city",
      place: "新北市",
      low: 15,
      high: 22,
      weather: "Rainy",
    },

    {
      tag: "taichung_city",
      place: "台中市",
      low: 15,
      high: 22,
      weather: "Rainy",
    },

    {
      tag: "tainan_city",
      place: "臺南市",
      low: 16,
      high: 24,
      weather: "Rainy",
    },

    {
      tag: "kaohsiung_city",
      place: "高雄市",
      low: 16,
      high: 24,
      weather: "Rainy",
    },

    {
      tag: "keelung_city",
      place: "基隆市",
      low: 15,
      high: 24,
      weather: "Rainy",
    },

    {
      tag: "taoyuan_country",
      place: "桃園市",
      low: 15,
      high: 24,
      weather: "Rainy",
    },

    {
      tag: "hsinchu_city",
      place: "新竹市",
      low: 13,
      high: 21,
      weather: "Rainy",
    },

    {
      tag: "hsinchu_country",
      place: "新竹縣",
      low: 19,
      high: 21,
      weather: "Rainy",
    },

    {
      tag: "miaoli_country",
      place: "苗栗縣",
      low: 16,
      high: 24,
      weather: "Rainy",
    },

    {
      tag: "changhua_country",
      place: "彰化縣",
      low: 14,
      high: 24,
      weather: "Rainy",
    },

    {
      tag: "nantou_country",
      place: "南投縣",
      low: 12,
      high: 24,
      weather: "Rainy",
    },

    {
      tag: "yunlin_country",
      place: "雲林縣",
      low: 11,
      high: 24,
      weather: "Cloudy",
    },

    {
      tag: "chiayi_city",
      place: "嘉義市",
      low: 10,
      high: 24,
      weather: "Rainy",
    },

    {
      tag: "chiayi_country",
      place: "嘉義縣",
      low: 12,
      high: 24,
      weather: "Cloudy",
    },

    {
      tag: "pingtung_country",
      place: "屏東縣",
      low: 18,
      high: 24,
      weather: "Cloudy",
    },

    {
      tag: "yilan_country",
      place: "宜蘭縣",
      low: 20,
      high: 24,
      weather: "Cloudy",
    },

    {
      tag: "hualien_country",
      place: "花蓮縣",
      low: 21,
      high: 24,
      weather: "Sunny",
    },

    {
      tag: "taitung_country",
      place: "台東縣",
      low: 17,
      high: 22,
      weather: "Sunny",
    },

    {
      tag: "penghu_country",
      place: "澎湖縣",
      low: 14,
      high: 24,
      weather: "Cloudy",
    },

    {
      tag: "kinmen_country",
      place: "金門縣",
      low: 15,
      high: 26,
      weather: "Sunny",
    },

    {
      tag: "lienchiang_country",
      place: "連江縣",
      low: 15,
      high: 20,
      weather: "Rainy",
    },
  ];

  useEffect(() => {
    let result = place_data.filter((obj) => {
      return obj.tag === params.city;
    });
    setTargetCity(result[0].place);
  }, []);

  useEffect(async () => {
    if (targetCity) {
      const q = query(
        collection(db, "CreateCampingGroup"),
        where("city", "==", targetCity)
      );
      const querySnapshot = await getDocs(q);
      let Arr = [];
      querySnapshot.forEach((doc) => {
        Arr.push(doc.data());
      });
      setTargetCityArr(Arr);
    }
  }, [targetCity]);

  const confirmJoinThisGroup = (index) => {
    if (!Context.userName) {
      Swal.fire({
        title: "尚未登入",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#426765",
        cancelButtonColor: "#EAE5BE",
        confirmButtonText: "前往登入",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
      return;
    }
    setTargetIndex(index);
    setIsOpen(true);
  };

  const splitDate = (start, end) => {
    let newDate = `${new Date(start * 1000).toLocaleString().split(" ")[0]}~ ${
      new Date(end * 1000).toLocaleString().split(" ")[0]
    }`;
    return <>{newDate}</>;
  };

  return (
    <div>
      <Header ContextByUserId={ContextByUserId} />
      <Section>
        <Wrap
          width='300px'
          alignItems='start'
          justifyContent='start'
          m='150px 0px 30px 4%'>
          <Img src={location_big} width='26px'></Img>
          <Font fontSize='20px' m='0px 0px 0px 20px' marginLeft='10px'>
            {targetCity}
          </Font>
        </Wrap>
        <Hr width='80%' m='0px 0px 0px 4%'></Hr>
        <GroupWrap>
          {targetCityArr.length !== 0 ? (
            targetCityArr.map((item, index) => (
              <Card
                sx={{
                  width: "23%",
                  height: "auto",
                  boxShadow:
                    "0.8rem 0.8rem 2.2rem #E2E1D3 , -0.5rem -0.5rem 1rem #ffffff",
                  borderRadius: 5,
                  padding: 1,
                  margin: 4,
                  marginTop: 0,
                  backgroundColor: "#F4F4EE",
                  "&:hover": {
                    transition: "0.7s",
                    opacity: "0.7",
                  },
                  "@media (max-width: 1280px)": {
                    width: "27%",
                    margin: 2,
                  },
                  "@media (max-width: 860px)": {
                    width: "40%",
                    margin: 2,
                  },
                  "@media (max-width: 580px)": {
                    width: "80%",
                    margin: 2,
                  },
                }}
                key={index}>
                <ImgWrap>
                  <CardMedia
                    sx={{
                      width: "100%",
                      height: "200px",
                    }}
                    component='img'
                    height='194'
                    image={item.picture}
                    alt='Paella dish'
                  />
                  {item.privacy == "私人" && <PrivicyTag>私</PrivicyTag>}
                </ImgWrap>
                <CardContent
                  sx={{
                    textAlign: "start",
                    height: "140px",
                  }}>
                  <Alink href={`./profile/${item.header_id}`}>
                    <Tag
                      width='90px'
                      height='18px'
                      fontSize='13px'
                      p='0px 0px 1px 0px'
                      borderRadius='8px'>
                      團長｜{item.header_name}
                    </Tag>
                  </Alink>

                  <Font fontSize='20px' m='6px 0px 6px 0px'>
                    {item.group_title}
                  </Font>
                  <Font fontSize='14px' m='0px 0px 16px 0px'>
                    {splitDate(item.start_date.seconds, item.end_date.seconds)}
                  </Font>
                  <Display justifyContent='space-between'>
                    <Display>
                      <Img src={location} width='20px'></Img>
                      <Span>{item.city}</Span>
                    </Display>
                    <Display>
                      <Font>
                        {item.current_number}/{item.max_member_number}
                      </Font>
                      <Span>人</Span>
                    </Display>
                  </Display>
                </CardContent>

                <ButtonWrap>
                  {item.status == ("進行中" || "") && (
                    <Button
                      width='90%'
                      margin='auto'
                      group_id={item.group_id}
                      variant='outlined'
                      onClick={() => {
                        confirmJoinThisGroup(index);
                      }}>
                      <LinkOpen>我要加入</LinkOpen>
                    </Button>
                  )}

                  {item.status === "已結束" && (
                    <Button
                      width='90%'
                      margin='auto'
                      variant='outlined'
                      style={{ cursor: "not-allowed" }}>
                      <LinkOpen>已結束</LinkOpen>
                    </Button>
                  )}
                </ButtonWrap>
                <TaiwanMapModal
                  modalIsOpen={modalIsOpen}
                  setIsOpen={setIsOpen}
                  currentPosts={targetCityArr}
                  index={targetIndex}
                  userId={userId}
                />
                <CardActions disableSpacing>
                  {item.select_tag
                    .map((obj, index) => (
                      <SelectTag key={index}>{obj}</SelectTag>
                    ))
                    .slice(0, 3)}
                </CardActions>
              </Card>
            ))
          ) : (
            <Font
              m='100px 0px 0px 0px'
              fontSize='16px'>{`此縣市尚無露營團，就等你來${targetCity}創建！`}</Font>
          )}
        </GroupWrap>
      </Section>
    </div>
  );
}

export default CityCamping;
