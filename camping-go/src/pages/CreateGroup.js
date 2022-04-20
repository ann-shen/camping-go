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
import { TextField, Box } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import GoogleMapBasic from "../component/GoogleMapBasic";

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  margin: 200px;
`;
const Label = styled.label`
  font-size: 16px;
  margin-left: 20px;
`;
const Input = styled.input`
  font-size: 16px;
  width: 150px;
  height: 30px;
  margin: 20px;
  margin-top: 10px;
`;
const Select = styled.select`
  width: 150px;
  height: 30px;
  margin: 20px;
  margin-top: 10px;
`;
const AddButton = styled.button`
  width: 150px;
`;
const CalendarWrap = styled.div`
  width: 250px;
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
          label='Date&Time picker'
          value={value}
          onChange={handleChange}
          renderInput={(params) => <TextField {...params} />}
        />
      </Stack>
    </LocalizationProvider>
  );
}

function CreateGroup({
  userId,
  setUserName,
  userName,
  allMemberArr,
  setAllMemberArr,
}) {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [state, setState] = useState({
    address: "",
    city: "",
    area: "",
    state: "",
    zoom: 15,
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
    status: "進行中",
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
    notice: ["營區提供租借帳篷", "自行準備晚餐/隔天早餐"],
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
  const [time, setTime] = useState("");
  const [clickConfirm, setClickConfirm] = useState(false);
  // const [tentMember, setTentMember] = useState([]);
  const [upload, setUpLoadFile] = useState({ file: "", url: "" });

  const navigate = useNavigate();

  useEffect(async () => {
    if (userId) {
      const docRef = doc(db, "joinGroup", userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        // console.log(docSnap.data().info.user_name);
        setUserName(docSnap.data().info.user_name);
      } else {
        console.log("No such document!");
      }
    }
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGroupInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const addNewGroup = async () => {
    const docRef = doc(collection(db, "CreateCampingGroup"));
    await setDoc(docRef, groupInfo);

    setGroupID(docRef.id);
    setClickConfirm(true);
  };

  const setUpGroup = async () => {
    //group
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
    console.log(state.city);
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

  const handleFiles = (e) => {
    setUpLoadFile((prevState) => ({ ...prevState, file: e.target.files[0] }));
    console.log(e.target.files[0]);
  };


  // console.log(arr);

  return (
    <Wrap>
      <Label>名稱</Label>
      <Input
        name='group_title'
        value={groupInfo.group_title}
        onChange={handleChange}></Input>
      <br />
      <Label>封面照片</Label>
      <input type='file' accept='image/*' onChange={handleFiles}></input>
      {/* <Upload /> */}
      <Label>公開狀態</Label>
      <Select name='privacy' onChange={handleChange}>
        <option value='公開'>公開</option>
        <option value='私人'>私人</option>
      </Select>
      <br />
      <br />
      <Label>最多幾人</Label>
      <br />

      <Input
        name='max_member_number'
        value={groupInfo.max_member_number}
        onChange={handleChange}></Input>
      <Label>密碼</Label>
      <Input
        name='password'
        value={groupInfo.password}
        onChange={handleChange}></Input>
      <button onClick={addNewGroup}>確認</button>
      {clickConfirm && (
        <div>
          <Label>營區網站</Label>
          <br />
          <Input
            name='site'
            value={groupInfo.site}
            onChange={handleChange}></Input>
          <br />
          <Label>時間</Label>
          <Calander
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            startDate={startDate}
            endDate={endDate}
          />
          <br />
          {/* <Label>縣市</Label>
          <Input
            name='city'
            value={groupInfo.city}
            onChange={handleChange}></Input> */}

          <GoogleMapBasic setState={setState} state={state} />
          <br />
          <br />
          <br />

          <Label>集合時間</Label>
          <br />
          <br />
          <MaterialUIPickers setTime={setTime} />

          <br />
          <Label>公告</Label>
          <br />
          <Input
            maxlength='150'
            name='announcement'
            value={groupInfo.announcement}
            onChange={handleChange}></Input>
          <br />
          <Label>注意事項</Label>
          <br />
          <Input
            maxlength='150'
            name='notice'
            value={groupInfo.notice}
            onChange={handleChange}></Input>
          <br />
          <Box
            sx={{
              width: "100%",
              height: "auto",
              "&:hover": {
                border: 1,
                opacity: [0.9, 0.8, 0.7],
              },
              boxShadow: 3,
              overflow: "hidden",
              borderRadius: 6,
              padding: 3,
              margin: 2,
            }}>
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
            <AddButton onClick={addNewTent}>新增</AddButton>
          </Box>
          <br />
          <Box
            sx={{
              width: "100%",
              height: "auto",
              "&:hover": {
                border: 1,
                opacity: [0.9, 0.8, 0.7],
              },
              boxShadow: 3,
              overflow: "hidden",
              borderRadius: 6,
              padding: 3,
              margin: 2,
            }}>
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
            <AddButton onClick={addSupplies}>新增物品</AddButton>
          </Box>
          <br />
          <br />
          <AddButton onClick={setUpGroup}>建立露營團</AddButton>
        </div>
      )}
    </Wrap>
  );
}

export default CreateGroup;
