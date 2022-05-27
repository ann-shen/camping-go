import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { useState, useEffect } from "react";
import { doc, onSnapshot, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import styled, { keyframes } from "styled-components";
import { Font, Display, Img, Button, Cloumn, Hr, Wrap } from "../css/style";

const AlertWrap = styled.div`
  width: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 4px;
  margin-left: 40px;
  cursor: pointer;
`;

const AlertContentWrap = styled.div`
  width: 120px;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  border-radius: 5px;
  z-index: 2;
  color: #426765;
  background-color: #f4f4ef;
  border-bottom: 1px solid #cfc781;
  cursor: pointer;
`;

const AlertContentIsReadWrap = styled.div`
  width: 120px;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  border-radius: 5px;
  z-index: 2;
  color: #f4f4ef;
  background-color: #426765;
  border-bottom: 1px solid #cfc781;
  cursor: pointer;
`;

const fadeIn = keyframes`
from {
  opacity: 0;
  transform: scale(0.2) translateX(30.5rem);
}
to {
  opacity: 1;
  transform: scale(1.3) translateX(0);
}
`;

const alertIn = keyframes`
0% { opacity: 0;
  transform: scale(0.3)  translateX(40.5rem)  }
40% { opacity: 0.8;
  transform: scale(1.2)   }
  70% { opacity: 0.8;
  transform: scale(0.9)   }
100% { opacity: 1;
  transform: scale(1)  translateX(0em)  }`;

const RedDot = styled.div`
  width: 120px;
  letter-spacing: 2px;
  height: 40px;
  border-radius: 5px;
  background-color: #f4f4ef;
  font-size: 13px;
  color: #4a6664;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #CFC781;
  animation: ${alertIn} 1.3s ease-in-out;
`;

function Alert({ userId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAlert, setIsAlert] = useState([]);
  const [isRedDot, setIsRedDot] = useState(false);

  useEffect(() => {
    if (userId) {
      const unsub = onSnapshot(doc(db, "joinGroup", userId), (doc) => {
        setIsAlert(doc.data().alert);
        doc.data().alert.map((item) => {
          if (item.is_read === false) {
            setIsRedDot(true);
          }
        });
      });
    }
  }, [userId]);

  const readAlert = async () => {
    setIsOpen(!isOpen);
    setIsRedDot(false);
    const getAlertRef = await getDoc(doc(db, "joinGroup", userId));
    if (getAlertRef.exists()) {
      let Arr = [];
      getAlertRef.data().alert.map((item) => {
        Arr.push(item);
      });

      setTimeout(() => {
        Arr.map((item) => {
          item.is_read = true;
        });
        updateDoc(doc(db, "joinGroup", userId), {
          alert: Arr,
        });
      }, 3000);

    }
  };
  return (
    <AlertWrap>
      <NotificationsActiveIcon
        onClick={readAlert}
        sx={{
          marginBottom: "15px",
          position: "relative",
          color: "#CFC781",
        }}></NotificationsActiveIcon>
      {isRedDot && <RedDot>你有新通知</RedDot>}
      {isOpen && (
        <>
          {isAlert.length !== 0 ? (
            <div>
              {isAlert
                .reverse()
                .slice(0, 6)
                .map((item, index) => (
                  <>
                    {item.is_read == true ? (
                      <AlertContentWrap key={index}>
                        <Font fontSize='13px'> {item.alert_content}</Font>
                      </AlertContentWrap>
                    ) : (
                      <AlertContentIsReadWrap key={index}>
                        <Font fontSize='13px' color='#F4F4EF'>
                          {item.alert_content}
                        </Font>
                      </AlertContentIsReadWrap>
                    )}
                  </>
                ))}
            </div>
          ) : (
            <AlertContentWrap>
              <Font fontSize='13px'>尚未有通知</Font>
            </AlertContentWrap>
          )}
        </>
      )}
    </AlertWrap>
  );
}

export default Alert;
