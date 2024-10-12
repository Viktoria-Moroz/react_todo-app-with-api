import { useState } from 'react';
import { addTodos, USER_ID } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { useFocusInput } from '../../hooks/useFocusInput';
import cn from 'classnames';

type Props = {
  todos: Todo[];
  setErrorMessage: (arg: string) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setTempTodo: (todo: Todo | null) => void;
  isLoading: boolean;
  setIsLoading: (arg: boolean) => void;
  toggleAllButton: () => void;
  completedTodos: boolean;
};

export const TodoHeader: React.FC<Props> = ({
  todos,
  setErrorMessage,
  setTodos,
  setTempTodo,
  setIsLoading,
  isLoading,
  toggleAllButton,
  completedTodos,
}) => {
  const focusOnInput = useFocusInput();

  const [title, setTitle] = useState('');

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setIsLoading(true);

    const newTempTodo = {
      id: 0,
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(newTempTodo);

    try {
      const newTodo = await addTodos({
        title: trimmedTitle,
        completed: false,
        userId: USER_ID,
      });

      setTodos(currentTodo => [...currentTodo, newTodo]);
      setTempTodo(null);
      setTitle('');
    } catch (error) {
      setErrorMessage('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setIsLoading(false);
    }
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: completedTodos,
          })}
          data-cy="ToggleAllButton"
          onClick={toggleAllButton}
        />
      )}

      <form onSubmit={handleFormSubmit}>
        <input
          value={title}
          onChange={event => setTitle(event.target.value)}
          ref={focusOnInput}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
