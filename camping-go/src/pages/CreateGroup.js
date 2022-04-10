import styled from "styled-components";
import React, { useState, useRef, useEffect } from "react";
import {
  DatePicker,
  Uploader,
  DateRangePicker,
  InputGroup,
  InputNumber,
} from "rsuite";
import Tent from "../component/Tent";
import CampSupplies from "../component/CampSupplies";

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

function CreateGroup(params) {
  const [groupInfo, setGroupInfo] = useState({
    status: "進行中",
    group_header: "12345",
    header_name: "",
    privacy: "",
    password: "",
    group_title: "",
    site: "",
    date: "",
    position: "詳細地址",
    city: "",
    meeting_time: "12:00PM",
    max_member_number: 0,
    current_number: 0,
    announcement: "",
    notice: ["營區提供租借帳篷", "自行準備晚餐/隔天早餐"],
    id: "",
  });

  const [dateValue, setDateValue] = useState([
    new Date("2022-04-01"),
    new Date("2022-04-03"),
  ]);
  const [timeValue, setTimeValue] = useState(new Date());
  console.log(timeValue);

  useEffect(() => {
    let startDate = dateValue[0].toLocaleString("zh-tw");
    let endDate = dateValue[1].toLocaleString("zh-tw");
    startDate = startDate.split(" ")[0];
    endDate = endDate.split(" ")[0];
    console.log(startDate);
    console.log(endDate);
    setGroupInfo((prevState) => ({
      ...prevState,
      date: `${startDate}~ ${endDate}`,
    }));
  }, [dateValue]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGroupInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  
  const handleTimeChange = ((date)=>{
    setTimeValue(date)
  })

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
  const TimeDatePicker = () => (
    <div>
      <DatePicker
        format='hh:mm aa'
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

  // console.log(groupInfo.date);

  const Upload = () => {
    return (
      <Uploader action='//jsonplaceholder.typicode.com/posts/' draggable>
        <div style={styles}>Click or Drag files to this area to upload</div>
      </Uploader>
    );
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
      <CampDate />
      <br />
      <Label>地點</Label>
      <Input
        name='position'
        value={groupInfo.position}
        onChange={handleChange}></Input>
      <br />
      <Label>集合時間</Label>
      <TimeDatePicker />
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
      <CampSupplies />
    </Wrap>
  );
}

export default CreateGroup;
