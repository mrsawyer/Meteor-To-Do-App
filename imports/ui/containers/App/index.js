import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import { ToDos } from '../../../api/todo';
import AccountsWrapper from '../../components/AccountsWrapper';

// import ClearButton from '../../components/ClearButton';
// import ToDoCount from '../../components/ToDoCount';
// import ToDoInput from '../../components/ToDoInput';
// import ToDoItem from '../../components/ToDoItem';

import './styles.css';

const ToDo = ({item, toggleComplete, removeToDo}) => {
  return <li >{item.title}
    <input
      type="checkbox"
      id={item._id}
      checked={item.complete}
      onChange={toggleComplete}
      />
    <label htmlFor={item._id}></label>
    <button
    onClick={removeToDo}>
      <i className="fa fa-trash"></i>
    </button>
  </li>;
}

const ClearButton = ({removeCompleted}) => {
  return <button onClick={removeCompleted}>Clear Completed Items</button>;
}

const ToDoCount = ({number}) => {
  return <p>{number} { number > 1 || number < 1 ? 'Items' : 'Item' } still to do</p>
}

class App extends Component {

  constructor() {
    super();
    this.state = {
      inputValue: ''
    }
    this.removeCompleted = this.removeCompleted.bind(this);
    this.addToDo = this.addToDo.bind(this);
  }

  toggleComplete(todo) {
    Meteor.call('todos.toggleComplete', todo)
  }

  removeToDo(todo) {
    Meteor.call('todos.removeToDo', todo)
  }

  removeCompleted() {
    const todoIds = this.props.todos.filter((todo) => todo.complete).map(todo => todo._id);
    Meteor.call('todos.removeCompleted', todoIds)
  }

  hasCompleted() {
    let newTodos = this.props.todos.filter((todo) => todo.complete);
    return newTodos.length > 0 ? true : false;
  }

  onInputChange(event) {
    this.setState({inputValue: event.target.value});
  }

  addToDo(event) {
    event.preventDefault();
    if(this.state.inputValue){
      Meteor.call('todos.addToDo', this.state.inputValue)
      this.setState({inputValue: ''});
    }
  }

  render() {
    return (
      <div className="app-wrapper">
        <div className="login-wrapper">
          <AccountsWrapper />
        </div>
        <div className="todo-list">
          <h1>So Many Things To Do</h1>
          { this.props.currentUser ? (
            <div>
              <div className="add-todo">
                <form name="addTodo" onSubmit={this.addToDo}>
                  <input type='text' value={this.state.inputValue} onChange={(e) => this.onInputChange(e)} />
                  <span>(press enter to add)</span>
                </form>
              </div>
              <ul className="App">
                {this.props.todos.filter(todo => todo.owner === this.props.currentUserId).map((todo, i) => (
                  <ToDo
                  item={todo}
                  key={i}
                  toggleComplete={() => this.toggleComplete(todo)}
                  removeToDo={() => this.removeToDo(todo)} />
                  ))}
              </ul>
              <div className='todo-admin'>
                <ToDoCount number={this.props.todos.length} />
                {this.hasCompleted() &&
                  <ClearButton removeCompleted={() => this.removeCompleted()} />
                }
              </div>
            </div>
          ) : (
            <div className="logged-out-message">
              <p>Please sign in to see your todos.</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}
ClearButton.propTypes = {
  removeCompleted: PropTypes.func.isRequired
};

ToDo.propTypes = {
  item: PropTypes.shape({
          _id: PropTypes.string,
          title: PropTypes.string,
          complete: PropTypes.bool
        }).isRequired,
  toggleComplete: PropTypes.func,
  removeToDo: PropTypes.func
};

ToDoCount.propTypes = {
  number: PropTypes.number.isRequired
};

App.defaultProps = {
  todos: []
};

App.propTypes = {
  todos: PropTypes.array.isRequired,
  currentUser: PropTypes.object.isRequired,
  currentUserId: PropTypes.string.isRequired,
};

export default createContainer(() => {

  Meteor.subscribe('todos');

  return {
    currentUser: Meteor.user(),
    currentUserId: Meteor.userId(),
    todos: ToDos.find({}).fetch()
  };
}, App);
