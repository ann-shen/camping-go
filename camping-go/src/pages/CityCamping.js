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
import { Box, Grid } from "@mui/material";
import { Font, Display, Img, Button } from "../css/style";
import location from "../image/location.png";
import { db } from "../utils/firebase";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../utils/userContext";
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

function CityCamping() {
  const [targetCity, setTargetCity] = useState("");
  const [targetCityArr, setTargetCityArr] = useState([]);
  const ContextByUserId = useContext(UserContext);

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

  const addCurrentMember = async (group_id, index) => {
    console.log(group_id);
    await updateDoc(doc(db, "CreateCampingGroup", group_id), {
      current_number: increment(1),
    });
    const docRefJoinGroup = doc(db, "joinGroup", ContextByUserId);
    updateDoc(docRefJoinGroup, {
      group: arrayUnion(group_id),
    });

    navigate(`/joinGroup/${group_id}`);
  };

  return (
    <div>
      <Header ContextByUserId={ContextByUserId} />

      {targetCityArr.map((item, index) => (
        <Box
          sx={{
            width: 1000,
            height: 300,
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
            <Font fontSize='24px' color='#797659' marginLeft='0px' margin='8px'>
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
                addCurrentMember(item.group_id, index);
              }}>
              我要加入
            </Button>
          </Grid>
        </Box>
      ))}
    </div>
  );
}

export default CityCamping;
