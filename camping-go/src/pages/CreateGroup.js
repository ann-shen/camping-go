import styled from "styled-components";
import { db } from "../utils/firebase";
import { setDoc, doc, collection, updateDoc, getDoc } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import {
  DatePicker,
  Uploader,
  DateRangePicker,
} from "rsuite";
import Tent from "../component/Tent";
import CampSupplies from "../component/CampSupplies";
import { DateRange } from "react-date-range";


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

function CreateGroup({ userId }) {
  console.log(userId);
  const [userName, setUserName] = useState("");

  useEffect(async () => {
    if(userId){
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

  const [groupInfo, setGroupInfo] = useState({
    header_id: userId,
    header_name: "",
    status: "進行中",
    privacy: "",
    password: "",
    group_title: "",
    site: "",
    date: "",
    position: "",
    city: "",
    meeting_time: "",
    max_member_number: 0,
    current_number: 1,
    announcement: "",
    notice: ["營區提供租借帳篷", "自行準備晚餐/隔天早餐"],
  });
  const [dateValue, setDateValue] = useState([
    new Date("2022-04-01"),
    new Date("2022-04-03"),
  ]);
  const [timeValue, setTimeValue] = useState(new Date());
  //calnader
  
  function MyComponent() {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
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
      <DateRange
        ranges={[selectionRange]}
        onChange={handleSelect}
        moveRangeOnFirstSelection={false}
      />
    );
  }

  useEffect(() => {
    let startDate = dateValue[0].toLocaleString("zh-tw");
    let endDate = dateValue[1].toLocaleString("zh-tw");
    startDate = startDate.split(" ")[0];
    endDate = endDate.split(" ")[0];
    setGroupInfo((prevState) => ({
      ...prevState,
      date: `${startDate}~ ${endDate}`,
    }));
  }, [dateValue]);

  useEffect(() => {
    let time = timeValue.toLocaleString("zh-tw");
    time = time.split(" ")[1];
    setGroupInfo((prevState) => ({
      ...prevState,
      meeting_time: time,
    }));
  }, [timeValue]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGroupInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleTimeChange = (date) => {
    setTimeValue(date);
  };

  const CampDate = () => {
    return (
      <div>
        <DateRangePicker value={dateValue} onChange={setDateValue} />
      </div>
    );
  };
  const ranges = [
    {
      label: "Now",
      value: new Date(),
    },
  ];
  const App = () => (
    <div>
      <DatePicker
        format='hh:mm'
        onChange={handleTimeChange}
        showMeridian
        ranges={ranges}
        style={{ width: 260 }}
      />
    </div>
  );

  const styles = {
    width: "500px",
    lineHeight: "200px",
  };

  const Upload = () => {
    return (
      <Uploader action='//jsonplaceholder.typicode.com/posts/' draggable>
        <div style={styles}>Click or Drag files to this area to upload</div>
      </Uploader>
    );
  };
  console.log(groupInfo.meeting_time);

  const setUpGroup = async () => {
    //group
    const docRef = doc(collection(db, "CreateCampingGroup"));
    await setDoc(docRef, groupInfo);
    updateDoc(doc(db, "CreateCampingGroup", docRef.id), {
      group_id: docRef.id,
      header_name: userName,
    });

    //tent
    const docRefTent = await doc(
      db,
      "CreateCampingGroup",
      docRef.id,
      "tent",
      docRef.id
    );
    setDoc(docRefTent, {
      member: ["ann", "shen"],
      max_number: 4,
      current_number: 2,
    });

    //object
    const docRefObject = await doc(
      db,
      "CreateCampingGroup",
      docRef.id,
      "object",
      docRef.id
    );
    setDoc(docRefObject, {
      object_name: "露營燈",
      note: "記得檢查電池",
      bring_person: "",
    });
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
    alert("已成功建立")
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
      <Upload />
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
      <MyComponent />

      {/* <DateRange
        ranges={[selectionRange]}
        onChange={handleSelect}
        moveRangeOnFirstSelection={false}
      /> */}
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
      <App />
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
      <Tent />
      <br />
      <AddButton onClick={setUpGroup}>建立露營團</AddButton>
    </Wrap>
  );
}

export default CreateGroup;
