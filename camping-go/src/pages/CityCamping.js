import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import {
  getDocs,
  collection,
  query,
  where,
  updateDoc,
  increment,
  doc,
  arrayUnion,
} from "firebase/firestore";
import { Font, Display, Img, Button, Wrap, Hr } from "../css/style";
import location from "../image/location.png";
import { db } from "../utils/firebase";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../utils/userContext";
import Header from "../component/Header";
import styled from "styled-components";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ExpandMore } from "../component/ReviewCard_Component/ExpanMore";
import Modal from "react-modal";
import { TextField, Alert, AlertTitle, Stack } from "@mui/material";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";
import location_big from "../image/location_big.png";
import Swal from "sweetalert2/dist/sweetalert2.js";

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
  width: 90%;
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



function CityCamping({ userName, groupId }) {
  const [targetCity, setTargetCity] = useState("");
  const [targetCityArr, setTargetCityArr] = useState([]);
  const ContextByUserId = useContext(UserContext);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [groupPassword, setGroupPassword] = useState("");
  const [expandedArr, setExpandedArr] = useState(
    Array(targetCityArr.length).fill(false)
  );
  const [targetIndex, setTargetIndex] = useState("");



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

  console.log(targetCity);

  useEffect(() => {
    let result = place_data.filter((obj) => {
      return obj.tag == params.city;
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
        console.log(doc.id, " => ", doc.data());
        Arr.push(doc.data());
      });
      console.log(Arr);
      setTargetCityArr(Arr);
    }
  }, [targetCity]);

  const addCurrentMember = async (group_id, index, password) => {
    if (!userName) {
      Swal.fire({
        title: "尚未登入",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#426765",
        cancelButtonColor: "#EAE5BE",
        confirmButtonText: "前往登入",
      }).then(async (result) => {
        if (result.isConfirmed) {
          navigate("/login");
          // Swal.fire("Deleted!", "Your file has been deleted.", "success");
        }
      });
      return;
    }

    console.log(group_id);
    await updateDoc(doc(db, "CreateCampingGroup", group_id), {
      current_number: increment(1),
    });
    const docRefJoinGroup = doc(db, "joinGroup", ContextByUserId);
    updateDoc(docRefJoinGroup, {
      group: arrayUnion(group_id),
    });
    setIsOpen(true);
    setGroupPassword(password);

    navigate(`/joinGroup/${group_id}`);
  };

  return (
    <div>
      <Header ContextByUserId={ContextByUserId} />
      <Wrap width='100%' direction='column' justifyContent='start'>
        <Wrap width='300px' alignItems='center' m='150px 0px 0px -20%'>
          <Img src={location_big} width='25px'></Img>
          <Font fontSize='20px' m='0px 0px 0px 20px' marginLeft='10px'>
            {targetCity}
          </Font>
        </Wrap>
        <Wrap alignItems='start' justifyContent='center' width='80%'>
          {targetCityArr.length !== 0 ? (
            targetCityArr.map((item, index) => (
              <Card
                sx={{
                  width: "24%",
                  height: "auto",
                  boxShadow:
                    "0.8rem 0.8rem 2.2rem #E2E1D3 , -0.5rem -0.5rem 1rem #ffffff",
                  borderRadius: 7.5,
                  padding: 1,
                  margin: 4,
                  marginTop: 2,
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
                    image={item.picture}
                    alt='Paella dish'
                  />
                  {item.privacy == "私人" && <Tag>私</Tag>}
                </ImgWrap>
                <CardContent
                  sx={{
                    textAlign: "start",
                    height: "160px",
                  }}>
                  <Span>團長</Span>
                  <Span>{item.header_name}</Span>
                  <Font fontSize='25px' m='6px 0px 6px 0px'>
                    {item.group_title}
                  </Font>
                  <Font fontSize='16px' m='0px 0px 16px 0px'>
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
                  <Display justifyContent='space-between'>
                    <Display>
                      <Img src={location} width='26px'></Img>{" "}
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
                  <Button
                    width='90%'
                    margin='auto'
                    group_id={item.group_id}
                    variant='outlined'
                    onClick={(e) => {
                      addCurrentMember(item.group_id, index, item.password);
                    }}>
                    {item.privacy == "公開" &&
                      item.header_name !== userName && (
                        <LinkPrivate to={`joinGroup/${item.group_id}`}>
                          我要加入
                        </LinkPrivate>
                      )}
                    {item.privacy == "私人" &&
                      item.header_name !== userName && (
                        <LinkOpen>我要加入</LinkOpen>
                      )}
                    {item.header_name == userName && (
                      <LinkOpen>我要加入</LinkOpen>
                    )}
                  </Button>
                </ButtonWrap>
                <IsModal
                  modalIsOpen={modalIsOpen}
                  setIsOpen={setIsOpen}
                  groupId={groupId}
                  groupPassword={groupPassword}
                />
                <CardActions disableSpacing>
                  {item.select_tag
                    .map((obj) => <SelectTag>{obj}</SelectTag>)
                    .slice(0, 3)}
                </CardActions>
                
              </Card>
            ))
          ) : (
            <Font
              m='100px 0px 0px 0px'
              fontSize='16px'>{`此縣市尚無露營團，就等你來${targetCity}創建！`}</Font>
          )}
        </Wrap>
      </Wrap>
    </div>
  );
}

export default CityCamping;
