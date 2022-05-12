import styled from "styled-components";
import Alert from "../component/Alert";
import AddIcon from "@mui/icons-material/Add";
import { Img } from "../css/style";
import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import logoColor from "../image/logoColor2.png";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const LinkRoute = styled(Link)`
  text-decoration: none;
  margin: 5px 5px;
  font-size: 14px;
  color: gray;
  margin-left: ${(props) => props.ml || "53%"};
  display: flex;
`;
const NavFont = styled.p`
  margin: 0px 0px -10px 0px;
  font-size: 16px;
  &:hover {
    color: #426765;
  }
`;

const NavFontSetGroup = styled.p`
  margin: 0px 0px -10px 25px;
  font-size: 16px;
  &:hover {
    color: #426765;
  }
`;

const LogoImgWrap = styled.div`
  display: flex;
  /* justify-content: start; */
  /* align-items: inherit; */
  width: 100%;
  margin: 25px 60px;
  z-index: 6;
`;

function NavBar({ userId }) {
  const [navFontColor, setnavFontColor] = useState("gray");
  const [navColor, setnavColor] = useState("transparent");
  const [navSize, setnavSize] = useState("6rem");
  const navigate = useNavigate();

  const listenScrollEvent = () => {
    window.scrollY > 10 ? setnavColor("#426765") : setnavColor("transparent");
    window.scrollY > 10 ? setnavSize("5.5rem") : setnavSize("7rem");
    window.scrollY > 10 ? setnavFontColor("#F4F4EE") : setnavFontColor("gray");
  };

  useEffect(() => {
    window.addEventListener("scroll", listenScrollEvent);
    return () => {
      window.removeEventListener("scroll", listenScrollEvent);
    };
  }, []);
  

  const swalAlert = () => {
    console.log("123");
    Swal.fire({
      title: "尚未登入",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#426765",
      cancelButtonColor: "#EAE5BE",
      confirmButtonText: "前往登入",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/login");
        // Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
  };

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
            <LinkRoute to={`/create_group`} ml='45%'>
              <AddIcon sx={{ marginBottom: "-10px" }}></AddIcon>
              <NavFont style={{ color: navFontColor }}>建立露營團</NavFont>
            </LinkRoute>
            <LinkRoute to={`/profile/${userId}`} ml='5%'>
              <NavFont style={{ color: navFontColor }}>我的露營團</NavFont>
            </LinkRoute>
          </>
        ) : (
          <>
            <LinkRoute to={`/`} ml='45%' onClick={swalAlert}>
              <AddIcon sx={{ marginBottom: "-10px" }}></AddIcon>
              <NavFont style={{ color: navFontColor }}>建立露營團</NavFont>
            </LinkRoute>
            <LinkRoute to={`/`} ml='5%' onClick={swalAlert}>
              <NavFont style={{ color: navFontColor }}>我的露營團</NavFont>
            </LinkRoute>
          </>
        )}

        <Alert userId={userId}></Alert>
        {!userId && (
          <LinkRoute to={`/login`} ml='1%'>
            <NavFontSetGroup style={{ color: navFontColor }}>
              登入
            </NavFontSetGroup>
          </LinkRoute>
        )}
      </LogoImgWrap>
    </nav>
  );
}

export default NavBar;
