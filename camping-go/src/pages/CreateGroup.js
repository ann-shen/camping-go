import styled from "styled-components";
import { db } from "../utils/firebase";
import { setDoc, doc, collection, updateDoc, getDoc } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import Tent from "../component/Tent";
import CampSupplies from "../component/CampSupplies";
import { DateRange } from "react-date-range";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  margin: 200px;
`;

const Label = styled.label`
  font-size: 16px;
  margin-left: 30px;
`;
const Input = styled.input`
  font-size: 16px;
  width: 150px;
  height: 30px;
  margin: 20px;
`;

const Select = styled.select`
  width: 150px;
`;

const AddButton = styled.button`
  width: 150px;
`;

const CalendarWrap = styled.div`
  width: 250px;
`;


//calnader
  function Calander({ setEndDate ,setStartDate,startDate,endDate}) {
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
  function MaterialUIPickers() {
    const [value, setValue] = React.useState(new Date("2014-08-18T21:11:54"));

    const handleChange = (newValue) => {
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

function CreateGroup({ userId }) {
  // console.log(userId);
  const [userName, setUserName] = useState("");
  const [groupID, setGroupID] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [groupInfo, setGroupInfo] = useState({
    header_id: userId,
    header_name: "",
    status: "進行中",
    privacy: "",
    password: "",
    group_title: "",
    site: "",
    start_date: "",
    end_date:"",
    position: "",
    city: "",
    meeting_time: "",
    max_member_number: 0,
    current_number: 1,
    announcement: "",
    notice: ["營區提供租借帳篷", "自行準備晚餐/隔天早餐"],
  });
  const [campSupplies, setCampSupplies] = useState({
    bring_person: "",
    note: "",
    supplies: "",
  });

  console.log(campSupplies);

  const [tentInfo, setTentInfo] = useState({
    current_number: 0,
    max_number: 0,
    member: [],
  });
  console.log(tentInfo);

  useEffect(async () => {
    if (userId) {
      const docRef = doc(db, "joinGroup", userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log(docSnap.data().info.user_name);
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

  // console.log(groupInfo.meeting_time);

  const setUpGroup = async () => {
    //group
    const docRef = doc(collection(db, "CreateCampingGroup"));
    await setDoc(docRef, groupInfo);
    updateDoc(doc(db, "CreateCampingGroup", docRef.id), {
      group_id: docRef.id,
      header_id: userId,
      header_name: userName,
      start_date: startDate,
      end_date: endDate,
    });
    //tent
    const docRefTent = await doc(
      db,
      "CreateCampingGroup",
      docRef.id,
      "tent",
      docRef.id
    );
    setDoc(docRefTent, tentInfo);

    //supplies
    const docRefObject = await doc(
      db,
      "CreateCampingGroup",
      docRef.id,
      "supplies",
      docRef.id
    );
    setDoc(docRefObject, campSupplies);
    //member
    const docRefMember = await doc(
      db,
      "CreateCampingGroup",
      docRef.id,
      "member",
      docRef.id
    );
    setDoc(docRefMember, {
      role: "header",
      member_name: userName,
      member_id: userId,
    });
    alert("已成功建立");
  };

  return (
    <Wrap>
      <Label>名稱</Label>
      <Input
        name='group_title'
        value={groupInfo.group_title}
        onChange={handleChange}></Input>
      <br />
      <Label>封面照片</Label>
      {/* <Upload /> */}
      <Label>公開狀態</Label>
      <Select name='privacy' onChange={handleChange}>
        <option value='公開'>公開</option>
        <option value='私人'>私人</option>
      </Select>
      <br />
      <Label>密碼</Label>
      <Input
        name='password'
        value={groupInfo.password}
        onChange={handleChange}></Input>
      <Label>營區網站</Label>
      <Input name='site' value={groupInfo.site} onChange={handleChange}></Input>
      <br />
      <Label>時間</Label>
      <Calander
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        startDate={startDate}
        endDate={endDate}
      />
      <br />
      <Label>縣市</Label>
      <Input name='city' value={groupInfo.city} onChange={handleChange}></Input>
      <Label>地點</Label>
      <Input
        name='position'
        value={groupInfo.position}
        onChange={handleChange}></Input>
      <br />
      <Label>集合時間</Label>
      <br />
      <MaterialUIPickers />
      <br />
      <Label>最多幾人</Label>
      <Input
        name='max_member_number'
        value={groupInfo.max_member_number}
        onChange={handleChange}></Input>
      <br />
      <Label>公告</Label>
      <Input
        maxlength='150'
        name='announcement'
        value={groupInfo.announcement}
        onChange={handleChange}></Input>
      <Label>注意事項</Label>
      <Input
        maxlength='150'
        name='notice'
        value={groupInfo.notice}
        onChange={handleChange}></Input>
      <br />
      <Tent setTentInfo={setTentInfo} tentInfo={tentInfo} />
      <br />
      <CampSupplies setCampSupplies={setCampSupplies} campSupplies={campSupplies} />
      <AddButton onClick={setUpGroup}>建立露營團</AddButton>
    </Wrap>
  );
}

export default CreateGroup;
