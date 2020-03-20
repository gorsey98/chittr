import React, { Component } from 'react';
import { FlatList, ActivityIndicator, Text, View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

class GetChits extends Component {
    constructor (props) {
        super (props);
        this.state = {
            isLoading: true, 
            chitList: []
        }
    }

    render() {

        if (this.state.isLoading) { 
            return(
                <View style = {styles.viewStyle}>
                    <ActivityIndicator/>
                </View>
            )
        }

        return (
            <View style = {styles.viewStyle}>
                <FlatList
                data = {this.state.chitList}
                renderItem = {({item})=> (
                <View style = {styles.viewFlatList}>
                    <Text style = {styles.viewNameText}>{item.user.given_name}</Text>
                    <Text style = {styles.viewChitText}>{item.chit_content}</Text>
                    </View>
                )}
                keyExtractor = {({id}, index) => id}
                />
            </View>
        );
    }

    getData() {
        return fetch("http://10.0.2.2:3333/api/v0.0.5/chits")
        .then ((response) => response.json())
        .then ((responseJson) => {

            this.setState ({
                isLoading: false,
                chitList: responseJson,
            });

        })
        .catch ((error)=> {
            console.log (error);
        });
    }

    componentDidMount() {
        this.getData();
    }

    async getPhoto(){
        let response = fetch ("http://10.0.2.2:3333/api/v0.0.5/chits/"+chit_id+"/photo")
        if (response.status == "200")
        {
            return response.blob();
        } else {
            return null;
        }
    }
}

const styles = StyleSheet.create({
    viewStyle: {
        justifyContent: 'center', 
        flex: 1,
        backgroundColor: 'aliceblue'
    },
    viewFlatList: {
        flexDirection: "column",
        justifyContent: "center",
        width: "100%"
    },
    viewNameText: {
        fontSize: 18,
        padding: 20,
        fontWeight: "bold",
        backgroundColor: "#DCDCDC"
    },
    viewChitText: {
        fontSize: 14,
        padding: 10,
        backgroundColor: "#F0F8FF"
    }
});

export default GetChits;