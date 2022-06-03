import styled from "styled-components";
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../utils/userContext";
import {
  setDoc,
  doc,
  collection,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "../utils/firebase";

import { TextField, Autocomplete, Stack } from "@mui/material";
import { Display, Cloumn, Button, Wrap, Img, Font } from "../css/style";

import landingPage04 from "../image/landingpage-04.png";
import tentColor from "../image/tentColor.png";
import supplies from "../image/supplies.png";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { DateRange } from "react-date-range";
import Tent from "../component/Tent";
import Header from "../component/Header";
import Footer from "../component/Footer";
import CampSupplies from "../component/CampSupplies";
import GoogleMapBasic from "../component/GoogleMapBasic";
import MultipleSelectChip from "../component/MultipleSelectChip";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { v4 as uuidv4 } from "uuid";

const RockImg = styled.img`
  width: 150px;
  position: absolute;
  top: -110px;
  left: -30px;
`;

const CreateLabel = styled.label`
  font-size: 18px;
  margin-left: 20px;
  margin: 5px 0px;
  letter-spacing: 2px;
  color: #605f56;
`;

const Title = styled.p`
  font-size: 35px;
  color: #426765;
  margin: 20px auto;
`;
const AddButton = styled.button`
  &:hover {
    color: #797659;
    background-color: none;
    box-shadow: none;
  }
  width: auto;
  height: 30px;
  background-color: none;
  border: 1px solid #605f56;
  border-radius: 10px;
  color: #797659;
  font-size: 16px;
  cursor: pointer;
  padding: 2px 16px 5px 16px;
  margin: 15px 0px;
  display: flex;
  justify-content: center;
`;
const CalendarWrap = styled.div`
  width: 250px;
`;

const FileLabel = styled.label`
  &:hover {
    color: #797659;
    background-color: none;
    box-shadow: none;
  }
  width: 60px;
  height: 20px;
  background-color: none;
  border: 1px solid #605f56;
  border-radius: 10px;
  color: #797659;
  font-size: 16px;
  cursor: pointer;
  padding: 2px 3px 5px 3px;
  margin: 20px 10px;
  display: flex;
  justify-content: center;
`;
const FileInput = styled.input`
  display: none;
  color: rgba(0, 0, 0, 0);
`;

const Form = styled.form`
  width: 65%;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: start;
  flex-direction: column;
  border: 2px solid #cfc781;
  padding: 60px;
  padding-top: 30px;
  border-radius: 20px;
  margin-top: 250px;
  position: relative;
`;

const options = ["公開", "私人"];

const MeetingTimeWrap = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  margin-left: 140px;
`;

const TimeWrap = styled.div`
  width: 100%;
  display: flex;
  margin-bottom: 40px;
`;

const SecondSection = styled.div`
  width: 100%;
`;

const TentWrap = styled.div`
  width: 90%;
  height: auto;
  margin: 40px auto 0px auto;
  padding: 40px 0px;
  border-top: 2px dashed #cfc781;
  border-bottom: 2px dashed #cfc781;
`;

const SuppliesWrap = styled.div`
  width: 90%;
  height: auto;
  margin: 0px auto 20px auto;
  padding: 40px 0px;
  border-bottom: 2px dashed #cfc781;
`;

const AddAlertItems = styled.button`
  width: 130px;
  margin: 0px;
  &:hover {
    color: #797659;
    background-color: none;
    box-shadow: none;
  }
  height: 30px;
  background-color: none;
  border: 1px solid #605f56;
  border-radius: 10px;
  color: #797659;
  font-size: 16px;
  cursor: pointer;
  padding: 2px 16px 5px 16px;
  display: flex;
  justify-content: center;
`;

//calnader
function Calander({ setEndDate, setStartDate, startDate, endDate }) {
  // const [startDate, setStartDate] = useState(new Date());
  // const [endDate, setEndDate] = useState(new Date());
  const handleSelect = (ranges) => {
    setStartDate(ranges.selection.startDate);
    setEndDate(ranges.selection.endDate);
  };
  const selectionRange = {
    startDate: startDate,
    endDate: endDate,
    key: "selection",
  };
  return (
    <CalendarWrap>
      <DateRange
        editableDateInputs={true}
        ranges={[selectionRange]}
        onChange={handleSelect}
        moveRangeOnFirstSelection={false}
      />
    </CalendarWrap>
  );
}

//time
function MaterialUIPickers({ setTime }) {
  const [value, setValue] = useState(new Date());

  const handleChange = (newValue) => {
    setTime(newValue);
    setValue(newValue);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Stack spacing={3}>
        <DateTimePicker
          CreateLabel='Date&Time picker'
          value={value}
          onChange={handleChange}
          renderInput={(params) => <TextField {...params} />}
        />
      </Stack>
    </LocalizationProvider>
  );
}

function CreateGroup({ userId, userName }) {
    console.log(userName);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const Context = useContext(UserContext);
  const [state, setState] = useState({
    address: "",
    city: "",
    area: "",
    state: "",
    zoom: 5,
    height: 400,
    mapPosition: {
      lat: 25.033493,
      lng: 121.564101,
    },
    markerPosition: {
      lat: 25.033493,
      lng: 121.564101,
    },
  });
  const [thisGroupId, setThisGroupID] = useState("");
  const [groupInfo, setGroupInfo] = useState({
    header_id: userId,
    header_name: userName,
    status: "",
    privacy: "公開",
    password: "",
    group_title: "",
    site: "",
    start_date: "",
    end_date: "",
    position: "",
    city: null,
    meeting_time: "",
    max_member_number: "",
    current_number: 1,
    announcement: "",
    notice: [],
    picture: "",
    create_time: serverTimestamp(),
  });
  const [campSupplies, setCampSupplies] = useState({
    bring_person: "",
    note: "",
    supplies: "",
  });
  const [tentInfo, setTentInfo] = useState({
    current_number: 0,
    max_number: 0,
    member: [],
    seat: 0,
    create_time: serverTimestamp(),
  });
  const [addNotice, setAddNotice] = useState([]);
  const [time, setTime] = useState("");
  const [clickConfirm, setClickConfirm] = useState(false);
  const [privacyValue, setPrivacyValue] = useState(options[0]);
  const [upload, setUpLoadFile] = useState({
    file: "",
    url: "",
    detail_picture: [],
  });
  const navigate = useNavigate();
  const [personName, setPersonName] = useState([]);
  const [getAllTent, setGetAllTent] = useState([]);
  const [getAllSupplies, setGetAllSupplies] = useState([]);

  let path = window.location.pathname;

  const addNewGroup = (e) => {
    e.preventDefault();
    setClickConfirm(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGroupInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    if (value === "notice") {
      setAddNotice((prev) => [...prev, groupInfo.notice]);
    }
  };

  const addGroupNotice = (e) => {
    e.preventDefault();
    setAddNotice((prev) => [...prev, groupInfo.notice]);
  };

  const setUpGroup = async (e) => {
    if (upload.file === "") {
      Swal.fire({
        position: "center",
        icon: "warning",
        text: "請上傳封面照片",
        showConfirmButton: false,
        timer: 2500,
      });
      return;
    }

    const groupId = uuidv4();
    setThisGroupID(groupId);

    const docRef = doc(db, "CreateCampingGroup", groupId);

    console.log(Context.personName);

    const comfirm = {
      address: state.address,
      addNotice,
      maxNumber: groupInfo.max_member_number,
      announcement: groupInfo.announcement,
      groupTitle: groupInfo.group_title,
      site: groupInfo.site,
    };

    for (const key in comfirm) {
      if (comfirm[key] === "") {
        console.log(key, comfirm[key]);
        Swal.fire({
          position: "center",
          icon: "warning",
          text: "請確實填完表格",
          showConfirmButton: false,
          timer: 2500,
        });
        return;
      }
    }

    if (Context.personName.length === 0) {
      Swal.fire({
        position: "center",
        icon: "warning",
        text: "請新增露營團喜愛標籤",
        showConfirmButton: false,
        timer: 2500,
      });
      return;
    }

    if (campSupplies.supplies === "") {
      Swal.fire({
        position: "center",
        icon: "warning",
        text: "請新增團員們認領的露營用品",
        showConfirmButton: false,
        timer: 2500,
      });
      return;
    }

    await setDoc(docRef, {
      group_id: groupId,
      header_id: Context.userId,
      header_name: Context.userName,
      start_date: startDate,
      end_date: endDate,
      meeting_time: time,
      position: state.address,
      city: state.city,
      picture: upload.url,
      detail_picture: upload.detail_picture,
      privacy: privacyValue,
      notice: addNotice,
      select_tag: Context.personName,
      current_number: 1,
      create_time: serverTimestamp(),
      status: "進行中",
      site: groupInfo.site,
      password: groupInfo.password,
      max_member_number: groupInfo.max_member_number,
      announcement: groupInfo.announcement,
      group_title: groupInfo.group_title,
    });

    getAllTent.map(async (item) => {
      const ondocRefNewTent = doc(
        collection(db, "CreateCampingGroup", groupId, "tent")
      );
      await setDoc(ondocRefNewTent, item);
      updateDoc(
        doc(db, "CreateCampingGroup", groupId, "tent", ondocRefNewTent.id),
        {
          tent_id: ondocRefNewTent.id,
          member: [],
          who_create: Context.userName,
        }
      );
    });

    getAllSupplies.map(async (item) => {
      const ondocRefNewSupplies = doc(
        collection(db, "CreateCampingGroup", groupId, "supplies")
      );
      await setDoc(ondocRefNewSupplies, item);
      updateDoc(
        doc(db, "CreateCampingGroup", groupId, "tent", ondocRefNewSupplies.id),
        {
          supplies_id: ondocRefNewSupplies.id,
        }
      );
    });

    const docRefObject = await doc(
      db,
      "CreateCampingGroup",
      groupId,
      "supplies",
      groupId
    );
    setDoc(docRefObject, campSupplies);
    updateDoc(doc(db, "CreateCampingGroup", groupId, "supplies", groupId), {
      supplies_id: docRefObject.id,
    });

    const docRefMember = await doc(
      db,
      "CreateCampingGroup",
      groupId,
      "member",
      groupId
    );
    setDoc(docRefMember, {
      role: "header",
      member_name: Context.userName,
      member_id: Context.userId,
    });

    let timerInterval;
    Swal.fire({
      title: "創建你的露營團",
      html: "建立中....",
      timer: 2000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
        const b = Swal.getHtmlContainer().querySelector("b");
        // timerInterval = setInterval(() => {
        //   b.textContent = Swal.getTimerLeft();
        // }, 100);
      },
      willClose: () => {
        clearInterval(timerInterval);
      },
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.timer) {
      }
    });

    navigate("/");
  };

  const addNewTent = (e) => {
    e.preventDefault();
    if (tentInfo.max_number === "") {
      return;
    }
    setGetAllTent((prev) => [...prev, tentInfo]);
    setTentInfo((prevState) => ({
      ...prevState,
      max_number: "",
      current_number: 0,
      seat: "",
      who_create: Context.userName,
    }));
  };

  const addSupplies = (e) => {
    e.preventDefault();
    setGetAllSupplies((prev) => [...prev, campSupplies]);
  };

  const handleFiles = (e) => {
    setUpLoadFile((prevState) => ({ ...prevState, file: e.target.files[0] }));

    const storage = getStorage();
    const imageRef = ref(storage, e.target.files[0].name);
    uploadBytes(imageRef, e.target.files[0])
      .then(() => {
        getDownloadURL(imageRef)
          .then((url) => {
            setUpLoadFile((prevState) => ({ ...prevState, url: url }));
          })
          .catch((error) => {
            console.log(error.message, "error getting the img url");
          });
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUpGroup(e);
  };

  return (
    <>
      <Header ContextByUserId={Context} />
      <Form onSubmit={handleSubmit} name='myform'>
        <RockImg src={landingPage04} alt='' />
        <Title>創建你的露營團</Title>
        <TextField
          size='small'
          sx={{ width: "100%", marginBottom: "30px" }}
          label='露營團名稱'
          name='group_title'
          required
          value={groupInfo.group_title}
          onChange={handleChange}></TextField>
        <TextField
          sx={{ width: "100%", marginRight: "20px", marginBottom: "30px" }}
          size='small'
          label='最多幾人'
          name='max_member_number'
          required
          value={groupInfo.max_member_number}
          onChange={handleChange}></TextField>
        <Wrap width='100%'>
          <Autocomplete
            size='small'
            sx={{ width: "150%" }}
            name='privacy'
            value={privacyValue}
            onChange={(event, newValue) => {
              setPrivacyValue(newValue);
            }}
            id='controllable-states-demo'
            options={options}
            renderInput={(params) => (
              <TextField
                {...params}
                label='狀態'
                helperText='如果設為私人，需要輸入密碼才可加團'
              />
            )}
          />
          {privacyValue === "私人" && (
            <TextField
              sx={{ width: "100%", marginLeft: "20px", marginBottom: "30px" }}
              size='small'
              label='密碼'
              name='password'
              value={groupInfo.password}
              onChange={handleChange}></TextField>
          )}
        </Wrap>
        <Display alignItems='center' m='50px 0px 50px 0px'>
          <Cloumn>
            <Display>
              <CreateLabel>封面照片</CreateLabel>
              <FileLabel>
                上傳
                <FileInput
                  required
                  type='file'
                  accept='image/*'
                  onChange={handleFiles}></FileInput>
              </FileLabel>
            </Display>
            {upload.file && upload.file.name}
          </Cloumn>
        </Display>
        <Button
          width='100%'
          onClick={(e) => {
            e.preventDefault();
            setClickConfirm(true);
          }}
          mt='40px'>
          下一步
        </Button>
        {clickConfirm && (
          <SecondSection>
            <Cloumn>
              <TextField
                sx={{
                  width: "100%",
                  marginRight: "20px",
                  marginBottom: "30px",
                  marginTop: "30px",
                }}
                size='small'
                label='營區網站'
                name='site'
                required
                value={groupInfo.site}
                onChange={handleChange}></TextField>
              <TextField
                sx={{
                  width: "100%",
                  marginRight: "20px",
                  marginBottom: "30px",
                  marginTop: "20px",
                }}
                required
                size='small'
                label='公告'
                name='announcement'
                value={groupInfo.announcement}
                onChange={handleChange}></TextField>
              <Wrap justifyContent='space-between' width='100%'>
                <Wrap width='80%' m='0px 20px 0px 0px'>
                  <TextField
                    sx={{
                      width: "100%",
                      marginRight: "20px",
                      marginBottom: "0px",
                      marginTop: "20px",
                    }}
                    required
                    label='注意事項'
                    size='small'
                    name='notice'
                    helperText='輸入完請按新增事項'
                    onChange={handleChange}></TextField>
                  <AddAlertItems onClick={addGroupNotice}>
                    新增事項
                  </AddAlertItems>
                </Wrap>
                <Wrap width='60%' direction='column' alignItems='start'>
                  {addNotice.map((item, index) => (
                    <Font fontSize='14px'>{`${index + 1}. ${item}`}</Font>
                  ))}
                </Wrap>
              </Wrap>
              <br />
              <br />
              <br />

              <MultipleSelectChip
                path={path}
                thisGroupId={thisGroupId}
                setPersonName={setPersonName}
                personName={personName}
                condiion='create'
              />
              <br></br>
              <br></br>

              <TimeWrap>
                <Cloumn>
                  <CreateLabel>時間</CreateLabel>
                  <Calander
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                    startDate={startDate}
                    endDate={endDate}
                  />
                </Cloumn>
                <MeetingTimeWrap>
                  <CreateLabel>集合時間</CreateLabel>
                  <MaterialUIPickers setTime={setTime} />
                </MeetingTimeWrap>
              </TimeWrap>
              <CreateLabel>地點</CreateLabel>
              <GoogleMapBasic setState={setState} state={state} />
              <TentWrap>
                <Cloumn>
                  <CreateLabel>新增帳篷</CreateLabel>
                </Cloumn>
                <Display justifyContent='space-between'>
                  <Display
                    justifyContent='end'
                    alignItems='end'
                    m=' 30px 0px 30px 0px'>
                    <Tent setTentInfo={setTentInfo} tentInfo={tentInfo} />
                    <AddButton onClick={addNewTent}>新增帳篷</AddButton>
                  </Display>
                  <Cloumn>
                    {getAllTent.map((item, index) => (
                      <Display mb='10px'>
                        <Img src={tentColor}></Img>
                        <Cloumn>
                          <Font fontSize='14px'>{`第${index + 1}頂帳篷`}</Font>
                          <Font fontSize='14px'>
                            可容納人數 {item.max_number}
                          </Font>
                        </Cloumn>
                      </Display>
                    ))}
                  </Cloumn>
                </Display>
              </TentWrap>
              <SuppliesWrap>
                <Cloumn>
                  <CreateLabel>新增需要團員們認領的物品</CreateLabel>
                </Cloumn>
                <Display justifyContent='space-between'>
                  <Display
                    justifyContent='end'
                    alignItems='end'
                    m=' 30px 0px 30px 0px'>
                    <CampSupplies
                      setCampSupplies={setCampSupplies}
                      campSupplies={campSupplies}
                    />
                    <AddButton onClick={addSupplies}>新增物品</AddButton>
                  </Display>
                  <Cloumn>
                    {getAllSupplies.map((item, index) => (
                      <Display mb='10px'>
                        <Img src={supplies} m='0px 20px 0px 0px'></Img>
                        <Cloumn>
                          <Font fontSize='14px'>{`第${index + 1}個物品`}</Font>
                          <Font fontSize='14px'>{item.supplies}</Font>
                          <Font fontSize='14px'>{item.note}</Font>
                        </Cloumn>
                      </Display>
                    ))}
                  </Cloumn>
                </Display>
              </SuppliesWrap>
            </Cloumn>
            <Button type='submit' width='100%' mt='60px' onClick={handleSubmit}>
              建立露營團
            </Button>
          </SecondSection>
        )}
      </Form>
      <Footer />
    </>
  );
}

export default CreateGroup;
