import { createContext } from "react";

const AllIndoorLocationContext = createContext({
  selectedItem: null,
  setSelectedItem: () => {},
});

export default AllIndoorLocationContext;
