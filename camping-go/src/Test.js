import { db } from "./utils/firebase";
import { setDoc, doc, getDoc, collection, addDoc } from "firebase/firestore";
import { useState } from "react";
import CampingGroup from "./component/CampingGroup";
import styled from "styled-components";

const CampWrap = styled.div`
  display: flex;
`;


function Test({ token }) {
  const [groupId, setGroupID] = useState("");
  const getData = async () => {
    const docRef = doc(collection(db, "homeTest"));
    await setDoc(docRef, {
      status:"進行中",
      group_header: "12345",
      header_name: "liam",
      privacy: true,
      password:"23456",
      group_Title: "大地吹呀吹",
      site: "https//:1234567",
      date_start: "2022.03.28",
      date_end: "2022.04.01",
      position: "詳細地址",
      city: "南投縣",
      meeting_time: "12:00PM",
      max_member_number: 20,
      current_number: 3,
      announcement: "大會報告～",
      notice: ["營區提供租借帳篷", "自行準備晚餐/隔天早餐"],
      id: docRef.id,
    });
    console.log("Document written with ID: ", docRef.id);
    setGroupID(docRef.id);

    //tent
    const docRefTent = await doc(db, "homeTest", docRef.id, "帳篷", docRef.id);
    setDoc(docRefTent, {
      member: ["ann", "shen"],
      max_number: 4,
      current_number: 2,
    });

    //object
    const docRefObject = await doc(
      db,
      "homeTest",
      docRef.id,
      "物品",
      docRef.id
    );
    setDoc(docRefObject, {
      object_name: "露營燈",
      note: "記得檢查電池",
      bring_person: "",
    });
    // const newCityRef = doc(db, "homeTest", docRef.id);
    // await setDoc(newCityRef,{id:123});
    // const docRefCity = await addDoc(collection(db, "Taiwancity"), {
    //   taipei: ["234456", docRef.id],
    //   Keelung: [],
    // });
  };

  const addTent = async () => {
    const tentdocRef = await addDoc(
      collection(db, "homeTest", "DS9GouO6OFlsVhuHnkEO", "帳篷"),
      {
        mm: "12312",
      }
    );
    console.log("Document written with ID: ", tentdocRef.id);
  };

  return (
    <CampWrap>
      <CampingGroup />
    </CampWrap>
  );
}


export default Test;

// import React from "react";
// import { DateRangePicker } from "rsuite";

// function Date(){
// return(
//   <div>
//     <DateRangePicker />
//   </div>
// )

// }

// export default Date


