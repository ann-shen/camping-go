import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../utils/firebase";

const data = {
  async getData(id) {
      onSnapshot(doc(db, "CreateCampingGroup", id), (doc) => {
      return doc.data();
    });
  },
  onCampingGroupChange(id, callback) {
    return onSnapshot(doc(db, "CreateCampingGroup", id), (doc) => callback);
  }
};

export { data };