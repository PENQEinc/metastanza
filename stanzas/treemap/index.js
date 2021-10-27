import Stanza from "togostanza/stanza";
import * as d3 from "d3";
import uid from "./uid";
//import data from "./sampleData2";
import loadData from "@/lib/load-data";

import {
  downloadSvgMenuItem,
  downloadPngMenuItem,
  appendCustomCss,
} from "@/lib/metastanza_utils.js";

export default class TreeMapStanza extends Stanza {
  menu() {
    return [
      downloadSvgMenuItem(this, "treeMapstanza"),
      downloadPngMenuItem(this, "treeMapstanza"),
    ];
  }

  async render() {
    appendCustomCss(this, this.params["custom-css-url"]);

    const width = this.params["width"];
    const height = this.params["height"];
    const colorScale = this.params["color-scale"];
    const data = await loadData(
      this.params["data-url"],
      this.params["data-type"]
    );

    this.renderTemplate({ template: "stanza.html.hbs" });

    //Add root element if there are more than one elements without parent. D3 cannot precess data with more than one root elements
    let rootElemIndexes = [];
    for (let i = 0; i < data.length - 1; i++) {
      if (!data[i]?.parent) {
        rootElemIndexes.push(i);
      }
    }
    if (rootElemIndexes.length > 1) {
      data.push({ id: -1, value: "", label: "" });

      rootElemIndexes.forEach((index) => {
        data[index].parent = -1;
      });
    }

    const treeMapElement = this.root.querySelector("#treemap");

    draw(treeMapElement, data, width, height, colorScale);
  }
}

function draw(el, dataset, width, height, colorScale) {
  // create nested structure by item.parent
  const nested = d3
    .stratify()
    .id(function (d) {
      return d.id;
    })
    .parentId(function (d) {
      return d.parent;
    })(dataset);

  const x = d3.scaleLinear().rangeRound([0, width]);
  const y = d3.scaleLinear().rangeRound([0, height]);

  // make path-like string for node
  const name = (d) => {
    if (d.data.data.id === -1) {
      return "/";
    }
    return d
      .ancestors()
      .reverse()
      .map((d) => {
        return d.data.data.label;
      })
      .join("/");
  };

  const format = d3.format(",d");

  const color = d3.scaleOrdinal(d3[colorScale]);

  function tile(node, x0, y0, x1, y1) {
    d3.treemapBinary(node, 0, 0, width, height);
    for (const child of node.children) {
      child.x0 = x0 + (child.x0 / width) * (x1 - x0);
      child.x1 = x0 + (child.x1 / width) * (x1 - x0);
      child.y0 = y0 + (child.y0 / height) * (y1 - y0);
      child.y1 = y0 + (child.y1 / height) * (y1 - y0);
    }
  }

  const treemap = (data) =>
    d3.treemap().tile(tile)(
      d3.hierarchy(data).sum((d) => d?.children?.length || 1)
      //.sort((a, b) => b?.children?.length || 1 - a?.children?.length || 1)
    );

  const svg = d3
    .select(el)
    .append("svg")
    .attr("viewBox", [0.5, -30.5, width, height + 30])
    .style("font", "10px sans-serif");

  let group = svg.append("g").call(render, treemap(nested));

  function render(group, root) {
    const dMax = d3.max(root, (d) => d?.children?.length || 1);
    const dMin = d3.min(root, (d) => d?.children?.length || 1);

    const node = group
      .selectAll("g")
      .data(root.children.concat(root))
      .join("g");

    node
      .filter((d) => (d === root ? d.parent : d.children))
      .attr("cursor", "pointer")
      .on("click", (event, d) => (d === root ? zoomout(root) : zoomin(d)));

    node
      .append("title")
      .text((d) =>
        d === root
          ? ""
          : `${name(d)}\n${
              d?.children
                ? format(d?.children?.length)
                : d.data.data.description
            }`
      );

    node
      .append("rect")
      .attr("id", (d) => (d.leafUid = uid("leaf")).id)
      .attr("fill", (d) =>
        d === root ? "#fff" : color((d.value - dMin) / (dMax - dMin))
      )
      .attr("stroke", "#fff");

    node
      .append("clipPath")
      .attr("id", (d) => (d.clipUid = uid("clip")).id)
      .append("use")
      .attr("href", (d) => d.leafUid.href);

    const txt = node
      .append("text")
      .attr("clip-path", (d) => d.clipUid)
      .attr("font-weight", (d) => (d === root ? "bold" : null))

      .attr("y", (d) => `${d.y0 + 10}px`)
      .attr("x", "0.5em")
      //.selectAll("tspan")
      // .data((d) => {
      //   return d === root ? name(d) : d.data.data.label;
      //   // .split(/(?=[A-Z][^A-Z])/g)
      //   // .concat(format(d.value));
      // })
      // .join("tspan")
      // .attr("x", 3)
      // .attr(
      //   "y",
      //   (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`
      // )
      // .attr("fill-opacity", (d, i, nodes) =>
      //   i === nodes.length - 1 ? 0.7 : null
      // )
      // .attr("font-weight", (d, i, nodes) =>
      //   i === nodes.length - 1 ? "normal" : null
      // )
      .text((d) => {
        if (d === root) {
          return name(d);
        } else if (d?.children?.length) {
          return `${d.data.data.label} : ${d?.children?.length}`;
        }
        return `${d.data.data.label}`;
      });

    group.call(position, root);
  }

  function wrap() {
    const text = d3.select(this).selectAll("text");

    text.each(function () {
      let text = d3.select(this);

      let rectWidth = d3
        .select(text.node().parentNode)
        .select("rect")
        .node()
        .getAttribute("width");

      //get to know if this is a root element (white bar at the top)
      const isRoot = Math.round(rectWidth) === Math.round(width);

      let words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        x = text.attr("x") || 0,
        y = text.attr("y") || 0,
        dy = 0,
        tspan = text
          .text(null)
          .append("tspan")
          .attr("x", x)
          .attr("y", y)
          .attr("dy", dy + "em");
      console.log(words);
      while ((word = words.pop())) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > rectWidth) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text
            .append("tspan")
            .attr("x", x)
            .attr("y", y)
            .attr("dy", ++lineNumber * lineHeight + dy + "em")
            .text(word);
        }
      }
    });
  }
  //place elements according to data
  function position(group, root) {
    group
      .selectAll("g")
      .attr("transform", (d) =>
        d === root ? `translate(0,-30)` : `translate(${x(d.x0)},${y(d.y0)})`
      )
      .select("rect")
      .attr("width", (d) => (d === root ? width : x(d.x1) - x(d.x0)))
      .attr("height", (d) => (d === root ? 30 : y(d.y1) - y(d.y0)));
  }

  // When zooming in, draw the new nodes on top, and fade them in.
  function zoomin(d) {
    const group0 = group.attr("pointer-events", "none");
    const group1 = (group = svg.append("g").call(render, d));

    x.domain([d.x0, d.x1]);
    y.domain([d.y0, d.y1]);

    svg
      .transition()
      .duration(750)
      .call((t) => group0.transition(t).remove().call(position, d.parent))
      .call((t) =>
        group1
          .transition(t)
          .attrTween("opacity", () => d3.interpolate(0, 1))
          .call(position, d)
      )
      .on("end", wrap);
  }

  // When zooming out, draw the old nodes on top, and fade them out.
  function zoomout(d) {
    const group0 = group.attr("pointer-events", "none");
    const group1 = (group = svg.insert("g", "*").call(render, d.parent));

    x.domain([d.parent.x0, d.parent.x1]);
    y.domain([d.parent.y0, d.parent.y1]);

    svg
      .transition()
      .duration(750)
      .call((t) =>
        group0
          .transition(t)
          .remove()
          .attrTween("opacity", () => d3.interpolate(1, 0))
          .call(position, d)
      )
      .call((t) => group1.transition(t).call(position, d.parent))
      .on("end", wrap);
  }
}