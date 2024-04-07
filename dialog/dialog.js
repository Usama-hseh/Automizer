module.exports = {
    createDialog: (text) => {
        let dialog = makeDialog(text);
        document.body.appendChild(dialog).showModal();

    }
}


function makeDialog(text) {
    const dialog = document.createElement("dialog");
    dialog.style.color = "white";
    dialog.title = "Task Summary";
    const div = document.createElement("div");
    div.style.display = "block";
    div.style.height = "50px";
    div.style.width = "200px";
    div.classList.add("summaryDialog");
    const header = document.createElement("sp-detail");
    header.id = "head";
  //  header.style.color = "white";
    header.textContent = text;
    div.appendChild(header);
    const buttonContainer = document.createElement('div')
    const doneButton = document.createElement("button");
    buttonContainer.style.display = 'flex'
    buttonContainer.style.alignItems = 'center'
    buttonContainer.style.justifyContent = 'center'
    buttonContainer.appendChild(doneButton)
    doneButton.id = "done";
    doneButton.textContent = "Done";
    div.appendChild(buttonContainer);
    dialog.appendChild(div);
   doneButton.addEventListener('click', () => {
    dialog.close()})
    return dialog;
}