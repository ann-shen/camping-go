import {
  getDoc,
  getDocs,
  collection,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import { Font, Img, Display, Button, ImgWrap } from "../css/style";
import { Box } from "@mui/material";
import { useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { db } from "../utils/firebase";
import Header from "../component/Header";
import { UserContext } from "../utils/userContext";

function PersonalOfHeader() {
  const [yourCreateGroup, setYourCreateGroup] = useState([]);
  const [groupID, setGroupID] = useState([]);
  const [totalScoreStatus, setTotalScoreStatus] = useState(false);
  const [comment, setComment] = useState([]);
  const ContextByUserId = useContext(UserContext);

  let params = useParams();

  useEffect(async () => {
    const q = query(
      collection(db, "CreateCampingGroup"),
      where("header_id", "==", params.id)
    );
    const querySnapshot = await getDocs(q);
    let CreateGroupArr = [];
    querySnapshot.forEach((doc) => {
      CreateGroupArr.push(doc.data());
    });
    setYourCreateGroup(CreateGroupArr);
  }, []);

  const checkComment = async (groupId) => {
    console.log("123");
    let commentArr = [];
    const commentRef = collection(
      db,
      "CreateCampingGroup",
      // -------- fix me lost groupid --------
      groupId,
      "feedback"
    );
    const querySnapshot = await getDocs(commentRef);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      commentArr.push(doc.data());
    });
    setComment(commentArr);
  };

  return (
    <div>
      <Header ContextByUserId={ContextByUserId} />
      {groupID &&
        yourCreateGroup.map((item, index) => (
          <Box
            key={index}
            sx={{
              width: "80%",
              height: "auto",
              boxShadow:
                "0.8rem 0.8rem 3.2rem #E2E1D3 , -0.5rem -0.5rem 1rem #ffffff",
              borderRadius: 6,
              padding: 3,
              margin: 3,
            }}>
            <Display justifyContent='space-around'>
              <Display direction='column' alignItems='start'>
                {new Date().getTime() <
                new Date(
                  new Date(item.end_date.seconds * 1000)
                    .toLocaleString()
                    .split(" ")[0]
                ).getTime()
                  ? "進行中"
                  : "已結束"}
                <ImgWrap>
                  <Img
                    src={item.picture}
                    width='100%'
                    onClick={(id) => {
                      checkComment(item.group_id);
                    }}></Img>
                </ImgWrap>

                <Font>{item.group_title}</Font>
                <Font>
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
                <Font>{item.city}</Font>
              </Display>
              {item.total_score && (
                <Display>
                  平均分數
                  <Font fontSize='30px' margin='10px' marginLeft='10px'>
                    {item.total_score}
                  </Font>
                  分
                </Display>
              )}
              <Display>
                {item.map && (
                  <div>
                    {item.comment.map((item) => (
                      <Font>{item}</Font>
                    ))}
                  </div>
                )}
              </Display>
            </Display>
          </Box>
        ))}
      <Display direction='cloumn'>
        {comment.map((item) => (
          <Font key={item.user_id}>{item.note}</Font>
        ))}
      </Display>
    </div>
  );
}

export default PersonalOfHeader;
