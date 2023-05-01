import { createContext } from "react";

const AllIndoorLocationContext = createContext({
  selectedItem: null,
  setSelectedItem: () => {},
  buildingSelectedItem: null,
  setBuildingSelectedItem: () => {},
  serviceSelectedItem: null,
  setServiceSelectedItem: () => {},
});

export default AllIndoorLocationContext;
