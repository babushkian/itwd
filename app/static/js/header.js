// import { getStat } from "./table_data.js";
const content = document.querySelector(".content__window.main");
const sideWindow = document.querySelector(".content__window.side");

const tableUrlEL = document.querySelector("#request");
const tableUrl = tableUrlEL.dataset.url;

const active = document.querySelector(".option_" + tableUrlEL.dataset.class);
active.classList.add("option_active");

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
  // даты адекватно не сравниваются, надо извращаться
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

mainDate.addEventListener("keyup", function (e) {
  if (e.key === "Enter") {
    getStat(tableUrl, this.value);
  }
});

mainDate.addEventListener("blur", function (e) {
  getStat(tableUrl, this.value);
});

dayFofward.addEventListener("click", () => {
  let date = new Date(mainDate.value);
  date.setDate(date.getDate() + 1);
  mainDate.valueAsDate = date;
  getStat(tableUrl, this.value);
});

monthFofward.addEventListener("click", () => {
  let date = new Date(mainDate.value);
  const a = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  date.setDate(date.getDate() + a.getDate());
  mainDate.valueAsDate = date;
  getStat(tableUrl, this.value);
});

dayBackward.addEventListener("click", () => {
  let date = new Date(mainDate.value);
  date.setDate(date.getDate() - 1);
  mainDate.valueAsDate = date;
  getStat(tableUrl, this.value);
});

monthBackward.addEventListener("click", () => {
  let date = new Date(mainDate.value);
  const a = new Date(date.getFullYear(), date.getMonth(), 0);
  date.setDate(date.getDate() - a.getDate());
  mainDate.valueAsDate = date;
  getStat(tableUrl, this.value);
});

startDateButton.addEventListener("click", () => {
  mainDate.value = startDate;
  getStat(tableUrl, this.value);
});
endDateButton.addEventListener("click", () => {
  mainDate.value = endDate;
  getStat(tableUrl, this.value);
});

getStat(tableUrl, mainDate.value);

async function getStat(url_string, date) {
  checkDateInput();
  const URL = `http://127.0.0.1:5000/${url_string}/${date}`;
  console.log("API:", URL);
  const data = await fetch(URL);
  const cd = await data.json();
  buildMainTable(cd);
  const firmId = cd.data[0]["id"];
  const firmName = cd.data[0]["name"];
  await getSideInfo(firmId, firmName, date);
}

function buildMainTable({ title, order, header, data }) {
  while (content.firstChild) {
    content.removeChild(content.firstChild);
  }
  const tt = document.createElement("div");

  tt.innerText = title;
  tt.className = "table_title";
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
          a.innerText =
            d.getDate().toString().padStart(2, "0") +
            "." +
            (d.getMonth() + 1).toString().padStart(2, "0") +
            "." +
            d.getFullYear();
        } else {
          a.innerText = "";
        }
      }

      tr.appendChild(a);
    });
  });
}

function convertInputToString(d) {
  const dp = d.split("-");
  return dp.reverse().join(".");
}

async function getSideInfo(firmId, firmName, date) {
  const URL = `http://127.0.0.1:5000/rating_history?firm=${firmId}&date=${date}`;
  const data = await fetch(URL);
  const cd = await data.json();
  buildSideTable(firmName, date, cd);
}

function buildSideTable(firmName, date, { order, header, data }) {
  while (sideWindow.firstChild) {
    sideWindow.removeChild(sideWindow.firstChild);
  }
  const tt = document.createElement("div");
  tt.innerText = `История рейтинга фирмы "${firmName}" до ${convertInputToString(
    date
  )}`;
  tt.className = "table_title";
  sideWindow.appendChild(tt);
  const tb = document.createElement("table");
  sideWindow.appendChild(tb);
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
          a.innerText =
            d.getDate().toString().padStart(2, "0") +
            "." +
            (d.getMonth() + 1).toString().padStart(2, "0") +
            "." +
            d.getFullYear();
        } else {
          a.innerText = "";
        }
      }
      tr.appendChild(a);
    });
  });
}
