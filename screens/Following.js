import React, { Component } from 'react';
import { Text, TextInput, View, Button, Alert, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { ListItem } from 'react-native-elements';

class Following extends Component {
    constructor(props){
        super(props);
        this.state={
            followingList: []
        };
    }

    async getFollowing(){
        let id = JSON.parse(await AsyncStorage.getItem('id'));
        try {
            const response = await fetch("http://10.0.2.2:3333/api/v0.0.5/user/" + id + "/following");
            const responseJson = await response.json();
            this.setState({
                followingList: responseJson
            });
        }
        catch (error) {
            console.log(error);
        }
    }

    componentDidMount(){
        this.getFollowing();
    }

    render() {
        return(
            <View>
                <FlatList
                data = {this.state.followingList}
                remderItem={({item})=> (
                    <ListItem
                    title={item.given_name}
                    />
                )}
            />
            </View>
        );
    }
}

export default Following;