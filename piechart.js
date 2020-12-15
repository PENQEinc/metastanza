import { d as defineStanzaElement } from './stanza-element-6585decd.js';
import { e as embed } from './vega-embed.module-05baedf9.js';
import './vega.module-01b84c84.js';
import './timer-be811b16.js';

async function piechart(stanza, params) {
  let spec = await fetch(params["src-url"]).then((res) => res.json());

  //stanza（描画範囲）のwidth・height（うまく効かない…広くなってしまう？）
  // spec.width = params["width"]
  // spec.height = params["height"]
  // spec.autosize = params["autosize"]
  spec.padding = {"left": 5, "top": 5, "right": 150, "bottom": 5};

// scales: カラースキームを指定
  spec.scales[0].range = [
    'var(--series-0-color)',
    'var(--series-1-color)',
    'var(--series-2-color)',
    'var(--series-3-color)',
    'var(--series-4-color)',
    'var(--series-5-color)'
  ];


//円の描画について
  //（デフォルトのコントローラを削除） 
  for (let signal of spec.signals)
    { 
      delete(signal.bind); 
    } 
  
  spec.signals[2].value = params["inner-padding-angle"];
  spec.signals[3].value = params["inner-radius"];

  spec.marks[0].encode = {
    "enter": {
      "fill": {"scale": "color", "field": "id"},
      "x": {"signal": "width / 2"},
      "y": {"signal": "height / 2"}
    },
    "update": {
      "startAngle": {"field": "startAngle"},
      "endAngle": {"field": "endAngle"},
      "padAngle": {"signal": "padAngle"},
      "innerRadius": {"signal": "innerRadius"},
      "outerRadius": {"signal": "width / 2"},
      "cornerRadius": {"signal": "cornerRadius"},
      "fill": {"scale": "color", "field": "id"}
    },
    "hover": {
      "fill": {"value": "var(--emphasized-color)"}
    }
  };

  // // hover時にvalueを出したい
  // spec.marks[1].encode = {
  //   "enter": {
  //     // "align": {"value": "center"},
  //     // "baseline": {"value": "bottom"},
  //     "fill": {"value": "var(--emphasized-color)"},
  //     // "font":{"value": getComputedStyle(stanza.root.host).getPropertyValue("--label-font")},
  //     // "fontSize": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--fontsize-of-value")},
  //     // "fontWeight": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--fontweight-of-value")}
  //   },
  //   "update": {
  //     "x": {"signal": "tooltip.category", "band": 0.5},
  //     "y": {"signal": "tooltip.amount", "offset": -1},
  //     "text": {"signal": "tooltip.id"},
  //     "fillOpacity": [
  //       {"test": "datum === tooltip", "value": 0},
  //       {"value": 1}
  //     ]
  //   }
  // }

  //legendを出す
  spec.legends =
  [
    {
      "fill": "color",
      "title": params["title-of-legend"],
      "orient": "none",
      "legendX": "220",
      "legendY": "5",
      "encode": {
        "labels": {"update": {"text": {"field": "value"}}}
      }
    }
  ];

  const el = stanza.root.querySelector("main");
  const opts = {
    renderer: "svg"
  };
  await embed(el, spec, opts);
}

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "piechart",
	"stanza:label": "piechart",
	"stanza:definition": "Vega wrapped piechart for MetaStanza",
	"stanza:type": "Stanza",
	"stanza:context": "Environment",
	"stanza:display": "Chart",
	"stanza:provider": "TogoStanza",
	"stanza:license": "MIT",
	"stanza:author": "TogoStanza",
	"stanza:address": "admin@biohackathon.org",
	"stanza:contributor": [
],
	"stanza:created": "2020-11-05",
	"stanza:updated": "2020-11-05",
	"stanza:parameter": [
	{
		"stanza:key": "src-url",
		"stanza:example": "https://vega.github.io/vega/examples/pie-chart.vg.json",
		"stanza:description": "source url which returns Vega specification compliant JSON",
		"stanza:required": true
	},
	{
		"stanza:key": "width",
		"stanza:type": "number",
		"stanza:example": "200",
		"stanza:description": "width of your stanza"
	},
	{
		"stanza:key": "height",
		"stanza:type": "number",
		"stanza:example": "200",
		"stanza:description": "height of your stanza"
	},
	{
		"stanza:key": "autosize",
		"stanza:type": "number",
		"stanza:example": "none",
		"stanza:description": ""
	},
	{
		"stanza:key": "color-scheme",
		"stanza:example": "pastel2",
		"stanza:description": "pastel2",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"pastel1",
			"pastel2",
			"set1"
		],
		"stanza:required": false
	},
	{
		"stanza:key": "inner-padding-angle",
		"stanza:example": "0",
		"stanza:description": "angle of inner padding.(0-0.1)",
		"stanza:required": false
	},
	{
		"stanza:key": "inner-radius",
		"stanza:example": "0",
		"stanza:description": "inner radius of your pie.(0-99)",
		"stanza:required": false
	},
	{
		"stanza:key": "title-of-legend",
		"stanza:type": "string",
		"stanza:example": "Title of this legend",
		"stanza:description": "title of legends"
	}
],
	"stanza:about-link-placement": "bottom-right",
	"stanza:style": [
	{
		"stanza:key": "--emphasized-color",
		"stanza:type": "color",
		"stanza:default": "#ec7d8d",
		"stanza:description": "emphasized color when you hover on labels and rects"
	},
	{
		"stanza:key": "--series-0-color",
		"stanza:type": "color",
		"stanza:default": "#FFC39E",
		"stanza:description": "second color"
	},
	{
		"stanza:key": "--series-1-color",
		"stanza:type": "color",
		"stanza:default": "#FF8DB8",
		"stanza:description": "third color"
	},
	{
		"stanza:key": "--series-2-color",
		"stanza:type": "color",
		"stanza:default": "#C690C6",
		"stanza:description": "forth color"
	},
	{
		"stanza:key": "--series-3-color",
		"stanza:type": "color",
		"stanza:default": "#6992D1",
		"stanza:description": "fifth color"
	},
	{
		"stanza:key": "--series-4-color",
		"stanza:type": "color",
		"stanza:default": "#71B093",
		"stanza:description": "fifth color"
	},
	{
		"stanza:key": "--series-5-color",
		"stanza:type": "color",
		"stanza:default": "#94BC8A",
		"stanza:description": "first color"
	}
]
};

var templates = [
  ["stanza.html.hbs", {"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<p class=\"greeting\">"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"greeting") || (depth0 != null ? lookupProperty(depth0,"greeting") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"greeting","hash":{},"data":data,"loc":{"start":{"line":1,"column":20},"end":{"line":1,"column":32}}}) : helper)))
    + "</p>";
},"useData":true}]
];

var css = "/*\n\nYou can set up a global style here that is commonly used in each stanza.\n\nExample:\n\nh1 {\n  font-size: 24px;\n}\n\n*/\nmain {\n  padding: 1rem 2rem;\n}\n\np.greeting {\n  margin: 0;\n  font-size: 24px;\n  color: var(--greeting-color);\n  text-align: var(--greeting-align);\n}";

defineStanzaElement(piechart, {metadata, templates, css, url: import.meta.url});
//# sourceMappingURL=piechart.js.map