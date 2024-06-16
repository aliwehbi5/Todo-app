const input = document.querySelector(".input");
const addBtn = document.querySelector(".addBtn");
const section = document.querySelector("section");
const tasksDiv = document.querySelector(".tasks");
const themeToggle = document.querySelector(".theme-toggle");
const icon = document.querySelector(".icon");
let items = 0;
let completed = 0;
let tasksObj = {};

themeToggle.addEventListener("click", () => {
  icon.classList.toggle("fa-sun");
  icon.classList.toggle("fa-moon");
  document.documentElement.classList.toggle("light");
  document.documentElement.classList.toggle("dark");
  localStorage.setItem("theme", document.documentElement.className);
});

input.addEventListener("keydown", function (event) {
  if (event.key === "Enter" || event.keyCode === 13) {
    event.preventDefault();
    if (input.value !== "") {
      const isDuplicate = Object.values(tasksObj).some((value) => {
        return value.content === input.value;
      });

      if (isDuplicate) {
        input.value = "";
        return;
      }

      makeTask(input.value, "false");
      input.value = "";
    }
  }
});

addBtn.addEventListener("click", (event) => {
  event.preventDefault();
  if (input.value !== "") {
    const isDuplicate = Object.values(tasksObj).some((value) => {
      return value.content === input.value;
    });

    if (isDuplicate) {
      input.value = "";
      return;
    }

    makeTask(input.value, "false");
    input.value = "";
  }
});

function makeTask(taskContent, isCompleted) {
  if (!tasksDiv.querySelector(".task")) {
    toggleClasses();
  }
  if (!section.querySelector(".footer")) {
    createFooter();
  }
  createTask(taskContent, isCompleted);
  refreshTask();
}

function createTask(taskContent, isCompleted) {
  tasksObj[tasksDiv.querySelectorAll(".task").length + 1] = {
    content: taskContent,
    completed: isCompleted,
  };
  localStorage.setItem("tasks", JSON.stringify(tasksObj));

  const taskDiv = document.createElement("div");
  taskDiv.className =
    "task d-flex justify-content-between align-items-center p-4";
  taskDiv.dataset.id = tasksDiv.querySelectorAll(".task").length + 1;
  taskDiv.dataset.completed = isCompleted;
  const textDiv = document.createElement("div");
  textDiv.className = "text d-flex align-items-center";
  const span = document.createElement("span");
  span.className = "complete-btn me-4 rounded-circle d-inline-block";
  const para = document.createElement("p");
  para.className = "task-content m-0";
  para.textContent = taskContent;
  const img = document.createElement("img");
  img.classList.add("close-img");
  img.src =
    "https://todo-app-faha1999.vercel.app/static/media/icon-cross.6ee81d30b75cab19d6f7314624fcc4d6.svg";
  taskDiv.appendChild(textDiv);
  textDiv.appendChild(span);
  textDiv.appendChild(para);
  taskDiv.appendChild(img);
  tasksDiv.appendChild(taskDiv);
  if (isCompleted == "true") {
    completedTask(taskDiv, taskDiv.dataset.id);
  }
  items++;
  refreshItems();
  span.addEventListener("click", () => {
    completedTask(taskDiv, taskDiv.dataset.id);
  });
  img.addEventListener("click", () => {
    if (!taskDiv.classList.contains("completed")) {
      items--;
    }
    deleteTask(taskDiv);
    refreshItems();
    if (items == 0 && document.querySelectorAll(".completed").length == 0) {
      document.querySelector(".footer").remove();
      toggleClasses();
    }
  });
}

function createFooter() {
  const footer = document.createElement("div");
  footer.className =
    "footer p-4 d-flex justify-content-between align-items-center";

  const footerSpan = document.createElement("span");
  footerSpan.className = "items-left";
  footerSpan.textContent = `${items} items left`;
  const ul = document.createElement("ul");
  ul.className = "list-unstyled m-0 d-flex gap-3";
  const firstLi = document.createElement("li");
  firstLi.textContent = "All";
  firstLi.classList.add("active");
  ul.appendChild(firstLi);
  const secondLi = document.createElement("li");
  secondLi.textContent = "Active";
  ul.appendChild(secondLi);
  const thirdLi = document.createElement("li");
  thirdLi.textContent = "Completed";
  ul.appendChild(thirdLi);
  const clearSpan = document.createElement("span");
  clearSpan.classList.add("clear");
  clearSpan.textContent = `Clear Completed`;
  footer.appendChild(footerSpan);
  footer.appendChild(ul);
  footer.appendChild(clearSpan);
  section.appendChild(footer);
  clearSpan.addEventListener("click", () => {
    clearCompleted();
  });
}

function refreshItems() {
  document.querySelector(".items-left").textContent = `${items} items left`;
}

function refreshTask() {
  const ul = document.querySelector("ul.list-unstyled");
  const tasks = document.querySelectorAll(".task");
  ul.querySelectorAll("li").forEach((li, index) => {
    li.addEventListener("click", () => {
      if (index == 0) {
        tasks.forEach((task) => {
          task.classList.remove("d-none");
        });
      } else if (index == 1) {
        tasks.forEach((task) => {
          if (task.classList.contains("completed")) {
            task.classList.add("d-none");
          } else {
            task.classList.remove("d-none");
          }
        });
      } else {
        tasks.forEach((task) => {
          if (task.classList.contains("completed")) {
            task.classList.remove("d-none");
          } else {
            task.classList.add("d-none");
          }
        });
      }
      ul.querySelectorAll("li").forEach((li) => {
        li.classList.remove("active");
      });
      li.classList.add("active");
    });
  });
}

function clearCompleted() {
  const completedTasks = document.querySelectorAll(".completed");
  completedTasks.forEach((task) => {
    deleteTask(task);
    if (items == 0) {
      if (document.querySelector(".footer")) {
        document.querySelector(".footer").remove();
      }
      toggleClasses();
    }
  });
}

function toggleClasses() {
  tasksDiv.querySelector("h4.main-h4").classList.toggle("d-none");
  tasksDiv.querySelector("p.main-p").classList.toggle("d-none");
  tasksDiv.classList.toggle("filled");
  section.classList.toggle("pt-5");
}

function completedTask(task, id) {
  if (task.classList.contains("completed")) {
    items++;
    completed--;
    tasksObj[id].completed = "false";
  } else {
    items--;
    completed++;
    tasksObj[id].completed = "true";
  }
  task.dataset.completed = tasksObj[id].completed;
  localStorage.setItem("tasks", JSON.stringify(tasksObj));
  task.classList.toggle("completed");
  refreshItems(items);
}

function deleteTask(task) {
  Object.entries(tasksObj).forEach(([key, value]) => {
    if (
      value.content == task.textContent &&
      value.completed == task.dataset.completed
    ) {
      delete tasksObj[key];
      const keys = Object.keys(tasksObj);
      const newTasksObj = {};

      for (let i = 0; i < keys.length; i++) {
        const oldKey = keys[i];
        const newIndex = i + 1;
        const value = tasksObj[oldKey];

        newTasksObj[newIndex] = value;
      }

      tasksObj = newTasksObj;
    }
  });
  localStorage.setItem("tasks", JSON.stringify(tasksObj));
  task.remove();
}

if (localStorage.getItem("tasks")) {
  tasksObj = JSON.parse(localStorage.getItem("tasks"));
  Object.entries(tasksObj).forEach(([taskId, taskData]) => {
    makeTask(taskData.content, taskData.completed);
  });
}

if (localStorage.getItem("theme")) {
  document.documentElement.classList.add(localStorage.getItem("theme"));
  icon.classList.toggle("fa-sun");
  icon.classList.toggle("fa-moon");
}
