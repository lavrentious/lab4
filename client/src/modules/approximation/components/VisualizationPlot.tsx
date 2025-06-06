import React, { useMemo } from "react";
import Plot from "react-plotly.js";
import { ApproximationResponse } from "../api/types";
import {
  fExprToFunction,
  generatePoints,
  hydrateFExpr,
  pointsToXsYs,
} from "../utils/utils";

interface VisualizationPlotProps {
  result: ApproximationResponse;
}

const VisualizationPlot: React.FC<VisualizationPlotProps> = ({ result }) => {
  const fn = useMemo(() => {
    if (!result.data) return null;
    return fExprToFunction(
      hydrateFExpr(result.data.f_expr, result.data.parameters),
    );
  }, [result]);
  const { xs, ys } = useMemo(() => {
    if (!fn || !result.points) return { xs: [], ys: [] };
    const points = generatePoints(fn, result.points);
    console.log("generated points", points);
    return points;
  }, [result, fn]);
  const { originalXs, originalYs } = useMemo(() => {
    const { xs, ys } = pointsToXsYs(result.points || []);
    return { originalXs: xs, originalYs: ys };
  }, [result]);

  return (
    <Plot
      style={{ width: "100%", height: "450px" }}
      useResizeHandler={true}
      config={{ responsive: true }}
      data={[
        {
          x: xs.map((x) => +x),
          y: ys.map((y) => +y),
          type: "scatter",
          mode: "lines",
          line: { color: "blue" },
          name: "ф(x)",
        },
        {
          x: originalXs || [],
          y: originalYs || [],
          type: "scatter",
          mode: "markers",
          marker: { color: "red", size: 8 },
          name: "input points",
        },
      ]}
      layout={{
        title: { text: "Result" },
        xaxis: { title: { text: "x" } },
        yaxis: { title: { text: "ф(x)" } },
        autosize: true,
      }}
    />
  );
};

export default VisualizationPlot;
