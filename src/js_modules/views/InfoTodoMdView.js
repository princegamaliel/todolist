import { EventEmitter } from 'events';

export default class InfoTodoMdView extends EventEmitter {
  constructor() {
    //singleton
    if (InfoTodoMdView.instance) {
      return InfoTodoMdView.instance;
    }
    super();
    InfoTodoMdView.instance = this;

    // assign events
    // close
    document
      .querySelector('.info-todo .cancel')
      .addEventListener('click', () => {
        this.emit('cancelModal');
      });
    document
      .querySelector('.info-todo')
      .parentElement.addEventListener('click', (e) => {
        if (e.target == e.currentTarget) {
          this.emit('cancelModal');
        }
      });
    return this;
  }

  showFullInfo(todo) {
    document.getElementById('info-todo-title').textContent = todo.title;
    document.getElementById('info-due-date').textContent = todo.date;
    document.getElementById('info-description').textContent = todo.description;
    document.getElementById('info-priority').textContent = todo.priority;
  }

  displayModal() {
    const modalView = document.querySelector('.info-todo');
    modalView.parentElement.classList.remove('display-none');
  }

  closeModal() {
    const modalView = document.querySelector('.info-todo');
    modalView.parentElement.classList.add('display-none');
  }
}
