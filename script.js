// Functions needed by index.html are kept in script.js
var documentChild = document.getElementById("notes_group");

// loading screen
newP = document.createElement("div");
newP.setAttribute("class", "loading-screen");
newDiv = document.createElement("div");
newDiv.setAttribute("class", "loading-bar");
newP.appendChild(newDiv);
documentChild.appendChild(newP);

// listener from parent
window.onmessage = function (e) {
  var notesList = JSON.parse(e.data);
  // delete loader on listen start
  documentChild.removeChild(documentChild.firstChild);
  var counter = 1;
  for (let eachNote of notesList) {
    for (let i = 0; i < 1; i++) {
      let masterA = document.createElement("div");
      // masterA.setAttribute("style", "display:flex; flex-direction: row; justify-content: space-between; align-items: center;");

      let newA = document.createElement("div");
      newA.setAttribute("id", "note" + counter.toString());
      newA.setAttribute("style", "margin:10px;");
      if (counter == 1) {
        newA.setAttribute("class", "list-group-item list-group-item-warning");
      } else if (counter === 2 || counter === 3) {
        newA.setAttribute("class", "list-group-item list-group-item-success");
      } else {
        newA.setAttribute("class", "list-group-item list-group-item-info  ");
      }
      newDiv = document.createElement("div");
      newDiv.setAttribute("class", "d-flex w-100 justify-content-between");
      newH = document.createElement("h5");
      newH.setAttribute("class", "mb-1");
      newH.setAttribute("id", "note_text" + counter.toString());
      newH.innerText = eachNote;
      newDiv.appendChild(newH);
      newA.appendChild(newDiv);

      /*
      let newB = document.createElement("div");
      newB.setAttribute("id", "note" + counter.toString());
      newB.setAttribute("style", "margin:10px;");
      if (counter == 1) {
        newB.setAttribute("class", "list-group-item list-group-item-warning");
      } else if (counter === 2 || counter === 3) {
        newB.setAttribute("class", "list-group-item list-group-item-success");
      } else {
        newB.setAttribute("class", "list-group-item list-group-item-info  ");
      }
      newButton = document.createElement("button");
      newButton.setAttribute("type", "button");
      newButton.setAttribute("class", "btn btn-danger");
      newButton.setAttribute("id", "delete_btn" + counter.toString());
      newIcon = document.createElement("i");
      newIcon.setAttribute("class", "glyphicon glyphicon-trash");
      newButton.appendChild(newIcon);
      newB.appendChild(newButton)
      */

      masterA.appendChild(newA);
      // masterA.appendChild(newButton)

      document.getElementById("notes_group").appendChild(masterA);
    }
    counter++;
  }

  // onClick event for delete button
  for (let i = 1; i < 500; i++) {
    if (document.getElementById("delete_btn" + i.toString())) {
      document
        .getElementById("delete_btn" + i.toString())
        .addEventListener("click", () => {
          window.top.postMessage("delete_" + i.toString(), "*");
        });
    }
  }

  // onClick event for notes
  for (let i = 1; i < 500; i++) {
    if (document.getElementById("note" + i.toString())) {
      document
        .getElementById("note" + i.toString())
        .addEventListener("click", () => {
          window.top.postMessage(
            document.getElementById("note_text" + i.toString()).innerText,
            "*"
          );
        });
    }
  }
};
