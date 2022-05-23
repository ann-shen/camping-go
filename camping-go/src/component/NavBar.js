import styled, { keyframes } from "styled-components";
import Alert from "../component/Alert";
import AddIcon from "@mui/icons-material/Add";
import { Img } from "../css/style";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logoColor from "../image/logoColor2.png";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { useNavigate } from "react-router-dom";
import DensityMediumIcon from "@mui/icons-material/DensityMedium";
import useMediaQuery from "@mui/material/useMediaQuery";
import { signOut, getAuth } from "firebase/auth";

const LinkRoute = styled(Link)`
  text-decoration: none;
  margin: 5px 5px;
  font-size: 14px;
  color: gray;
  margin-left: ${(props) => props.ml || "10%"};
  display: flex;

  @media (max-width: 1080px) {
    margin-left: 8%;
    color: red;
    display: flex;
  }
`;
const NavFont = styled.p`
  letter-spacing: 2px;
  margin: 0px 0px -10px 0px;
  font-size: 16px;
  &:hover {
    color: #426765;
  }
  @media (max-width: 776px) {
    display: none;
  }
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

const NavFontSetGroup = styled.p`
  letter-spacing: 2px;
  margin: 0px 0px -10px 45px;
  font-size: 16px;
  &:hover {
    color: #426765;
  }
`;

const LogoImgWrap = styled.div`
  display: flex;
  width: 100%;
  margin: 25px 60px;
  z-index: 6;
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

const NavWrap = styled.div`
  width: 70%;
  display: flex;

  justify-content: end;
  margin-top: 5px;
  @media (max-width: 1080px) {
    width: 65%;
  }
  @media (max-width: 1024px) {
    width: 55%;
  }
`;

const SideNavBarWrap = styled.div`
  width: 200px;
  height: 100vh;
  padding-top: 100px;
  background-color: #eae5be;
  position: absolute;
  top: 0px;
  right: 0px;
  animation: ${fadeIn} 500ms ease-in-out;
  @media (max-width: 450px) {
    width: 55%;
  }
`;

const ToggleWrap = styled.div`
  display: flex;
  justify-content: end;
  margin-top: 8px;
  z-index: 99;
  position: absolute;
  top: 30px;
  right: 30px;
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
  width: 100vw;
  height: 100vh;
  background-color: rgb(13 37 37);
  opacity: 0.7;
  position: absolute;
  top: 0px;
  left: 0px;
  animation: ${backgeoundFadeIn} 500ms ease-in-out;
`;

function NavBar({ userId }) {
  const [navFontColor, setnavFontColor] = useState("gray");
  const [navColor, setnavColor] = useState("transparent");
  const [navSize, setnavSize] = useState("6rem");
  const [navbar, setNavbar] = useState(false);
  const navigate = useNavigate();
  const listenScrollEvent = () => {
    window.scrollY > 10 ? setnavColor("#426765") : setnavColor("transparent");
    window.scrollY > 10 ? setnavSize("5.5rem") : setnavSize("7rem");
    window.scrollY > 10 ? setnavFontColor("#F4F4EE") : setnavFontColor("gray");
  };
  const matches = useMediaQuery("(max-width:766px)");
  const auth = getAuth();

  useEffect(() => {
    window.addEventListener("scroll", listenScrollEvent);
    return () => {
      window.removeEventListener("scroll", listenScrollEvent);
    };
  }, []);

  const swalAlert = () => {
    Swal.fire({
      text: "尚未登入",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#426765",
      cancelButtonColor: "#EAE5BE",
      confirmButtonText: "前往登入",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/login");
      }
    });
  };

  function getLogout() {
    signOut(auth)
      .then(() => {})
      .catch((error) => {});
    navigate("/login");
  }

  return (
    <nav
      style={{
        backgroundColor: navColor,
        height: navSize,
        transition: "all 1s",
        position: "fixed",
        zIndex: "99",
        width: "100%",
      }}>
      <LogoImgWrap>
        <a href='/'>
          <Img
            src={logoColor}
            width='240px'
            height='50px'
            mb='20px'
            m='-10px 0px 0px 0px'></Img>
        </a>

        {userId ? (
          <>
            <NavWrap>
              <LinkRoute to={`/create_group`}>
                <NavFont>
                  <AddIcon
                    sx={{
                      marginTop: "-5px",
                      color: "#CFC781",
                      fontSize: "35px",
                    }}></AddIcon>
                </NavFont>
                <NavFont style={{ color: navFontColor }}>建立露營團</NavFont>
              </LinkRoute>
              <LinkRoute to={`/profile/${userId}`}>
                <NavFont style={{ color: navFontColor }}>我的露營團</NavFont>
              </LinkRoute>
              <NavFont>
                <Alert userId={userId}></Alert>
              </NavFont>
            </NavWrap>
            {matches && (
              <>
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
                      <MobileLinkRoute to={`/profile/${userId}`}>
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
        ) : (
          <>
            <NavWrap>
              {!matches && (
                <>
                  <LinkRoute to={`/`} onClick={swalAlert}>
                    <NavFont>
                      <AddIcon
                        sx={{
                          marginTop: "-5px",
                          color: "#CFC781",
                          fontSize: "35px",
                        }}></AddIcon>
                    </NavFont>
                    <NavFont style={{ color: navFontColor }}>
                      建立露營團
                    </NavFont>
                  </LinkRoute>
                  <LinkRoute to={`/`} onClick={swalAlert}>
                    <NavFont style={{ color: navFontColor }}>
                      我的露營團
                    </NavFont>
                  </LinkRoute>
                  <LinkRoute to={`/login`} ml='1%'>
                    <NavFontSetGroup style={{ color: navFontColor }}>
                      <NavFont>登入</NavFont>
                    </NavFontSetGroup>
                  </LinkRoute>
                </>
              )}
            </NavWrap>
            {matches && (
              <>
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
                      <MobileLinkRoute to={`/`} onClick={swalAlert}>
                        <MobileNavFont>建立露營團</MobileNavFont>
                      </MobileLinkRoute>
                      <MobileLinkRoute to={`/`} onClick={swalAlert}>
                        <MobileNavFont>我的露營團</MobileNavFont>
                      </MobileLinkRoute>
                      <MobileLinkRoute to={`/login`}>
                        <MobileNavFont>登入</MobileNavFont>
                      </MobileLinkRoute>
                    </SideNavBarWrap>
                  </>
                )}
              </>
            )}
          </>
        )}
      </LogoImgWrap>
    </nav>
  );
}

export default NavBar;
