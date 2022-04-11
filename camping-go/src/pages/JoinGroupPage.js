import { db } from "../utils/firebase";
import {
  doc,
  onSnapshot,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { Routes, Route, useParams } from "react-router-dom";

function JoinGroupPage() {
  const [homePageCampGroup, sethomePageCampGroup] = useState("");
  let params = useParams();
  console.log(params.id);

  //render all camping group
  useEffect(async () => {
    const unsub = onSnapshot(
      doc(db, "CreateCampingGroup", params.id),
      (doc) => {
        console.log("Current data: ", doc.data().current_number);
        sethomePageCampGroup(doc.data());
      }
    );
  }, []);

  return <div>目前人數{homePageCampGroup.current_number}</div>;
}

export default JoinGroupPage;
