import { Meteor } from 'meteor/meteor';
import { ToDos } from '../../api/todo';
import { Accounts } from 'meteor/accounts-base';

Meteor.startup(() => {

  let userId = '';
  if(Meteor.users.find().count() === 0) {
    userId = Accounts.createUser({
      email: 'hello@test.test',
      password: '123456'
    })
  }

  if ( ToDos.find().count() === 0 ) {
    ToDos.insert({
      title: 'Learn React',
      complete: false,
      owner: userId
    });
  }
});
