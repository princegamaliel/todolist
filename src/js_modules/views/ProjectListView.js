import { EventEmitter } from 'events';

export default class ProjectListView extends EventEmitter {
  constructor() {
    // singleton
    if (ProjectListView.instance) {
      return ProjectListView.instance;
    }
    super();
    ProjectListView.instance = this;

    return this;
  }

  render(prjList) {
    const listView = document.querySelector('.project-list');
    // remove all data
    listView.textContent = '';
    prjList.forEach((prj) => {
      const nodeElement = _createNodeElement(prj);
      _assignEvents.call(this, nodeElement);
      listView.appendChild(nodeElement);
    });

    function _assignEvents(element) {
      element.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete')) {
          this.emit('deleteProject', e.currentTarget.dataset.id);
        }
        if (e.target.classList.contains('open')) {
          this.emit('openProject', e.currentTarget.dataset.id);
        }
      });
    }

    function _createNodeElement(element) {
      const elementView = document.createElement('div');
      elementView.innerHTML = `
      <div class="project-element" data-id="${element.id}">
      <div class="project-name"><h2>${element.name}</h2></div>
      <div class="project-options">
        <button class="button delete" tabindex="-1">X</button>
        <button class="button open" tabindex="-1">Open</button>
      </div>
    </div>
      `;
      return elementView.firstElementChild;
    }
  }

  updateCurrentPrj(prj) {
    const curPrjView = document.querySelector('.current-project');
    if (prj) {
      curPrjView.textContent = prj.name;
    } else {
      curPrjView.textContent = '_NO_PROJECT_';
    }
  }
}
