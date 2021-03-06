import React from 'react';
import { useEffect, useState } from 'react';
import './App.css';
import { Form } from './components/Form';
import Task from './components/Task';

const App = React.memo(() => {
  const [state, setState] = useState({ tasks: [] });
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  useEffect( () => {
    const allTasks = localStorage.getItem('toDoList');
    if(allTasks) setState({ tasks: JSON.parse(allTasks)});
  }, []);

  useEffect( () => {
    localStorage.setItem('toDoList', JSON.stringify(state.tasks) );
  }, [state.tasks])

  const handleChange = event => {
    setValue(event.target.value);
  }

  const onSubmit = event => {
    event.preventDefault();
    const newTask = {}
    newTask.id = `task${new Date().getTime()}`;
    newTask.text = value;
    newTask.checked = false;
    newTask.error = error;
    if(value){
      setState({ tasks: [...state.tasks, newTask]});
      setValue('');
    }
  }

  const isCheckMarked = () => state.tasks.some(item => item.checked);
  
  const onChangeInput = id => {
    const copyTasks = [...state.tasks];
    copyTasks.forEach( task => {
      if(task.id === id) task.checked = !task.checked; 
    })
    setState({ tasks: copyTasks});
  }
  
  const removeTask = (id, checked) => {
    if(!checked){
      const copyTasks = [...state.tasks];
      const findTask = copyTasks.find( task => task.id === id);
      const idx = copyTasks.indexOf(findTask);
      copyTasks.splice(idx, 1);
      setState({ tasks: copyTasks});
      setError('');
    }else {
      setError('Нельзя удалить');
    }
  }

  return (
    <div className="wrapper">
      <div className="main">
        <h1>toDoList</h1>    
        <Form onSubmit={onSubmit} 
              value={value} 
              handleChange={handleChange} 
              isDisabled={!value}  
            />
        <div className={`error ${(error && isCheckMarked()) && ' show'}`}>{error}</div>
        <ul className="items">
          {
            state.tasks.map( task => <Task key={task.id} 
                                            id={task.id} 
                                            text={task.text} 
                                            checked={task.checked}
                                            onChangeInput={onChangeInput}
                                            removeTask={removeTask}
                                            error={task.error}
                                            /> )
          }            
        </ul>
      </div>
    </div>
  )
});

export default App;
