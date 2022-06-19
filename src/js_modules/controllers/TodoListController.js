import TodoListModel from '../models/TodoListModel';
import TodoListView from '../views/TodoListView';
import InfoTodoMdView from '../views/InfoTodoMdView';
import ConfirmMdView from '../views/ConfirmMdView';
import EditTodoMdView from '../views/EditTodoMdView';
import Validator from '../Validator';
import CreateTodoMdView from '../views/CreateTodoMdView';
import Todo from '../factories/Todo';
import { format, parse } from 'date-fns';
import TodoSorter from '../TodoSorter';

export default class TodoListController {
  constructor() {
    // singleton
    if (TodoListController.instance) {
      return TodoListController.instance;
    }
    TodoListController.instance = this;

    const _todoListModel = new TodoListModel();
    const _todoListView = new TodoListView();
    const _infoTodoMdView = new InfoTodoMdView();
    const _confirmMdView = new ConfirmMdView();
    const _editTodoMdView = new EditTodoMdView();
    const _createTodoMdView = new CreateTodoMdView();
    const _validator = new Validator();

    // private
    let _confirmQueryTodoId = null;
    let _editQueryTodoId = null;
    const DATE_FORMAT = 'MMM do y';
    const DATE_DEFAULT_FORMAT = 'yyyy-MM-dd';

    // add handlers for EditTodoMdView
    // cancel
    _createTodoMdView.on('cancelModal', () => {
      _createTodoMdView.clear();
      _createTodoMdView.closeModal();
    });
    // open modal
    _createTodoMdView.on('openModal', () => {
      if (_todoListModel.hasProject()) {
        _createTodoMdView.displayModal();
      }
    });
    // create todo
    _createTodoMdView.on('createTodo', () => {
      const title = _createTodoMdView.getTitle();
      const date = _createTodoMdView.getDate();
      const description = _createTodoMdView.getDescription();
      const priority = _createTodoMdView.getPriority();

      if (_validator.isValidName(title)) {
        _createTodoMdView.displayValidTitle();
        if (_validator.isValidDate(date)) {
          _createTodoMdView.displayValidDate();

          const id = _todoListModel.getUniqueId();
          const newTodo = new Todo(
            id,
            title,
            format(parse(date, DATE_DEFAULT_FORMAT, new Date()), DATE_FORMAT),
            description,
            priority,
            false
          );
          _todoListModel.addTodo(newTodo);

          // sort by Date (desc)
          TodoSorter.sortByDate(
            _todoListModel.getCurrentProject(),
            DATE_FORMAT
          );
          _todoListModel.saveAndRender();
          _createTodoMdView.clear();
          _createTodoMdView.closeModal();
        } else {
          _createTodoMdView.displayInvalidDate();
        }
      } else {
        _createTodoMdView.displayInvalidTitle();
      }
    });

    // add handlers for EditTodoMdView
    // cancel
    _editTodoMdView.on('cancelModal', () => {
      _editQueryTodoId = null;
      _editTodoMdView.closeModal();
    });
    // update
    _editTodoMdView.on('updateTodo', () => {
      const newTitle = _editTodoMdView.getTitle();
      const newDate = _editTodoMdView.getDate();
      const newDescription = _editTodoMdView.getDescription();
      const newPriority = _editTodoMdView.getPriority();

      if (_validator.isValidName(newTitle)) {
        _editTodoMdView.displayValidTitle();
        if (_validator.isValidDate(newDate)) {
          _editTodoMdView.displayValidDate();

          const todo = _todoListModel.getTodoAt(_editQueryTodoId);
          todo.title = newTitle;
          todo.date = format(
            parse(newDate, DATE_DEFAULT_FORMAT, new Date()),
            DATE_FORMAT
          );
          todo.description = newDescription;
          todo.priority = newPriority;

          // sort by Date (desc)
          TodoSorter.sortByDate(
            _todoListModel.getCurrentProject(),
            DATE_FORMAT
          );

          _todoListModel.updateTodo(todo);
          _editQueryTodoId = null;
          _editTodoMdView.closeModal();
        } else {
          _editTodoMdView.displayInvalidDate();
        }
      } else {
        _editTodoMdView.displayInvalidTitle();
      }
    });

    // add handlers for ConfirmMdView
    // no
    _confirmMdView.on('no', () => {
      if (_confirmQueryTodoId) {
        _confirmQueryTodoId = null;
        _confirmMdView.closeModal();
      }
    });
    // yes
    _confirmMdView.on('yes', () => {
      if (_confirmQueryTodoId) {
        _todoListModel.removeTodoAt(_confirmQueryTodoId);
        _confirmQueryTodoId = null;
        _confirmMdView.closeModal();
      }
    });

    // add handlers for TodoListModel
    // load
    _todoListModel.on('loadProject', (prj) => {
      _todoListView.render(prj);
    });
    // remove
    _todoListModel.on('removeProject', () => {
      _todoListView.displayNoProject();
    });

    // add handlers for TodoListView
    // show full info
    _todoListView.on('showFullInfo', (id) => {
      const todo = _todoListModel.getTodoAt(id);
      _infoTodoMdView.displayModal();
      _infoTodoMdView.showFullInfo(todo);
    });
    // complete
    _todoListView.on('completeTodo', (id) => {
      const todo = _todoListModel.getTodoAt(id);
      if (todo.complete) {
        todo.complete = false;
      } else {
        todo.complete = true;
      }
      _todoListModel.updateTodo(todo);
    });
    // edit
    _todoListView.on('editTodo', (id) => {
      const todo = _todoListModel.getTodoAt(id);
      _editTodoMdView.displayModal();
      const formatedDate = format(
        parse(todo.date, DATE_FORMAT, new Date()),
        DATE_DEFAULT_FORMAT
      );
      _editTodoMdView.fillInputs(todo);
      _editTodoMdView.fillDate(formatedDate);
      _editQueryTodoId = id;
    });
    // delete
    _todoListView.on('deleteTodo', (id) => {
      _confirmQueryTodoId = id;
      _confirmMdView.displayModal();
    });

    // add handlers for InfoTodoMdView
    // cancel
    _infoTodoMdView.on('cancelModal', () => {
      _infoTodoMdView.closeModal();
    });

    return this;
  }
}
