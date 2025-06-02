"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var render_1 = require("@react-email/render");
var user_verification_1 = require("~/user-verification");
var html = await (0, render_1.pretty)(await (0, render_1.render)((0, jsx_runtime_1.jsx)(user_verification_1.default, {})));
console.log(html);
