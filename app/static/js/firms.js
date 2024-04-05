const currentPage = "option_firms";
async function getStat(date) {
  const URL = `http://127.0.0.1:5000/fstatus/${date}`;
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
    keys = [
      "id",
      "name",
      "open_date",
      "close_date",
      "workers_count",
      "rating",
      "rate_date",
    ];
    keys.forEach((key) => {
      let a = document.createElement("td");
      if (["open_date", "close_date", "rate_date"].includes(key)) {
        const d = new Date(element[key]);
        a.innerText =
          d.getDate().toString().padStart(2, "0") +
          "." +
          (d.getMonth() + 1).toString().padStart(2, "0") +
          "." +
          d.getFullYear();
      } else {
        a.innerText = element[key];
      }

      tr.appendChild(a);
    });
  });
}
