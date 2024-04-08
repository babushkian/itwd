const currentPage = "option_firms";
async function getStat(date) {
  const URL = `http://127.0.0.1:5000/fstatus/${date}`;
  const data = await fetch(URL);
  const cd = await data.json();
  buildTable(cd);
}

function buildTable({ title, order, header, data }) {
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
