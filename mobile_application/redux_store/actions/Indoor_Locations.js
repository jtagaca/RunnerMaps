import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import qs from "qs";

export const fetchTargetLocations = createAsyncThunk(
  "targetLocations/fetch",
  async (buildingId) => {
    const obj = {
      get_list_of_indoor_locations_by_building_id: true,
      building_id: buildingId,
    };
    const response = await axios({
      method: "post",
      url: "https://www.cs.csub.edu/~runnermaps/backend/index.php",
      data: qs.stringify(obj),
      dataType: "JSON",
      withCredentials: true,
    });
    console.log("target locations from function", response.data);
    return response.data;
  }
);
