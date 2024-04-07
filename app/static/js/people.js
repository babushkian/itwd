const currentPage = "option_people";

async function getStat(date) {
  const URL = `http://127.0.0.1:5000/pstatus/${date}`;
  const data = await fetch(URL);
  const cd = await data.json();
  console.log(mainDate.value);
  // buildTable(cd);
  buildTableNew(cd);
}

function convertInputToString(d) {
  dp = d.split("-");
  return dp.reverse().join(".");
}

function buildTableNew({ title, order, header, data }) {
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
