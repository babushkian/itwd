const tableUrlEL = document.querySelector("#request");
const tableUrl = tableUrlEL.dataset.url;
const active = document.querySelector(".option_" + tableUrlEL.dataset.class);
active.classList.add("option_active");

import { View } from "./view.js";

const v = new View(tableUrl);
