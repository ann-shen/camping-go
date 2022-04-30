import { db } from "../utils/firebase";
import styled, { keyframes } from "styled-components";
import { doc, collection, getDocs, getDoc } from "firebase/firestore";
import { useState, useEffect, useRef, useContext } from "react";

function FindGroup({ userId }) {
  const [userTag, setUserTag] = useState([]);
  const [allGroupInfo,setAllGroupInfo]=useState([])
  const [allGroupSelectArr, setAllGroupSelectArr] = useState([]);
  const [findIndex, setFindIndex] = useState("");

  // console.log(userId);

  useEffect(async () => {
    const docRef = await getDoc(doc(db, "joinGroup", userId));
    if (docRef.exists()) {
      setUserTag(docRef.data().select_tag);
    } else {
      console.log("nono~");
    }
  }, []);

  useEffect(async () => {
    const docRef = await getDocs(collection(db, "CreateCampingGroup"));
    let allSelectArr = [];
    let allInfoArr=[]
    docRef.forEach((doc) => {
      allSelectArr.push(doc.data().select_tag);
      allInfoArr.push(doc.data())
    });
    setAllGroupSelectArr(allSelectArr);
    setAllGroupInfo(allInfoArr)
  }, []);

  // const arr = [3, 5, 8, 100, 20];

  // const max = Math.max(...arr);

  // const index = arr.indexOf(max);
  // console.log(index); // 👉️ 3

  useEffect(() => {
    let mathArr = [];
    allGroupSelectArr.map(async(groupSelect) => {
      const find = groupSelect
        .map((item) => {
          return userTag.filter((e) => e == item);
        })
        .flat(Infinity);

      mathArr.push(find.length);
      const max = Math.max(...mathArr);
      const index = mathArr.indexOf(max);
      console.log(index);
      setFindIndex(index)
      console.log(allGroupInfo[index])

    });

    // const find = allGroupSelectArr[0].map((item) => {
    //     return userTag.filter((e) => e == item);
    //   }).flat(Infinity);
  }, [allGroupSelectArr,allGroupInfo]);

  // useEffect(()=>{
  //   console.log(find)
  // },[find])

  return <div>123</div>;
}

export default FindGroup;
