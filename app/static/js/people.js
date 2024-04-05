const content = document.querySelector(".content");
const active = document.querySelector(".option_people");
active.classList.add("option_active");

const mainDate = document.querySelector("#main-date");
const dayFofward = document.querySelector("#day-plus");
const monthFofward = document.querySelector("#month-plus");
const dayBackward = document.querySelector("#day-minus");
const monthBackward = document.querySelector("#month-minus");

mainDate.addEventListener("keyup", function (e) {
  if (e.key === "Enter") {
    getStat(this.value);
  }
});

mainDate.addEventListener("blur", function (e) {
  getStat(this.value);
});

dayFofward.addEventListener("click", () => {
  let date = new Date(mainDate.value);
  date.setDate(date.getDate() + 1);
  mainDate.valueAsDate = date;
  getStat(mainDate.value);
});

monthFofward.addEventListener("click", () => {
  let date = new Date(mainDate.value);
  const a = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  date.setDate(date.getDate() + a.getDate());
  mainDate.valueAsDate = date;
  getStat(mainDate.value);
});

dayBackward.addEventListener("click", () => {
  let date = new Date(mainDate.value);
  date.setDate(date.getDate() - 1);
  mainDate.valueAsDate = date;
  getStat(mainDate.value);
});

monthBackward.addEventListener("click", () => {
  let date = new Date(mainDate.value);
  const a = new Date(date.getFullYear(), date.getMonth(), 0);
  date.setDate(date.getDate() - a.getDate());
  mainDate.valueAsDate = date;
  getStat(mainDate.value);
});

async function getStat(date) {
  const URL = `http://127.0.0.1:5000/pstatus/${date}`;
  const data = await fetch(URL);
  const cd = await data.json();
  buildTable(cd);
}

function buildTable(data) {
  while (content.firstChild) {
    content.removeChild(content.firstChild);
  }
  const tb = document.createElement("table");
  content.appendChild(tb);
  data.forEach((element) => {
    const tr = document.createElement("tr");
    tb.appendChild(tr);
    keys = ["id", "last_name", "first_name", "name", "status_date"];
    keys.forEach((key) => {
      let a = document.createElement("td");
      if (key != "status_date") {
        a.innerText = element[key];
      } else {
        const d = new Date(element[key]);
        a.innerText =
          d.getDate().toString().padStart(2, "0") +
          "." +
          (d.getMonth() + 1).toString().padStart(2, "0") +
          "." +
          d.getFullYear();
      }
      tr.appendChild(a);
    });
  });
}
getStat(mainDate.value);
