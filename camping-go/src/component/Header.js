import styled from "styled-components";
import logo from "../image/logo.png";
import { Link } from "react-router-dom";
import { Display } from "../css/style";

const Nav = styled.div`
  background-color: #cfc781;
  height: 80px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 15px;

  z-index: 99;
  margin-top: -20px;
  margin-bottom: 40px;
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
    <Nav>
      <ALink to={"/"}>
        <LogoImg src={logo}></LogoImg>
      </ALink>
      <Display>
        <ALink to={`/create_group`}>建立露營團</ALink>
        {!ContextByUserId && <ALink to={`/login`}>登入</ALink>}
        <ALink to={`/profile/${ContextByUserId.userId}`}>我的露營團</ALink>
        {/* <ALink to={`/personal_header/${ContextByUserId}`}>開團歷史紀錄</ALink> */}
      </Display>
    </Nav>

  );
}

export default Header;
