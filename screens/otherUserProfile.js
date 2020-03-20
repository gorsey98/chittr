import React, { Component } from 'react';
import { Text, TextInput, View, Button, Alert, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Avatar } from 'react-native-elements';

class OtherUserProfile extends Component {
    constructor(props){
        super(props);
        this.state={
            userID: "",
            token: "",
            profileData: "", 
            isFollowing: false,
            photo: null
        };
    }
    
    //Retrieve user ID using AsyncStorage
    retrieveID = async (done) => {
        try {
            const value = await AsyncStorage.getItem('@profileid')
            if(value !== null) {
                this.setState ({userID: value},()=>{
                    done();
                })
                console.log (this.state.userID)
            }
        } catch (e) {
            console.error (e)
        }
    }

    //Retrieve Token using AsyncStorage
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

    //Retrieve Profile Data method and store that data in profileData variable 
    getProfileData() {
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
        this.retrieveID(()=>{
            this.retrieveToken();
            this.getProfileData();
        });
    }

    //Follow method, requires authorisation token to work, also uses the ID retrieved 
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

    //Method to retrieve user profile photo, retrieves photo and stores it in variable photo 
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

    render(){
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

                    <View style = {styles.viewFollowButton}>
                    <Button
                    title = {this.state.isFollowing == false ? "Follow":"Unfollow"}
                    onPress = {()=>this.followPoint()}
                    />
                    </View>

                    <View style = {styles.viewChitTitleText}>
                    <Text>Chits</Text>
                    </View>

                    <View style = {styles.viewChitBodyText}>
                    <FlatList
                    data = {this.state.profileData.recent_chits}
                    renderItem = {({item})=> <Text>{item.chit_content}</Text>}
                    keyExtractor = {({id}, index) => id}
                    />
                    </View>
                </View>
            )
    }
}

const styles = StyleSheet.create({
    viewStyle: {
        justifyContent: 'center', 
        flex: 1,
        backgroundColor: 'aliceblue'
    },
    viewAvatar: {
        alignSelf: 'center'
    },
    viewNameText: {
        fontSize: 22, 
        fontWeight: 'bold',
        alignSelf: 'center'
    },
    viewFollowButton: {
        paddingTop: 15,
        paddingLeft: 150,
        paddingRight: 150
    },
    viewChitTitleText: {
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
    }
});

export default OtherUserProfile;