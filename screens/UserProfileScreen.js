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

    //Async store user ID to be retrieved in multiple files 
    storeID = async (id) => {
        try {
            console.log("ID:", id)
            await AsyncStorage.setItem('@id', JSON.stringify(id))
        } catch (error) {
            console.log (error);
        }
    }

    //Async store token to be retrieved in multiple files 
    storeLogInToken = async (token) => {
            try {
                console.log("Token:", token);
                await AsyncStorage.setItem('@logintoken', token)
            } catch (e) {
                console.error (e)
            }
        }

    //Retrieve ID async function, stored to variable 'userID'
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

    //Retrieve token async function, stored to variable 'token'
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

    //Delete LogIn token method, runs once Log Out button is pressed 
    async deleteLogInToken(){
        try{
            await AsyncStorage.removeItem('@logintoken');
            console.log("Token Deleted");
        }
        catch (error){
            console.log(error);
        }
    }

    //Log In method, initialises all methods needed to display profile data as well as run the log in parameters through the api 
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

    //Create account function, posts name, email and password through API 
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

    //Get profile data function
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
        this.retrieveToken();
    }

    //Get Profile Photo method 
    getPhoto() {
        return fetch ("http://10.0.2.2:3333/api/v0.0.5/user/"+this.state.userID+"/photo?timestamp=" + Date.now())
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

    //Logout Method, requires stored token as authorisation 
    logout = () =>{
        console.log(this.state.token)
        return fetch("http://10.0.2.2:3333/api/v0.0.5/logout", 
        {
            method: 'POST',
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
        })
        .catch(function(error){
            console.log(error);
        })
    }

    //Navigation to Follower and Edit Profile pages 
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
                    <View style = {styles.viewAvatar}>
                    <Avatar
                    rounded
                    source={{uri: this.state.photo}}
                    onPress = {()=>this.viewUploadPhoto()}
                    />
                    </View>

                    <View style = {styles.viewNameText}>
                    <Text>{this.state.profileData.given_name} {this.state.profileData.family_name}</Text>
                    </View>

                    <View style = {styles.viewFollowButtons}>
                    <Button
                    title = "Followers"
                    onPress = {()=> {this.viewFollowers()}}
                    />
                    <Button
                    title = "Following"
                    onPress = {()=> {this.viewFollowing()}}
                    />
                    </View>
                    
                    <View style = {styles.viewChitTitle}>
                    <Text>Chits</Text>
                    </View>

                    <View style = {styles.viewChitBodyText}>
                    <FlatList
                    data = {this.state.profileData.recent_chits}
                    renderItem = {({item})=> <Text>{item.chit_content}</Text>}
                    keyExtractor = {({id}, index) => id}
                    />
                    </View>

                    <View style = {styles.viewProfileButtons}>
                    <Button
                    title = "Log Out"
                    onPress = {()=> {this.logout()}}
                    />
                    <Button
                    title = "Edit Profile"
                    onPress = {()=> {this.viewEditProile()}}
                    />
                    </View>
                </View>
            )
        }else{
        return(
            <View style = {styles.viewStyle}>
                <View style = {styles.viewTextInput}>
                <TextInput
                onChangeText = {(text) => this.setState({given_name: text})}
                value = {this.state.given_name}
                placeholder = "First Name"
                />

                <TextInput
                onChangeText = {(text) => this.setState({family_name: text})}
                value = {this.state.family_name}
                placeholder = "Second Name"
                />

                <TextInput
                onChangeText={(text)=>this.setState({email: text})}
                value={this.state.email}
                textContentType='emailAddress'
                placeholder = "Email"
                />

                <TextInput
                onChangeText = {(text) => this.setState({password: text})}
                value = {this.state.password}
                secureTextEntry
                placeholder = "Password"
                />
                </View>

                <View style = {styles.viewButtons}>
                <Button
                title = "Log In"
                onPress = {() => {this.logIn()}}                
                />
                <Button
                title = "Create Account"
                onPress = {() => {this.createAccount()}}
                />
                </View>
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
    },
    viewButtons: {
        backgroundColor: 'black',
        margin: 10,
        padding: 2
    },
    viewTextInput: {
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: 'white',
        margin: 10,
        padding: 2
    },
    viewAvatar: {
        alignSelf: 'center',
        paddingTop: 30
    },
    viewNameText: {
        fontSize: 22, 
        fontWeight: 'bold',
        alignSelf: 'center',
        paddingTop: 10,
        paddingBottom: 10
    },
    viewFollowButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignSelf: 'center',
        paddingLeft: 10,
        paddingRight: 10
    },
    viewChitTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        alignSelf: 'center',
        paddingTop: 15,
        paddingBottom: 15
    },
    viewChitBodyText: {
        fontSize: 14,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#DCDCDC'
    },
    viewProfileButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 300
    }
});

export default UserProfileScreen;