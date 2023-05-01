import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import qs from "qs";

export const getBuildings = createAsyncThunk("buildings/fetch", async () => {
  const parameters = { get_list_of_buildings: true };
  const response = await axios({
    method: "post",
    url: "https://www.cs.csub.edu/~runnermaps/backend/index.php",
    data: qs.stringify(parameters),
    dataType: "JSON",
    withCredentials: true,
  });
  return response.data;
});
