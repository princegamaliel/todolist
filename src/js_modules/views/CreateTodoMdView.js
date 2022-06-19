import { EventEmitter } from 'events';

export default class CreateTodoMdView extends EventEmitter {
  constructor() {
    // singleton
    if (CreateTodoMdView.instance) {
      return CreateTodoMdView.instance;
    }
    super();
    CreateTodoMdView.instance = this;

    // assign events
    // cancel
    document
      .querySelector('.new-todo .cancel')
      .addEventListener('click', () => {
        this.emit('cancelModal');
      });
    document
      .querySelector('.new-todo')
      .parentElement.addEventListener('click', (e) => {
        if (e.target == e.currentTarget) {
          this.emit('cancelModal');
        }
      });
    // open
    document.getElementById('new-todo-btn').addEventListener('click', () => {
      this.emit('openModal');
    });
    // create
    document
      .querySelector('.new-todo .create')
      .addEventListener('click', () => {
        this.emit('createTodo');
      });

    return this;
  }

  getTitle() {
    return document.getElementById('new-todo-title').value;
  }

  getDate() {
    return document.getElementById('new-due-date').value;
  }

  getDescription() {
    return document.getElementById('new-description').value;
  }

  getPriority() {
    return document.getElementById('new-priority').value;
  }

  clear() {
    document.getElementById('new-todo-title').value = '';
    document.getElementById('new-due-date').value = '';
    document.getElementById('new-description').value = '';
    document.getElementById('new-priority').value = 'high';
  }

  displayModal() {
    const modalView = document.querySelector('.new-todo');
    modalView.parentElement.classList.remove('display-none');
  }

  closeModal() {
    const modalView = document.querySelector('.new-todo');
    modalView.parentElement.classList.add('display-none');
  }

  displayInvalidTitle() {
    const titleLabel = document.getElementById('new-todo-title-label');
    titleLabel.classList.add('invalid');
    titleLabel.textContent = 'Todo Title length 1-20 characters';
  }

  displayValidTitle() {
    const titleLabel = document.getElementById('new-todo-title-label');
    titleLabel.classList.remove('invalid');
    titleLabel.textContent = 'Title';
  }

  displayInvalidDate() {
    const titleLabel = document.getElementById('new-due-date-label');
    titleLabel.classList.add('invalid');
    titleLabel.textContent = 'Select a date';
  }

  displayValidDate() {
    const titleLabel = document.getElementById('new-due-date-label');
    titleLabel.classList.remove('invalid');
    titleLabel.textContent = 'Due Date';
  }
}
