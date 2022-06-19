import { compareDesc, parse } from 'date-fns';

export default class TodoSorter {
  static sortByDate(prj, pattern) {
    prj.todoList.sort((a, b) => {
      return compareDesc(
        parse(a.date, pattern, new Date()),
        parse(b.date, pattern, new Date())
      );
    });
  }
}
