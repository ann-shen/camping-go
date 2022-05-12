import styled from "styled-components";
import { Display, Cloumn, Button, Wrap, Img, Font } from "../css/style";

const FooterWrap = styled.div`
  width: 100%;
  height: 50px;
  background-color: #eae5be;
  padding-top: 25px;
  margin-top: 130px;
`;
function Footer() {
  return (
    <FooterWrap>
      <Font fontSize="14px">© 2022 Camping GO by Ann Shen</Font>
    </FooterWrap>
  );
}

export default Footer;
