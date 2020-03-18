import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import SearchUserScreen from './SearchUserScreen.js'
import OtherUserProfile from './otherUserProfile.js'

  const Stack = createStackNavigator();
  
  function App() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="SearchUserScreen" screenOptions = {{headerShown: false}}>
          <Stack.Screen name="SearchUserScreen" component={SearchUserScreen}/>
          <Stack.Screen name="OtherUserProfile" component={OtherUserProfile}/>
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  export default App;