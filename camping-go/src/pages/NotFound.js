import initial from "../image/initial-09.png";
import styled from "styled-components";
import { Font, Img, Button, Hr, BoxWrap, Cloumn } from "../css/style";

const NotFoundWrap = styled.div`
width:80%;
margin:100px auto;
display:flex;
flex-direction: column;
align-items:center;`

function NotFound() {
  return (
    <NotFoundWrap>
      <Font>糟糕！Camping GO 似乎無法找到你要找的頁面</Font>
      <br />
      <Img src={initial} width='300px' ></Img>
    </NotFoundWrap>
  );
}

export default NotFound;
