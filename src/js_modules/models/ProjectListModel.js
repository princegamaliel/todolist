import { EventEmitter } from 'events';

export default class ProjectListModel extends EventEmitter {
  constructor(storage) {
    // singleton
    if (ProjectListModel.instance) {
      return ProjectListModel.instance;
    }
    super();
    ProjectListModel.instance = this;

    // private data
    const _projectList = storage.getProjectList();
    let uniqueId = storage.getPrjUniqueID();

    let _currentProject = null;

    this.getProjectList = function() {
      return _projectList;
    };
    this.getProjectAt = function(id) {
      return _projectList.find((prj) => prj.id == id);
    };
    this.getFirstProject = function() {
      return _projectList[0];
    };
    this.addProject = function(prj) {
      _projectList.unshift(prj);
      this.emit('save', _projectList, uniqueId);
      this.emit('addProject', prj);
    };
    this.removeProjectAt = function(id) {
      const index = _projectList.findIndex((prj) => prj.id == id);
      _projectList.splice(index, 1);
      this.emit('save', _projectList, uniqueId);
      this.emit('removeProject', id);
    };

    this.getUniqueId = function() {
      return ++uniqueId;
    };

    this.getCurrentProject = function() {
      return _currentProject;
    };

    this.setCurrentProject = function(prj) {
      _currentProject = prj;
      this.emit('changeProject', prj);
    };

    this.updateProject = function(prj) {
      const index = _projectList.findIndex((p) => p.id == prj.id);
      _projectList.splice(index, 1, prj);
      this.emit('save', _projectList, uniqueId);
    };

    return this;
  }
}
