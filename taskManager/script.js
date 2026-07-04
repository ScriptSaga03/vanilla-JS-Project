const app = {
  // target elements
  input: document.querySelector('#taskInput'),
  addBtn: document.querySelector('#addBtn'),
  taskList: document.querySelector('#taskList'),
  statusMsg: document.querySelector('#status-msg'),
  clearDatabase: document.querySelector('#clearAllBtn'),

  statusTimer: null,

  showStatus: function (msg, color) {
    if (this.statusTimer) {
      clearTimeout(this.statusTimer);
    }

    this.statusMsg.innerText = msg;
    this.statusMsg.style.color = color;
    this.statusMsg.classList.add('show');

    setTimeout(() => {
      this.statusMsg.classList.remove('show');
    }, 2000);
  },

  // init
  init: function () {
    const savedDraft = sessionStorage.getItem('draftTask');
    if (savedDraft) {
      this.input.value = savedDraft;
      this.showStatus('📝 Draft restored from session', 'blue');
    }

    // add task listener
    this.addBtn.addEventListener('click', () => {
      this.addTasks();
    });

    // add task if user press enter button
    this.input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.addTasks();
      }
    });

    this.input.addEventListener('input', (e) => {
      sessionStorage.setItem('draftTask', e.target.value);
    });

    this.clearDatabase.addEventListener('click', () => {
      this.removeDatabase();
    });

    this.taskList.addEventListener('click', (e) => {
      const taskName = e.target.getAttribute('data-task');
      if (e.target.classList.contains('remove-btn')) {
        this.removeTask(taskName);
      } else if (e.target.classList.contains('edit-btn')) {
        this.editTask(taskName);
      }
    });

    this.showStatus('🔃 fetching data, please wait', 'purple');
    this.taskList.innerHTML = '';
    setTimeout(() => {
      let tasks = JSON.parse(localStorage.getItem('myList'));
      if (tasks && tasks.length > 0) {
        this.showStatus('✅ Data Loaded.', 'blue');
        this.renderTasks();
      } else {
        this.showStatus('no match found', 'red');
      }
    }, 4000);
  },

  // add Items
  addTasks: function () {
    let val = this.input.value.trim();
    if (val === '' || !isNaN(val)) {
      this.showStatus('⚠️ Invalid input!', 'red');
      return;
    }

    let tasks = JSON.parse(localStorage.getItem('myList')) || [];

    if (this.editMode) {
      const index = tasks.indexOf(this.editId);
      if (index !== -1) {
        tasks[index] = val;
        this.showStatus('✏️ Task Updated!', 'blue');
      }
      this.editMode = false;
      this.editId = null;
      this.addBtn.innerText = 'Add Task';
      this.addBtn.style.backgroundColor = '';
    } else {
      if (tasks.includes(val)) {
        this.showStatus('⚠️ Task already exists!', 'orange');
        return;
      }

      tasks.push(val);
      this.showStatus('✅ Task added!', 'green');
    }
    sessionStorage.removeItem('draftTask');
    localStorage.setItem('myList', JSON.stringify(tasks));
    this.input.value = '';
    this.renderTasks();
  },

  // render
  renderTasks: function () {
    // first empty old list
    this.taskList.innerHTML = '';

    // get data
    const tasks = JSON.parse(localStorage.getItem('myList')) || [];

    const fragment = document.createDocumentFragment();

    // run loop
    if (tasks) {
      tasks.forEach((item) => {
        let li = document.createElement('li');
        li.classList.add('task-item');
        li.innerHTML = `
          <span>${item}</span>
              <div class="actions">
              <button class="edit-btn"  data-task ="${item}">Edit</button>
              <button class="remove-btn"  data-task ="${item}">Remove</button>
          </div>
              `;
        fragment.appendChild(li);
      });
      this.taskList.appendChild(fragment);
    }
  },

  // remove task
  removeTask: function (taskName) {
    const confirmUser = confirm(`Do you really want to remove "${taskName}"?`);

    if (confirmUser) {
      const tasks = JSON.parse(localStorage.getItem('myList')) || [];
      const updatedTask = tasks.filter((item) => item !== taskName);
      localStorage.setItem('myList', JSON.stringify(updatedTask));
      this.showStatus(`✅ ${taskName} removed!`, 'red');
      this.renderTasks();
    }
  },
  // edit task
  editId: null,
  editMode: false,

  editTask: function (oldTask) {
    let tasks = JSON.parse(localStorage.getItem('myList')) || [];
    let exist = tasks.find((item) => item === oldTask);
    this.input.value = exist;

    // 3. Edit Mode On karo
    this.editMode = true;
    this.editId = oldTask;

    this.addBtn.innerText = 'Update Task';
    this.addBtn.style.backgroundColor = '#f59e0b';
    this.input.focus();
  },

  // clearDatabase
  removeDatabase: function () {
    let tasks = JSON.parse(localStorage.getItem('myList'));

    if (tasks) {
      localStorage.removeItem('myList');
      this.showStatus('✅ clear database.');
      this.renderTasks();
    } else {
      this.showStatus('❌ database already cleared!', 'red');
    }
  },
};

app.init();
