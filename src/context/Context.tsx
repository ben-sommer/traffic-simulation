import { createContext } from "react";

const Context = createContext<{
  roads: any[];
  junctions: any[];
  selected: any[];
  junctionClick: (coords: number[]) => void;
  route: any[];
  graph: any;
}>({
  roads: [],
  junctions: [],
  selected: [],
  junctionClick: (coords) => {},
  route: [],
  graph: null,
});

export default Context;
