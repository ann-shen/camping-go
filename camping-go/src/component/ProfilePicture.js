import styled from "styled-components";
import { useState, useEffect } from "react";
import { Display, Img } from "../css/style";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "../utils/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import FileUploadRoundedIcon from "@mui/icons-material/FileUploadRounded";
import { Skeleton, Stack } from "@mui/material";
import { useParams } from "react-router-dom";

const ProfileWrap = styled.div`
  position: relative;
`;

const ImgWrap = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 130px;
  height: 130px;
  border-radius: 50%;
  overflow: hidden;
  border: 5px solid #dcd8b3;
`;

const Label = styled.label`
  &:hover {
    color: #797659;
    background-color: white;
    box-shadow: none;
  }
  width: 40px;
  height: 30px;
  background-color: #dcd8b3;
  border-radius: 10px;
  color: white;
  cursor: pointer;
  padding-top: 8px;
  position: absolute;
  bottom: 5px;
  right: 0px;
`;

const Input = styled.input`
  position: absolute;
  top: 50;
  left: 0;
  display: none;
  color: rgba(0, 0, 0, 0);
`;

const InfoWrap = styled.div`
  width: 120px;
  display: flex;
  justify-content: start;
  align-items: center;
  margin: 30px 0px;
`;

export const ProfilePicture = ({ userId }) => {
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState(null);
  let params = useParams();

  useEffect(async () => {
    if (userId) {
      const getInfo = await getDoc(doc(db, "joinGroup", userId));
      if (getInfo.exists()) {
        setPreview(getInfo.data().profile_img);
      }
    }
  }, [selectedFile, userId]);

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }
    const storage = getStorage();
    const imageRef = ref(storage, e.target.files[0].name);
    uploadBytes(imageRef, e.target.files[0])
      .then(() => {
        getDownloadURL(imageRef)
          .then((url) => {
            setPreview(url);
            updateDoc(doc(db, "joinGroup", userId), {
              profile_img: url,
            });
            setSelectedFile(e.target.files[0]);
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
        <ProfileWrap>
          {preview == null ? (
            <ImgWrap>
              <Stack spacing={1}>
                <Skeleton variant='circular' width={120} height={120} />
              </Stack>
            </ImgWrap>
          ) : (
            <ImgWrap>
              <Img src={preview} width='auto' height='115%' />
            </ImgWrap>
          )}
          {params.id == userId && (
            <Label>
              <FileUploadRoundedIcon
                sx={{
                  pointerEvents: "none",
                  cursor: "not-allowed",
                  stroke: "#ffffff",
                  strokeWidth: 1,
                }}
              />
              <Input type='file' onChange={onSelectFile} />
            </Label>
          )}
        </ProfileWrap>
      </Display>
    </InfoWrap>
  );
};
