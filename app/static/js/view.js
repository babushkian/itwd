import { Panel } from "./panels.js";
import { Timer } from "./timer.js";
import { mainTabObjects, tabObjects } from "./tabs.js";
import { buildTable } from "./table.js";

export class View {
  constructor(mainTabUrl) {
    this.mainTabUrl = mainTabUrl;
    this.timer = new Timer();
    this.mainPanel = new Panel("main", mainTabObjects);
    this.sidePanel = new Panel("details", tabObjects);
    this.getStat(this.timer.mainDate.value);

    this.timer.timerElement.addEventListener("dateChanged", (e) => {
      this.getStat(e.detail.currentDate);
    });
  }

  async getStat(date) {
    const URL = `http://127.0.0.1:5000/${this.mainTabUrl}?date=${date}`;
    console.log(URL);
    const data = await fetch(URL);
    this.mainPanel.jsonContent = await data.json();
    const titleObject = { entnty: "Информация о фирмах", name: "", date };
    buildTable(this.mainPanel, titleObject);

    const firmId = this.mainPanel.jsonContent.data[0]["id"];
    const firmName = this.mainPanel.jsonContent.data[0]["name"];
    await this.getSideInfo(firmId, firmName, date);
  }

  async getSideInfo(firmId, firmName, date) {
    const URL = `http://127.0.0.1:5000/rating_history?firm=${firmId}&date=${date}`;
    const data = await fetch(URL);
    this.sidePanel.jsonContent = await data.json();

    const titleObject = {
      entnty: "Сведения о фирме",
      name: `"${firmName}"`,
      date,
    };
    buildTable(this.sidePanel, titleObject);
  }
}
