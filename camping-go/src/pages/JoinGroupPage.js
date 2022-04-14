import { db } from "../utils/firebase";
import styled from "styled-components";
import {
  doc,
  onSnapshot,
  collection,
  query,
  where,
  updateDoc,
  setDoc,
  getDocs,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { Routes, Route, useParams } from "react-router-dom";
import "../utils/data";
import { data } from "../utils/data";
import Tent from "../component/Tent";

const Label = styled.label`
  font-size: 16px;
  margin-left: 30px;
`;
const Input = styled.input`
  font-size: 16px;
  width: 150px;
  height: 30px;
  margin: 20px;
`;
const AddButton = styled.button`
  width: 150px;
`;

function JoinGroupPage({ setAllMemberArr, allMemberArr }) {
  const [homePageCampGroup, setHomePageCampGroup] = useState("");
  const [allTentArr, setAllTentArr] = useState([]);
  const [allSupplies, setAllSupplies] = useState([]);
  const [tentInfo, setTentInfo] = useState({
    current_number: 0,
    max_number: 0,
    member: [],
  });
  const [tentMember, setTentMember] = useState([]);

  let params = useParams();

  //render all camping group

  // useEffect(() => {
  //   data.onCampingGroupChange(params.id, (doc) => {
  //     console.log("=== data", doc.data());
  //   });
  // }, []);

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "CreateCampingGroup", params.id),
      (doc) => {
        // console.log("Current data: ", doc.data().meeting_time.seconds);
        setHomePageCampGroup(doc.data());
      }
    );
  }, []);
  //getTentData
  useEffect(async () => {
    let tentsArr = [];
    const querySnapshot = await getDocs(
      collection(db, "CreateCampingGroup", params.id, "tent")
    );
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      tentsArr.push(doc.data());
    });
    setAllTentArr(tentsArr);

    // const eventListenerpage = query(
    //   collection(db, "CreateCampingGroup", params.id, "tent")
    // );
    // onSnapshot(eventListenerpage, (snapshot) => {
    //   snapshot.docChanges().forEach(async (change) => {
    //     // if (change.type === "added") {
    //     console.log(change.doc.data());
    //     tentsArr.push(change.doc.data());
    //     // }
    //   });
    //   console.log(tentsArr);
    // });
  }, []);
  //getSuppliesData
  useEffect(() => {
    const eventListenerpage = query(
      collection(db, "CreateCampingGroup", params.id, "supplies")
    );
    onSnapshot(eventListenerpage, (snapshot) => {
      let suppliesArr = [];
      snapshot.docChanges().forEach(async (change) => {
        if (change.type === "added") {
          suppliesArr.push(change.doc.data());
        }
      });
      setAllSupplies(suppliesArr);
      console.log("getData");
    });
  }, []);

  const takeAway = async (id) => {
    console.log(id);
    await updateDoc(doc(db, "CreateCampingGroup", params.id, "supplies", id), {
      bring_person: "123",
    });
    const eventListenerpage = query(
      collection(db, "CreateCampingGroup", params.id, "supplies")
    );
    onSnapshot(eventListenerpage, (snapshot) => {
      let suppliesArr = [];
      snapshot.docChanges().forEach(async (change) => {
        if (change.type === "added") {
          // console.log(change.doc.data());
          suppliesArr.push(change.doc.data());
        }
      });
      setAllSupplies(suppliesArr);
      console.log("getData");
    });
  };

  const addNewTent = async () => {
    const ondocRefNewTent = doc(
      collection(db, "CreateCampingGroup", params.id, "tent")
    );
    await setDoc(ondocRefNewTent, tentInfo);
    updateDoc(
      doc(db, "CreateCampingGroup", params.id, "tent", ondocRefNewTent.id),
      {
        tent_id: ondocRefNewTent.id,
        member: allMemberArr,
      }
    ).then(async() => {
      console.log("next");
      let tentsArr = [];
    const querySnapshot = await getDocs(
      collection(db, "CreateCampingGroup", params.id, "tent")
    );
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      tentsArr.push(doc.data());
    });
    setAllTentArr(tentsArr);
    });
    setAllMemberArr("");

    // const eventListenerpage = query(
    //   collection(db, "CreateCampingGroup", params.id, "tent")
    // );
    // onSnapshot(eventListenerpage, (snapshot) => {
    //   let tentsArr = [];
    //   snapshot.docChanges().forEach(async (change) => {
    //     if (change.type === "added") {
    //       console.log(change.doc.data());
    //       tentsArr.push(change.doc.data());
    //     }
    //   });
    //   setAllMemberArr(tentsArr);
    // });
    console.log(allMemberArr);
  };
  return (
    <div>
      {
        <div>
          <Label> 目前人數{homePageCampGroup.current_number}</Label>
          <br />
          <Label>{homePageCampGroup.group_title}</Label>
          <br />
          <Label>日期</Label>
          <Label>
            {homePageCampGroup &&
              new Date(
                homePageCampGroup.start_date.seconds * 1000
              ).toLocaleString()}
          </Label>
          <Label>時間</Label>
          <Label>
            {homePageCampGroup &&
              new Date(
                homePageCampGroup.meeting_time.seconds * 1000
              ).toLocaleString()}
          </Label>
          <br />
          <br />
          {allTentArr.map((item, index) => (
            <div key={index}>
              <Label>最多幾人</Label>
              <Label>{item.max_number}</Label>
              <Label>目前幾人</Label>
              <Label>{item.current_number}</Label>
              <Input></Input>
            </div>
          ))}
          <br />
          <AddButton onClick={addNewTent}>新增</AddButton>
          <Tent
            setTentInfo={setTentInfo}
            tentInfo={tentInfo}
            setAllMemberArr={setAllMemberArr}
          />
          {/* {tentArr.map((_, index) => (
            <div key={index}>
              <Tent setTentInfo={setTentInfo} tentInfo={tentInfo} />
            </div>
          ))} */}
          <br />
          <br />
          <Label>需要幫忙認領的物品</Label>
          <br />
          {allSupplies.map((item, index) => (
            <div key={index}>
              <Label>{item.supplies}</Label>
              <Label>{item.bring_person}</Label>
              <Label>{item.note}</Label>
              {/* onClick=
              {(index) => {
                takeAway(index);
              }} */}
              <button
                onClick={() => {
                  takeAway(item.supplies_id);
                }}>
                我可以幫忙帶
              </button>
            </div>
          ))}
        </div>
      }
    </div>
  );
}

export default JoinGroupPage;
