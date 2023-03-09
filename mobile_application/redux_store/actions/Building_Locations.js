import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import qs from "qs";

export const fetchBuildings = createAsyncThunk("buildings/fetch", async () => {
  const obj = { get_list_of_buildings: true };
  const response = await axios({
    method: "post",
    url: "https://42371-jtagaca-gitpodphpdebug-7kfr5n7yuwe.ws-us89b.gitpod.io/index.php",
    data: qs.stringify(obj),
    dataType: "JSON",
    withCredentials: true,
  });
  console.log("buildings from function", response.data);
  return response.data;
});
