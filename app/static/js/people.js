const currentPage = "option_people";
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
