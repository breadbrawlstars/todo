// Load the first CSS file
const link1 = document.createElement("link");
link1.rel = "stylesheet";
link1.href = "/MaterialIcons/MaterialIcons.css";
document.head.appendChild(link1);

// Load the second CSS file after the first one has finished loading
const link2 = document.createElement("link");
link2.rel = "stylesheet";
link2.href = "main.css";
link1.onload = () => {
  document.head.appendChild(link2);
};

const list_el = document.getElementById("list");
const create_btn_el = document.getElementById("create");

let todos = [];

create_btn_el.addEventListener('click', CreateNewTodo);

function CreateNewTodo() {
  const item = {
    id: new Date().getTime(),
    text: "",
    complete: false
  };

  todos.unshift(item);

  const { item_el, input_el } = CreateTodoElement(item);

  list_el.prepend(item_el);

  input_el.removeAttribute("disabled");
  input_el.focus();

  let shouldSave = false;

  input_el.addEventListener("input", () => {
    item.text = input_el.value;
  });

  input_el.addEventListener("keypress", (event) => {
    if (event.key === "Enter" && input_el.value.trim() !== "") {
      shouldSave = true;
      input_el.setAttribute("disabled", "");
    }
  });

  input_el.addEventListener("blur", () => {
    if (shouldSave) {
      Save();
    } else if (input_el.value.trim() === "") {
      todos = todos.filter((t) => t.id != item.id);
      item_el.remove();
    }
  });

  item_el.addEventListener("click", (event) => {
    if (event.target !== input_el && input_el.value.trim() !== "") {
      shouldSave = true;
      input_el.setAttribute("disabled", "");
    }
  });

  const edit_btn_el = item_el.querySelector(".edit-btn");
  edit_btn_el.addEventListener("click", () => {
    input_el.removeAttribute("disabled");
    input_el.focus();
  });

  const remove_btn_el = item_el.querySelector(".remove-btn");
  remove_btn_el.addEventListener("click", () => {
    todos = todos.filter((t) => t.id != item.id);
    item_el.remove();
    Save();
  });
}

/* 
  <div class="item">
      <input type="checkbox" />
      <input 
          type="text" 
          value="Todo content goes here" 
          disabled />
      <div class="actions">
          <button class="material-icons">edit</button>
          <button class="material-icons remove-btn">remove_circle</button>
      </div>
  </div> 
*/

function CreateTodoElement(item) {
    const item_el = document.createElement("div");
    item_el.classList.add("item");

    const checkbox_wrapper = document.createElement("label");
    checkbox_wrapper.classList.add("checkbox-wrapper");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = item.complete;

    if (item.complete) {
        item_el.classList.add("complete");
        checkbox_wrapper.classList.add("checked");
    }

    const checkbox_indicator = document.createElement("span");
    checkbox_indicator.classList.add("checkbox-indicator");

    checkbox_wrapper.append(checkbox);
    checkbox_wrapper.append(checkbox_indicator);
    item_el.append(checkbox_wrapper);

    const input_el = document.createElement("input");
    input_el.placeholder = "What do you need to do?";
    input_el.type = "text";
    input_el.value = item.text;
    input_el.setAttribute("disabled", "");

    const actions_el = document.createElement("div");
    actions_el.classList.add("actions");

    const button_group = document.createElement("div"); // Create a container for the buttons
    button_group.classList.add("button-group"); // Add a class to the container

    const edit_btn_el = document.createElement("button");
    edit_btn_el.classList.add("material-icons");
    edit_btn_el.innerText = "edit";

    const remove_btn_el = document.createElement("button");
    remove_btn_el.classList.add("material-icons", "remove-btn");
    remove_btn_el.innerText = "remove_circle";

    button_group.append(edit_btn_el); // Append both buttons to the container
    button_group.append(remove_btn_el);

    actions_el.append(button_group); // Append the container to the actions element

    item_el.append(input_el);
    item_el.append(actions_el);

    // EVENTS
    checkbox.addEventListener("change", () => {
        item.complete = checkbox.checked;

        if (item.complete) {
            item_el.classList.add("complete");
            checkbox_wrapper.classList.add("checked");
            // move completed items to the bottom
            list_el.appendChild(item_el);
        } else {
            item_el.classList.remove("complete");
            checkbox_wrapper.classList.remove("checked");
            // move incomplete items to the top
            list_el.insertBefore(item_el, list_el.firstChild);
        }

        Save();
    });

    checkbox_wrapper.addEventListener("mouseover", () => {
        if (!item.complete) {
            checkbox_indicator.classList.add("hover");
        }
    });

    checkbox_wrapper.addEventListener("mouseout", () => {
        checkbox_indicator.classList.remove("hover");
        checkbox_indicator.classList.remove("active");
    });

    checkbox_wrapper.addEventListener("mousedown", () => {
        if (!item.complete) {
            checkbox_indicator.classList.add("active");
        }
    });

    checkbox_wrapper.addEventListener("mouseup", () => {
        checkbox_indicator.classList.remove("active");
    });

    input_el.addEventListener("input", () => {
        item.text = input_el.value;
    });

    input_el.addEventListener("blur", () => {
        if (input_el.value.trim() === '') {
            if (item.id === todos[0].id) {
                return;
            }
            todos = todos.filter(t => t.id != item.id);
            item_el.remove();
        } else {
            input_el.setAttribute("disabled", "");
            Save();
        }
    });

    edit_btn_el.addEventListener("click", () => {
        input_el.removeAttribute("disabled");
        input_el.focus();
    });

    remove_btn_el.addEventListener("click", () => {
        todos = todos.filter(t => t.id != item.id);

        item_el.remove();

        Save();
    });

    return { item_el, input_el, edit_btn_el, remove_btn_el }
}

function DisplayTodos() {
    Load();

    for (let i = 0; i < todos.length; i++) {
        const item = todos[i];

        const { item_el } = CreateTodoElement(item);

        list_el.append(item_el);
    }
}

DisplayTodos();

function Save() {
    const save = JSON.stringify(todos);
    
    localStorage.setItem("my_todos", save);
}

function Load() {
    const data = localStorage.getItem("my_todos");

    if (data) {
        todos = JSON.parse(data);
    }
}

const todoItems = document.querySelectorAll('.item');

todoItems.forEach((item) => {
  const textInput = item.querySelector('input[type="text"]');

  textInput.addEventListener('input', () => {
    textInput.style.width = 'auto';
    textInput.style.width = `${textInput.scrollWidth}px`;
  });
});

const h1 = document.querySelector('h1');
const colorPicker = document.querySelector('input[type=color]');
colorPicker.style.display = 'none';

h1.addEventListener('click', () => {
  if (colorPicker.style.display === 'none') {
    colorPicker.style.display = 'inline';
  } else {
    colorPicker.style.display = 'none';
  }
});

colorPicker.addEventListener('input', () => {
  document.body.style.backgroundColor = colorPicker.value;
});
