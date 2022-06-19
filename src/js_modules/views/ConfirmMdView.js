import { EventEmitter } from 'events';

export default class ConfirmMdView extends EventEmitter {
  constructor() {
    // singleton
    if (ConfirmMdView.instance) {
      return ConfirmMdView.instance;
    }
    super();
    ConfirmMdView.instance = this;

    // assign events
    // no
    document
      .querySelector('.confirmation .no-btn')
      .addEventListener('click', () => {
        this.emit('no');
      });
    document
      .querySelector('.confirmation')
      .parentElement.addEventListener('click', (e) => {
        if (e.target == e.currentTarget) {
          this.emit('no');
        }
      });

    // yes
    document
      .querySelector('.confirmation .yes-btn')
      .addEventListener('click', () => {
        this.emit('yes');
      });

    return this;
  }

  displayModal() {
    const modalView = document.querySelector('.confirmation');
    modalView.parentElement.classList.remove('display-none');
  }

  closeModal() {
    const modalView = document.querySelector('.confirmation');
    modalView.parentElement.classList.add('display-none');
  }
}
