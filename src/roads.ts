const Graph = require("graph-data-structure");

const graph = new Graph();

const roads = [
  {
    points: [
      [-16, -16],
      [-16, 8],
    ],
  },
  {
    points: [
      [-16, 8],
      [-16, 16],
    ],
  },
  {
    points: [
      [-16, 16],
      [16, 16],
    ],
  },
  {
    points: [
      [16, 16],
      [16, 8],
    ],
  },
  {
    points: [
      [16, 8],
      [16, -16],
    ],
  },
  {
    points: [
      [16, -16],
      [2, -16],
    ],
  },
  {
    points: [
      [2, -16],
      [-16, -16],
    ],
  },
  {
    points: [
      [-12, 0],
      [0, 0],
    ],
    oneWay: true,
  },
  {
    points: [
      [-12, 0],
      [-12, 8],
    ],
    oneWay: true,
  },
  {
    points: [
      [-16, 8],
      [-12, 8],
    ],
    oneWay: true,
  },
  {
    points: [
      [-12, 8],
      [0, 8],
    ],
    oneWay: true,
  },
  {
    points: [
      [0, 8],
      [0, 0],
    ],
    oneWay: true,
  },
  {
    points: [
      [0, 8],
      [12, 8],
    ],
    oneWay: true,
  },
  {
    points: [
      [12, 8],
      [16, 8],
    ],
    oneWay: true,
  },
  {
    points: [
      [12, 8],
      [12, -4],
    ],
  },
  {
    points: [
      [12, -4],
      [12, -12],
    ],
    oneWay: true,
  },
  {
    points: [
      [12, -12],
      [-4, -12],
    ],
    oneWay: true,
  },
  {
    points: [
      [-4, -12],
      [-4, -4],
    ],
    oneWay: true,
  },
  {
    points: [
      [-4, -4],
      [12, -4],
    ],
    oneWay: true,
  },
  {
    points: [
      [2, -16],
      [2, -12],
    ],
    oneWay: true,
  },
];

const getLength = (points: any) => {
  const sortedX = points.map((x: any) => x[0]).sort((a: any, b: any) => a - b);
  const w = sortedX[1] - sortedX[0];

  const sortedY = points.map((x: any) => x[1]).sort((a: any, b: any) => a - b);
  const h = sortedY[1] - sortedY[0];

  return Math.max(w, h);
};

const junctions = [
  // @ts-ignore
  ...new Set(
    [].concat
      .apply([], roads.map((x) => x.points) as any)
      .map((x: any) => x.join(","))
  ),
];

junctions.forEach((x) => graph.addNode(x));

roads.forEach((x: any) => {
  graph.addEdge(
    x.points[0].join(","),
    x.points[1].join(","),
    getLength(x.points)
  );
  if (!x.oneWay) {
    graph.addEdge(
      x.points[1].join(","),
      x.points[0].join(","),
      getLength(x.points)
    );
  }
});

console.log(graph.serialize());
try {
  console.log(graph.shortestPath("-16,-16", "0,0"));
} catch (e) {
  console.log("No route found");
}

export default roads;
