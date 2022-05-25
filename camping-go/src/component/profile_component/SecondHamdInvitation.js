import { db } from "../../utils/firebase";
import { doc, updateDoc, getDoc, arrayUnion } from "firebase/firestore";
import {
  Font,
  Img,
  Display,
  Button,
  Wrap,
  ImgWrap,
  Cloumn,
  Hr,
} from "../../css/style";
import Modal from "react-modal";
import "../../css/modal.css";
import Swal from "sweetalert2/dist/sweetalert2.js";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import styled from "styled-components";
import firebase from "../../utils/firebaseConfig";

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

const ChangeImgWrap = styled.div`
  width: 170px;
  overflow: hidden;
  border-radius: 15px;
  height: 120px;
  @media (max-width: 1024px) {
    width: 150px;
  }
`;

const ChangeWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0px 30px;
  @media (max-width: 1024px) {
    margin: 20px;
  }
`;

const ChangeSection = styled.div`
  display: flex;
  width: 100%;
  margin: 30px 0px 50px 0px;
  @media (max-width: 570px) {
    margin: 0px;
    flex-direction: column;
    align-items: center;
  }
`;

const ChangeIconWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (max-width: 570px) {
    flex-direction: row;
  }
`;

const ButtonWrap = styled.div`
  width: 70%;
  display: flex;
  justify-content: space-evenly;
  @media (max-width: 570px) {
    height: 130px;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
  }
`;



function SecondHandInvitation({
  inviteIsOpen,
  setInviteIsOpen,
  inviteInfo,
  inviteInfoIndex,
  userId,
}) {
  const rejectInvite = async () => {
    inviteInfo[inviteInfoIndex].buyer_name = "";
    inviteInfo[inviteInfoIndex].buyer_id = "";
    inviteInfo[inviteInfoIndex].change_supplies_picture = "";
    inviteInfo[inviteInfoIndex].change_supplies = "";
    inviteInfo[inviteInfoIndex].invite = false;

    const docRef = doc(db, "joinGroup", userId);
    await updateDoc(docRef, { second_hand: inviteInfo });

    setInviteIsOpen(false);
  };

  const acceptInvite = async () => {
    inviteInfo[inviteInfoIndex].invite = false;
    inviteInfo[inviteInfoIndex].change_status = true;

    const docRef = doc(db, "joinGroup", userId);
    await updateDoc(docRef, { second_hand: inviteInfo });

    const inviteDocRef = doc(
      db,
      "joinGroup",
      inviteInfo[inviteInfoIndex].buyer_id
    );
    const getInviteDocRef = await getDoc(inviteDocRef);

    if (getInviteDocRef.exists()) {
      let findIndex = getInviteDocRef
        .data()
        .second_hand.findIndex(
          (e) => e.supplies_id == inviteInfo[inviteInfoIndex].change_supplies_id
        );

      let Arr = getInviteDocRef.data().second_hand;
      Arr[findIndex].change_status = true;
      Arr[findIndex].buyer_name = inviteInfo[inviteInfoIndex].seller_name;
      Arr[findIndex].buyer_id = inviteInfo[inviteInfoIndex].seller_id;
      Arr[findIndex].change_supplies = inviteInfo[inviteInfoIndex].name;


      updateDoc(inviteDocRef, {
        second_hand: Arr,
        alert: arrayUnion({
          alert_content: `${inviteInfo[inviteInfoIndex].seller_name}已接受${Arr[0].name}的二手換物邀請」`,
          is_read: false,
        }),
      });
    }

    Swal.fire({
      position: "center",
      icon: "success",
      title: "成功交換",
      showConfirmButton: false,
      timer: 1500,
    });
    setInviteIsOpen(false);
  };
  return (
    <>
      <Modal
        isOpen={inviteIsOpen}
        onRequestClose={() => setInviteIsOpen(false)}
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
          <DeleteModalButton onClick={() => setInviteIsOpen(false)}>
            X
          </DeleteModalButton>
          {inviteInfo && (
            <>
              <Wrap
                width='100%'
                justifyContent='center'
                direction='column'
                alignItems='center'>
                <Font>{inviteInfo[inviteInfoIndex].buyer_name}想要用</Font>
                <Hr width='70%'></Hr>
                <ChangeSection width='100%' m='30px 0px 50px 0px'>
                  <ChangeWrap
                    width='100%px'
                    direction='column'
                    m='0px 30px 0px 30px'>
                    <ChangeImgWrap>
                      <Img
                        width='100%'
                        src={
                          inviteInfo[inviteInfoIndex].change_supplies_picture
                        }></Img>
                    </ChangeImgWrap>
                    <Font fontSize='16px' m='15px 0px 0px 0px'>
                      {inviteInfo[inviteInfoIndex].change_supplies}
                    </Font>
                    <Font fontSize='14px'>
                      {inviteInfo[inviteInfoIndex].change_note}
                    </Font>
                  </ChangeWrap>
                  <ChangeIconWrap>
                    <Font fontSize='16px'>跟你換</Font>
                    <CompareArrowsIcon
                      sx={{
                        fontSize: "70px",
                        color: "#426765",
                      }}></CompareArrowsIcon>
                  </ChangeIconWrap>
                  <ChangeWrap>
                    <ChangeImgWrap width='80%' height='120px'>
                      <Img
                        width='100%'
                        src={inviteInfo[inviteInfoIndex].picture}></Img>
                    </ChangeImgWrap>
                    <Font fontSize='16px' m='15px 0px 0px 0px'>
                      {inviteInfo[inviteInfoIndex].name}
                    </Font>
                  </ChangeWrap>
                </ChangeSection>
                <ButtonWrap>
                  <Button onClick={acceptInvite} width='150px'>
                    確認交換
                  </Button>
                  <Button onClick={rejectInvite} width='150px'>
                    忍痛拒絕
                  </Button>
                </ButtonWrap>
              </Wrap>
            </>
          )}
        </CheckCommentWrap>
      </Modal>
      )
    </>
  );
}

export default SecondHandInvitation;
