import React, { Component } from 'react';
import { Text, TextInput, View, Button, Alert } from 'react-native';

class SearchUsers extends Component{
    constructor(props){
        super(props);
        this.state={
            user_id: 0,
            given_name: "",
            family_name: "",
            email: "",
            //q: ""
        };
    }

    search(){
        


    render() {
        return(
            <View style = {{flexDirection: 'column'}}>
                <TextInput
                onChangeText = {(text) => this.setState ({q: text})}
                value = {this.state.q}
                />
                <Button
                title = "Search"
                onPress = {() => {this.search()}}
                />
                <FlatList
                data = {this.state.user_id + this.state.given_name + this.state.family_name + this.state.email}
                renderItem = {({item})=> <Text>{item.searchResults}</Text>}
                keyExtractor = {({id}, index) => id}
                />
            </View>
        )
    }
}

export default SearchUsers;