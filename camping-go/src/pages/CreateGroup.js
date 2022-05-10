import styled from "styled-components";
import { db } from "../utils/firebase";
import {
  setDoc,
  doc,
  collection,
  updateDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { DateRange } from "react-date-range";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Tent from "../component/Tent";
import CampSupplies from "../component/CampSupplies";
import Stack from "@mui/material/Stack";
import { TextField, Box, Autocomplete } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import GoogleMapBasic from "../component/GoogleMapBasic";
import MultipleSelectChip from "../component/MultipleSelectChip";
import { Display, Cloumn, Button, Wrap } from "../css/style";
import landingPage04 from "../image/landingpage-04.png";

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
const Input = styled.input`
  font-size: 16px;
  width: 150px;
  height: 30px;
  margin: 10px 0px;
`;
const Select = styled.select`
  width: 150px;
  height: 30px;
  margin-top: 10px;
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
  margin-top: 150px;
  position: relative;
`;

const options = ["公開", "私人"];

const PriviewImg = styled.img`
  width: 100%;
`;

const PriviewImgWrap = styled.div`
  width: 250px;
  height: 150px;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  margin-right: 20px;
`;

const PriviewDeleteImgButton = styled.button`
  width: 20px;
  height: 20px;
  border-radius: 4px;
  overflow: hidden;
  position: absolute;
  top: 10px;
  right: 10px;
  color: white;
  background-color: gray;
  border: none;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

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
  width: 150px;
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
    console.log(ranges);
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
  // console.log(value);

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

function Multiple({ setUpLoadFile }) {
  const [file, setFile] = useState([]);

  function uploadSingleFile(e) {
    setFile([...file, URL.createObjectURL(e.target.files[0])]);
    console.log("file", file);
  }

  function upload(e) {
    e.preventDefault();
    console.log(file);
    setUpLoadFile((prevState) => ({
      ...prevState,
      detail_picture: file,
    }));
  }

  function deleteFile(e) {
    const s = file.filter((item, index) => index !== e);
    setFile(s);
    console.log(s);
  }

  return (
    <form>
      <Display>
        <CreateLabel>細節照片</CreateLabel>
        <div className='form-group'>
          <FileLabel>
            上傳
            <FileInput
              required
              type='file'
              accept='image/*'
              disabled={file.length === 5}
              className='form-control'
              onChange={uploadSingleFile}></FileInput>
          </FileLabel>
        </div>
        <Button
          height='30px'
          width='100px'
          type='button'
          className='btn btn-primary btn-block'
          onClick={upload}>
          Upload
        </Button>
      </Display>
      <div className='form-group preview'>
        <Display>
          {file.length > 0 &&
            file.map((item, index) => {
              return (
                <Display key={item}>
                  <PriviewImgWrap>
                    <PriviewImg src={item} alt='' />
                    <PriviewDeleteImgButton
                      type='button'
                      onClick={() => deleteFile(index)}>
                      x
                    </PriviewDeleteImgButton>
                  </PriviewImgWrap>
                </Display>
              );
            })}
        </Display>
      </div>
    </form>
  );
}

function CreateGroup({ userId, userName, allMemberArr, setAllMemberArr }) {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [state, setState] = useState({
    address: "",
    city: "",
    area: "",
    state: "",
    zoom: 5,
    height: 400,
    mapPosition: {
      lat: 0,
      lng: 0,
    },
    markerPosition: {
      lat: 0,
      lng: 0,
    },
  });
  const [groupId, setGroupID] = useState("");
  const [groupInfo, setGroupInfo] = useState({
    header_id: userId,
    header_name: "",
    status: "",
    privacy: "",
    password: "",
    group_title: "",
    site: "",
    start_date: "",
    end_date: "",
    position: "",
    city: "",
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
  const [tentArr, setTentArr] = useState([]);
  const [suppliesArr, setSuppliesArr] = useState([]);
  const [alertItemsArr, setAlertItemsArr] = useState([]);
  const [addNotice, setAddNotice] = useState([]);
  const [time, setTime] = useState("");
  const [clickConfirm, setClickConfirm] = useState(false);
  const [upload, setUpLoadFile] = useState({
    file: "",
    url: "",
    detail_picture: [],
  });
  const navigate = useNavigate();
  let path = window.location.pathname;
  const [privacyValue, setPrivacyValue] = useState(options[0]);
  const formRef = React.useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(e.target.value);

    setGroupInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    if (value == "notice") {
      setAddNotice((prev) => [...prev, groupInfo.notice]);
    }
  };

  console.log(addNotice);

  const AddNotice = (e) => {
    setAddNotice((prev) => [...prev, groupInfo.notice]);
  };

  const addNewGroup = async (event) => {
    event.preventDefault();
    const docRef = doc(collection(db, "CreateCampingGroup"));
    await setDoc(docRef, groupInfo);

    setGroupID(docRef.id);
    setClickConfirm(true);
  };

  const setUpGroup = async () => {
    // group
    console.log(upload);
    const storage = getStorage();
    const imageRef = ref(storage, upload.file.name);
    uploadBytes(imageRef, upload.file)
      .then(() => {
        getDownloadURL(imageRef)
          .then((url) => {
            console.log(url);
            setUpLoadFile((prevState) => ({ ...prevState, url: url }));
          })
          .catch((error) => {
            console.log(error.message, "error getting the img url");
          });
        setUpLoadFile((prevState) => ({ ...prevState, file: "" }));
      })
      .catch((error) => {
        console.log(error.message);
      });

    //tent
    const docRefTent = await doc(
      db,
      "CreateCampingGroup",
      groupId,
      "tent",
      groupId
    );
    setDoc(docRefTent, tentInfo);
    updateDoc(doc(db, "CreateCampingGroup", groupId, "tent", groupId), {
      tent_id: docRefTent.id,
      member: allMemberArr,
    });
    console.log(tentInfo);
    //supplies
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
    //member
    const docRefMember = await doc(
      db,
      "CreateCampingGroup",
      groupId,
      "member",
      groupId
    );
    setDoc(docRefMember, {
      role: "header",
      member_name: userName,
      member_id: userId,
    });

    alert("已成功建立");
    // navigate("/");
  };

  useEffect(() => {
    const test = {
      group_id: groupId,
      header_id: userId,
      header_name: userName,
      start_date: startDate,
      end_date: endDate,
      meeting_time: time,
      position: state.address,
      city: state.city,
      picture: upload.url,
      detail_picture: upload.detail_picture,
      privacy: privacyValue,
      notice: addNotice,
    };
    console.log(test);
    if (groupId) {
      updateDoc(doc(db, "CreateCampingGroup", groupId), {
        group_id: groupId,
        header_id: userId,
        header_name: userName,
        start_date: startDate,
        end_date: endDate,
        meeting_time: time,
        position: state.address,
        city: state.city,
        picture: upload.url,
        detail_picture: upload.detail_picture,
        privacy: privacyValue,
        notice: addNotice,
      });
    }
  }, [upload.url]);

  const addNewTent = async () => {
    setAllMemberArr("");
    setTentArr((prev) => [...prev, 1]);
    const ondocRefNewTent = doc(
      collection(db, "CreateCampingGroup", groupId, "tent")
    );
    await setDoc(ondocRefNewTent, tentInfo);
    updateDoc(
      doc(db, "CreateCampingGroup", groupId, "tent", ondocRefNewTent.id),
      {
        tent_id: ondocRefNewTent.id,
        member: allMemberArr,
      }
    );
  };

  const addSupplies = async () => {
    setSuppliesArr((prev) => [...prev, 1]);
    const ondocRefNewSupplies = doc(
      collection(db, "CreateCampingGroup", groupId, "supplies")
    );
    await setDoc(ondocRefNewSupplies, campSupplies);
    updateDoc(
      doc(
        db,
        "CreateCampingGroup",
        groupId,
        "supplies",
        ondocRefNewSupplies.id
      ),
      {
        supplies_id: ondocRefNewSupplies.id,
      }
    );
  };

  // console.log(alertItemsArr);

  const handleFiles = (e) => {
    setUpLoadFile((prevState) => ({ ...prevState, file: e.target.files[0] }));
    console.log(e.target.files[0].name);
  };

  // console.log(upload.file.name);

  useEffect(() => {
    if (upload) {
    } else {
      return;
    }
  }, [upload]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("SUBMIT", e);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <RockImg src={landingPage04} alt='' />
      <Title>創建你的露營團</Title>
      {/* <CreateLabel>露營團名稱</CreateLabel> */}
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
        // helperText='Incorrect entry.'
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
        {privacyValue == "私人" && (
          <TextField
            sx={{ width: "100%", marginLeft: "20px", marginBottom: "30px" }}
            size='small'
            required
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
          {/* <PriviewImgWrap>
              {upload.url && <PriviewImg src={upload.url}></PriviewImg>}
            </PriviewImgWrap> */}
        </Cloumn>
      </Display>
      <Button width='100%' onClick={addNewGroup} mt='40px'>
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
            <TextField
              sx={{
                width: "100%",
                marginRight: "20px",
                marginBottom: "50px",
                marginTop: "20px",
              }}
              required
              label='注意事項'
              size='small'
              name='notice'
              // value={groupInfo.notice}
              onChange={handleChange}></TextField>
            {alertItemsArr.map((_, index) => (
              <TextField
                key={index}
                sx={{
                  width: "100%",
                  marginRight: "20px",
                  marginBottom: "50px",
                  marginTop: "20px",
                }}
                required
                label='注意事項'
                size='small'
                name='notice'
                // value={groupInfo.notice}
                onChange={handleChange}></TextField>
            ))}
            <AddAlertItems onClick={AddNotice}>新增事項</AddAlertItems>

            <CreateLabel>添加露營團標籤</CreateLabel>
            <MultipleSelectChip path={path} groupId={groupId} />
            {/* <CreateLabel>營區網站</CreateLabel>
              <Input
                name='site'
                value={groupInfo.site}
                onChange={handleChange}></Input> */}
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
              <CreateLabel>新增帳篷</CreateLabel>
              <Display justifyContent='start' m=' 30px 0px 30px 0px'>
                <Tent
                  setTentInfo={setTentInfo}
                  tentInfo={tentInfo}
                  setAllMemberArr={setAllMemberArr}
                  allMemberArr={allMemberArr}
                />
                {tentArr.map((_, index) => (
                  <div key={index}>
                    <Tent
                      setTentInfo={setTentInfo}
                      tentInfo={tentInfo}
                      setAllMemberArr={setAllMemberArr}
                      allMemberArr={allMemberArr}
                    />
                  </div>
                ))}
              </Display>
              <AddButton onClick={addNewTent}>新增</AddButton>
            </TentWrap>
            <SuppliesWrap>
              <CreateLabel>新增需要團員們認領的物品</CreateLabel>
              <Cloumn>
                <Display>
                  <CampSupplies
                    setCampSupplies={setCampSupplies}
                    campSupplies={campSupplies}
                  />
                  {suppliesArr.map((_, index) => (
                    <div key={index}>
                      <CampSupplies
                        setCampSupplies={setCampSupplies}
                        campSupplies={campSupplies}
                      />
                    </div>
                  ))}
                </Display>
                <AddButton onClick={addSupplies}>新增</AddButton>
              </Cloumn>
            </SuppliesWrap>
            <Display>
              <Multiple setUpLoadFile={setUpLoadFile} />
            </Display>
            <Button width='100%' mt='60px' onClick={setUpGroup}>
              建立露營團
            </Button>
          </Cloumn>
        </SecondSection>
      )}
      {/* <Button width='20%' type='submit' variant='outlined'>
          Validate
        </Button> */}
    </Form>
  );
}

export default CreateGroup;
