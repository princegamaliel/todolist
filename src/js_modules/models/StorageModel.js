import { EventEmitter } from 'events';

export default class StorageModel extends EventEmitter {
  constructor(storage) {
    // singleton
    if (StorageModel.instance) {
      return StorageModel.instance;
    }
    super();
    StorageModel.instance = this;

    // private data
    const _storage = storage;
    const _PROJECT_LIST = 'projectList';
    const _PRJ_UNIQUE_ID = 'prjUniqueID';
    const _TODO_UNIQUE_ID = 'todoUniqueID';

    const _DEFAULT = {
      _PROJECT_LIST: [
        {
          name: 'Default',
          id: 0,
          todoList: [
            {
              id: 0,
              title: 'Demo Todo',
              date: 'Apr 1st 1970',
              description: 'Hello There this is a demo todo item',
              priority: 'medium',
              completed: false
            }
          ],
          [_TODO_UNIQUE_ID]: 0
        }
      ],
      _PRJ_UNIQUE_ID: 0
    };

    const _storageIsEmpty = () => {
      const prjList = JSON.parse(_storage.getItem(_PROJECT_LIST));
      if (!prjList || !prjList[0]) {
        return true;
      }
      return false;
    };
    const _evalStorage = () => {
      if (_storageIsEmpty()) {
        _setDefault();
      }
    };
    const _setDefault = () => {
      this.setProjectList(_DEFAULT._PROJECT_LIST);
      this.setPrjUniqueID(_DEFAULT._PRJ_UNIQUE_ID);
    };

    this.getProjectList = function() {
      return JSON.parse(_storage.getItem(_PROJECT_LIST));
    };

    this.getPrjUniqueID = function() {
      return JSON.parse(_storage.getItem(_PRJ_UNIQUE_ID));
    };

    this.setProjectList = function(prjList) {
      _storage.setItem(_PROJECT_LIST, JSON.stringify(prjList));
    };

    this.setPrjUniqueID = function(id) {
      _storage.setItem(_PRJ_UNIQUE_ID, JSON.stringify(id));
    };

    // init
    _evalStorage();

    return this;
  }
}
