let newArray = loadTasksFromStorage();
let currentActiveList = "";
let i = 0;

$(document).ready(function () {
  initializeTasks();
  initializeMembers();
  openMembers();
  $("#addTask").prop("disabled", true);
  listEvent();
  closeModal();

  $("#newTask").on("keypress", function (e) {
    if (e.key === "Enter") {
      createList();
    }
  });

  $(".create").on("click", function () {
    createList();
  });

  newTask();
  documentClick();
  menuItemClick();
  memberClick();
  trashBox();
  checkboxEvent();
});

function initializeTasks() {
  newArray.forEach(function (task) {
    let taskCount = task.task.filter((t) => !t.completed).length; // Tamamlanmamış görevleri say
    addDivToMenuBar(task.name, taskCount); // Task count ile menü öğesi ekle
    if (taskCount > 0) {
      $(".taskNumber").css("visibility", "visible");
    }
  });
}

function initializeMembers() {
  let memberArr = [
    {
      name: "Serkan Genç",
      section: 1,
      id: 2022189675,
      img: "user-profile.webp",
    },
    {
      name: "Jasmin Patel",
      section: 1,
      id: 2021139525,
      img: "./user-profile.webp",
    },
    {
      name: "Benjamin Harris",
      section: 2,
      id: 2023159677,
      img: "./user-profile.webp",
    },
    {
      name: "Megan Mitchell",
      section: 1,
      id: 20221496630,
      img: "./user-profile.webp",
    },
  ];

  $(".projectMem").css("display", "none");
  for (let x in memberArr) {
    $(".projectMem").append(
      `<div class="member">
        <div>
          <img src="${memberArr[x].img}" alt="user icon">
        </div>
        <div>
          <h5>${memberArr[x].name}</h5>
          <p>Section: ${memberArr[x].section}</p>
          <p>${memberArr[x].id}</p>
        </div>
      </div>`
    );
  }
}

function listEvent() {
  $(".newList").click(function () {
    $(".modal").css("display", "block");
    $(".bg").css("display", "flex");
  });
}

function closeModal() {
  $(".close").click(function () {
    $("#myModal").css("display", "none");
    $(".bg").css("display", "none");
  });
}

function createList() {
  var listName = $("#newTask").val();
  newArray.push({ name: listName, task: [] });
  addDivToMenuBar(listName, 0);
  saveAllTasks();
  $("#newTask").val("");
  $(".close").click();
  $(".menu-item").removeClass("active");
  openList(listName);
  $(".menu-item")
    .filter(function () {
      return $(this).find(".task").text() === listName;
    })
    .addClass("active");
}

function newTask() {
  $(document).on("keypress", "#addTask", function (event) {
    if (event.which === 13) {
      // Enter tuşuna basıldığında
      let taskValue = $("#addTask").val();
      if (taskValue) {
        addToTaskArray(currentActiveList, taskValue);
        let selectedObject = newArray.find(
          (item) => item.name === currentActiveList
        );
        addTaskToPage(
          currentActiveList,
          selectedObject.task[selectedObject.task.length - 1],
          selectedObject.task.length - 1
        );
        $("#addTask").val("");
        updateTaskCount(currentActiveList);
      }
    }
  });
}

function documentClick() {
  $(document).on("click", function (event) {
    if (
      !$(event.target).closest(".menu-item").length &&
      !$(event.target).closest(".page")
    ) {
      $(".menu-item").css("border-left", "");
    }
  });
}

function menuItemClick() {
  $(document).on("click", ".menu-item", function () {
    $(".menu-item").removeClass("active");
    currentActiveList = $(this).find(".task").text();
    $(this).addClass("active");
    $(".members").css("border-left", "");
    var textInsideP = $(this).find(".task").text();
    openList(textInsideP);
  });
}

function updateTaskCount(listName) {
  let listIndex = newArray.findIndex((item) => item.name === listName);
  if (listIndex !== -1) {
    let uncompletedTaskCount = newArray[listIndex].task.filter(
      (task) => !task.completed
    ).length;

    $(".menu-item")
      .eq(listIndex)
      .find(".taskNumber p")
      .text(uncompletedTaskCount);

    $(".menu-item")
      .eq(listIndex)
      .find(".taskNumber")
      .css("visibility", uncompletedTaskCount > 0 ? "visible" : "hidden");
  }
  saveAllTasks();
}

function updateTaskStatus(isChecked, taskText) {
  let listIndex = newArray.findIndex((item) => item.name === currentActiveList);
  if (listIndex !== -1) {
    let taskIndex = newArray[listIndex].task.findIndex(
      (task) => task.text === taskText
    );
    if (taskIndex !== -1) {
      newArray[listIndex].task[taskIndex].completed = isChecked;
    }

    let taskCount = newArray[listIndex].task.filter(
      (task) => !task.completed
    ).length;
    let taskCountElement = $(".menu-item").eq(listIndex).find(".taskNumber p");
    let taskNumberElement = $(".menu-item").eq(listIndex).find(".taskNumber ");
    taskCountElement.text(taskCount);
    taskNumberElement.css("visibility", taskCount > 0 ? "visible" : "hidden");
    saveAllTasks();
  }
}

function checkboxEvent() {
  $(document).on("change", "input[type='checkbox']", function () {
    var isChecked = $(this).is(":checked");
    var taskText = $(this).siblings("p").text();

    updateTaskStatus(isChecked, taskText);
    $(this)
      .siblings("p")
      .css("text-decoration", isChecked ? "line-through" : "none");
  });

  $(document).on("click", "p", function () {
    var isChecked = $(this).is(":checked");
    var taskText = $(this).text();

    updateTaskStatus(isChecked, taskText);
    $(this).css("text-decoration", isChecked ? "line-through" : "none");
  });

  $(document).on("click", "p", function () {
    // Toggle the 'checked' state of the associated checkbox
    var checkbox = $(this).siblings("input[type='checkbox']");
    checkbox.prop("checked", !checkbox.is(":checked"));

    // After toggling, use the new checked state for updates
    var isChecked = checkbox.is(":checked");
    var taskText = $(this).text();

    updateTaskStatus(isChecked, taskText);

    // Apply the text decoration to the paragraph itself
    $(this).css("text-decoration", isChecked ? "line-through" : "none");
  });
}

function memberClick() {
  $(".members").click(function () {
    $(".projectMem").css("display", "block");
    $(".taskPage").css("display", "none");
    $(".add").css("display", "none");
    $(".menu-item").removeClass("active");
    $(".members").css("border-left", "3px solid black");
    $(".page").css("background", "linear-gradient(90deg, #123456, #fff)");
  });
}

function trashBox() {
  $(document).on("click", ".trashBox", function (e) {
    var textInsideP = $(this).closest(".menu-item").find(".task").text();
    var indexToRemove = newArray.findIndex(
      (item) => item.name.toLowerCase() === textInsideP.toLowerCase()
    );

    if (indexToRemove !== -1) {
      $(".menu-item").eq(indexToRemove).remove();
      newArray.splice(indexToRemove, 1);
      saveAllTasks();
      e.stopPropagation();

      var newIndexToShow =
        indexToRemove === newArray.length ? indexToRemove - 1 : indexToRemove;

      if (newArray.length == 0) {
        handleEmptyTaskList();
      } else {
        openPreviousTask(indexToRemove - 1);
      }
    }
  });
}

function openPreviousTask(id) {
  $(".taskPage").children().remove();
  renderTaskDetails(id);
}

function renderTaskDetails(id) {
  $(".taskPage").empty();

  let task = newArray[id];
  openList(task.name);
}

function handleEmptyTaskList() {
  $(".taskPage").hide();
  openMembers();
}

function closeCurrentPage(index) {
  $(".menu-item").eq(index).hide();
}

function openMembers() {
  // Logic to open/display members section
  // Make sure to update the UI accordingly
  $(".projectMem").css("display", "block");
  $(".taskPage").css("display", "none");
  $(".add").css("display", "none");
  // Other necessary UI updates for this view
}

function addToTaskArray(name, taskValue) {
  let selectedObject = newArray.find((item) => item.name === name);
  let newTask = { text: taskValue, completed: false };
  selectedObject.task.push(newTask);
  saveAllTasks();
  updateTaskCount(name);
}

function addTaskToPage(textInsideP, task, i) {
  let isChecked = task.completed ? "checked" : "";
  let textDecoration = task.completed ? "line-through" : "none";
  let spaceCount = (textInsideP.match(/\s/g) || []).length;
  if (spaceCount >= 1) {
    let classes = textInsideP.split(" ").map((word) => word.trim());
    $("." + classes[0]).append(
      `<div class="taskClass">
         <div class="taskItem">
           <input type="checkbox" ${isChecked} name="${textInsideP}-task" id="check${textInsideP}${i}" />
           <p style="text-decoration: ${textDecoration};">${task.text}</p>
         </div>
       </div>`
    );
  } else {
    $("." + textInsideP).append(
      `<div class="taskClass">
         <div class="taskItem">
           <input type="checkbox" ${isChecked} name="${textInsideP}-task" id="check${textInsideP}${i}" />
           <p style="text-decoration: ${textDecoration};">${task.text}</p>
         </div>
       </div>`
    );
  }
}

function addDivToMenuBar(name, num) {
  $(".menubar").append(
    '<div class="menu-item"><i class="fa-solid fa-bars"></i><p class="task">' +
      name +
      '</p><div class="trashBox"><i class="fa-solid fa-trash"></i></div><div class="taskNumber"><p>' +
      num +
      "</p></div></div>"
  );
}

function loadTasksFromStorage() {
  let data = localStorage.getItem("newArray");
  return data ? JSON.parse(data) : [];
}

function saveAllTasks() {
  localStorage.setItem("newArray", JSON.stringify(newArray));
}

function openList(textInsideP) {
  if (newArray !== null) {
    currentActiveList = textInsideP;

    $(".menu-item").removeClass("active");
    $(".menu-item")
      .filter(function () {
        return $(this).find(".task").text() === textInsideP;
      })
      .addClass("active");

    $(".projectMem").css("display", "none");
    $(".page").css("background", "linear-gradient(90deg, #7392c4, #4255c1)");
    $(".add").css("display", "block");
    $("#addTask").prop("disabled", false);
    $(".taskPage")
      .empty()
      .css("display", "block")
      .append(
        '<div class="' +
          textInsideP +
          '"><p class="title">' +
          textInsideP +
          "</p></div>"
      );

    newArray
      .find((item) => item.name.toLowerCase() === textInsideP.toLowerCase())
      .task.forEach((task, index) => {
        addTaskToPage(textInsideP, task, index);
      });
  }
}
