import { EventEmitter } from 'events';

export default class EditTodoMdView extends EventEmitter {
  constructor() {
    // singleton
    if (EditTodoMdView.instance) {
      return EditTodoMdView.instance;
    }
    super();
    EditTodoMdView.instance = this;

    // assign events
    // cancel
    document
      .querySelector('.edit-todo .cancel')
      .addEventListener('click', () => {
        this.emit('cancelModal');
      });
    document
      .querySelector('.edit-todo')
      .parentElement.addEventListener('click', (e) => {
        if (e.target == e.currentTarget) {
          this.emit('cancelModal');
        }
      });
    // update
    document.querySelector('.edit-todo .edit').addEventListener('click', () => {
      this.emit('updateTodo');
    });

    return this;
  }

  fillInputs(todo) {
    document.getElementById('edit-todo-title').value = todo.title;
    document.getElementById('edit-description').value = todo.description;
    document.getElementById('edit-priority').value = todo.priority;
  }

  fillDate(date) {
    document.getElementById('edit-due-date').value = date;
  }

  getTitle() {
    return document.getElementById('edit-todo-title').value;
  }

  getDate() {
    return document.getElementById('edit-due-date').value;
  }

  getDescription() {
    return document.getElementById('edit-description').value;
  }

  getPriority() {
    return document.getElementById('edit-priority').value;
  }

  displayModal() {
    const modalView = document.querySelector('.edit-todo');
    modalView.parentElement.classList.remove('display-none');
  }

  closeModal() {
    const modalView = document.querySelector('.edit-todo');
    modalView.parentElement.classList.add('display-none');
  }

  displayInvalidTitle() {
    const titleLabel = document.getElementById('edit-todo-title-label');
    titleLabel.classList.add('invalid');
    titleLabel.textContent = 'Todo Title length 1-20 characters';
  }

  displayValidTitle() {
    const titleLabel = document.getElementById('edit-todo-title-label');
    titleLabel.classList.remove('invalid');
    titleLabel.textContent = 'Title';
  }

  displayInvalidDate() {
    const titleLabel = document.getElementById('edit-due-date-label');
    titleLabel.classList.add('invalid');
    titleLabel.textContent = 'Select a date';
  }

  displayValidDate() {
    const titleLabel = document.getElementById('edit-due-date-label');
    titleLabel.classList.remove('invalid');
    titleLabel.textContent = 'Due Date';
  }
}
