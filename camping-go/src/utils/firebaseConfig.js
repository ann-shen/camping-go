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
import { db } from "../utils/firebase";

const firebase = {
  async deleteMember(groupId, memberID) {
    await deleteDoc(doc(db, "CreateCampingGroup", groupId, "member", memberID));
  },
};

export default firebase;
