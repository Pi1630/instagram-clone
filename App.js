import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation'
import { f, auth, storage, database } from './config/config.js'

import feed from './app/screens/feed'
import upload from './app/screens/upload'
import profile from './app/screens/profile'
import userProfile from './app/screens/userProfile'
import comments from './app/screens/comments'

const TabStack = createBottomTabNavigator(
  {
    Feed: {screen: feed},
    Upload: {screen: upload},
    Profile: {screen: profile}
  }
)

const MainStack = createStackNavigator(
  {
    Home: {screen: TabStack},
    User: {screen: userProfile},
    Comments: {screen: comments}
  },
  {
    initialRouteName: 'Home',
    mode: 'modal',
    headerMode: 'none'
  }
)


export default class App extends React.Component {

  login = async() => {
    //Force User to log in
    try{
      let user = await auth.signInWithEmailAndPassword('test@user.com','password')
    }catch(error){
      console.log(error)
    }
  }

  constructor(props){
    super(props)
    this.login();
  }

  render() {
    return (
      <MainStack />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
