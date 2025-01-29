import { register } from "node:module";
import { pathToFileURL } from "node:url";

register("ts-node/esm", pathToFileURL("./"));

// (node:14720) ExperimentalWarning: `--experimental-loader` may be removed in the future; instead use `register()`:
// https://github.com/nodejs/node/issues/51196
