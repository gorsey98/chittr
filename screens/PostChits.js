import React, { Component } from 'react';
import { Text, TextInput, View, Button, Alert, StyleSheet, PermissionsAndroid, CheckBox } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from 'react-native-geolocation-service';

class PostChits extends Component{
    constructor(props){
        super(props);
        this.state={
            timestamp: 0,
            chit_content: "",
            token: "",
            userID: "",
            image: null,
            longitude: null, 
            latitude: null, 
            locationPermission: false,
            geotag: false
        };
    }

    requestLocationPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Chittr Location Permission',
                    message:
                    'This app requires to access your location',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'Allow'
                },
            )

            if (granted == PermissionsAndroid.RESULTS.GRANTED) {
                console.log ('You can access location');
                return true;
            } else {
                console.log ('Location permission denied');
                return false;
            }
        } catch (error) {
            console.warn (error)
        }
    }

    findCoordinates = (done) => {
        if(!this.state.locationPermission) {
            this.state.locationPermission = this.requestLocationPermission()
        }

        Geolocation.getCurrentPosition(
            (position) => {
                const longitude = JSON.stringify (position.coords.longitude)
                const latitude = JSON.stringify (position.coords.latitude)
                this.setState ({
                    longitude: longitude,
                    latitude: latitude
                },()=>{
                    done();
                })
            },
            (error) => {
                Alert.alert (error.message)
            },
            {
                enableHighAccuracy: true,
                timeout: 20000,
                maximumAge: 1000
            }
        )
    }

    componentDidMount() {
        this.retrieveToken(()=>{
            this.findCoordinates(()=>{
                console.log(this.state.longitude)
            });
        });
    }

    retrieveToken = async (done) => {
        try {
            const value = await AsyncStorage.getItem('@logintoken')
            if(value !== null) {
                this.setState ({token: value},()=>{
                    done();
                })
            }
        } catch (e) {
            console.error (e)
        }
    }

    retrieveID = async () => {
        try {
            const value = await AsyncStorage.getItem('@id')
            if(value !== null) {
                this.setState ({userID: value})
                console.log (this.state.userID)
            }
        } catch (e) {
            console.error (e)
        }
    }

    postChit(){
        let res = JSON.stringify({
            timestamp: Date.parse(new Date()),
            chit_content: this.state.chit_content,
            location: {
                longitude: parseFloat(this.state.longitude),
                latitude: parseFloat(this.state.latitude)
            }
        });

        let res1 = JSON.stringify({
            timestamp: Date.parse(new Date()),
            chit_content: this.state.chit_content,
        });

        console.log(res);

        if (this.state.geotag == true) {
            return fetch ("http://10.0.2.2:3333/api/v0.0.5/chits",
            {
                method: 'POST',
                body: res,
                headers: {
                    "Content-Type": "application/json",
                    "X-Authorization": this.state.token
                }
            })
            .then((responseJson) => {
                Alert.alert ("Posted Chit!")
            })
            .catch ((error) => {
                console.error(error)
            })
        } else {
            return fetch ("http://10.0.2.2:3333/api/v0.0.5/chits",
            {
                method: 'POST',
                body: res1,
                headers: {
                    "Content-Type": "application/json",
                    "X-Authorization": this.state.token 
                }
            })
            .then ((repsonseJson) => {
                Alert.alert ("Posted Chit!")
            })
            .catch ((error) => {
                console.error (error)
            })
        }
    }

    postPhoto(){
        return fetch ("http://10.0.2.2:3333/api/v0.0.5/chits/", 
        {
            method: 'POST',
            headers: {
                "Content-Type": "image/jpeg",
                "X-Authorization": this.state.token
            },
            body: this.state.image
        })
        .then((response)=>{
            console.log("Posted Image");
            this.setState({
                image: null
            })
        })
        .catch((error)=>{
            console.log(error)
        });
    }

    imageRecieved = (image)=>{
        this.setState({image})
    }

    imageAdknowledge =()=>{
        this.props.navigation.navigate('Camera', {imageRecieved: this.imageRecieved});
    }

    render(){
        return(
            <View style = {styles.viewStyle}>
                <View style = {styles.viewTextInput}>
                <TextInput
                onChangeText = {(text) => this.setState({chit_content: text})}
                placeholder = "Enter your chit here..."
                />
                </View>
                <View style = {styles.viewButtons}>
                <Button
                title = "Post Chit"
                onPress = {() => {this.postChit()}}
                />
                <Button
                title = "Post Image"
                onPress = {() => {this.postPhoto()}}
                />
                </View>
                <Text> Add Geo Location</Text>
                <CheckBox
                value = {this.state.geotag}
                onValueChange={() => this.setState( {geotag: !this.state.geotag})}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    viewStyle: { 
        flex: 1,
        backgroundColor: 'aliceblue'
    },
    viewTextInput: {
        backgroundColor: '#F0F8FF'
    },
    viewButtons: {
        backgroundColor: 'black',
        margin: 10,
        padding: 2
    }
});

export default PostChits;