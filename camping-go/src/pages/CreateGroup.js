import styled from "styled-components";
import React from "react";
import { DatePicker, Uploader, DateRangePicker,InputGroup,InputNumber } from "rsuite";
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
  const Date = () => {
    return (
      <div>
        <DateRangePicker />
      </div>
    );
  };
  const DatePickerInstance = (props) => {
    return (
      <div className='field'>
        <DatePicker format='HH:mm' ranges={[]} style={{ width: 260 }} />
      </div>
    );
  };

  const styles = {
    width:"500px",
    lineHeight: "200px",
  };

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
      <Input></Input>
      <br />
      <Label>封面照片</Label>
      <Upload />
      <Label>公開狀態</Label>
      <Select>
        <option value=''>公開</option>
        <option value=''>私人</option>
      </Select>
      <br />
      <Label>密碼</Label>
      <Input></Input>
      <Label>營區網站</Label>
      <Input></Input>
      <br />
      <Label>時間</Label>
      <Date />
      <br />
      <Label>地點</Label>
      <Input></Input>
      <br />
      <Label>集合時間</Label>
      <DatePickerInstance />
      <br />
      <Label>最多幾人</Label>
      <DatePickerInstance />
      <br />
      <Label>公告</Label>
      <Input maxlength='150'></Input>
      <Label>注意事項</Label>
      <Input maxlength='150'></Input>
      <br />
      <Tent />
      <br/>
      <CampSupplies />
    </Wrap>
  );
}

export default CreateGroup;
