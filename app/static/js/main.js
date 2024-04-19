(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity)
      fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy)
      fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
function convertInputToString(d) {
  const dp = d.split("-");
  return dp.reverse().join(".");
}
const mainDate = document.querySelector("#main-date");
const startDate = mainDate.getAttribute("min");
const endDate = mainDate.getAttribute("max");
const leftButtons = document.querySelectorAll("button.left");
const rightButtons = document.querySelectorAll("button.right");
const dayFofward = document.querySelector("#day-plus");
const monthFofward = document.querySelector("#month-plus");
const dayBackward = document.querySelector("#day-minus");
const monthBackward = document.querySelector("#month-minus");
const startDateButton = document.querySelector("#start_date");
const endDateButton = document.querySelector("#end_date");
function checkDisableButtons(leftDate, rightDate, buttonsSection) {
  const a = new Date(leftDate);
  const b = new Date(rightDate);
  if (a.getTime() >= b.getTime()) {
    buttonsSection.forEach((button) => button.setAttribute("disabled", ""));
  } else {
    buttonsSection.forEach((button) => {
      if (button.hasAttribute("disabled")) {
        button.removeAttribute("disabled");
      }
    });
  }
}
function checkDateInput() {
  if (mainDate.value > endDate) {
    mainDate.value = endDate;
  }
  if (mainDate.value < startDate) {
    mainDate.value = startDate;
  }
  checkDisableButtons(startDate, mainDate.value, leftButtons);
  checkDisableButtons(mainDate.value, endDate, rightButtons);
}
function createTitle(contentNode, obj) {
  const tt = document.createElement("div");
  tt.innerText = `${obj.entnty} ${obj.name} на ${convertInputToString(
    obj.date
  )}`;
  tt.className = "title";
  contentNode.appendChild(tt);
}
function buildTable({ content }, headerObj, { order, header, data }) {
  while (content.firstChild) {
    content.removeChild(content.firstChild);
  }
  createTitle(content, headerObj);
  const tc = document.createElement("div");
  tc.className = "table";
  content.appendChild(tc);
  const tb = document.createElement("table");
  tc.appendChild(tb);
  const th = document.createElement("tr");
  tb.appendChild(th);
  order.forEach((el) => {
    const thd = document.createElement("th");
    thd.innerText = header[el];
    th.appendChild(thd);
  });
  data.forEach((element) => {
    const tr = document.createElement("tr");
    tb.appendChild(tr);
    if (element.hasOwnProperty("active")) {
      if (!element.active) {
        tr.classList.add("not_active");
      }
    }
    order.forEach((key) => {
      let a = document.createElement("td");
      if (!key.includes("_date")) {
        a.innerText = element[key];
      } else {
        if (element[key]) {
          const d = new Date(element[key]);
          a.innerText = d.getDate().toString().padStart(2, "0") + "." + (d.getMonth() + 1).toString().padStart(2, "0") + "." + d.getFullYear();
        } else {
          a.innerText = "";
        }
      }
      tr.appendChild(a);
    });
  });
}
document.querySelector(".half.main");
document.querySelector(".half.details");
const tableUrlEL = document.querySelector("#request");
const tableUrl = tableUrlEL.dataset.url;
console.log("селестор страницы", tableUrl);
const active = document.querySelector(".option_" + tableUrlEL.dataset.class);
active.classList.add("option_active");
class Panel {
  constructor(name) {
    this.createPanel(name);
    this.currentTab = null;
  }
  createPanel(name) {
    const r = document.createElement("div");
    r.className = `half ${name}`;
    const root = document.querySelector(".content");
    root.appendChild(r);
    this.tabsPanel = document.createElement("div");
    this.tabsPanel.className = "tabs_panel";
    r.appendChild(this.tabsPanel);
    this.content = document.createElement("div");
    this.content.className = "content__window";
    r.appendChild(this.content);
  }
}
const mainPanel = new Panel("main");
const detailsPanel = new Panel("details");
mainDate.addEventListener("keyup", function(e) {
  if (e.key === "Enter") {
    checkDateInput();
    getStat(tableUrl, this.value);
  }
});
mainDate.addEventListener("blur", function(e) {
  checkDateInput();
  getStat(tableUrl, this.value);
});
dayFofward.addEventListener("click", () => {
  let date = new Date(mainDate.value);
  date.setDate(date.getDate() + 1);
  mainDate.valueAsDate = date;
  checkDateInput();
  getStat(tableUrl, mainDate.value);
});
monthFofward.addEventListener("click", () => {
  let date = new Date(mainDate.value);
  const a = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  date.setDate(date.getDate() + a.getDate());
  mainDate.valueAsDate = date;
  checkDateInput();
  getStat(tableUrl, mainDate.value);
});
dayBackward.addEventListener("click", () => {
  let date = new Date(mainDate.value);
  date.setDate(date.getDate() - 1);
  mainDate.valueAsDate = date;
  checkDateInput();
  getStat(tableUrl, mainDate.value);
});
monthBackward.addEventListener("click", () => {
  let date = new Date(mainDate.value);
  const a = new Date(date.getFullYear(), date.getMonth(), 0);
  date.setDate(date.getDate() - a.getDate());
  mainDate.valueAsDate = date;
  checkDateInput();
  getStat(tableUrl, mainDate.value);
});
startDateButton.addEventListener("click", () => {
  mainDate.value = startDate;
  checkDateInput();
  getStat(tableUrl, mainDate.value);
});
endDateButton.addEventListener("click", () => {
  mainDate.value = endDate;
  checkDateInput();
  getStat(tableUrl, mainDate.value);
});
async function getStat(url_string, date) {
  const URL = `http://127.0.0.1:5000/${url_string}/${date}`;
  const data = await fetch(URL);
  const cd = await data.json();
  buildMainTable(mainPanel, cd);
  const titleObject = { entnty: "Информация о фирмах", name: "", date };
  buildTable(mainPanel, titleObject, cd);
  const firmId = cd.data[0]["id"];
  const firmName = cd.data[0]["name"];
  await getSideInfo(firmId, firmName, date);
}
checkDateInput();
getStat(tableUrl, mainDate.value);
function buildMainTable({ content }, { title, order, header, data }) {
  while (content.firstChild) {
    content.removeChild(content.firstChild);
  }
  const tt = document.createElement("div");
  tt.innerText = title;
  tt.className = "title";
  content.appendChild(tt);
  const tb = document.createElement("table");
  content.appendChild(tb);
  const th = document.createElement("tr");
  tb.appendChild(th);
  order.forEach((el) => {
    const thd = document.createElement("th");
    thd.innerText = header[el];
    th.appendChild(thd);
  });
  data.forEach((element) => {
    const tr = document.createElement("tr");
    tb.appendChild(tr);
    if (element.hasOwnProperty("active")) {
      if (!element.active) {
        tr.classList.add("not_active");
      }
    }
    order.forEach((key) => {
      let a = document.createElement("td");
      if (!key.includes("_date")) {
        a.innerText = element[key];
      } else {
        if (element[key]) {
          const d = new Date(element[key]);
          a.innerText = d.getDate().toString().padStart(2, "0") + "." + (d.getMonth() + 1).toString().padStart(2, "0") + "." + d.getFullYear();
        } else {
          a.innerText = "";
        }
      }
      tr.appendChild(a);
    });
  });
}
async function getSideInfo(firmId, firmName, date) {
  const URL = `http://127.0.0.1:5000/rating_history?firm=${firmId}&date=${date}`;
  const data = await fetch(URL);
  const cd = await data.json();
  const titleObject = {
    entnty: "Сведения о фирме",
    name: `"${firmName}"`,
    date
  };
  buildTable(detailsPanel, titleObject, cd);
}
const mainTabObjects = [
  {
    id: "main_firms",
    name: "фирмы",
    request: "feq"
  },
  {
    id: "main__staff",
    name: "люди",
    request: "feq"
  },
  {
    id: "main_statistics",
    name: "статистика",
    request: "feq"
  }
];
const tabObjects = [
  {
    id: "firm_history",
    name: "история",
    request: "feq"
  },
  {
    id: "firm_staff",
    name: "сотрудники",
    request: "feq"
  },
  {
    id: "firm_rating",
    name: "рейтинг",
    request: "feq"
  }
];
buildPanel(mainPanel, mainTabObjects);
buildPanel(detailsPanel, tabObjects);
function buildPanel({ tabsPanel, currentTab }, tabObj) {
  function listenTabPanel(panel) {
    panel.addEventListener("click", (event) => {
      const a = event.target.closest(".tab");
      if (a) {
        currentTab.classList.remove("active_tab");
        a.classList.add("active_tab");
        currentTab = a;
      }
    });
  }
  tabsPanel.innerHTML = "";
  tabObj.forEach((tab, index) => {
    const tb = document.createElement("button");
    tb.className = "tab";
    if (!currentTab) {
      currentTab = tb;
      tb.classList.add("active_tab");
    }
    tb.setAttribute("id", tab.id);
    tb.innerHTML = `<span>${tab.name}</span>`;
    tabsPanel.appendChild(tb);
  });
  listenTabPanel(tabsPanel);
}
