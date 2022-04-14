import styled from "styled-components";
import { db } from "../utils/firebase";
import {
  setDoc,
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { async } from "@firebase/util";

const LinkRoute = styled(Link)`
  text-decoration: none;
  margin: 20px 5px;
  font-size: 20px;
  color: gray;
`;

const GroupWrap = styled.div`
  display: flex;
  /* flex-direction: column; */
  margin: 100px;
`;

const Group = styled.div`
  width: 200px;
  margin-left: 100px;
`;

function CampingGroup({ setGroupId, userId, groupId,userName}) {
  console.log(userName);
  const [homePageCampGroup, sethomePageCampGroup] = useState([]);
  //render all camping group
  useEffect(async () => {
    let arr = [];
    const querySnapshot = await getDocs(collection(db, "CreateCampingGroup"));
    querySnapshot.forEach((doc) => {
      arr.push(doc.data());
    });
    sethomePageCampGroup(arr);
  }, []);

  //particular city
  useEffect(async () => {
    const q = query(
      collection(db, "CreateCampingGroup"),
      where("city", "==", "新竹縣")
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // console.log(doc.id, " => ", doc.data());
    });
  }, []);

  const addCurrentMember = async (index) => {
    let currentNumber;
    //current_number+1
    const docRef = await doc(
      db,
      "CreateCampingGroup",
      homePageCampGroup[index].group_id.toString()
    );

    const docRefMember = await doc(
      db,
      "CreateCampingGroup",
      homePageCampGroup[index].group_id.toString(),
      "member",
      userId
    );

    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data().current_number);
      currentNumber = docSnap.data().current_number + 1;
      setGroupId(docSnap.data().group_id);
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }

    setDoc(docRefMember, {
      role: "member",
      member_name: userName,
      member_id: userId,
    });

    updateDoc(docRef, {
      current_number: currentNumber,
    });

    // console.log(groupId);
  };

  useEffect(async () => {
    //set JoinGroup
    const docRefJoinGroup = await doc(db, "joinGroup", userId);
    console.log(groupId);
    updateDoc(docRefJoinGroup, {
      group: [
        {
          group_id: groupId,
        },
      ],
    });
  }, [groupId]);

  // console.log(homePageCampGroup[0].id);
  return (
    <div>
      <GroupWrap>
        {homePageCampGroup.map((item, index) => (
          <Group key={index}>
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
              <LinkRoute to={`joinGroup/${item.group_id}`}>我要加入</LinkRoute>
            </button>
          </Group>
        ))}
      </GroupWrap>
    </div>
  );
}

export default CampingGroup;
