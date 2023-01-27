console.log("The extension is up and running");
var actionBar = document.getElementsByTagName("button");
var textAreaMain = document.getElementById("custom-message");
var kdbCss = `
  kbd {
    background-color: #f7f7f7;
    color: #444;
    padding: 1px 8px;
    border-radius: 3px;
    box-shadow: 0 2px 0 rgba(0, 0, 0, 0.2), 0 2px 0 rgba(255, 255, 255, 0.7) inset;
    font-size: 0.8em;
    font-family: Arial, sans-serif;
  }
`;
var kbdStyle = document.createElement("style");
kbdStyle.innerHTML = kdbCss;
document.head.appendChild(kbdStyle);
var defaultDashBtn = "Postbox";
var tempLegacyStorage = [];

/*
 ** --------------------------------
 ** create storage if not present, otherwise get and assign to tempLegacyStorage
 ** --------------------------------
 */

if (!localStorage.getItem("storage")) {
  var tempArr = [];
  tempArr[0] =
    "Found you through Cisco Startup Summit, I'm from Cisco too, talks products & startups, would love to have you on my network.";
  tempArr[1] =
    "I'm from Cisco too, found you through Cisco Startup Summit, would love to have you on my network.";
  localStorage.setItem("storage", JSON.stringify(tempArr));
}
tempLegacyStorage = JSON.parse(localStorage.getItem("storage"));
/*
 ** --------------------------------
 ** Function definitions starts here
 ** --------------------------------
 */
function startSet() {
  var returnInterval = setInterval(() => {
    var textArea = document.getElementsByTagName("textarea");
    for (let text of textArea) {
      if (text.value.length === 0) {
        for (let item of actionBar) {
          if (item.innerHTML.includes("Send")) {
            item.disabled = true;
            item.classList.add("artdeco-button--disabled");
            var storageBtn = document.getElementById("storage_code_button");
            if (storageBtn) {
              storageBtn.disabled = true;
              storageBtn.classList.add("artdeco-button--disabled");
            }
            // if send does't disable, remove break
            break;
          }
        }
      } else if (tempLegacyStorage.includes(text.value)) {
        for (let item of actionBar) {
          if (item.innerHTML.includes("Send")) {
            item.disabled = false;
            item.classList.remove("artdeco-button--disabled");
          }
        }
        var storageBtn = document.getElementById("storage_code_button");
        if (storageBtn) {
          storageBtn.disabled = true;
          storageBtn.classList.add("artdeco-button--disabled");
        }
      } else {
        for (let item of actionBar) {
          if (item.innerHTML.includes("Send")) {
            item.disabled = false;
            item.classList.remove("artdeco-button--disabled");
          }
        }
        var storageBtn = document.getElementById("storage_code_button");
        storageBtn.disabled = false;
        storageBtn.classList.remove("artdeco-button--disabled");
        break;
      }
    }
  }, [0]);
  return returnInterval;
}
function showModalHelper() {
  let modal = document.createElement("dialog");
  modal.setAttribute("id", "template_dialog");
  modal.setAttribute(
    "style",
    `
    height:60%;
    overflow: hidden;
    width:65%;
    bottom:30%;
    border:none;
    border-radius:15px;
    background-color:#323a42;
    position:fixed; box-shadow: 0px 12px 48px rgba(29, 5, 64, 0.32);
    -webkit-box-shadow: 10px 10px 72px -50px rgba(0,0,0,0.75);
    -moz-box-shadow: 10px 10px 72px -50px rgba(0,0,0,0.75);
    box-shadow: 10px 10px 72px -50px rgba(0,0,0,0.75);
    `
  );
  modal.innerHTML = `
  <iframe id="popup-content"; style="height:100%; width: 100%; background-color:#323a42;"></iframe>
  <div style="position:absolute; top:0px; left:5px; background-color: #323a42;">
    <button style="padding: 8px 12px; font-size: 16px; border: none; border-radius: 20px; color: white;">x</button>
  </div>`;
  document.body.appendChild(modal);
  let dialog = document.querySelector("dialog");
  dialog?.showModal();
  let iframe = document.getElementById("popup-content");
  iframe.src = chrome.runtime.getURL("index.html");
  let tempStorage = JSON.stringify(tempLegacyStorage);
  // sender to send notes from localStorage
  setTimeout(() => {
    iframe?.contentWindow?.postMessage(tempStorage, "*");
  }, [500]);
  // listener to receive messages from index.html
  window.onmessage = function (e) {
    if (e?.data?.includes("delete_")) {
      if (confirm("Hope you know what you are doing!") == true) {
        let index = parseInt(e.data.split("_")[1]);
        let flag = tempLegacyStorage[index - 1];
        if (tempLegacyStorage.includes(flag)) {
          tempLegacyStorage = tempLegacyStorage.filter((v) => v !== flag);
        }
        localStorage.setItem("storage", JSON.stringify(tempLegacyStorage));
      }
    } else {
      textAreaInject(e.data);
    }
    lPostbox = document.getElementById("postbox_button");
    if (lPostbox) {
      let tempBtnText = `📮 <font size="3px" style="align-self: center;justify-self: center;display: contents;">${defaultDashBtn}</font> ◀`;
      lPostbox.innerHTML = `${tempBtnText}`;
    }
    dialog.close();
  };
  // change ASCII text in postbox button on x click
  dialog.querySelector("button").addEventListener("click", () => {
    dialog.close();
    var button = document.querySelectorAll(".copy_code_button");
    button.forEach((elm) => {
      let tempBtnText = `📮 <font size="3px" style="align-self: center;justify-self: center;display: contents;">${defaultDashBtn}</font> ◀`;
      elm.innerHTML = `${tempBtnText}`;
    });
  });

  let currentDialog = document.getElementById("template_dialog");
  document.addEventListener("keyup", (event) => {
    if (event.key === 27 && currentDialog) {
      currentDialog.close();
      var button = document.querySelectorAll(".copy_code_button");
      button.forEach((elm) => {
        let tempBtnText = `📮 <font size="3px" style="align-self: center;justify-self: center;display: contents;">${defaultDashBtn}</font> ◀`;
        elm.innerHTML = `${tempBtnText}`;
      });
    }
  });
}
function addBtn(item) {
  // shuffle button
  var btnOne = document.createElement("button");
  btnOne.classList.add(
    "artdeco-button",
    "artdeco-button--2",
    "artdeco-button--primary",
    "ember-view",
    "ml1"
  );
  btnOne.classList.add("shuffle_code_button");
  // btnOne.appendChild(document.createTextNode("Shuffle ⌘ + I"));
  btnOne.innerHTML = `Shuffle&nbsp;<font size="3px" style="align-self: center;justify-self: center;display: contents;"><kbd>⌘</kbd>&nbsp;<kbd>I</kdb></font>`;
  item.parentNode.appendChild(btnOne);
  btnOne.style.position = "relative";
  // postbox button
  var btn = document.createElement("button");
  btn.classList.add(
    "artdeco-button",
    "artdeco-button--2",
    "artdeco-button--primary",
    "ember-view",
    "ml1"
  );
  btn.setAttribute("id", "postbox_button");
  btn.classList.add("copy_code_button");
  // btn.appendChild(document.createTextNode("📮 " + defaultDashBtn + " ◀"));
  btn.innerHTML = `📮 <font size="3px" style="align-self: center;justify-self: center;display: contents;">${defaultDashBtn}</font> ◀`;
  item.parentNode.appendChild(btn);
  btn.style.position = "relative";
  var returnStartSet = startSet();
  return returnStartSet;
}
function addStorageBtn() {
  // storage button
  var btnStorage = document.createElement("button");
  btnStorage.classList.add(
    "artdeco-button",
    "artdeco-button--2",
    "artdeco-button--primary",
    "ember-view",
    "ml1"
  );
  btnStorage.classList.add("storage_code_button");
  btnStorage.setAttribute("id", "storage_code_button");
  // btnStorage.appendChild(document.createTextNode("💾 new note. ⌘ + ⌥ + S"));
  btnStorage.innerHTML = `💾 new note &nbsp;<font size="3px" style="align-self: center;justify-self: center;display: contents;"><kbd>⌘</kbd> &nbsp; <kbd>⌥</kbd> &nbsp; <kbd>S</kbd></font>`;
  // paraphrase button
  /* var btnParaphrase = document.createElement("button");
  btnParaphrase.classList.add(
    "artdeco-button",
    "artdeco-button--2",
    "artdeco-button--primary",
    "ember-view",
    "ml1"
  );
  btnParaphrase.classList.add("paraphrase_button");
  btnParaphrase.setAttribute("id", "paraphrase_button");
  btnParaphrase.appendChild(document.createTextNode("Paraphrase"));*/
  textAreaMain?.parentNode?.appendChild(btnStorage);
  // textAreaMain?.parentNode?.appendChild(btnParaphrase);
  btnStorage.style.position = "relative";
}
// default textarea injecting
function textAreaInject(flag) {
  var textArea = document.getElementsByTagName("textarea");
  for (let text of textArea) {
    // first time
    if (flag === 0) {
      if (text.value.length === 0) {
        let items = tempLegacyStorage;
        text.value = items[0];
      }
    }
    // from shuffle
    else if (flag === 1) {
      let items = tempLegacyStorage;
      text.value =
        items[
          Math.floor(Math.random() * (items.length >= 3 ? 3 : items.length))
        ];
    }
    // from postbox
    else {
      text.value = flag;
      if (tempLegacyStorage.includes(flag)) {
        tempLegacyStorage = tempLegacyStorage.filter((v) => v !== flag);
      }
      tempLegacyStorage.unshift(flag);
      localStorage.setItem("storage", JSON.stringify(tempLegacyStorage));
    }
  }
}
/*
 ** ------------------------------
 ** Function definitions ends here.
 ** ------------------------------
 */
textAreaInject(0);
// add/remove button on click if emoji not present, remove otherwise.
for (let item of actionBar) {
  if (item.innerHTML.includes("Cancel")) {
    var returnBtn;
    if (!item.parentNode.lastChild.textContent.includes("📮")) {
      returnBtn = addBtn(item);
    } else {
      item.parentNode.removeChild(item.parentNode.lastChild);
      item.parentNode.removeChild(item.parentNode.lastChild);
      console.log(returnBtn);
      clearInterval(returnBtn);
    }
  }
}
// add/remove storage button
if (textAreaMain?.parentNode?.childElementCount === 4) {
  textAreaMain.parentNode.removeChild(textAreaMain.parentNode.lastChild);
  textAreaMain.parentNode.removeChild(textAreaMain.parentNode.lastChild);
} else {
  addStorageBtn();
}
// postbox button click activity
var button = document.querySelectorAll(".copy_code_button");
button.forEach((elm) => {
  elm.addEventListener("click", (e) => {
    if (elm.innerHTML.includes("◀")) {
      let tempBtnText = `📮 <font size="3px" style="align-self: center;justify-self: center;display: contents;">${defaultDashBtn}</font> ▲`;
      elm.innerHTML = `${tempBtnText}`;
      showModalHelper();
    } else {
      let tempBtnText = `📮 <font size="3px" style="align-self: center;justify-self: center;display: contents;">${defaultDashBtn}</font> ◀`;
      elm.innerHTML = `${tempBtnText}`;
    }
  });
});

// shuffle button click activity
var button2 = document.querySelectorAll(".shuffle_code_button");
button2.forEach((elm) => {
  elm.addEventListener("click", (e) => {
    textAreaInject(1);
  });
});
// storage button click activity
var button3 = document.querySelectorAll(".storage_code_button");
button3.forEach((elm) => {
  elm.addEventListener("click", (e) => {
    var textArea = document.getElementsByTagName("textarea");
    for (let text of textArea) {
      tempLegacyStorage.unshift(text.value);
      localStorage.setItem("storage", JSON.stringify(tempLegacyStorage));
    }
    elm.innerHTML = `Saved ✅`;
    setTimeout(() => {
      elm.innerHTML = `💾 new note &nbsp;<font size="3px" style="align-self: center;justify-self: center;display: contents;"><kbd>⌘</kbd> &nbsp; <kbd>⌥</kbd> &nbsp; <kbd>S</kbd></font>`;
    }, [500]);
  });
});
// paraphrase button click activity
var button4 = document.querySelectorAll(".paraphrase_button");
button4.forEach((elm) => {
  elm.addEventListener("click", (e) => {
    var textArea = document.getElementsByTagName("textarea");
    for (let text of textArea) {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({
        input: text.value,
      });

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
        mode: "cors",
        headers: {
          "Access-Control-Allow-Origin": "https://www.linkedin.com",
        },
      };

      fetch("https://postbox-ruthsan345.vercel.app/api", requestOptions)
        .then((response) => response.text())
        .then((result) => {
          console.log(result);
          var textArea = document.getElementsByTagName("textarea");
          for (let text of textArea) {
            text.value = result;
          }
        })
        .catch((error) => console.log("error", error));
    }
  });
});

/**
 *
 * Shortcuts
 *
 */

// shuffle
window.addEventListener("keydown", (e) => {
  if ((e.ctrlKey && e.keyCode === 73) || (e.metaKey && e.keyCode === 73)) {
    textAreaInject(1);
  }
});

// storage
window.addEventListener("keydown", (e) => {
  if (
    (e.ctrlKey && e.altKey && e.keyCode === 83) ||
    (e.metaKey && e.altKey && e.keyCode === 83)
  ) {
    button3.forEach((elm) => {
      var textArea = document.getElementsByTagName("textarea");
      let savedFlag = false;
      for (let text of textArea) {
        if (!tempLegacyStorage.includes(text.value)) {
          tempLegacyStorage.unshift(text.value);
          savedFlag = true;
          localStorage.setItem("storage", JSON.stringify(tempLegacyStorage));
        }
      }
      if (savedFlag === true) {
        elm.innerHTML = `Saved ✅`;
        setTimeout(() => {
          elm.innerHTML = `💾 new note &nbsp;<font size="3px" style="align-self: center;justify-self: center;display: contents;"><kbd>⌘</kbd> &nbsp; <kbd>⌥</kbd> &nbsp; <kbd>S</kbd></font>`;
        }, [500]);
      }
      savedFlag = false;
    });
  }
});
