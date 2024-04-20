"use strict";

export class Panel {
  constructor(name, tabObj) {
    this.currentTab = null;
    this.tabObject = tabObj;
    this.createPanel(name);
    this.jsonContent = null;
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
    this.buildPanel();
  }

  buildPanel() {
    function listenTabPanel(event) {
      const a = event.target.closest(".tab");
      if (a) {
        this.currentTab.classList.remove("active_tab");
        a.classList.add("active_tab");
        this.currentTab = a;
      }
    }

    this.tabsPanel.innerHTML = "";
    this.tabObject.forEach((tab, index) => {
      const tb = document.createElement("button");

      tb.className = "tab";

      if (!this.currentTab) {
        this.currentTab = tb;
        tb.classList.add("active_tab");
      }
      tb.setAttribute("id", tab.id);

      tb.innerHTML = `<span>${tab.name}</span>`;
      this.tabsPanel.appendChild(tb);
    });

    const listen = listenTabPanel.bind(this);
    this.tabsPanel.addEventListener("click", (event) => {
      listen(event);
    });
  }
}
