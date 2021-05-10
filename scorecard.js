import { d as defineStanzaElement } from './index-60baf012.js';
import { l as loadData } from './load-data-cd9af903.js';
import { a as appendDlButton } from './metastanza_utils-a3ff1297.js';

async function scorecard(stanza, params) {
  function css(key) {
    return getComputedStyle(stanza.root.host).getPropertyValue(key);
  }

  const dataset = await loadData(params["data-url"], params["data-type"]);
  const width = params["width"];
  const height = params["height"];
  const padding = params["padding"];

  stanza.render({
    template: "stanza.html.hbs",
    parameters: {
      scorecards: [
        {
          key: Object.keys(dataset)[0],
          value: Object.values(dataset)[0],
        },
      ],
      width,
      height,
      padding,
    },
  });

  const chartWrapper = stanza.root.querySelector(".chart-wrapper");
  chartWrapper.setAttribute(
    `style`,
    `width: ${width}px; height: ${height}px; padding: ${padding}px`
  );

  const scorecardSvg = stanza.root.querySelector("#scorecardSvg");
  scorecardSvg.setAttribute(
    "height",
    `${
      Number(css("--togostanza-key-font-size")) +
      Number(css("--togostanza-value-font-size"))
    }`
  );

  const key = stanza.root.querySelector("#key");
  const value = stanza.root.querySelector("#value");
  if (params["legend"] === "false") {
    key.setAttribute(`style`, `display: none;`);
  }

  key.setAttribute("y", Number(css("--togostanza-key-font-size")));
  key.setAttribute("fill", "var(--togostanza-key-font-color)");
  value.setAttribute(
    "y",
    Number(css("--togostanza-key-font-size")) +
      Number(css("--togostanza-value-font-size"))
  );
  value.setAttribute("fill", "var(--togostanza-value-font-color)");
  key.setAttribute("font-size", css("--togostanza-key-font-size"));
  value.setAttribute("font-size", css("--togostanza-value-font-size"));

  //menu button placement
  appendDlButton(
    stanza.root.querySelector(".chart-wrapper"),
    stanza.root.querySelector(".scorecard-svg"),
    "scorecard",
    stanza
  );

  const menuButton = stanza.root.querySelector("#dl_button");
  const menuList = stanza.root.querySelector("#dl_list");
  switch (params["metastanza-menu-placement"]) {
    case "top-left":
      menuButton.setAttribute("class", "dl-top-left");
      menuList.setAttribute("class", "dl-top-left");
      break;
    case "top-right":
      menuButton.setAttribute("class", "dl-top-right");
      menuList.setAttribute("class", "dl-top-right");
      break;
    case "bottom-left":
      menuButton.setAttribute("class", "dl-bottom-left");
      menuList.setAttribute("class", "dl-bottom-left");
      break;
    case "bottom-right":
      menuButton.setAttribute("class", "dl-bottom-right");
      menuList.setAttribute("class", "dl-bottom-right");
      break;
    case "none":
      menuButton.setAttribute("class", "dl-none");
      menuList.setAttribute("class", "dl-none");
      break;
  }
}

var stanzaModule = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': scorecard
});

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "scorecard",
	"stanza:label": "Scorecard",
	"stanza:definition": "Scorecard MetaStanza",
	"stanza:type": "Stanza",
	"stanza:display": "Image",
	"stanza:provider": "Togostanza",
	"stanza:license": "MIT",
	"stanza:author": "c-nakashima",
	"stanza:address": "nakashima@penqe.com",
	"stanza:contributor": [
],
	"stanza:created": "2020-12-02",
	"stanza:updated": "2020-12-02",
	"stanza:parameter": [
	{
		"stanza:key": "data-url",
		"stanza:example": "https://sparql-support.dbcls.jp/sparqlist/api/metastanza_scorecard?tax_id=9606&gene_id=BRCA1",
		"stanza:description": "Data source URL",
		"stanza:required": true
	},
	{
		"stanza:key": "data-type",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"json",
			"tsv",
			"csv",
			"sparql-results-json"
		],
		"stanza:example": "json",
		"stanza:description": "Data type",
		"stanza:required": true
	},
	{
		"stanza:key": "width",
		"stanza:type": "number",
		"stanza:example": 200,
		"stanza:description": "Width"
	},
	{
		"stanza:key": "height",
		"stanza:type": "number",
		"stanza:example": 70,
		"stanza:description": "Height"
	},
	{
		"stanza:key": "padding",
		"stanza:type": "number",
		"stanza:example": 50,
		"stanza:description": "Padding"
	},
	{
		"stanza:key": "legend",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"true",
			"false"
		],
		"stanza:example": true,
		"stanza:description": "Show key name"
	},
	{
		"stanza:key": "metastanza-menu-placement",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"top-left",
			"top-right",
			"bottom-left",
			"bottom-right",
			"none"
		],
		"stanza:example": "top-right",
		"stanza:description": "Menu button placement"
	}
],
	"stanza:about-link-placement": "bottom-right",
	"stanza:style": [
	{
		"stanza:key": "--togostanza-font-family",
		"stanza:type": "text",
		"stanza:default": "Helvetica Neue",
		"stanza:description": "Font family"
	},
	{
		"stanza:key": "--togostanza-key-font-color",
		"stanza:type": "color",
		"stanza:default": "#6590e6",
		"stanza:description": "Font color for key"
	},
	{
		"stanza:key": "--togostanza-key-font-size",
		"stanza:type": "number",
		"stanza:default": 16,
		"stanza:description": "Font size for key"
	},
	{
		"stanza:key": "--togostanza-key-font-weight",
		"stanza:type": "number",
		"stanza:default": 400,
		"stanza:description": "Font weight for key"
	},
	{
		"stanza:key": "--togostanza-value-font-color",
		"stanza:type": "color",
		"stanza:default": "#4E5059",
		"stanza:description": "Font color for value"
	},
	{
		"stanza:key": "--togostanza-value-font-size",
		"stanza:type": "number",
		"stanza:default": 36,
		"stanza:description": "Font size for value"
	},
	{
		"stanza:key": "--togostanza-value-font-weight",
		"stanza:type": "number",
		"stanza:default": 600,
		"stanza:description": "Font weight for value"
	},
	{
		"stanza:key": "--togostanza-background-color",
		"stanza:type": "color",
		"stanza:default": "rgba(255,255,255,0)",
		"stanza:description": "Background color"
	}
]
};

var templates = [
  ["stanza.html.hbs", {"1":function(container,depth0,helpers,partials,data,blockParams) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "    <svg id=\"scorecardSvg\" class=\"scorecard-svg\">\n      <text id=\"text\" x=\"50%\" y=\"50%\" text-anchor=\"middle\">\n        <tspan id=\"key\" x=\"50%\" y=\"16px\" font-size=\"16px\">\n          "
    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? lookupProperty(stack1,"key") : stack1), depth0))
    + "\n        </tspan>\n        <tspan id=\"value\" x=\"50%\" y=\"48px\" font-size=\"32px\">\n          "
    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? lookupProperty(stack1,"value") : stack1), depth0))
    + "\n        </tspan>\n      </text>\n    </svg>\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data,blockParams) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\"chart-wrapper\">\n"
    + ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"scorecards") : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 1, blockParams),"inverse":container.noop,"data":data,"blockParams":blockParams,"loc":{"start":{"line":2,"column":2},"end":{"line":13,"column":11}}})) != null ? stack1 : "")
    + "</div>";
},"useData":true,"useBlockParams":true}]
];

const url = import.meta.url.replace(/\?.*$/, '');

defineStanzaElement({stanzaModule, metadata, templates, url});
//# sourceMappingURL=scorecard.js.map
