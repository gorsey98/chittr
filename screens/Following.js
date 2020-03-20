import React, { Component } from 'react';
import { Text, TextInput, View, Button, Alert, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { ListItem } from 'react-native-elements';


class Following extends Component {
    constructor(props){
        super(props);
        this.state={
            followingList: [],
            isLoading: true
        };
    }

    async getFollowing(done){
        let id = JSON.parse(await AsyncStorage.getItem('id'));
        console.log ("check" + id)
        try {
            const response = await fetch("http://10.0.2.2:3333/api/v0.0.5/user/" + id + "/following");
            const responseJson = await response.json();
            this.setState({
                followingList: responseJson,
                isLoading: false
            },()=>{
                done();
            });
        }
        catch (error) {
            console.log(error);
        }
    }

    componentDidMount(){
        this.getFollowing(()=>{
            console.log (this.state.followingListssss);
        });
    }

    render() {
        console.log (this.state.isLoading)
        if (this.state.isLoading) {
            return(
            <View>
            <ActivityIndicator />
            </View>
            );
        } else {
        return(
            <View>
                <FlatList
                data = {this.state.followingList}
                renderItem={({item})=> (
                    <ListItem
                    title={item.given_name}
                    />
                )}
                keyExtractor = {({id}, index) => id}
            />
            </View>
        );
        }
    }
}

export default Following;