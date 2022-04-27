import styled from "styled-components";
import { useState, useEffect, useContext } from "react";
import { Font, Display, Img, Button } from "../css/style";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "../utils/firebase";
import { doc, updateDoc } from "firebase/firestore";

const ImgWrap = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
`;

const Label = styled.label`
  width: 100px;
  height: 30px;
  background-color: #333;
  color: white;
  cursor: pointer;
`;

const Input = styled.input`
  position: absolute;
  top: 50;
  left: 0;
  display: none;
  color: rgba(0, 0, 0, 0);
`;

const InfoWrap = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 30px 0px;
`;

export const ImageUpload = ({ userId }) => {
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState("");

  // create a preview as a side effect, whenever selected file is changed
  useEffect(() => {
    console.log(preview);
    if (!selectedFile) {
      setPreview(
        "https://firebasestorage.googleapis.com/v0/b/camping-go-14942.appspot.com/o/person%2Bprofile%2Buser%2Bicon-1320184051308863170.png?alt=media&token=91bccd8a-3fea-4515-8211-c10dfffb1285"
      );
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }

    setSelectedFile(e.target.files[0]);

    const storage = getStorage();
    const imageRef = ref(storage, e.target.files[0].name);
    uploadBytes(imageRef, e.target.files[0])
      .then(() => {
        getDownloadURL(imageRef)
          .then((url) => {
            console.log(url);

            //=======fix me ========//

            updateDoc(doc(db, "joinGroup", userId), {
              profile_img: url,
            });
          })
          .catch((error) => {
            console.log(error.message, "error getting the img url");
          });
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  return (
    <InfoWrap>
      <Display direction='column'>
        {preview && (
          <ImgWrap>
            <Img src={preview} width='auto' height='115%' />
          </ImgWrap>
        )}
        <Label>
          chose
          <Input type='file' onChange={onSelectFile} />
        </Label>
      </Display>
    </InfoWrap>
  );
};
