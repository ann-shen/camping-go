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

function subCollectionOfMember(groupId) {
  return collection(db, "CreateCampingGroup", groupId, "member");
}

function joinGroupOfuserID(memberId) {
  return doc(db, "joinGroup", memberId);
}

function CreateCampingGroupOfGroupID(groupId) {
  return doc(db, "CreateCampingGroup", groupId);
}

function CreateCampingGroupOfFeedBack(groupId) {
  return collection(db, "CreateCampingGroup", groupId, "feedback");
}

function queryTentOfMember(groupId, memberName) {
  const getTent = query(
    collection(db, "CreateCampingGroup", groupId, "tent"),
    where("member", "array-contains", memberName)
  );
  return getTent;
}

function querySuppliesOfMember(groupId, memberName) {
  const getSupplies = query(
    collection(db, "CreateCampingGroup", groupId, "supplies"),
    where("bring_person", "==", memberName)
  );
  return getSupplies;
}

function allSupplies(groupId) {
  return collection(db, "CreateCampingGroup", groupId, "supplies");
}

const firebase = {
  async deleteMember(groupId, memberID) {
    await deleteDoc(doc(db, "CreateCampingGroup", groupId, "member", memberID));
  },

  async getDocsOfSubCollectionMember(groupId) {
    let memberArr = [];
    const querySnapshot = await getDocs(subCollectionOfMember(groupId));
    querySnapshot.forEach((doc) => {
      memberArr.push(doc.data());
    });
    return memberArr;
  },

  async getDocsOfSupplies(groupId) {
    let takeAwayArr = [];
    const querySnapshot = await getDocs(allSupplies(groupId));
    querySnapshot.forEach((doc) => {
      takeAwayArr.push(doc.data());
    });
    return takeAwayArr;
  },

  async updateDocOfArrayRemoveGroup(memberId, groupId) {
    await updateDoc(joinGroupOfuserID(memberId), {
      group: arrayRemove(groupId),
    });
  },

  async updateDocUserGroupId(userId, groupId) {
    await updateDoc(doc(db, "joinGroup", userId), {
      group: arrayRemove(groupId),
    });
  },

  async updateDocIncrementCurrentOfMember(groupId) {
    await updateDoc(CreateCampingGroupOfGroupID(groupId), {
      current_number: increment(-1),
    });
  },

  async updateDocIncrementTentOfMember(groupId, memberName) {
    const querySnapshot = await getDocs(queryTentOfMember(groupId, memberName));
    querySnapshot.forEach((item) => {
      updateDoc(doc(db, "CreateCampingGroup", groupId, "tent", item.id), {
        current_number: increment(-1),
        member: arrayRemove(memberName),
      });
    });
  },

  async updateDocSuppliesOfMember(groupId, memberName) {
    const querySupplies = await getDocs(
      querySuppliesOfMember(groupId, memberName)
    );
    querySupplies.forEach((item) => {
      updateDoc(doc(db, "CreateCampingGroup", groupId, "supplies", item.id), {
        bring_person: "",
      });
    });
  },

  async updateDocAlertToHeaderOfGroup(userId,userName,GroupTitle){
    updateDoc(doc(db, "joinGroup", userId), {
      alert: arrayUnion({
        alert_content: `${userName}已退出「${GroupTitle}」`,
        is_read: false,
      }),
    });

  },

  async deleteMemberOfGroup(groupId, userId) {
    await deleteDoc(doc(db, "CreateCampingGroup", groupId, "member", userId));
  },

  async getCocsFeedback(groupId) {
    let commentArr = [];
    const querySnapshot = await getDocs(CreateCampingGroupOfFeedBack(groupId));
    querySnapshot.forEach((doc) => {
      commentArr.push(doc.data());
    });
    return commentArr;
  },

  async getDocJoinGroupOfMember(userId) {
    const paramIdProfile = await getDoc(joinGroupOfuserID(userId));
    if (paramIdProfile.exists()) {
      return paramIdProfile.data();
    }
  },
};

export default firebase;
