import './style.css';
import {saveToStorage, restoreFromStorage} from './localStorage.js';


//------------------------------crObjects.js------------------------------------------------

function addNewTask() {
    let newTask = document.getElementById("newTask").value;
    createTask("toDoList", newTask);
}

function createTask(type, taskName) {
    let divTask = document.createElement('div');
    divTask.classList.add("task");

    let chk = createCheckBox();
    // task name container
    let tnContainer = document.createElement("div");
    tnContainer.classList.add("taskNameContainer");

    let task = document.createElement('div');
    task.classList.add("taskNameInput");
    task.innerHTML = taskName;
    task.setAttribute("readonly","readonly");

    let taskEdit = createTextarea('',"taskNameEdit");
    taskEdit.style.display = "none";
    
    taskEdit.addEventListener("keydown", function (e) {
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
    
    task.addEventListener("dblclick", function () {
        taskEdit.style.display = "";
        taskEdit.value = this.innerHTML;
    });

    tnContainer.appendChild(task);
    tnContainer.appendChild(taskEdit);
    
     //dates block
    let divDates = document.createElement('div');
    divDates.classList.add('datesBlock');
    let startDate = createDate('startDate', getDate());
    let endDate = createDate('endDate', '');
    divDates.appendChild(startDate);
    divDates.appendChild(endDate);
    let divDel = document.createElement("i");
    divDel.classList.add("fa");
    divDel.classList.add("fa-trash");
    divDel.classList.add("deleteIcon");
    divDel.style.visibility = "hidden";
    //

    divTask.addEventListener("mouseover", function(){
        divDel.style.visibility = "visible";
    });

    divTask.addEventListener("mouseout", function () {
        divDel.style.visibility = "hidden";
    });

    // construct record
    divTask.appendChild(chk);
    divTask.appendChild(tnContainer);
    divTask.appendChild(divDates);
    divTask.appendChild(divDel);
    
    // append to open list
    let parent = document.getElementById(type);
    parent.prepend(divTask);
}

function createCheckBox() {
    let chk = document.createElement('input');
    chk.setAttribute("type", "checkbox");
    chk.classList.add("isDone");
    return chk;
}

function getDate() {
    function pad(el) {
        if (el.toString().length < 2) {
            return '0' + el;
        } else return el;
    };
    let currDate = new Date();
    let hours = currDate.getHours();
    let min = currDate.getMinutes();
    let sec = currDate.getSeconds();
    return pad(hours) + ":" + pad(min) + ":" + pad(sec);
}

function createDate(type, value) {
    let div = document.createElement('div');
    div.classList.add(type);
    div.innerHTML = value;
    return div;
}

function createTextarea(text, className) {
    var taElement = document.createElement("textarea");
    var taElementText = document.createTextNode(text);
    taElement.appendChild(taElementText);
    taElement.classList.add(className);
    return taElement;
}

//-----------------------------end crObjects.js-------------------------------------------

//-----------------------------crFunctions.js ---------------------------------------------

function moveTaskToDone(task) {
    let doneList = document.getElementById("doneList");
    let endDate = task.querySelector(".endDate");
    endDate.innerHTML = getDate();
    doneList.appendChild(task);
}

function moveTaskToOpen(task) {
    let toDoList = document.getElementById("toDoList");
    let endDate = task.querySelector(".endDate");
    endDate.innerHTML = '';
    toDoList.appendChild(task);
}

// --------------- On Click ---------------

function onClickFunction(event) {
    let target = event.target;

    if (target.classList.contains("isDone")) {
        let task = target.closest('.task');
        if (target.checked) {
            target.setAttribute("checked","checked");
            moveTaskToDone(task);
        } else {
            target.removeAttribute("checked");
            moveTaskToOpen(task);
        }
    };

    if (target.id == "addTaskButton") {
        addNewTask();
    }

    //------- deleting record ----------------

    if (target.classList.contains("deleteIcon")) {
        let divTask = target.closest('.task');  
       divTask.remove();
    }
    
    // ------------------------------clearing lists-------------------------------
    const removeElements = (elms) => elms.forEach(el => el.remove());

    if (target.tagName == 'A') {
        event.preventDefault();
        if (target.closest('p').classList.contains('open')) {
            removeElements(document.querySelectorAll("#toDoList .task"));
            saveToStorage();
        }
        if (target.closest('p').classList.contains('done')) {
            removeElements(document.querySelectorAll("#doneList .task"));
            saveToStorage();
        }

    }
}
// ---------------------------- Sorting ------------------------

function sortList(sortedListId, optionValue) {
    let list = document.getElementById(sortedListId);
    let listElements = list.getElementsByClassName('task');
    let arr = Array.prototype.slice.call(listElements);
    
    if (optionValue == "Records (asc)") {
        arr.sort(sortBytaskNameInput);
    }

    if (optionValue == "Records (desc)") {
        arr.sort(sortBytaskNameInput);
        arr.reverse();
    }

    if (optionValue == "Creation date(asc)") {
        arr.sort(sortByStartDate);
    }

    if (optionValue == "Creation date(desc)") {
        arr.sort(sortByStartDate);
        arr.reverse();
    }

    if (optionValue == "Due date(asc)") {
        arr.sort(sortByEndDate);
    }

    if (optionValue == "Due date(desc)") {
        arr.sort(sortByEndDate);
        arr.reverse();
    }

    list.innerHtml = '';
    for (var i = 0; i < arr.length; i++) {
        list.appendChild(arr[i]); //add them again in different order
    }

    saveToStorage();

}

function sortByStartDate(a, b) {
    let avalue = a.getElementsByClassName('startDate')[0].innerHTML;
    let bvalue = b.getElementsByClassName('startDate')[0].innerHTML;
    let ret = (avalue == bvalue ? 0 : (avalue > bvalue ? 1 : -1));
    return ret;
}

function sortByEndDate(a, b) {
    let avalue = a.getElementsByClassName('endDate')[0].innerHTML;
    let bvalue = b.getElementsByClassName('endDate')[0].innerHTML;
    let ret = (avalue == bvalue ? 0 : (avalue > bvalue ? 1 : -1));
    return ret;
}

function sortBytaskNameInput(a, b) {
    let avalue = a.getElementsByClassName('taskNameInput')[0].innerHTML;
    let bvalue = b.getElementsByClassName('taskNameInput')[0].innerHTML;
    let ret = (avalue == bvalue ? 0 : (avalue > bvalue ? 1 : -1));
    return ret;
}

// ------------- filter lists ------------------------

function filterContent(val){
    let toDoListElements = document.getElementById("toDoList").getElementsByClassName('task');
    let doneListElements = document.getElementById("doneList").getElementsByClassName('task');

    for (let el of toDoListElements) {
        if (el.getElementsByClassName('taskNameInput')[0].innerHTML.indexOf(val)<0){
            el.style.display = "none";
            
        }
        else { el.style.display = "";}
    }
    for (let el of doneListElements) {
        if (el.getElementsByClassName('taskNameInput')[0].innerHTML.indexOf(val) < 0) {
            el.style.display = "none";

        }
        else { el.style.display = ""; }
    }
    saveToStorage();

}
// ------------------end crFunctions.js--------------------------------------

window.onload = restoreFromStorage;
window.onunload = saveToStorage;


//---------------- listeners.js -------------------------------------------
    document.addEventListener('click', () => {
        onClickFunction(event)
    });

    let toDoSort = document.getElementById("sortToDo");
    toDoSort.addEventListener("change", () => {
        sortList("toDoList", toDoSort.value)
    });

    let doneSort = document.getElementById("sortDone");
    doneSort.addEventListener("change", () => {
        sortList("doneList", doneSort.value)
    });

    let searchTextl = document.getElementById("searchText");
    searchText.addEventListener("keyup", () => filterContent(searchText.value));
//-----------------end listeners.js------------------------------------------------    

   



   












