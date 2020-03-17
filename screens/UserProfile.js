import React, { Component } from 'react';
import { Text, TextInput, View, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

class UserProfile extends Component{
    constructor(props){
        super(props);
        this.state={
            given_name: "",
            family_name: "",
            email: "",
            password: "",
            loggedIn: false
        };
    }

    storeLogInToken = async (token) => {
            try {
                console.log("Token:", token);
                await AsyncStorage.setItem('@logintoken', token)
            } catch (e) {
                console.error (e)
            }
        }

    logIn(){
        let res = JSON.stringify({
            email: this.state.email,
            password: this.state.password
        });

        console.log(res);

        return fetch("http://10.0.2.2:3333/api/v0.0.5/login", //Change back to localhost when finished
        {
            method: 'POST',
            body: res,
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then((response)=>{
            let res = response.json();
            return res;
        })
        .then((responseJson)=>{
            console.log(responseJson.token);
            Alert.alert("Logged in");
            this.storeLogInToken(responseJson.token);
            this.setState ({
                loggedIn: true
            })
        })
        .catch((error)=>{
            console.error(error)
        });
    }

    createAccount() {
        let res1 = JSON.stringify({
            given_name: this.state.given_name,
            family_name: this.state.family_name,
            email: this.state.email,
            password: this.state.password
        });

        console.log (res1);

        return fetch ("http://10.0.2.2:3333/api/v0.0.5/user",
        {
            method: 'POST',
            body: res1, 
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then((response) => {
            Alert.alert ("Account Created");
        })
        .catch((error) => {
            console.error (error)
        });
    }

    render(){
        if (this.state.loggedIn){
            return(
                <View>
                    <Text>Profile</Text>
                </View>
            )
        }
        return(
            <View style = {{flexDirection: 'column'}}>
                <Text>First Name</Text>
                <TextInput
                onChangeText = {(text) => this.setState({given_name: text})}
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
                title = "Log In"
                onPress = {() => {this.logIn()}}
                />
                <Button
                title = "Create Account"
                onPress = {() => {this.createAccount()}}
                />
            </View>
        )
    }
}

export default UserProfile;