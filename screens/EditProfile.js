import React, {Component} from 'react';
import {
  Text,
  TextInput,
  View,
  Button,
  Alert,
  FlatList,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      given_name: '',
      family_name: '',
      email: '',
      password: '',
      loggedIn: false,
      token: '',
      userID: '',
    };
  }

  //Retrieve token async function
  retrieveToken = async () => {
    try {
      const value = await AsyncStorage.getItem('@logintoken');
      if (value !== null) {
        this.setState({token: value});
        console.log(this.state.token);
      }
    } catch (e) {
      console.error(e);
    }
  };

  //Retrieve ID async function
  retrieveID = async () => {
    try {
      const value = await AsyncStorage.getItem('@id');
      if (value !== null) {
        this.setState({userID: value});
        console.log(this.state.userID);
      }
    } catch (e) {
      console.error(e);
    }
  };

  componentDidMount() {
    this.retrieveToken();
    this.retrieveID();
  }

  //Edit account PATCH function
  editAccount() {
    let res1 = JSON.stringify({
      given_name: this.state.given_name,
      family_name: this.state.family_name,
      email: this.state.email,
      password: this.state.password,
    });

    console.log(res1);

    return fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + this.state.userID, {
      method: 'PATCH',
      body: res1,
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': this.state.token,
      },
    })
      .then(response => {
        Alert.alert('Updated Account');
      })
      .catch(error => {
        console.error(error);
      });
  }

  render() {
    return (
      <View style={styles.viewStyle}>
        <View style={styles.viewTextInput}>
          <TextInput
            onChangeText={text => this.setState({given_name: text})}
            value={this.state.given_name}
            placeholder="First Name"
          />

          <TextInput
            onChangeText={text => this.setState({family_name: text})}
            value={this.state.family_name}
            placeholder="Second Name"
          />

          <TextInput
            onChangeText={text => this.setState({email: text})}
            value={this.state.email}
            textContentType="emailAddress"
            placeholder="Email"
          />

          <TextInput
            onChangeText={text => this.setState({password: text})}
            value={this.state.password}
            secureTextEntry
            placeholder="Password"
          />
        </View>

        <View style={styles.viewButtons}>
          <Button
            title="Save Changes"
            onPress={() => {
              this.editAccount();
            }}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewStyle: {
    justifyContent: 'center',
    flex: 1,
    backgroundColor: 'aliceblue',
  },
  viewButtons: {
    backgroundColor: 'black',
    margin: 10,
    padding: 2,
  },
  viewTextInput: {
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: 'white',
    margin: 10,
    padding: 2,
  },
});

export default EditProfile;
