import Stanza from "togostanza/stanza";
import * as d3 from "d3";
import loadData from "togostanza-utils/load-data";
// import ToolTip from "@/lib/ToolTip";
import Legend from "@/lib/Legend";
import {
  downloadSvgMenuItem,
  downloadPngMenuItem,
  downloadJSONMenuItem,
  downloadCSVMenuItem,
  downloadTSVMenuItem,
  copyHTMLSnippetToClipboardMenuItem,
  appendCustomCss,
} from "togostanza-utils";

export default class Linechart extends Stanza {
  menu() {
    return [
      downloadSvgMenuItem(this, "linechart"),
      downloadPngMenuItem(this, "linechart"),
      downloadJSONMenuItem(this, "linechart", this._data),
      downloadCSVMenuItem(this, "linechart", this._data),
      downloadTSVMenuItem(this, "linechart", this._data),
      copyHTMLSnippetToClipboardMenuItem(this),
    ];
  }

  async render() {
    appendCustomCss(this, this.params["custom-css-url"]);

    const css = (key) => getComputedStyle(this.element).getPropertyValue(key);

    //width、height、padding

    const padding = this.params["padding"];

    //data
    const xKeyName = this.params["category"];
    const yKeyName = this.params["value"];
    const xAxisTitle = this.params["category-title"];
    const yAxisTitle = this.params["value-title"];
    const showXTicks = this.params["xtick"] === "true" ? true : false;
    const showYTicks = this.params["ytick"] === "true" ? true : false;
    const showLegend = this.params["legend"] === "true" ? true : false;
    const groupKeyName = this.params["group-by"];
    const showXGrid = this.params["xgrid"] === "true" ? true : false;
    const showYGrid = this.params["ygrid"] === "true" ? true : false;
    const xLabelAngle = parseInt(this.params["xlabel-angle"]) || -90;
    const yLabelAngle = parseInt(this.params["ylabel-angle"]) || 0;

    this.renderTemplate({
      template: "stanza.html.hbs",
    });

    const root = this.root.querySelector(":scope > div");

    // On change params rerender - Check if legend and svg already existing and remove them -
    const existingLegend = this.root.querySelector("togostanza--legend");
    if (existingLegend) {
      existingLegend.remove();
    }
    const existingSVG = this.root.querySelector("svg");
    if (existingSVG) {
      existingSVG.remove();
    }
    // ====

    // Add legend

    if (showLegend) {
      this.legend = new Legend();
      root.append(this.legend);
    }

    const values = await loadData(
      this.params["data-url"],
      this.params["data-type"]
    );
    this._data = values;

    // find most long legend caption

    const dataMin = d3.min(values, (d) => +d[yKeyName]);
    const dataMax = d3.max(values, (d) => +d[yKeyName]);

    const width = parseInt(this.params["width"]);
    const height = parseInt(this.params["height"]);
    const MARGIN = { TOP: 10, BOTTOM: 60, LEFT: 50, RIGHT: 10 };
    const HEIGHT = height - MARGIN.TOP - MARGIN.BOTTOM;
    const WIDTH = width - MARGIN.LEFT - MARGIN.RIGHT;

    const el = this.root.querySelector("#linechart-d3");

    const svg = d3
      .select(el)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const graphArea = svg.append("g").attr("class", "chart");

    const linesArea = graphArea
      .append("g")
      .attr("class", "lines")
      .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`);

    const xAxisArea = graphArea
      .append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(${MARGIN.LEFT},${HEIGHT + MARGIN.TOP})`);

    const yTitleArea = graphArea.append("g").attr("class", "y axis title");
    const xTitleArea = graphArea
      .append("g")
      .attr("class", "x axis title")
      .attr("dominant-baseline", "hanging")
      .attr(
        "transform",
        `translate(0,${HEIGHT + MARGIN.TOP + MARGIN.BOTTOM / 2})`
      );

    const yTitle = yTitleArea
      .append("text")
      .text(yAxisTitle)
      .attr("text-anchor", "middle")
      .attr("transform", `rotate(-90)`)
      .attr("x", -HEIGHT / 2 - MARGIN.TOP)
      .attr("y", 10);

    xTitleArea
      .append("text")
      .text(xAxisTitle)
      .attr("text-anchor", "middle")
      .attr("x", MARGIN.LEFT + WIDTH / 2);

    const yAxisArea = graphArea
      .append("g")
      .attr("transform", `translate(${MARGIN.LEFT},${MARGIN.TOP})`)
      .attr("class", "y axis");

    /// Axes preparation
    const xAxisLabels = [...new Set(values.map((d) => d[xKeyName]))];

    const x = d3.scaleBand().domain(xAxisLabels).range([0, WIDTH]);
    const y = d3.scaleLinear().domain([dataMin, dataMax]).range([HEIGHT, 0]);

    // Show/hide axes ticks
    if (showXTicks) {
      let xdy = "0.5em";
      let xx = "-0.7em";
      let textAnchor = "end";
      if ((xLabelAngle < 0) & (xLabelAngle !== -90)) {
        xdy = "0.8em";
        textAnchor = "end";
      }
      if ((xLabelAngle > 0) & (xLabelAngle !== 90)) {
        xx = "0.7em";
        xdy = "0.71em";
        textAnchor = "start";
      }

      xAxisArea
        .call(d3.axisBottom(x).tickSizeOuter(0))
        .selectAll("text")
        .attr("text-anchor", textAnchor)
        .attr("x", xx)
        .attr("y", "0")
        .attr("dy", xdy)
        .attr("transform", `rotate(${xLabelAngle})`);
    }
    if (showYTicks) {
      yAxisArea
        .call(d3.axisLeft(y))
        .selectAll("text")
        .attr("text-anchor", "end")
        .attr("transform", `rotate(${yLabelAngle})`);
    }

    // ====

    // If any grouping check
    if (groupKeyName) {
      const categorizedData = d3.group(values, (d) => d[groupKeyName]);
      const groups = [...categorizedData.keys()];

      const color = d3
        .scaleOrdinal()
        .domain(groups)

        // TODO make colors from palette css
        .range(["#e41a1c", "#377eb8", "#4daf4a"]);

      linesArea
        .append("g")
        .attr("class", "data-lines")
        .selectAll("g")
        .data(categorizedData)
        .enter()
        .append("path")
        .attr("id", (_, i) => "data-" + i)
        .attr("class", "data-lines")
        .attr("fill", "none")
        .attr("stroke", function (d) {
          return color(d[0]);
        })
        .attr("stroke-width", 1.5)
        .attr("d", function (d) {
          return d3
            .line()
            .x(function (d) {
              return x(d[xKeyName]) + x.bandwidth() / 2;
            })
            .y(function (d) {
              return y(+d[yKeyName]);
            })(d[1]);
        });

      // Add legend

      this.legend.setup(
        groups.map((item, index) => ({
          id: "" + index,
          label: item,
          color: color(item),
          node: this.root.querySelector(`svg #data-${index}`),
        })),
        this.root.querySelector("main"),
        {
          fadeoutNodes: this.root.querySelectorAll("path.data-lines"),
          position: ["top", "right"],
          fadeProp: "stroke-opacity",
        }
      );

      // ====
      // Show/hide grid lines
      if (showXGrid) {
        const xAxisGridGenerator = d3
          .axisBottom(x)
          .tickSize(-HEIGHT)
          .tickFormat("")
          .ticks(10);

        const xAxisGrid = linesArea
          .append("g")
          .attr("class", "x gridlines")
          .attr("transform", "translate(0," + HEIGHT + ")")
          .call(xAxisGridGenerator);
      }

      if (showYGrid) {
        const yAxisGridGenerator = d3
          .axisLeft(y)
          .tickSize(-WIDTH)
          .tickFormat("")
          .ticks(10);

        const yAxisGrid = linesArea
          .append("g")
          .attr("class", "y gridlines")
          .call(yAxisGridGenerator);
      }
    } else {
      // else just draw line

      return;
    }
  }
}
