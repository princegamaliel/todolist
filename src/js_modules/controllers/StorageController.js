import ProjectListModel from '../models/ProjectListModel';
import StorageModel from '../models/StorageModel';
import TodoListModel from '../models/TodoListModel';
import ProjectListController from './ProjectListController';
import TodoListController from './TodoListController';
export default class StorageController {
  constructor(storage) {
    // singleton
    if (StorageController.instance) {
      return StorageController.instance;
    }
    StorageController.instance = this;

    // models
    const _storageModel = new StorageModel(storage);
    const _projectListModel = new ProjectListModel(_storageModel);
    const _todoListModel = new TodoListModel();

    // controllers
    const _projectListController = new ProjectListController(_storageModel);
    const _todoListController = new TodoListController();

    // add handlers for ProjectListModel
    // save
    _projectListModel.on('save', (prjList, uniqueId) => {
      _storageModel.setProjectList(prjList);
      _storageModel.setPrjUniqueID(uniqueId);
    });
    // changeProject
    _projectListModel.on('changeProject', (curPrj) => {
      if (curPrj) {
        _todoListModel.loadProject(curPrj);
      } else {
        _todoListModel.removeProject();
      }
    });

    // add handlers for TodoListModel
    // save
    _todoListModel.on('saveCurrentProject', (curPrj) => {
      _projectListModel.setCurrentProject(curPrj);
      _projectListModel.updateProject(curPrj);
    });

    this.init = function() {
      _projectListController.init();
    };

    return this;
  }
}
