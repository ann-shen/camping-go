import styled from "styled-components";
import logo from "../image/logo.png";
import { Link } from "react-router-dom";

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
  font-size: 20px;
  margin-right: 50px;
`;

//sf
function Header({ homePageCampGroup }) {
  return (
    <div>
      <Nav>
        <ALink to={"/"}>
          <LogoImg src={logo}></LogoImg>
        </ALink>
        <ALink to={`/profile/${homePageCampGroup.header_id}`}>我的露營趴</ALink>
      </Nav>
    </div>
  );
}

export default Header;
