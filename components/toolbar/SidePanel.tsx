import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Slider, TextField, Tooltip } from "@mui/material";
import { LineWeightSliderValueLabel } from "./Toolbar";
import { HexColorPicker } from "react-colorful";

export default function SidePanel() {
  const drawer = (
    <>
      <List>
        <Box sx={{ width: 200 }} className="p-2">
          <TextField id="outlined-number" label="Border width" type="number" />
        </Box>

        <Box sx={{ width: 200 }} className="p-2">
          <Slider
            valueLabelDisplay="auto"
            max={100}
            min={1}
            slots={{
              valueLabel: LineWeightSliderValueLabel,
            }}
            aria-label="Border width"
            value={100}
            // onChange={(_, value) => handleChangeStrokeWidth(value as number)}
          />
        </Box>

        <ListItemText primary="Border color" />

        <HexColorPicker
          className="p-5"
          color={undefined}
          onChange={undefined}
        />

        <ListItemText primary="Fill color" />

        <HexColorPicker
          className="p-5"
          color={undefined}
          onChange={undefined}
        />
      </List>
    </>
  );

  return (
    <Drawer
      variant="permanent"
      // ModalProps={{
      //   keepMounted: true,
      // }}
    >
      {drawer}
    </Drawer>
  );
}
