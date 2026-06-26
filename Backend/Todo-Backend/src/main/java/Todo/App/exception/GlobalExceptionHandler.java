package Todo.App.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(TodoNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String,String> handleTodoNotFound(
            TodoNotFoundException ex){

        Map<String,String> error = new HashMap<>();

        error.put("message", ex.getMessage());

        return error;
    }
}