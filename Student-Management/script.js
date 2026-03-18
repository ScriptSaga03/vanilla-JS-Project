const students = [
  { id: 101, name: 'Rahul', grade: 'A', marks: 85, city: 'Delhi' },
  { id: 102, name: 'Aditi', grade: 'B', marks: 72, city: 'Mumbai' },
  { id: 103, name: 'Mehtab', grade: 'B', marks: 76, city: 'Delhi' },
  { id: 104, name: 'Nafees', grade: 'D', marks: 54, city: 'Delhi' },
  { id: 105, name: 'Ishaan', grade: 'A', marks: 89, city: 'Mumbai' },
  { id: 106, name: 'Ananya', grade: 'A', marks: 92, city: 'Bangalore' },
  { id: 107, name: 'Kabir', grade: 'D', marks: 45, city: 'Pune' },
  { id: 108, name: 'Zoya', grade: 'B', marks: 78, city: 'Hyderabad' },
  { id: 109, name: 'Aryan', grade: 'F', marks: 31, city: 'Chennai' },
  { id: 110, name: 'Riya', grade: 'C', marks: 65, city: 'Kolkata' },
  { id: 111, name: 'Siddharth', grade: 'A', marks: 82, city: 'Ahmedabad' },
  { id: 112, name: 'Myra', grade: 'B', marks: 74, city: 'Jaipur' },
];

const app = {
  allData: [...students],
  statusTimer: null,

  state: {
    searchQuery: '',
    statusFilter: 'all',
    sortMarks: 'none',
  },

  // targetElements
  tBody: document.querySelector('#tableBody'),
  statusMsg: document.querySelector('#status-msg'),
  table: document.querySelector('#studentTable'),
  form: document.querySelector('#studentForm'),
  searchQuery: document.querySelector('#searchInput'),
  sortMarks: document.querySelector('#sortMarks'),
  showPass: document.querySelector('#showPass'),
  showFail: document.querySelector('#showFail'),
  showAll: document.querySelector('#showAll'),
  totalCount: document.querySelector('#total-count'),
  classAvg: document.querySelector('#class-avg'),
  classTopper: document.querySelector('.class-topper'),
  cityTopperBtn: document.querySelector('#cityTopperBtn'),
  cityTopperInput: document.querySelector('#cityInput'),
  graceBtn: document.querySelector('#graceBtn'),
  clearFilters: document.querySelector('#clearFilters'),

  // status msg
  showStatus: function (msg, color) {
    if (this.statusTimer) clearTimeout(this.statusTimer);
    this.statusMsg.innerText = msg;
    this.statusMsg.style.color = color;
    this.statusMsg.classList.add('show');

    this.statusTimer = setTimeout(() => {
      this.statusMsg.innerText = '';
      this.statusMsg.classList.remove('show');
      this.statusTimer = null;
    }, 3000);
  },

  // debounce
  debounce: function (originalFun, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        originalFun.apply(this, args);
      }, delay);
    };
  },

  // active
  updateActiveState: function (activeId) {
    [this.showPass, this.showFail, this.showAll].forEach((btn) => {
      btn.classList.remove('active');
    });
    if (activeId === 'pass') this.showPass.classList.add('active');
    if (activeId === 'fail') this.showFail.classList.add('active');
    if (activeId === 'all') this.showAll.classList.add('active');
  },
  // render table (UI)
  renderTable: function (data) {
    this.tBody.innerHTML = '';

    if (!data || data.length === 0) {
      this.table.style.display = 'none';
      this.showStatus('⚠️ Data not found!', 'orange');
      return;
    }

    this.table.style.display = 'table';

    const rowsHTML = data
      .map(
        (item) => `
      <tr data-id="${item.id}">
        <td>${item.id}</td>
        <td>${item.name}</td>
        <td>${item.city}</td>
        <td>${item.marks}</td>
        <td><b style="color: ${item.marks >= 33 ? 'green' : 'red'}">${
          item.grade
        }</b></td>
        <td>
        <button class="edit-btn">Edit</button>
        <button class="remove-btn">Remove</button>
        </td>
      </tr>
    `
      )
      .join('');

    this.tBody.innerHTML = rowsHTML;
  },

  // init function
  init: function () {
    // get session storage data in input
    const savedDraft = JSON.parse(sessionStorage.getItem('studentDraft')) || {};
    if (savedDraft && Object.keys(savedDraft).length > 0) {
      if (savedDraft.name)
        document.querySelector('#name').value = savedDraft.name;
      if (savedDraft.marks)
        document.querySelector('#marks').value = savedDraft.marks;
      if (savedDraft.city)
        document.querySelector('#city').value = savedDraft.city;

      setTimeout(() => {
        this.showStatus('📝 Draft restored for all fields', 'blue');
      }, 500);
    }

    // 1. Restore State
    const savedState = JSON.parse(sessionStorage.getItem('appState'));
    if (savedState) {
      this.state = savedState;
      this.searchQuery.value = this.state.searchQuery;
      this.sortMarks.value = this.state.sortMarks;
      this.updateActiveState(this.state.statusFilter);
    }

    // listener
    // 1. Search with Debounce
    const searchHandler = this.debounce((e) => {
      this.state.searchQuery = e.target.value;
      this.smartSearch();
    }, 500);

    this.searchQuery.addEventListener('input', searchHandler);

    // sorting dropDown
    this.sortMarks.addEventListener('change', (e) => {
      this.state.sortMarks = e.target.value;
      this.smartSearch();
    });

    this.showPass.addEventListener('click', () => {
      this.state.statusFilter = 'pass';
      this.smartSearch();
      this.updateActiveState('pass');
    });
    this.showFail.addEventListener('click', (e) => {
      this.state.statusFilter = 'fail';
      this.smartSearch();
      this.updateActiveState('fail');
    });
    this.showAll.addEventListener('click', () => {
      this.state.statusFilter = 'all';
      this.state.searchQuery = '';
      this.state.sortMarks = 'none';
      this.searchQuery.value = '';
      this.sortMarks.value = 'none';
      this.smartSearch();
      this.updateActiveState('all');
      sessionStorage.removeItem('searchDraft');
    });

    // classTopper
    this.classTopper.addEventListener('click', () => {
      this.topper();
    });

    // city topper
    this.cityTopperBtn.addEventListener('click', () => {
      let val = this.cityTopperInput.value;
      this.cityTopper(val);
    });

    // grace marks
    this.graceBtn.addEventListener('click', () => {
      this.graceMarks();
    });

    // clear filters
    this.clearFilters.addEventListener('click', () => {
      this.resetFilters();
    });

    // save session with debounce
    this.form.addEventListener('input', (e) => {
      const inputId = e.target.id;
      const inputValue = e.target.value;

      const debouncedSave = this.debounce(() => {
        let currentDraft =
          JSON.parse(sessionStorage.getItem('studentDraft')) || {};
        currentDraft[inputId] = inputValue;
        sessionStorage.setItem('studentDraft', JSON.stringify(currentDraft));
      }, 1000);

      debouncedSave();
    });

    // add or update
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.addNew();
      sessionStorage.removeItem('studentDraft');
    });

    // listner for remove or edit (event deligation)
    this.tBody.addEventListener('click', (e) => {
      const row = e.target.closest('tr');
      if (!row) return;
      const id = parseInt(row.dataset.id);
      if (e.target.classList.contains('remove-btn')) {
        this.removeStudent(id);
      }

      if (e.target.classList.contains('edit-btn')) {
        this.editRecord(id);
      }
    });

    this.table.style.display = 'none';
    this.showStatus('🔃 fetching students record, please wait 3s', 'purple');

    setTimeout(() => {
      const savedData = JSON.parse(localStorage.getItem('studentDB'));
      if (savedData && savedData.length > 0) {
        this.allData = savedData;
      } else {
        // Agar pehli baar app khul rahi hai, toh purana students array lo
        this.allData = [...students];
        // Aur use save kar do storage mein
        localStorage.setItem('studentDB', JSON.stringify(this.allData));
      }

      if (this.allData.length > 0) {
        this.showStatus('✅ Data loaded successfully.', 'green');
        this.table.style.display = 'table';
        // this.renderTable(this.allData);
        // this.updateStats(this.allData);
        this.smartSearch();
      } else {
        this.showStatus('❌ No records in Database.', 'red');
      }
    }, 1500);
  },

  // reset filter
  resetFilters: function () {
    // 1. Reset state
    this.state = {
      searchQuery: '',
      statusFilter: 'all',
      sortMarks: 'none',
    };
    // 2. Clear UI Inputs
    this.searchQuery.value = '';
    this.sortMarks.value = 'none';
    this.cityTopperInput.value = '';
    this.updateActiveState('all');

    // 3. Clear Session
    sessionStorage.removeItem('appState');

    // 4. Refresh Table
    this.smartSearch();
    this.showStatus('🧹 Filters Reset Successfully!', 'gray');
  },

  // add students
  addNew: function () {
    const name = document.querySelector('#name');
    const marks = document.querySelector('#marks');
    const city = document.querySelector('#city');

    if (name.value.trim() === '') {
      this.showStatus('⚠️ Name is required!', 'orange');
      name.style.borderColor = 'red';
      name.focus();
      return;
    }
    if (marks.value === '') {
      this.showStatus('⚠️ Marks is required!', 'orange');
      marks.style.borderColor = 'red';
      marks.focus();
      return;
    }
    if (city.value.trim() === '') {
      this.showStatus('⚠️ City is required!', 'orange');
      city.style.borderColor = 'red';
      city.focus();
      return;
    }

    let marksValue = Number(marks.value);
    if (marksValue < 0 || marksValue > 100) {
      this.showStatus('❌ Marks should be between 0-100', 'red');
      marks.focus();
      return;
    }
    if (isNaN(marksValue)) {
      this.showStatus('❌ Please enter a valid number for marks', 'red');
      marks.focus();
      return;
    }

    // Data normalization
    const formatText = (str) => {
      return str
        .trim()
        .split(/\s+/)
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(' ');
    };
    const formattedName = formatText(name.value.trim());
    const formattedCity = formatText(city.value.trim());

    if (this.editId) {
      this.allData = this.allData.map((s) =>
        s.id === this.editId
          ? {
              ...s,
              name: formattedName,
              city: formattedCity,
              marks: marksValue,
              grade: this.calculateGrade(marksValue),
            }
          : s
      );
      localStorage.setItem('studentDB', JSON.stringify(this.allData));
      this.showStatus(`✅ Student ID: ${this.editId} Updated!`, 'green');
      this.editId = null;
      this.form.querySelector('button').innerText = 'Add Student';
      this.form.querySelector('button').style.backgroundColor = '';
    } else {
      // Id gen
      // const newId =
      //   this.allData.length > 0
      //     ? this.allData[this.allData.length - 1].id + 1
      //     : 101;

      const maxId =
        this.allData.length > 0
          ? Math.max(...this.allData.map((s) => s.id))
          : 100;

      const newId = maxId + 1;

      // add New student
      const newStudent = {
        id: newId,
        name: formattedName,
        marks: marksValue,
        grade: this.calculateGrade(marksValue),
        city: formattedCity,
      };

      this.allData.push(newStudent);
      localStorage.setItem('studentDB', JSON.stringify(this.allData));
      this.showStatus(
        `✅ Student with ID ${newId} added successfully`,
        'green'
      );
    }

    this.smartSearch();
    this.form.reset();
    [name, marks, city].forEach((el) => (el.style.borderColor = ''));
  },

  calculateGrade: function (marks) {
    if (marks > 80) return 'A';
    if (marks > 60) return 'B';
    if (marks > 45) return 'C';
    if (marks > 33) return 'D';
    else return 'F';
  },

  // edit student or update
  editId: null,
  editRecord: function (id) {
    let student = this.allData.find((s) => s.id === id);
    if (!student) {
      this.showStatus(`${id} not exist!`);
      return;
    }
    this.editId = id;
    document.querySelector('#name').value = student.name;
    document.querySelector('#marks').value = student.marks;
    document.querySelector('#city').value = student.city;

    // focus
    document.querySelector('#name').focus();

    this.form.querySelector('button').innerText = 'Update Student';
    this.form.querySelector('button').style.backgroundColor = 'green';
  },

  // remove student
  removeStudent: function (id) {
    const student = this.allData.find((s) => s.id === id);
    if (!student) return;

    if (confirm(`Are you sure you want to delete ${student.name}?`)) {
      this.allData = this.allData.filter((s) => s.id !== id);
      localStorage.setItem('studentDB', JSON.stringify(this.allData));
      this.showStatus(
        `🗑️ Student "${student.name}" (ID: ${id}) has been removed.`,
        'orange'
      );
    }
    this.smartSearch();
  },

  // smart search
  smartSearch: function () {
    let filtered = [...this.allData];

    // searchLogic
    if (this.state.searchQuery) {
      const query = this.state.searchQuery.trim().toLowerCase();
      filtered = filtered.filter((s) => {
        return (
          s.id.toString() === query ||
          s.name.toLowerCase().includes(query) ||
          s.city.toLowerCase().includes(query) ||
          s.grade.toLowerCase().includes(query)
        );
      });
    }

    // status filter
    if (this.state.statusFilter === 'pass') {
      filtered = filtered.filter((s) => s.marks >= 33);
    } else if (this.state.statusFilter === 'fail') {
      filtered = filtered.filter((s) => s.marks < 33);
    }

    // 4. Sorting Logic
    if (this.state.sortMarks === 'highToLow') {
      filtered.sort((a, b) => b.marks - a.marks);
    } else if (this.state.sortMarks === 'lowToHigh') {
      filtered.sort((a, b) => a.marks - b.marks);
    }

    if (filtered.length === 0) {
      this.table.style.display = 'none';
      this.updateStats([]);

      if (this.allData.length === 0) {
        this.showStatus('❌ Database is empty. Please add a student.', 'red');
      } else {
        this.showStatus('🔍 No students match your search/filter.', 'orange');
      }
      return;
    }

    this.table.style.display = 'table';
    this.renderTable(filtered);
    this.updateStats(filtered);
    this.saveAppState();
  },

  // update stats
  updateStats: function (data) {
    const count = data.length;
    const avg =
      count > 0
        ? (data.reduce((sum, s) => sum + s.marks, 0) / count).toFixed(2)
        : 0;

    this.totalCount.innerText = count;
    this.classAvg.innerText = avg;
  },

  // classTopper
  topper: function () {
    if (this.allData.length === 0) {
      this.showStatus('⚠️ No students available!', 'orange');
      return;
    }
    let topperRecord = this.allData.reduce((acc, curr) => {
      return curr.marks > acc.marks ? curr : acc;
    }, this.allData[0]);
    this.renderTable([topperRecord]);
    this.updateStats([topperRecord]);
    this.showStatus(`🏆 Class Topper is ${topperRecord.name}!`, 'gold');
  },

  cityTopper: function (query) {
    if (!query || query.trim() === '') {
      this.showStatus('⚠️ Please enter a city name!', 'orange');
      return;
    }

    const q = query.trim().toLowerCase();

    let cityStudents = this.allData.filter((s) => s.city.toLowerCase() === q);

    if (cityStudents.length > 0) {
      let topperRecord = cityStudents.reduce((acc, curr) => {
        return curr.marks > acc.marks ? curr : acc;
      }, cityStudents[0]);
      this.renderTable([topperRecord]);
      this.updateStats([topperRecord]);

      this.showStatus(
        `🏆 ${topperRecord.city} Topper: ${topperRecord.name} (${topperRecord.marks} Marks)`,
        '#d4af37'
      );
      this.cityTopperInput.value = '';
    } else {
      this.renderTable([]);
      this.showStatus(`❌ No students found in city: "${query}"`, 'red');
    }
  },

  // grace marks
  graceMarks: function () {
    if (this.allData.length === 0) {
      this.showStatus('⚠️ No data to update!', 'orange');
      return;
    }

    // Check: Kya koi student fail hai jise grace ki zarurat hai?
    const hasFailures = this.allData.some((s) => s.marks < 33);

    if (!hasFailures) {
      this.showStatus('✅ All students are already passed!', 'green');
      return;
    }

    if (!confirm('Apply 5 Grace Marks to all failing students?')) return;

    let count = 0;
    this.allData = this.allData.map((item) => {
      if (item.marks < 33) {
        let newMarks = Math.min(item.marks + 5, 100);
        count++;

        return {
          ...item,
          marks: newMarks,
          grade: this.calculateGrade(newMarks),
        };
      }
      return item;
    });
    this.graceBtn.disabled = true;
    this.graceBtn.style.opacity = '0.5';
    this.graceBtn.style.cursor = 'not-allowed';
    localStorage.setItem('studentDB', JSON.stringify(this.allData));
    this.smartSearch();
    this.showStatus(`🎁 Grace marks applied to ${count} student(s)!`, 'blue');
  },

  saveAppState: function () {
    sessionStorage.setItem('appState', JSON.stringify(this.state));
  },
};

app.init();
