import * as React from "react";
import styled from "styled-components";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../utils/userContext";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { db } from "../../utils/firebase";
import {
  getDocs,
  collection,
  query,
  where,
  doc,
  deleteDoc,
} from "firebase/firestore";
import {
  Font,
  Img,
  Display,
  Button,
  Wrap,
  Tag,
  ImgWrap,
  ProfileBox,
} from "../../css/style";
import "../../css/modal.css";
import { Box } from "@mui/material";
import location from "../../image/location.png";
import Swal from "sweetalert2/dist/sweetalert2.js";
import {
  CheckCommentFromMember,
  CheckOfGroupMember,
} from "./YourCreateGroupButton";

const LinkRoute = styled(Link)`
  text-decoration: none;
  margin: 5px 5px;
  font-size: 14px;
  color: gray;
`;

function YourCreateGroup() {
  let params = useParams();
  const [yourCreateGroup, setYourCreateGroup] = useState([]);
  const [renderParticipateArr, setRenderParticipateArr] = useState(false);
  const Context = useContext(UserContext);

  useEffect(async () => {
    const q = query(
      collection(db, "CreateCampingGroup"),
      where("header_id", "==", params.id)
    );
    const querySnapshot = await getDocs(q);
    let Arr = [];
    querySnapshot.forEach((doc) => {
      Arr.push(doc.data());
    });
    setYourCreateGroup(Arr);
  }, []);

  const deleteThisGroup = async (id) => {
    console.log(id);
    Swal.fire({
      title: "確定要刪除此團？",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#426765",
      cancelButtonColor: "#EAE5BE",
      confirmButtonText: "刪除",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteDoc(doc(db, "CreateCampingGroup", id));
        Swal.fire({
          icon: "success",
          confirmButtonColor: "#426765",
          title: `成功刪除`,
        });
      }
    });
  };

  return (
    <>
      {yourCreateGroup.map((item, index) => (
        <Box key={index} sx={ProfileBox}>
          <Display justifyContent='space-between' ml='20px'>
            <LinkRoute to={`/joinGroup/${item.group_id}`}>
              <Display direction='column' alignItems='start'>
                <Display alignItems='start'>
                  <ImgWrap>
                    <Img src={item.picture} width='100%' m='0px'></Img>
                  </ImgWrap>
                  <Display direction='column' alignItems='start' ml='30px'>
                    <Tag bgc='#CFC781' color='white'>
                      {item.status}
                    </Tag>
                    <Font
                      fontSize='25px'
                      letterSpacing='3px'
                      m='10px 0px 0px 0px'>
                      {item.group_title}
                    </Font>
                    <Font fontSize='14px' m='0px 0px 15px 0px'>
                      {
                        new Date(item.start_date.seconds * 1000)
                          .toLocaleString()
                          .split(" ")[0]
                      }
                      ~
                      {
                        new Date(item.end_date.seconds * 1000)
                          .toLocaleString()
                          .split(" ")[0]
                      }
                    </Font>
                    <Display>
                      <Img
                        src={location}
                        width='20px'
                        m=' 0px 8px 0px -3px '></Img>
                      <Font fontSize='16px'>{item.city}</Font>
                    </Display>
                  </Display>
                </Display>
                <Display alignItems='center'></Display>
              </Display>
            </LinkRoute>
            {Context.userId == params.id && (
              <Wrap
                direction='column'
                alignItems='end'
                height='250px'
                justifyContent='space-evenly'
                m='20px'>
                {item.status == "已結束" && (
                  <CheckCommentFromMember groupId={item.group_id} />
                )}
                <CheckOfGroupMember
                  setRenderParticipateArr={setRenderParticipateArr}
                  groupId={item.group_id}
                  userId={Context.userId}
                  group_title={item.group_title}
                  userName={Context.userName}
                />
                <Button
                  border='#CFC781'
                  bgc='#FFFEF4'
                  width='150px'
                  onClick={(id) => {
                    deleteThisGroup(item.group_id);
                  }}>
                  刪除此團
                </Button>
              </Wrap>
            )}
          </Display>
        </Box>
      ))}
    </>
  );
}

export default YourCreateGroup;
