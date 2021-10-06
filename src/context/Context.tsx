import { createContext } from "react";

const Context = createContext<{
  roads: any[];
  junctions: any[];
  selected: any[];
  junctionClick: (coords: number[]) => void;
  route: any[];
  graph: any;
  setEnableControls: (val: boolean) => void;
  enableControls: boolean;
}>({
  roads: [],
  junctions: [],
  selected: [],
  junctionClick: (coords) => {},
  route: [],
  graph: null,
  setEnableControls: (val) => {},
  enableControls: true
});

export default Context;
