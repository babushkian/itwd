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

getStat(mainDate.value);
