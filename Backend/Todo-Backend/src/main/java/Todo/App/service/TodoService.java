package Todo.App.service;

import Todo.App.entity.Todo;
import Todo.App.exception.TodoNotFoundException;
import Todo.App.repository.TodoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TodoService {

    @Autowired
    private TodoRepository todoRepository;

    public List<Todo> getAllTodos() {
        return todoRepository.findAll();
    }

    public Todo saveTodo(Todo todo) {
        return todoRepository.save(todo);
    }

    public Todo getTodoById(Long id){
        return todoRepository.findById(id).orElseThrow(()->new TodoNotFoundException("Todo not found with id "+ id));
    }

    public void deleteTodo(Long id){
        todoRepository.deleteById(id);
    }

    public Todo updateTodo(Long id,Todo updatedTodo){
       Todo existingTodo = todoRepository.findById(id).orElse(null);

       if(existingTodo != null){
           existingTodo.setTitle(updatedTodo.getTitle());
           existingTodo.setCompleted(updatedTodo.isCompleted());

           return todoRepository.save(existingTodo);
       }

       return null;
    }
}