import React, { Component } from 'react';
import { Text, TextInput, View, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

class PostChits extends Component{
    constructor(props){
        super(props);
        this.state={
            timestamp: 0,
            chit_content: "",
            token: ""
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

    postChit(){
        let res = JSON.stringify({
            chit_id: this.state.chit_id,
            timestamp: this.state.timestamp,
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

    render(){
        return(
            <View style = {{flexDirection: 'column'}}>
                <TextInput
                onChangeText = {(text) => this.setState({chit_content: text})}
                />
                <Button
                title = "Post Chit"
                onPress = {() => {this.postChit()}}
                />
            </View>
        )
    }
}

export default PostChits;