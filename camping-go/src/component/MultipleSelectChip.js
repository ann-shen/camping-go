import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../utils/userContext";

import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../utils/firebase";
import useMediaQuery from "@mui/material/useMediaQuery";
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
  "高海拔",
  "夜景",
  "大草皮",
  "近溪流",
  "泡湯",
  "雲海",
  "戲水池",
  "螢火蟲",
  "櫻花",
  "森林",
  "遮雨篷",
];

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function MultipleSelectChip({ userId, condiion }) {
  const theme = useTheme();
  const [personName, setPersonName] = useState([]);
  const matches = useMediaQuery("(max-width:1024px)");
  const Context = useContext(UserContext);


  useEffect(async () => {
    if (condiion !== "create") {
      const docRef = doc(db, "joinGroup", userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPersonName(docSnap.data().select_tag);
      }
    }
  }, []);

  const handleChange = async (event) => {
    const value = event.target.value;
    setPersonName(value, value.toString().split(",")[value.length - 1]);
    Context.personName = value;
    if (condiion !== "create") {
      await updateDoc(doc(db, "joinGroup", userId), {
        select_tag: arrayUnion(value.toString().split(",")[value.length - 1]),
      });
    }
  };

  let formControlStyle;

  if (condiion !== "create") {
    formControlStyle = { ml: 2, mt: 1, width: "400px" };
  }
  if (matches) {
    formControlStyle = { ml: 2, mt: 1, width: "300px" };
  }
  return (
    <FormControl sx={formControlStyle} size='small'>
      {condiion !== "create" ? (
        <InputLabel id='demo-multiple-chip-label' sx={{ zIndex: "0" }}>
          喜愛
        </InputLabel>
      ) : (
        <InputLabel id='demo-multiple-chip-label'>標籤</InputLabel>
      )}

      <Select
        labelId='demo-multiple-chip-label'
        id='demo-multiple-chip'
        multiple
        value={personName}
        onChange={handleChange}
        input={<OutlinedInput id='select-multiple-chip' label='Chip' />}
        renderValue={(selected) => (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 0.7,
            }}>
            {selected.map((value) => (
              <Chip
                sx={{
                  backgroundColor: "#F4F4EE",
                  border: " 2px solid #cfc781",
                  color: "#426765",
                }}
                key={value}
                label={value}
              />
            ))}
          </Box>
        )}
        MenuProps={MenuProps}>
        {names.map((name) => (
          <MenuItem
            key={name}
            value={name}
            style={getStyles(name, personName, theme)}>
            {name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
