import { Meteor } from 'meteor/meteor';
import React from 'react';
import ReactDOM from 'react-dom';
import { render } from 'react-dom';
import App from '../imports/ui/containers/App';
import './main.css';

import { createStore} from 'redux';

const addTodo = payload => ({ type: 'ADD_TODO', payload });

const removeTodo = payload => ({ type: 'REMOVE_TODO', payload });

const initialState = {
  todos: [],
  lastId: 0
};
const reducer = (state = initialState, action) => {
  switch(action.type) {
    case 'ADD_TODO':
      const todo = {
        id: state.lastId,
        text: action.payload,
        completed: false
      }
      return { ... state, todos: [...state.todos, todo], lastId: state.lastId + 1 };

    case 'REMOVE_TODO':
      const todos = state.todos.filter(todo => action.payload !== todo.id);
      return { ... state, todos };
    default:
      return state;
  }
}

const store = createStore(reducer, initialState);

console.log('initial:', store.getState());

store.dispatch(addTodo('make next feature'));

console.log('after added:', store.getState());

store.dispatch(removeTodo(0));

console.log('after removed:', store.getState());

Meteor.startup(() => {
  Meteor.autorun(() => {
      render(
      <App />,
      document.getElementById('root')
    )
    })
})

