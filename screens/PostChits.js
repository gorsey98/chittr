import React, { Component } from 'react';
import { Text, TextInput, View, Button, Alert, StyleSheet } from 'react-native';
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
            image: null
        };
    }

    componentDidMount() {
        this.retrieveToken();
    }

    retrieveToken = async () => {
        try {
            const value = await AsyncStorage.getItem('@logintoken')
            if(value !== null) {
                this.setState ({token: value})
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
            chit_id: this.state.chit_id,
            timestamp: Date.parse(new Date()),
            chit_content: this.state.chit_content,
            location: this.state.location
        });

        console.log(res);

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
        });
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

    componentDidMount() {
        this.imageAdknowledge();
    }

    render(){
        return(
            <View style = {styles.viewStyle}>
                <TextInput
                onChangeText = {(text) => this.setState({chit_content: text})}
                />
                <Button
                title = "Post Chit"
                onPress = {() => {this.postChit()}}
                />
                <Button
                title = "Post Image"
                onPress = {() => {this.postPhoto()}}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    viewStyle: { 
        flex: 1,
        backgroundColor: 'aliceblue'
    }
});

export default PostChits;