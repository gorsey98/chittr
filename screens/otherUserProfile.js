import React, { Component } from 'react';
import { Text, TextInput, View, Button, Alert, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

class OtherUserProfile extends Component {
    constructor(props){
        super(props);
        this.state={
            userID: "",
            token: "",
            profileData: "", 
            isFollowing: false
        };
    }
    
    retrieveID = async () => {
        try {
            const value = await AsyncStorage.getItem('@profileid')
            if(value !== null) {
                this.setState ({userID: value})
                console.log (this.state.userID)
            }
        } catch (e) {
            console.error (e)
        }
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

    getProfileData(userID) {
        return fetch ("http://10.0.2.2:3333/api/v0.0.5/user/"+this.state.userID,
        {
            method: 'GET'
        })
        .then((response) => response.json())
        .then((responseJson) => {
            this.setState({
                profileData: responseJson
            });
        })
        .catch ((error) => {
            console.log (error);
        });
    }

    componentDidMount() {
        this.retrieveID();
        this.retrieveToken();
        this.getProfileData();
    }

    followPoint(){
        let id = this.state.userID
        let token = this.state.token

        if (this.state.isFollowing == false){
            return fetch ("http://10.0.2.2:3333/api/v0.0.5/user/"+id+"/follow",
            {
                method: 'POST',
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                    "X-Authorization": token
                }
            })
            .then((response)=>{
                if(response.status == "200"){
                    this.setState({
                        isFollowing: true
                    });
                }
            })
            .catch((error)=>{
                console.log(error);
            })
        } else {
            return fetch ("http://10.0.2.2:3333/api/v0.0.5/user/"+id+"/follow", 
            {
                method: 'DELETE',
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                    "X-Authorization": token
                }
            })
            .then((response)=>{
                if(response.status == "200"){
                    this.setState({
                        isFollowing: false
                    });
                }
            })
            .catch((error)=>{
                console.log(error);
            });
        }
    }

    render(){
            return(
                <View style = {styles.viewStyle}>
                    <Text>{this.state.profileData.given_name} {this.state.profileData.family_name}</Text>
                    <Text>Chits</Text>
                    <FlatList
                    data = {this.state.profileData.recent_chits}
                    renderItem = {({item})=> <Text>{item.chit_content}</Text>}
                    keyExtractor = {({id}, index) => id}
                    />
                    <Button
                    title = {this.state.isFollowing == false ? "Follow":"Unfollow"}
                    onPress = {()=>this.followPoint()}
                    />
                </View>
            )
    }
}

const styles = StyleSheet.create({
    viewStyle: {
        justifyContent: 'center', 
        flex: 1,
        backgroundColor: 'aliceblue'
    }
});

export default OtherUserProfile;