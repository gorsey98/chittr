import React, { Component } from 'react';
import { Text, TextInput, View, Button, Alert, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

class EditProfile extends Component {
    constructor(props){
        super(props);
        this.state={
            given_name: "",
            family_name: "",
            email: "",
            password: "",
            loggedIn: false,
            token: "",
            userID: ""
        };
    }

    retrieveToken = async () => {
        try {
            const value = await AsyncStorage.getItem('@logintoken')
            if(value !== null) {
                this.setState ({token: value})
                console.log (this.state.token)
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

    componentDidMount() {
        this.retrieveToken();
        this.retrieveID();
    }

    editAccount() {
        let res1 = JSON.stringify({
            given_name: this.state.given_name,
            family_name: this.state.family_name,
            email: this.state.email,
            password: this.state.password
        });

        console.log (res1);

        return fetch ("http://10.0.2.2:3333/api/v0.0.5/user/"+this.state.userID,
        {
            method: 'PATCH',
            body: res1, 
            headers: {
                "Content-Type": "application/json",
                "X-Authorization": this.state.token
            }
        })
        .then((response) => {
            Alert.alert ("Updated Account");
        })
        .catch((error) => {
            console.error (error)
        });
    }

    render(){
        return(
            <View>
                <Text>First Name</Text>
                <TextInput
                onChangeText = {(text)=>this.setState({given_name: text})}
                value = {this.state.given_name}
                />

                <Text>Second Name</Text>
                <TextInput
                onChangeText = {(text) => this.setState({family_name: text})}
                value = {this.state.family_name}
                />

                <Text>Email</Text>
                <TextInput
                onChangeText={(text)=>this.setState({email: text})}
                value={this.state.email}
                textContentType='emailAddress'
                />

                <Text>Password</Text>
                <TextInput
                onChangeText = {(text) => this.setState({password: text})}
                value = {this.state.password}
                secureTextEntry
                />

                <Button
                title = "Save Changes"
                onPress = {()=> {this.editAccount()}}
                />
            </View>
        )
    }
}
export default EditProfile;