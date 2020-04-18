function saveToStorage() {
    [...document.getElementsByClassName('taskNameEdit')].forEach(function (item) {
        item.style.display = "none";
    });

    localStorage.setItem("toDoList", document.getElementById("toDoList").innerHTML);
    localStorage.setItem("doneList", document.getElementById("doneList").innerHTML);
    localStorage.setItem("sortToDo", document.getElementById("sortToDo").value);
    localStorage.setItem("sortDone", document.getElementById("sortDone").value);
    localStorage.setItem("searchText", document.getElementById("searchText").value);

}

function restoreFromStorage() {
    document.getElementById("toDoList").innerHTML = localStorage.getItem("toDoList");
    document.getElementById("doneList").innerHTML = localStorage.getItem("doneList");
    if (localStorage.getItem("sortToDo") != "") {
        document.getElementById("sortToDo").value = localStorage.getItem("sortToDo");
    }
    if (localStorage.getItem("sortDone") != "") {
        document.getElementById("sortDone").value = localStorage.getItem("sortDone");
    }
    if (localStorage.getItem("searchText") != "") {
        document.getElementById("searchText").value = localStorage.getItem("searchText");
    }

    [...document.getElementsByClassName('task')].forEach(function (item) {
        item.addEventListener("mouseover", () => item.getElementsByClassName("deleteIcon")[0].style.visibility = "visible");

        item.addEventListener("mouseout", function () {
            item.getElementsByClassName("deleteIcon")[0].style.visibility = "hidden";
        });
    });

    [...document.getElementsByClassName('taskNameInput')].forEach(function (item) {
        item.addEventListener("dblclick", function () {
            let taskEdit = this.parentNode.getElementsByClassName("taskNameEdit")[0];
            console.log(taskEdit);
            taskEdit.style.display = "";
            taskEdit.value = this.innerHTML;
        });
    });

    [...document.getElementsByClassName('taskNameEdit')].forEach(function (item) {
        item.addEventListener("keydown", function (e) {
            let task = this.parentNode.getElementsByClassName("taskNameInput")[0];
            if (e.key === "Enter") {
                task.innerHTML = this.value;
                this.style.display = "none";
                this.value = "";
            }
            if (e.key === "Escape") {
                this.value = "";
                this.style.display = "none";
            }

        });
    });


}

export {saveToStorage, restoreFromStorage }