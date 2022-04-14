const digitRange = document.querySelector(".digits-input");
const filtersCheckboxes = document.querySelectorAll("input[type='checkbox']");
const radioInputs = document.querySelectorAll("input[type='radio']");
const saveBtn = document.querySelector("#save-init-btn");
const passNameField = document.querySelector(".pass-name-input");
const saveTab = document.querySelector("#save-tab");
const formSaveSubmit = document.querySelector(".save-submit");
const formFilters = document.querySelector(".form-filters");
const formLetterTypes = document.querySelector(".form-letter-types");
const passField = document.querySelector(".generated-pass");
const copyToClipBtn = document.querySelector(".copy-btn");
const refreshBtn = document.querySelector(".refresh-btn");
const libraryBtn = document.querySelector(".library-btn");
const aboutBtn = document.querySelector(".about-btn");
const overlay = document.querySelector(".overlay");
const savedPassesContainer = document.querySelector(
  ".saved-passwords-container"
);

const numbers = "0123456789";
const specialChars = "[]!@#$%^&()_-=+*/?.;:,'~`\"><{}|";
const letters = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
};

const filterStatus = {
  hasNums: true,
  hasSpecial: true,
  letterType: "mixed",
};

let storedPasses = { ...localStorage };
for (const [key, value] of Object.entries(storedPasses)) {
  let toAdd = document.createElement("div");
  toAdd.className = "saved-password";
  toAdd.innerHTML = `
  <div class="saved-info">
    <span class="saved-pass-name">${key}</span>
    <span class="saved-pass-pass">${value}</span>
  </div>
  <div class="btns">
  <button class="copy-saved-pass-btn" title="Copy password"><i class="fas fa-copy"></i></button>
  <button class="del-saved-pass-btn" title="Delete"><i class="fas fa-times"></i></button>
</div>`;
  savedPassesContainer.append(toAdd);
}

const deleteBtns = document.querySelectorAll(".del-saved-pass-btn");
const copyBtns = document.querySelectorAll(".copy-saved-pass-btn");

//events

digitRange.addEventListener("input", (e) => {
  digitRange.nextElementSibling.textContent = `${digitRange.value} digits`;
  passField.value = generatePass(returnCorrespondingArray());
});

formFilters.addEventListener("input", (e) => {
  if (e.target.id === "enable-special") {
    if (e.target.checked) filterStatus.hasSpecial = true;
    else filterStatus.hasSpecial = false;
  }

  if (e.target.id === "enable-numbers") {
    if (e.target.checked) filterStatus.hasNums = true;
    else filterStatus.hasNums = false;
  }

  passField.value = generatePass(returnCorrespondingArray());
});

formLetterTypes.addEventListener("input", (e) => {
  switch (e.target.id) {
    case "all-up":
      if (e.target.checked) filterStatus.letterType = "all-up";
      break;

    case "all-low":
      if (e.target.checked) filterStatus.letterType = "all-low";
      break;

    case "mixed":
      if (e.target.checked) filterStatus.letterType = "mixed";
      break;
  }
  passField.value = generatePass(returnCorrespondingArray());
});

formSaveSubmit.addEventListener("submit", (e) => {
  localStorage.setItem(`${passNameField.value}`, `${passField.value}`);
});

refreshBtn.addEventListener("click", () => {
  passField.value = generatePass(returnCorrespondingArray());

  refreshBtn.style.animation = "refreshAnim 0.25s ease ";
  refreshBtn.addEventListener(
    "animationend",
    () => (refreshBtn.style.animation = "")
  );
});

copyToClipBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(passField.value);

  copyToClipBtn.style.animation = "copyAnim 0.25s ease ";
  copyToClipBtn.addEventListener(
    "animationend",
    () => (copyToClipBtn.style.animation = "")
  );
});

saveBtn.addEventListener("click", () => {
  showTab("save-tab");
});

aboutBtn.addEventListener("click", () => {
  showTab("about-tab");
});

libraryBtn.addEventListener("click", () => {
  showTab("library-tab");
});

//enumerable events
const yesAnswer = document.querySelector(".yes");
const noAnswer = document.querySelector(".no");

deleteBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    let currentBtn = e.currentTarget;
    let parent = currentBtn.closest(".saved-password");
    document.querySelector(".confirm-deletion span").innerText =
      parent.querySelector(".saved-pass-name").innerText;

    let popAnimation = gsap
      .timeline()
      .fromTo(".deletion-overlay", 0, { display: "none" }, { display: "flex" })
      .fromTo(
        ".confirm-deletion",
        0.25,
        { scale: 0 },
        { scale: 1, ease: Power4.easeOut }
      );

    //option handlers
    noAnswer.addEventListener("click", () => {
      popAnimation.reverse();
      yesAnswer.removeEventListener("click", yesOpt);
    });

    function yesOpt() {
      localStorage.removeItem(
        `${parent.querySelector(".saved-pass-name").innerText}`
      );
      location.reload();
    }
    yesAnswer.addEventListener("click", yesOpt);
  });
});

copyBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    let parent = btn.closest(".saved-password");
    let password = parent.querySelector(".saved-pass-pass").innerText;
    navigator.clipboard.writeText(password);

    btn.style.animation = "copyAnim 0.25s ease ";
    btn.addEventListener("animationend", () => (btn.style.animation = ""));
  });
});

//functions

function generatePass(array) {
  const thePass = [];
  while (thePass.length < digitRange.value) {
    let toPush = array[Math.floor(Math.random() * array.length)];
    thePass.push(toPush);
  }
  return thePass.join("");
}

function returnCorrespondingArray() {
  return [].concat(
    filterStatus.hasNums ? [...numbers.split("")] : [],
    filterStatus.hasSpecial ? [...specialChars.split("")] : [],
    filterStatus.letterType === "mixed"
      ? [...letters.uppercase.split(""), ...letters.lowercase.split("")]
      : [],
    filterStatus.letterType === "all-up"
      ? [...letters.uppercase.split("")]
      : [],
    filterStatus.letterType === "all-low"
      ? [...letters.lowercase.split("")]
      : []
  );
}

function showTab(tab) {
  appearAnimation(`#${tab}`);

  //function of the click event that tracks overlay
  function overlayEvent(e) {
    if (e.target.className === "overlay") {
      appeartl.reverse();
      overlay.removeEventListener("click", overlayEvent);
      passNameField.value = "";
    }
  }

  overlay.addEventListener("click", overlayEvent);
}

function appearAnimation(elementID) {
  return (appeartl = gsap
    .timeline()
    .fromTo(
      ".overlay",
      0.25,
      { pointerEvents: "none", opacity: "0" },
      { pointerEvents: "auto", opacity: "1" }
    )
    .fromTo(
      elementID,
      0.25,
      { y: -50, opacity: "0", display: "none" },
      {
        y: 0,
        opacity: "1",
        display: "flex",
        onComplete: () => {
          if (`#${saveTab.id}` === elementID) passNameField.focus();
        },
      },
      "-=0.25"
    ));
}
//initial output

passField.value = generatePass(returnCorrespondingArray());
