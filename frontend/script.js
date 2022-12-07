const form = document.querySelector(`.main-form`);
const filterForm = document.querySelector(`.filter-form`);
const model = document.querySelector(`#modelis`);
const flipCardInner = document.querySelector(`.flip-card-inner`);
const table = document.querySelector(`table`);

const checkLength = function (input) {
  if (input.value.length > input.maxLength) {
    input.value = input.value.slice(0, input.maxLength);
  }
};
const checkNumPlate = function (event) {
  if (
    (event.charCode >= 48 && event.charCode <= 57) || // 0-9
    (event.charCode >= 65 && event.charCode <= 90) || // A-Z
    (event.charCode >= 97 && event.charCode <= 122)
  )
    // a-z
    alert("0-9, a-z or A-Z");
};

const changeModel = function (input) {
  carMan.forEach((el) => {
    if (input.value === el) {
      const lower = el.toLowerCase().replace(` `, ``);
      model.setAttribute(`list`, lower);
    }
  });
};

const carMan = [
  "Alfa Romeo",
  "Audi",
  "BMW",
  "Chevrolet",
  "Chrysler",
  "Citroen",
  "Dacia",
  "Dodge",
  "Fiat",
  "Ford",
  "Honda",
  "Hyundai",
  "Infiniti",
  "Jaguar",
  "Jeep",
  "Kia",
  "Lancia",
  "Land Rover",
  "Lexus",
  "Mazda",
  "Mercedes",
  "Mini",
  "Mitsubishi",
  "Nissan",
  "Opel",
  "Peugeot",
  "Porsche",
  "Renault",
  "Saab",
  "Seat",
  "Skoda",
  "Smart",
  "Subaru",
  "Suzuki",
  "Toyota",
  "Volkswagen",
  "Volvo",
  "Gaz",
  "Vaz",
];

function inpNum(e) {
  e = e || window.event;
  var charCode = typeof e.which == "undefined" ? e.keyCode : e.which;
  var charStr = String.fromCharCode(charCode);
  if (!charStr.match(/^[0-9]+$/)) e.preventDefault();
}
function flip() {
  flipCardInner.classList.toggle(`flip`);
}

function checkIQO(e) {
  if (
    e.key === "i" ||
    e.key === "I" ||
    e.key === "o" ||
    e.key === "O" ||
    e.key === "q" ||
    e.key === "Q"
  ) {
    e.preventDefault();
  }
}

function checkPaste(e) {
  let val = e.clipboardData.getData(`text/plain`);
  let reg = /q|Q|i|I|o|O/.test(val);
  if (reg === true) {
    e.preventDefault();
  }
  let reg2 = /^[A-Za-z0-9_]+$/.test(val);
  if (reg2 === false) {
    e.preventDefault();
  }
}

function checkNumLett(event) {
  let reg = /^[A-Za-z0-9_]+$/.test(event.key);
  if (reg === false) {
    event.preventDefault();
  }
}

const get = async function () {
  await fetch(`http://127.0.0.1:3000/auto`, {
    method: "GET",
  })
    .then((response) => {
      console.log(response.status);
      return response.json();
    })
    .then((data) => {
      makeTable(data);
    })
    .catch((e) => {
      console.log(e);
    });
};

get();

const makeTable = function (arr) {
  arr.forEach((el, index) => {
    table.insertAdjacentHTML(
      `beforeend`,
      `<tr row_id="row_${index + 1}">
    <td row_id="${index + 1}">${el.apliecibas_nr}</td>
    <td row_id="${index + 1}">${el.reg_nr}</td>
    <td row_id="${index + 1}">${el.marka}</td>
    <td row_id="${index + 1}">${el.modelis}</td>
    <td row_id="${index + 1}">${el.vin}</td>
    <td row_id="${index + 1}">${el.pilseta}</td>
    <td row_id="${index + 1}">${el.iela}</td>
    <td row_id="${index + 1}">${el.tipa_nr}</td>
    <td row_id="${index + 1}">${el.tilpums}</td>
    <td row_id="${index + 1}">${el.degviela}</td>
    <td row_id="${index + 1}">${el.krasa}</td>
    <td row_id="${index + 1}">${el.sedvietas}</td>
    <td row_id="${index + 1}">${el.veids}</td>
    <td row_id="${index + 1}">${el.piezimes}</td> 
    <td row_id="${
      index + 1
    }"><button class="del-btn" onclick="deleteRow(this)" row_id="${
        index + 1
      }">X</button></td> 
  </tr>`
    );
  });
};

const deleteRow = async function (btn) {
  const rowEls = document.querySelectorAll(
    `[row_id="${btn.getAttribute(`row_id`)}"]`
  );
  const apliecibas_nr = rowEls[0].textContent;
  const reg_nr = rowEls[1].textContent;
  const vin = rowEls[4].textContent;
  const tipa_nr = rowEls[7].textContent;

  await fetch(`http://127.0.0.1:3000/auto`, {
    headers: {
      "Content-type": "application/json",
    },
    method: "DELETE",
    body: JSON.stringify({
      apliecibas_nr,
      reg_nr,
      vin,
      tipa_nr,
    }),
  })
    .then((response) => {
      console.log(response.status);
      return response.json();
    })
    .then((data) => {
      if (data.successfully === "deleted") {
        console.log(`Sucessfully deleted!`);
        resetTable();
      }
    })
    .catch((e) => {
      console.log(e);
    });
};

const resetTable = function () {
  const tbody = document.querySelectorAll(`tbody`);
  tbody.forEach((el) => {
    el.remove();
  });
  get();
};
const errorArr = [
  "auto.vin",
  "auto.tipa_nr",
  "pase.apliecibas_nr",
  "pase.reg_nr",
];

form.addEventListener(`submit`, async (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const apliecibasNr =
    data.get(`aplieciba_1`) + data.get(`aplieciba_2`).toUpperCase();
  const regNr = data.get(`reg_1`) + data.get(`reg_2`).toUpperCase();
  const marka = data.get(`marka`).toUpperCase();
  const modelis = data.get(`modelis`).toUpperCase();
  const vin = data.get(`vin`).toUpperCase();
  const pilseta = data.get(`pilseta`).toUpperCase();
  const iela = data.get(`iela`).toUpperCase();
  const tipaNr = data.get(`tipa_nr`).toLowerCase();
  const tilpums = data.get(`tilpums`).toUpperCase();
  const jauda = data.get(`jauda`).toUpperCase();
  const degviela = data.get(`degviela`).toUpperCase();
  const krasa = data.get(`krasa`).toUpperCase();
  const sedvietas = data.get(`sedvietas`).toUpperCase();
  const veids = data.get(`veids`).toUpperCase();
  const piezimes = data.get(`piezimes`).toUpperCase();

  await fetch(`http://127.0.0.1:3000/auto`, {
    headers: {
      "Content-type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      apliecibasNr,
      regNr,
      marka,
      modelis,
      vin,
      pilseta,
      iela,
      tipaNr,
      tilpums,
      jauda,
      degviela,
      krasa,
      sedvietas,
      veids,
      piezimes,
    }),
  })
    .then((response) => {
      console.log(response.status);
      return response.json();
    })
    .then((data) => {
      resetTable();
      dupHandle(errorArr, data);
    })
    .catch((e) => {
      console.log(e);
    });
});

const dupHandle = function (arr, data) {
  arr.forEach((el) => {
    if (data.sqlMessage.includes(el) && data.code.includes(`DUP_ENTRY`)) {
      const errorMsg = el.substring(el.indexOf(`.`) + 1).toUpperCase();
      alert(`${errorMsg} JAU PASTĀV!`);
    }
    return;
  });
};

filterForm.addEventListener(`submit`, async (e) => {
  e.preventDefault();
  const data = new FormData(filterForm);
  vin = data.get(`vin`);

  await fetch(`http://127.0.0.1:3000/auto`, {
    headers: {
      "Content-type": "application/json",
    },
    method: "GET",
  })
    .then((response) => {
      console.log(response.status);
      return response.json();
    })
    .then((data) => {
      console.log(data);
      findByVIN(data, vin);
    })
    .catch((e) => {
      console.log(e);
    });
});

const findByVIN = function (arr, vins) {
  let message;
  arr.forEach((el) => {
    if (el.vin === vins) {
      const tbody = document.querySelectorAll(`tbody`);
      tbody.forEach((el) => {
        el.remove();
      });
      const arrayEl = [el];
      makeTable(arrayEl);
      message = "Atrasts";
    } else {
      message = `Nav atrasts!`;
    }
  });
  alert(message);
};
