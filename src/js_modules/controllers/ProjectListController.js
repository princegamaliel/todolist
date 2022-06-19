import ProjectListModel from '../models/ProjectListModel';
import ProjectListView from '../views/ProjectListView';
import CrtProjectMdView from '../views/CrtProjectMdView';
import Validator from '../Validator';
import Project from '../factories/Project';
import ConfirmMdView from '../views/ConfirmMdView';

export default class ProjectListController {
  constructor(storageModel) {
    // singleton
    if (ProjectListController.instance) {
      return ProjectListController.instance;
    }
    ProjectListController.instance = this;

    const _projectListModel = new ProjectListModel(storageModel);
    const _projectListView = new ProjectListView();
    const _crtProjectMdView = new CrtProjectMdView();
    const _confirmMdView = new ConfirmMdView();
    const _validator = new Validator();

    // private
    let _confirmQueryPrjId = null;

    // add handlers for ProjectListView
    // delete prj
    _projectListView.on('deleteProject', (id) => {
      _confirmQueryPrjId = id;
      _confirmMdView.displayModal();
    });
    // open prj
    _projectListView.on('openProject', (id) => {
      const prj = _projectListModel.getProjectAt(id);
      _projectListModel.setCurrentProject(prj);
      _projectListView.updateCurrentPrj(prj);
    });

    // add handlers for ConfirmMdView
    // no
    _confirmMdView.on('no', () => {
      if (_confirmQueryPrjId) {
        _confirmQueryPrjId = null;
        _confirmMdView.closeModal();
      }
    });
    // yes
    _confirmMdView.on('yes', () => {
      if (_confirmQueryPrjId) {
        _projectListModel.removeProjectAt(_confirmQueryPrjId);
        _confirmQueryPrjId = null;
        _confirmMdView.closeModal();
      }
    });

    // add handlers for CrtProjectMdView
    // open modal
    _crtProjectMdView.on('openModal', () => {
      _crtProjectMdView.displayModal();
    });
    // cancel modal
    _crtProjectMdView.on('cancelModal', () => {
      _crtProjectMdView.clear();
      _crtProjectMdView.closeModal();
    });
    // create project
    _crtProjectMdView.on('createProject', () => {
      const name = _crtProjectMdView.getPrjName();

      if (_validator.isValidName(name)) {
        // create prj
        const id = _projectListModel.getUniqueId();
        const prj = new Project(name, id);
        _projectListModel.addProject(prj);

        _crtProjectMdView.clear();
        _crtProjectMdView.closeModal();
      } else {
        _crtProjectMdView.displayInvalidName();
      }
    });

    // add handlers for ProjectListModel
    // add project
    _projectListModel.on('addProject', (prj) => {
      _projectListView.render(_projectListModel.getProjectList());
      _projectListModel.setCurrentProject(prj);
      _projectListView.updateCurrentPrj(prj);
    });
    // remove project
    _projectListModel.on('removeProject', (removedPrjID) => {
      _projectListView.render(_projectListModel.getProjectList());
      const _currentPrjId = _projectListModel.getCurrentProject().id;
      // set another project
      if (_currentPrjId == removedPrjID) {
        const curPrj = _projectListModel.getFirstProject();
        _projectListModel.setCurrentProject(curPrj);
        _projectListView.updateCurrentPrj(curPrj);
      }
    });

    this.init = function() {
      _projectListView.render(_projectListModel.getProjectList());
      const curPrj = _projectListModel.getFirstProject();
      _projectListModel.setCurrentProject(curPrj);
      _projectListView.updateCurrentPrj(curPrj);
    };

    return this;
  }
}
