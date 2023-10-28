import React from 'react'
import { View, FlatList, Text, StyleSheet, TouchableOpacity, Alert, Dimensions, TextInput } from 'react-native';

const DashboardScreen = (props) => {
  return (
    <View style={{ position: 'relative', height: Dimensions.get('screen').height }}>
      <Text style={{ color: "black" }}>Dashboard:</Text>
    </View>
  );
}

export default DashboardScreen;