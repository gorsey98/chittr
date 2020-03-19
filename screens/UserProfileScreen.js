import React, { Component } from 'react';
import { Text, TextInput, View, Button, Alert, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Avatar } from 'react-native-elements';

class UserProfileScreen extends Component{
    constructor(props){
        super(props);
        this.state={
            given_name: "",
            family_name: "",
            email: "",
            password: "",
            loggedIn: false,
            userID: "",
            profileData: [],
            photo: null,
            token: ""
        };
    }

    storeID = async (id) => {
        try {
            console.log("ID:", id)
            await AsyncStorage.setItem('@id', JSON.stringify(id))
        } catch (error) {
            console.log (error);
        }
    }

    storeLogInToken = async (token) => {
            try {
                console.log("Token:", token);
                await AsyncStorage.setItem('@logintoken', token)
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

    async deleteLogInToken(){
        try{
            await AsyncStorage.removeItem('@logintoken');
            console.log("Token Deleted");
        }
        catch (error){
            console.log(error);
        }
    }

    logIn(){
        let res = JSON.stringify({
            email: this.state.email,
            password: this.state.password
        });

        console.log(res);

        return fetch("http://10.0.2.2:3333/api/v0.0.5/login",
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
            this.getProfileData(()=> {
                this.getPhoto();
                this.storeID(responseJson.id);
                this.storeLogInToken(responseJson.token);
                this.setState ({
                    loggedIn: true
            })
            console.log (this.state.loggedIn)
            });
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

    getProfileData(done) {
        return fetch ("http://10.0.2.2:3333/api/v0.0.5/user/"+this.state.userID,
        {
            method: 'GET'
        })
        .then((response) => response.json())
        .then((responseJson) => {
            this.setState({
                profileData: responseJson
            }, ()=> {done();});
        })
        .catch ((error) => {
            console.log (error);
        });
    }

    componentDidMount() {
        this.retrieveID();
    }

    getPhoto() {
        return fetch ("http://10.0.2.2:3333/api/v0.0.5/user/"+this.state.userID+"/photo")
        .then(response => response.blob())
        .then((image) => {
            var reader = new FileReader();
            reader.onload =()=>{
                this.setState({
                    photo: reader.result
                });
            }
            reader.readAsDataURL(image);
        })
        .catch((error)=>{
            console.log(error);
        });
    }

    logout = () =>{
        return fetch("http://10.0.2.2:3333/api/v0.0.5/logout", 
        {
            method: 'POST',
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': this.state.token
            }
        })
        .then((response)=>{
            this.deleteLogInToken();
            this.setState({
                loggedIn: false
            })
            .catch(function(error){
                console.log(error);
            })
        })
    }

    viewFollowers = id => {
        this.props.navigation.navigate('Followers');
    }

    viewFollowing = id => {
        this.props.navigation.navigate('Following');
    }

    viewUploadPhoto() {
        this.props.navigation.navigate ('UploadPhoto');
    }

    viewEditProile() {
        this.props.navigation.navigate ('EditProfile');
    }

    render(){
        if (this.state.loggedIn){
            return(
                <View style = {styles.viewStyle}>
                    <Avatar
                    rounded
                    source={{uri: this.state.photo}}
                    onPress = {()=>this.viewUploadPhoto()}
                    />
                    <Text>{this.state.profileData.given_name} {this.state.profileData.family_name}</Text>
                    <Text>Chits</Text>
                    <FlatList
                    data = {this.state.profileData.recent_chits}
                    renderItem = {({item})=> <Text>{item.chit_content}</Text>}
                    keyExtractor = {({id}, index) => id}
                    />
                    <Button
                    title = "Followers"
                    onPress = {()=> {this.viewFollowers()}}
                    />
                    <Button
                    title = "Following"
                    onPress = {()=> {this.viewFollowing()}}
                    />
                    <Button
                    title = "Log Out"
                    onPress = {()=> {this.logout()}}
                    />
                    <Button
                    title = "Edit Profile"
                    onPress = {()=> {this.viewEditProile()}}
                    />
                </View>
            )
        }else{
        return(
            <View style = {styles.viewStyle}>
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
}

const styles = StyleSheet.create({
    viewStyle: {
        justifyContent: 'center', 
        flex: 1,
        backgroundColor: 'aliceblue'
    }
});

export default UserProfileScreen;