import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const DrawerNavigation = () => {
    return (
        <View style={{ flex: 1, backgroundColor: 'red', position: 'absolute', zIndex: 1000, height: height, width: width * 0.8 }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: "black" }}>Home</Text>
            </View>
            <TouchableOpacity
                style={{ padding: 16, backgroundColor: 'lightgray' }}
                onPress={() => {
                    // Implement navigation logic here
                }}
            >
                <Text style={{ color: "black" }}>Drawer Item 1</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={{ padding: 16, backgroundColor: 'lightgray' }}
                onPress={() => {
                    // Implement navigation logic here
                }}
            >
                <Text style={{ color: "black" }}>Drawer Item 2</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={{ padding: 16, backgroundColor: 'lightgray' }}
                onPress={() => {
                    // Implement navigation logic here
                }}
            >
                <Text style={{ color: "black" }}>Drawer Item 3</Text>
            </TouchableOpacity>
        </View>
    );
};

export default DrawerNavigation;
