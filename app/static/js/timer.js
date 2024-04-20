export class Timer {
  constructor() {
    this.timerElement = document.querySelector(".timer");
    this.mainDate = document.querySelector("#main-date");
    this.startDate = this.mainDate.getAttribute("min");
    this.endDate = this.mainDate.getAttribute("max");

    this.leftButtons = document.querySelectorAll("button.left");
    this.rightButtons = document.querySelectorAll("button.right");
    this.dayFofward = document.querySelector("#day-plus");
    this.monthFofward = document.querySelector("#month-plus");
    this.dayBackward = document.querySelector("#day-minus");
    this.monthBackward = document.querySelector("#month-minus");
    this.startDateButton = document.querySelector("#start_date");
    this.endDateButton = document.querySelector("#end_date");

    this.applyListeners();
  }

  checkDateInput() {
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

    if (this.mainDate.value > this.endDate) {
      this.mainDate.value = this.endDate;
    }
    if (this.mainDate.value < this.startDate) {
      this.mainDate.value = this.startDate;
    }
    checkDisableButtons(this.startDate, this.mainDate.value, this.leftButtons);
    checkDisableButtons(this.mainDate.value, this.endDate, this.rightButtons);
  }

  checkAndSendEvent() {
    this.checkDateInput();
    this.createEvent();
  }

  createEvent() {
    const e = new CustomEvent("dateChanged", {
      detail: { currentDate: this.mainDate.value },
    });
    console.log("пустил петуха");
    this.timerElement.dispatchEvent(e);
  }

  applyListeners() {
    this.mainDate.addEventListener("keyup", function (e) {
      if (e.key === "Enter") {
        this.checkAndSendEvent();
      }
    });

    this.mainDate.addEventListener("blur", function (e) {
      this.checkAndSendEvent();
    });

    this.dayFofward.addEventListener("click", () => {
      let date = new Date(this.mainDate.value);
      date.setDate(date.getDate() + 1);
      this.mainDate.valueAsDate = date;
      this.checkAndSendEvent();
    });

    this.monthFofward.addEventListener("click", () => {
      let date = new Date(this.mainDate.value);
      const a = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      date.setDate(date.getDate() + a.getDate());
      this.mainDate.valueAsDate = date;
      this.checkAndSendEvent();
    });

    this.dayBackward.addEventListener("click", () => {
      let date = new Date(this.mainDate.value);
      date.setDate(date.getDate() - 1);
      this.mainDate.valueAsDate = date;
      this.checkAndSendEvent();
    });

    this.monthBackward.addEventListener("click", () => {
      let date = new Date(this.mainDate.value);
      const a = new Date(date.getFullYear(), date.getMonth(), 0);
      date.setDate(date.getDate() - a.getDate());
      this.mainDate.valueAsDate = date;
      this.checkAndSendEvent();
    });

    this.startDateButton.addEventListener("click", () => {
      this.mainDate.value = this.startDate;
      this.checkAndSendEvent();
    });
    this.endDateButton.addEventListener("click", () => {
      this.mainDate.value = this.endDate;
      this.checkAndSendEvent();
    });
  }
}
