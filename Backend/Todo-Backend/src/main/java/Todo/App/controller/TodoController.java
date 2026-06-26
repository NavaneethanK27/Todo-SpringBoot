package Todo.App.controller;

import Todo.App.entity.Todo;
import Todo.App.service.TodoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/todos")
public class TodoController {

    @Autowired
    private TodoService todoService;

    @GetMapping
    public List<Todo> getAllTodos() {
        return todoService.getAllTodos();
    }

    @PostMapping
    public Todo createTodo(@RequestBody Todo todo) {
        return todoService.saveTodo(todo);
    }

    @GetMapping("/{id}")
    public Todo getTodoById(@PathVariable Long id){
        return todoService.getTodoById(id);
    }

    @DeleteMapping("/{id}")
    public String deleteTodo(@PathVariable Long id){
        todoService.deleteTodo(id);
        return "Todo Deleted Successfully";
    }

    @PutMapping("/{id}")
    public Todo updateTodo(@PathVariable Long id,@RequestBody Todo todo){
        return todoService.updateTodo(id,todo);
    }

}