import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import qs from "qs";

export const getIndoorLocationsById = createAsyncThunk(
  "indoor_locations/get",
  async (building_id) => {
    const parameters = {
      get_list_of_indoor_locations_by_building_id: true,
      building_id: building_id,
    };
    const response = await axios({
      method: "post",
      url: "https://www.cs.csub.edu/~runnermaps/backend/index.php",
      data: qs.stringify(parameters),
      dataType: "JSON",
      withCredentials: true,
    });
    console.log("target locations from function", response.data);
    return response.data;
  }
);
