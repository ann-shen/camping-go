import styled from "styled-components";
import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import {
  Font,
  Img,
  Display,
  Button,
  Wrap,
  Hr,
  Tag,
  ImgWrap,
} from "../../css/style";
import {
  getDocs,
  collection,
  query,
  where,
  doc,
  deleteDoc,
  onSnapshot,
  updateDoc,
  arrayRemove,
  setDoc,
  increment,
  getDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../../utils/firebase";
import "../../css/modal.css";
import { Box } from "@mui/material";
import Swal from "sweetalert2/dist/sweetalert2.js";
import firebase from "../../utils/firebaseConfig";
import Modal from "react-modal";
import { v4 as uuidv4 } from "uuid";

const CheckCommentWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  position: relative;
  padding: 40px 10px;
`;

const DeleteModalButton = styled.button`
  width: 30px;
  height: 30px;
  position: absolute;
  top: 0px;
  right: 10px;
  border: none;
  color: white;
  background-color: #dedab4;
  border-radius: 50%;
  cursor: pointer;
  &:hover {
    color: #cfc781;
    transform: scale(1.2);
    transition: 500ms;
  }
`;

const ScrollWrap = styled.div`
  height: 280px;
  margin-top: 30px;
  overflow: scroll;
  ::-webkit-scrollbar {
    height: 0px;
    width: 6px;
    border-radius: 3px;
    border-left: 6px solid #e6ecf8;
  }
  ::-webkit-scrollbar-thumb {
    background-color: #eae5be;
  }
`;

const ProfileWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
`;

export function CheckCommentFromMember({ groupId }) {
  const [commentIsOpen, setCommentIsOpen] = useState(false);
  const [comment, setComment] = useState([]);
  const [totalScore, setTotalScore] = useState("");

  const checkComment = async () => {
    setCommentIsOpen(true);
    firebase.getCocsFeedback(groupId).then((res) => {
      console.log(res);
      setComment(res);
    });
  };

  useEffect(() => {
    if (comment.length !== 0) {
      let scoreArr = [];
      comment.map((item) => {
        scoreArr.push(Number(item.score));
      });
      let totalScoreNumber = scoreArr.reduce(function (total, e) {
        return total + e;
      }, 0);
      setTotalScore((totalScoreNumber / comment.length).toFixed(1));
    } else {
      return;
    }
  }, [comment]);

  return (
    <div className='App'>
      <Button
        width=' 150px'
        onClick={checkComment}
        setCommentIsOpen={setCommentIsOpen}>
        查看評論
      </Button>
      <Modal
        isOpen={commentIsOpen}
        onRequestClose={() => setCommentIsOpen(false)}
        overlayClassName={{
          base: "overlay-base",
          afterOpen: "overlay-after",
          beforeClose: "overlay-before",
        }}
        className={{
          base: "content-base",
          afterOpen: "content-after",
          beforeClose: "content-before",
        }}
        closeTimeoutMS={500}>
        <CheckCommentWrap>
          <DeleteModalButton onClick={() => setCommentIsOpen(false)}>
            X
          </DeleteModalButton>
          {/* <CommentTitleWrap> */}
          <Font fontSize='20px' letterSpacing='3px'>
            你的評論
          </Font>
          <Hr width='60%'></Hr>
          <Display>
            {totalScore ? (
              <div>
                <Display>
                  <Font fontSize='16px'>總分</Font>
                  <Font fontSize='35px' marginLeft='3px'>
                    {totalScore}
                  </Font>
                </Display>
              </div>
            ) : (
              <Font>尚未有回饋唷！</Font>
            )}
          </Display>
          {totalScore && (
            <ScrollWrap>
              {comment &&
                comment.map((item) => (
                  <Box
                    sx={{
                      width: "600px",
                      height: "auto",
                      padding: 0,
                      margin: 1,
                    }}>
                    <Wrap
                      width='500px'
                      borderBottom='1.4px solid #EAE5BE'
                      paddingBottom='20px'>
                      <Wrap justifyContent='space-around' width='500px'>
                        <Display>
                          <Wrap
                            direction='column'
                            width='100px'
                            m='0px 40px 0px 0px'>
                            <ProfileWrap>
                              <Img src={item.profile_img}></Img>
                            </ProfileWrap>
                            <Font fontSize='14px'>{item.name}</Font>
                          </Wrap>
                          <Wrap width='280px'>
                            <Font fontSize='14px'>{item.note}</Font>
                          </Wrap>
                        </Display>
                        <Font marginLeft='20px'>{item.score}分</Font>
                      </Wrap>
                    </Wrap>
                  </Box>
                ))}
            </ScrollWrap>
          )}
        </CheckCommentWrap>
      </Modal>
    </div>
  );
}

export function CheckOfGroupMember({
  groupId,
  setRenderParticipateArr,
  group_title,
  userName,
}) {
  const [memberIsOpen, setMemberIsOpen] = useState(false);
  const [member, setMember] = useState([]);
  const checkMemberList = async () => {
    setMemberIsOpen(true);
    firebase.getDocsOfSubCollectionMember(groupId).then((res) => {
      const removeHeaderArr = res.filter((e, index) => {
        console.log(e.role);
        return e.role !== "header";
      });
      const getHeaderArr = res.filter((e, index) => {
        return e.role == "header";
      });
      removeHeaderArr.unshift(getHeaderArr[0]);
      setMember(removeHeaderArr);
    });
  };
  const removeMember = async (index, member_id, member_name) => {
    console.log(member_name);
    Swal.fire({
      title: "確定移除？",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#426765",
      cancelButtonColor: "#EAE5BE",
      confirmButtonText: "移除",
    }).then(async (result) => {
      if (result.isConfirmed) {
        firebase
          .deleteMember(groupId, member[index].member_id)
          .then(async () => {
            firebase.getDocsOfSubCollectionMember(groupId).then((res) => {
              setMember(res);
            });
            firebase.updateDocOfArrayRemoveGroup(member[index].member_id, groupId);
            firebase.updateDocIncrementCurrentOfMember(groupId);
            firebase.updateDocIncrementTentOfMember(groupId, member_name);
            firebase.updateDocSuppliesOfMember(groupId, member_name);
          });

        updateDoc(doc(db, "joinGroup", member_id), {
          alert: arrayUnion({
            alert_content: `你已被移除${group_title}`,
            is_read: false,
          }),
        });
        setRenderParticipateArr(true);
      }
    });
  };
  return (
    <div>
      <Button
        width=' 150px'
        onClick={checkMemberList}
        setMemberIsOpen={setMemberIsOpen}>
        查看團員名單
      </Button>
      <Modal
        isOpen={memberIsOpen}
        onRequestClose={() => setMemberIsOpen(false)}
        overlayClassName={{
          base: "overlay-base",
          afterOpen: "overlay-after",
          beforeClose: "overlay-before",
        }}
        className={{
          base: "content-base",
          afterOpen: "content-after",
          beforeClose: "content-before",
        }}
        closeTimeoutMS={500}>
        <CheckCommentWrap>
          <DeleteModalButton onClick={() => setMemberIsOpen(false)}>
            X
          </DeleteModalButton>
          <Font fontSize='20px'>你的團員</Font>
          <Hr width='60%'></Hr>
          <ScrollWrap>
            {member.map((item, index) => (
              <Box
                key={uuidv4()}
                sx={{
                  width: "500px",
                  height: "50px",
                  borderBottom: " 1.4px solid #EAE5BE",
                  padding: 1,
                  margin: 1,
                  display: "flex",
                  justifyContent: "space-between",
                }}>
                <Display>
                  {item.role == "header" && (
                    <Tag
                      width='40px'
                      p='3px 0px 0px 1px'
                      fontSize='14px'
                      height='25px'
                      m='0px 10px 0px 0px'>
                      團長
                    </Tag>
                  )}
                  <Font>{item.member_name}</Font>
                </Display>
                {item.role == "member" && (
                  <Button
                    width='150px'
                    mt='0px'
                    ml='20px'
                    boxShadow='none'
                    onClick={() => {
                      removeMember(
                        index,
                        item.member_id,
                        item.member_name
                      );
                    }}>
                    移除成員
                  </Button>
                )}
              </Box>
            ))}
          </ScrollWrap>
        </CheckCommentWrap>
      </Modal>
    </div>
  );
}
