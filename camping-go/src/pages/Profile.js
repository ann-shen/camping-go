import * as React from "react";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material/styles";
import { AppBar, Tabs, Tab, Typography, Box } from "@mui/material";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../utils/firebase";
import { getDocs, collection, query, where } from "firebase/firestore";
import {
  Label,
  Input,
  AddButton,
  Font,
  Img,
  Display,
  Button,
} from "../css/style";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}>
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

export default function Profile() {
  const theme = useTheme();
  const [value, setValue] = useState(0);
  let params = useParams();
  console.log(params.width);

  const [yourCreateGroup, setYourCreateGroup] = useState([]);
  console.log(yourCreateGroup);

  useEffect(async () => {
    const q = query(
      collection(db, "CreateCampingGroup"),
      where("header_id", "==", params.id)
    );
    const querySnapshot = await getDocs(q);
    let Arr = [];
    querySnapshot.forEach((doc) => {
      // console.log(doc.id, " => ", doc.data());
      Arr.push(doc.data());
    });
    setYourCreateGroup(Arr);
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return (
    <Box sx={{ bgcolor: "background.paper", width: "100%" }}>
      <AppBar position='static' sx={{ bgcolor: "#426765" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          // indicatorColor='secondary'
          textColor='inherit'
          variant='fullWidth'
          aria-label='full width tabs example'
          TabIndicatorProps={{
            style: {
              backgroundColor: "#CFC781",
            },
          }}>
          <Tab label='我開的團' {...a11yProps(0)} />
          <Tab label='加入的團' {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}>
        <TabPanel value={value} index={0} dir={theme.direction}>
          {yourCreateGroup.map((item, index) => (
            <Box
              key={index}
              sx={{
                width: "80%",
                height: "auto",
                boxShadow: 2,
                borderRadius: 6,
                padding: 3,
                margin: 3,
              }}>
              <Font>{item.group_title}</Font>
              <Font>
                {
                  new Date(item.start_date.seconds * 1000)
                    .toLocaleString()
                    .split(" ")[0]
                }
                ~
                {
                  new Date(item.end_date.seconds * 1000)
                    .toLocaleString()
                    .split(" ")[0]
                }
              </Font>
              <Font>{item.city}</Font>
            </Box>
          ))}
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          Item Two
        </TabPanel>
      </SwipeableViews>
    </Box>
  );
}
