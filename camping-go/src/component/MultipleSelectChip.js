import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import { useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../utils/firebase";


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
  "可租裝配",
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

export default function MultipleSelectChip({ userId }) {
  const theme = useTheme();
  const [personName, setPersonName] = React.useState([]);
  console.log(personName);

  useEffect(async () => {
    await updateDoc(doc(db, "joinGroup", userId), {
      selectTag: personName,
    });
  }, [personName]);

  const handleChange = (event) => {
    const value = event.target.value;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  return (
    <div>
      <FormControl sx={{ ml: 3, mt:2, width: "500px" }}>
        <InputLabel id='demo-multiple-chip-label'>喜愛</InputLabel>
        <Select
          labelId='demo-multiple-chip-label'
          id='demo-multiple-chip'
          multiple
          value={personName}
          onChange={handleChange}
          input={<OutlinedInput id='select-multiple-chip' label='Chip' />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
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
    </div>
  );
}
