export default class Project {
  constructor(name, id, todoList = [], todoUniqueID = 0) {
    this.name = name;
    this.id = id;
    this.todoList = todoList;
    this.todoUniqueID = todoUniqueID;
  }
}
