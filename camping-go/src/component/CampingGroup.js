import styled from "styled-components";
import { db } from "../utils/firebase";
import {
  setDoc,
  doc,
  getDoc,
  getDocs,
  collection,
  addDoc,
  query, where,
  updateDoc,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { async } from "@firebase/util";

const GroupWrap = styled.div`
  flex-direction: column;
  width: 300px;
  height: 200px;
  margin: 100px 200px 200px 400px;
`;

function CampingGroup() {
  const [homePageCampGroup, sethomePageCampGroup] = useState([]);
  // const docRef = doc(db, "homeTest", "yTabKtzodj5PK1Rz7lLR");
  
  useEffect(async () => {
    let arr=[]
    const querySnapshot = await getDocs(collection(db, "homeTest"));
    querySnapshot.forEach((doc) => {
      arr.push(doc.data());
    });
    sethomePageCampGroup(arr);
  }, []);

  //particular city
  useEffect(async () => {
    const q = query(collection(db, "homeTest"), where("city", "==", "新竹縣"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // console.log(doc.id, " => ", doc.data());
    });

  },[])

  const addCurrentMember = async (index) => {
    let currentNumber;
    console.log(index);
    const docRef = await doc(
      db,
      "homeTest",
      homePageCampGroup[index].id.toString()
    );
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data().current_number);
      currentNumber = docSnap.data().current_number+1
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
    updateDoc(docRef, {
      current_number: currentNumber,
    });
  };

  // console.log(homePageCampGroup[0].id);
  return (
    <div>
      <GroupWrap>
        {homePageCampGroup.map((item, index) => (
          <div key={index}>
            <img src='' alt='' />
            <div>
              <span>團長</span>
              <span>{item.header_name}</span>
            </div>
            <h1>{item.group_title}</h1>
            <div>
              <span>{item.date}</span>
            </div>
            <div>
              <div>{item.city}</div>
              <div>
                <span>{item.current_number}</span>/
                <span>{item.max_member_number}</span>人
              </div>
            </div>
            <button
              onClick={(e) => {
                addCurrentMember(index);
              }}>
              我要加入
            </button>
          </div>
        ))}
      </GroupWrap>
    </div>
  );
}

export default CampingGroup;
