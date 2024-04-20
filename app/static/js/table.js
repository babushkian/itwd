import { convertInputToString } from "./utils.js";

function createTitle(contentNode, obj) {
  const tt = document.createElement("div");
  tt.innerText = `${obj.entnty} ${obj.name} на ${convertInputToString(
    obj.date
  )}`;
  tt.className = "title";
  contentNode.appendChild(tt);
}

function buildTable(panel, headerObj) {
  const { content } = panel;
  const { order, header, data } = panel.jsonContent;
  // удаляем созданные заголовок и таблицу
  while (content.firstChild) {
    content.removeChild(content.firstChild);
  }
  // создаем заголовок таблицы
  createTitle(content, headerObj);

  //создаем таблицу
  // сначала контейнел для таблицы
  const tc = document.createElement("div");
  tc.className = "table";
  content.appendChild(tc);
  // затем саму таллицу
  const tb = document.createElement("table");
  tc.appendChild(tb);
  // ее заголовок
  const th = document.createElement("tr");
  tb.appendChild(th);

  // и сами данные
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

export { buildTable };
