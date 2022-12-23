import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";

const submitBtn = document.getElementById("submit");
const baseUrl = "http://localhost:8383/info";

const burger = document.querySelector(".burger");
const nav = document.querySelector(".nav-links");
const navLinks = document.querySelectorAll(".nav__link");

const numPieces = document.querySelector(".number-pieces");

const shipmentServiceType = document.querySelector(".shipment-service-type");

const hsCodes = document.querySelector(".hs-codes");
const weight = document.querySelector(".weight");
const weightUnits = document.querySelector(".weight-units");
const hazardous = document.querySelector(".hazardous");
const checkbox = document.querySelector(".checkbox");
const fullName = document.getElementById("fullName");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const companyName = document.getElementById("companyName");
const pickupInfo = document.getElementById("pickupInfo");
const shippingInfo = document.getElementById("shippingInfo");
const additionalInfo = document.querySelector(".additional-info textarea");
const numSkids = document.querySelector(".number-skids");
const skidDimensions = document.querySelector(".skid-dimensions");
const skidTypeWrapper = document.querySelector(".skid-type-wrapper");

function initFirebase(key) {
  const firebaseConfig = {
    apiKey: key,
    authDomain: "cgl-forms.firebaseapp.com",
    databaseURL: "https://cgl-forms-default-rtdb.firebaseio.com",
    projectId: "cgl-forms",
    storageBucket: "cgl-forms.appspot.com",
    messagingSenderId: "1008506608692",
    appId: "1:1008506608692:web:47818afefcc2935608be61",
  };
  const app = initializeApp(firebaseConfig);
  let db = getFirestore(app);

  var ref = collection(db, "quotes");
  return ref;
}

(function () {
  if (!skidTypeWrapper) {
    return;
  }

  window.addEventListener("DOMContentLoaded", () => {
    let templateSkidTypes = `<input type="text" placeholder="Type: (Skid, Carton, Tube etc)" data-count="0" class="skid-type" name='skid-type'><br>
                                      <input type="text" placeholder="Type: (Skid, Carton, Tube etc)" data-count="1" class="skid-type" name='skid-type'><br>
                                      <input type="text" placeholder="Type: (Skid, Carton, Tube etc)" data-count="2" class="skid-type" name='skid-type'>`;

    let templateSkidDimensions = `<div class="dimensions-wrapper">
                                            <input type="text" placeholder="Length" class="dimensions-input length" data-count="0" name='length'>
                                            <input type="text" placeholder="Width" class="dimensions-input width" data-count="0" name='width'>
                                            <input type="text" placeholder="Height" class="dimensions-input height" data-count="0" name='height'>
                                          </div>
                                          <div class="dimensions-wrapper">
                                            <input type="text" placeholder="Length" class="dimensions-input length" data-count="1" name='length'>
                                            <input type="text" placeholder="Width" class="dimensions-input width" data-count="1" name='width'>
                                            <input type="text" placeholder="Height" class="dimensions-input height" data-count="1" name='height'>
                                          </div>
                                          <div class="dimensions-wrapper">
                                            <input type="text" placeholder="Length" class="dimensions-input length" data-count="2" name='length'>
                                            <input type="text" placeholder="Width" class="dimensions-input width" data-count="2" name='width'>
                                            <input type="text" placeholder="Height" class="dimensions-input height" data-count="2" name='height'>
                                          </div>`;

    skidTypeWrapper.insertAdjacentHTML("afterbegin", templateSkidTypes);
    skidDimensions.insertAdjacentHTML("afterbegin", templateSkidDimensions);

    displaySkidInputs();
  });
})();

function displaySkidInputs() {
  numSkids.addEventListener("input", () => {
    skidTypeWrapper.innerHTML = "";
    skidDimensions.innerHTML = "";
    for (let i = 0; i < numSkids.value; i++) {
      let templateSkidTypes = `<input type="text" placeholder="Type: (Skid, Carton, Tube etc)" data-count="${i}" class="skid-type" name='skid-type'>`;
      let templateSkidDimensions = `<div class="dimensions-wrapper">
                                      <input type="text" placeholder="Length" class="dimensions-input length" data-count="${i}" name='length'>
                                      <input type="text" placeholder="Width" class="dimensions-input width" data-count="${i}" name='width'>
                                      <input type="text" placeholder="Height" class="dimensions-input height" data-count="${i}" name='height'>
                                    </div>`;
      skidTypeWrapper.insertAdjacentHTML("beforeend", templateSkidTypes);
      skidDimensions.insertAdjacentHTML("beforeend", templateSkidDimensions);
    }
  });
}

function getFormValues() {
  let inputs = document.querySelectorAll(".dimensions-input");
  let skidTypes = document.querySelectorAll(".skid-type");

  let arrInput = [];
  inputs.forEach((input) => {
    skidTypes.forEach((type, i) => {
      if (input.dataset.count === type.dataset.count) {
        arrInput.push(
          `${type.value} ${i} - ${input.placeholder}: ${input.value}`
        );
      }
    });
  });

  return arrInput;
}

if (submitBtn) {
  submitBtn.addEventListener("click", (e) => {
    saveForm(e);
  });
}

async function addDocument_AutoID(numSkids = "", ref = "") {
  if (!shipmentServiceType) {
    return;
  }
  // let typeValue = shipmentServiceType.value;
  let typeText =
    shipmentServiceType.options[shipmentServiceType.selectedIndex].text;

  const docRef = await addDoc(ref, {
    fullName: fullName.value,
    companyName: companyName.value,
    email: email.value,
    phone: phone.value,
    pickupInfo: pickupInfo.value,
    shippingInfo: shippingInfo.value,
    numSkids: numSkids,
    numPieces: numPieces.value,
    shipmentServiceType: typeText,
    hsCodes: hsCodes.value,
    weight: weight.value,
    weightUnits: weightUnits.value,
    hazardous: hazardous.value,
    checkbox: checkbox.value,
    additionalInfo: additionalInfo.value,
  })
    .then(() => {
      alert("Data added successfully");
    })
    .catch((error) => {
      alert("Unsuccessful operation, error:" + error);
    });
}

async function saveForm(e) {
  e.preventDefault();
  const res = await fetch(baseUrl, {
    method: "GET",
  });

  const data = await res.json();
  const collRef = initFirebase(data.text);
  let inputs = getFormValues();

  addDocument_AutoID(inputs, collRef);
}

// Nav bar
burger.addEventListener("click", () => {
  nav.classList.toggle("nav-active");

  navLinks.forEach((link, index) => {
    if (link.style.animation) {
      link.style.animation = "";
    } else {
      link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7}s`;
    }
  });
  // Burger animation
  burger.classList.toggle("toggle");
});
