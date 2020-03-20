import * as React from 'react';
import {View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import UserProfileScreen from './UserProfileScreen.js';
import Followers from './Followers.js';
import Following from './Following.js';
import UploadPhoto from './UploadPhoto.js';
import EditProfile from './EditProfile.js';

const Stack = createStackNavigator();

//Navigation code for the User Profile screens

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="UserProfileScreen"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="UserProfileScreen" component={UserProfileScreen} />
        <Stack.Screen name="Followers" component={Followers} />
        <Stack.Screen name="Following" component={Following} />
        <Stack.Screen name="UploadPhoto" component={UploadPhoto} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
