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
import {RNCamera} from 'react-native-camera';
import {TouchableOpacity} from 'react-native-gesture-handler';

class UploadPhoto extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photo: null,
      token: '',
    };
  }

  componentDidMount() {
    this.retrieveToken();
  }

  //Async token retrieval function
  retrieveToken = async () => {
    try {
      const value = await AsyncStorage.getItem('@logintoken');
      if (value !== null) {
        this.setState({token: value});
      }
    } catch (e) {
      console.error(e);
    }
  };

  //Function which takes a photo then updates the users profile photo, takes auth token
  newProfilePhoto = async () => {
    if (this.camera) {
      const options = {quality: 0.5, base64: true};
      const data = await this.camera.takePictureAsync(options);
      console.log(data.uri);

      return fetch('http://10.0.2.2:3333/api/v0.0.5/user/photo', {
        method: 'POST',
        body: data,
        headers: {
          'Content-Type': 'image/jpeg',
          'X-Authorization': this.state.token,
        },
      })
        .then(response => {
          Alert.alert('Updated Profile Photo');
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.preview}
        />
        <View style={{flex: 0, flexDirection: 'row', justifyContent: 'center'}}>
          <TouchableOpacity
            onPress={this.newProfilePhoto.bind(this)}
            style={styles.capture}>
            <Text style={{fontSize: 16}}>CAPTURE</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {flex: 1, flexDirection: 'column'},
  preview: {flex: 1, justifyContent: 'flex-end', alignItems: 'center'},
  capture: {
    flex: 0,
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});

export default UploadPhoto;
