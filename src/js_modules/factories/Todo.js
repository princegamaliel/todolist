export default class Todo {
  constructor(id, title, date, description, priority, completed) {
    this.id = id;
    this.title = title;
    this.date = date;
    this.description = description;
    this.priority = priority;
    this.completed = completed;
  }
}
