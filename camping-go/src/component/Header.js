import styled, { keyframes } from "styled-components";
import logo from "../image/logo.png";
import { Link } from "react-router-dom";
import { Display } from "../css/style";
import useMediaQuery from "@mui/material/useMediaQuery";
import DensityMediumIcon from "@mui/icons-material/DensityMedium";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut, getAuth } from "firebase/auth";
import logoColor from "../image/logoColor2.png";

const Nav = styled.div`
  background-color: #cfc781;
  height: 80px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 15px;

  z-index: 10;
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


const MobileNavFont = styled.p`
  letter-spacing: 2px;
  margin-bottom: 20px;
  font-size: 16px;
  border-bottom: 1px solid white;
  padding-bottom: 20px;
  color: rgb(66, 103, 101);
  cursor: pointer;
  &:hover {
    color: white;
  }
`;


const fadeIn = keyframes`
from {
  opacity: 0;
  transform: translateX(300px)  ;
}
to {
  opacity: 1;
  transform: translateX(0px) ;
}
`;



const SideNavBarWrap = styled.div`
  width: 200px;
  height: 100vh;
  padding:20px;
  padding-top: 100px;
  background-color: #eae5be;
  position: fixed;
  top: 0px;
  right: 0px;
  animation: ${fadeIn} 500ms ease-in-out;
  z-index: 4;
  @media (max-width: 450px) {
    width: 55%;
  }
`;

const ToggleWrap = styled.div`
  height: 100vh;
  display: flex;
  justify-content: end;
  margin-top: 8px;
  position: absolute;
  top: 30px;
  right: 30px;
  z-index: 5;
  cursor: pointer;
`;

const MobileLinkRoute = styled(Link)`
  text-decoration: none;
  font-size: 14px;
`;

const backgeoundFadeIn = keyframes`
from {
  opacity: 0;
  transform: translateX(-300px)  ;
}
to {
  opacity: 0.7;
  transform: translateX(0px) ;
}
`;

const BackdropBcakGround = styled.div`
  width: 98vw;
  height: 360vh;
  background-color: rgb(13 37 37);
  opacity: 0.7;
  position: absolute;
  top: 0px;
  left: 0px;
  animation: ${backgeoundFadeIn} 500ms ease-in-out;
  z-index: 3;
`;

function Header({ ContextByUserId }) {
  const matches = useMediaQuery("(max-width:766px)");
  const [navbar, setNavbar] = useState(false);
  const auth = getAuth();
  const navigate = useNavigate();

  function getLogout() {
    signOut(auth)
      .then(() => {})
      .catch((error) => {});
    navigate("/login");
  }

  return (
    <>
      {!matches && (
        <Nav>
          <ALink to={"/"}>
            <LogoImg src={logo}></LogoImg>
          </ALink>
          <Display>
            <ALink to={`/create_group`}>建立露營團</ALink>
            {!ContextByUserId && <ALink to={`/login`}>登入</ALink>}
            <ALink to={`/profile/${ContextByUserId.userId}`}>我的露營團</ALink>
          </Display>
        </Nav>
      )}
      {matches && (
        <>
          <ALink to={"/"}>
            <LogoImg src={logoColor}></LogoImg>
          </ALink>
          <ToggleWrap>
            <DensityMediumIcon
              sx={{ marginLeft: "30px", color: "#CFC781" }}
              onClick={() => {
                setNavbar(!navbar);
              }}
            />
          </ToggleWrap>
          {navbar && (
            <>
              <BackdropBcakGround
                onClick={() => {
                  setNavbar(!navbar);
                }}></BackdropBcakGround>
              <SideNavBarWrap>
                <MobileLinkRoute to={`/create_group`}>
                  <MobileNavFont>建立露營團</MobileNavFont>
                </MobileLinkRoute>
                <MobileLinkRoute to={`/profile/${ContextByUserId.userId}`}>
                  <MobileNavFont>我的露營團</MobileNavFont>
                </MobileLinkRoute>
                <MobileLinkRoute to={`/login`}>
                  <MobileNavFont onClick={getLogout}>登出</MobileNavFont>
                </MobileLinkRoute>
              </SideNavBarWrap>
            </>
          )}
        </>
      )}
    </>
  );
}

export default Header;
