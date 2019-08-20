import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import json from "rollup-plugin-json";
import resolve from "rollup-plugin-node-resolve";
import replace from "rollup-plugin-replace";
import postcss from "rollup-plugin-postcss";
import { terser } from "rollup-plugin-terser";

export default {
  input: "./src/index.js",
  output: {
    dir: "./",
    format: "cjs",
    intro: "var regeneratorRuntime = require('regenerator-runtime');\n"
  },
  plugins: [
    json(),
    resolve({ extensions: [".js", ".json"] }),
    babel({
      runtimeHelpers: true,
      exclude: "node_modules/**"
    }),
    replace({
      ENVIRONMENT: JSON.stringify("production")
    }),
    commonjs(),
    postcss(),
    terser()
  ],
  external: [
    "apollo-client",
    "apollo-link",
    "apollo-link-http",
    "aws-appsync",
    "classnames",
    "copy-text-to-clipboard",
    "date-fns",
    "downshift",
    "graphql",
    "graphql-tag",
    "leaflet",
    "leaflet-defaulticon-compatibility",
    "leaflet.featuregroup.subgroup",
    "leaflet.markercluster",
    "lodash.debounce",
    "lodash.throttle",
    "lottie-web",
    "node-sass",
    "prop-types",
    "react",
    "react-animate-height",
    "react-apollo",
    "react-day-picker",
    "react-detect-offline",
    "react-dom",
    "react-dom/server",
    "react-if"
  ]
};
