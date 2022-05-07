import styled from "styled-components";
import logo from "../image/logo.png";
import { Link } from "react-router-dom";
import { Label, AddButton, Font, Img, Display, Button } from "../css/style";

const Nav = styled.div`
  background-color: #cfc781;
  height: 80px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const LogoImg = styled.img`
  width: 270px;
  margin-left: 50px;
  margin-top: 5px;
`;

const ALink = styled(Link)`
  color: #797659;
  text-decoration: none;
  font-size: 16px;
  margin-right: 50px;
`;

//sf
function Header({ ContextByUserId }) {
  return (
    <div>
      <Nav>
        <ALink to={"/"}>
          <LogoImg src={logo}></LogoImg>
        </ALink>
        <Display>
          <ALink to={`/profile/${ContextByUserId}`}>我的露營趴</ALink>
          <ALink to={`/login`}>登入</ALink>
          {/* <ALink to={`/personal_header/${ContextByUserId}`}>開團歷史紀錄</ALink> */}
        </Display>
      </Nav>
    </div>
  );
}

export default Header;
