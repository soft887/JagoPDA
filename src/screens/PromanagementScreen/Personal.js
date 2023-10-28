import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, Modal, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Dimensions, TextInput } from 'react-native';
import Header from '../../components/Header';
import ApiObject from '../../support/Api';

const Personal = (props) => {

    const { projectItem } = useSelector((state) => state.base);
    const [data, setData] = useState([]);


    useEffect(() => {
        fetchData();
    }, []);


    const fetchData = async () => {
        const result = await ApiObject.projectmemberList({
            id: projectItem.id,
        })
        setData(result.members)
    };

    const BackBtnPress = async () => {
        props.navigation.push('PromanageMain')
    };



    const renderItem = ({ item }) => {
        return (
            <View style={{ ...styles.maincontent, flexDirection: 'row', backgroundColor: '#F2F2F2', borderBottomColor: "#BCBCBC", borderBottomWidth: 1 }}>
                <Text style={styles.textcontent}>{item.name}</Text>
                <Text style={styles.textcontent}>{item?.rolelist?.id}</Text>
                <Text style={styles.textcontent}>{item.step}</Text>
                <Text style={styles.textcontent}>{item.position}</Text>
            </View>
        );
    };

    return (
        <View style={styles.allcontent}>
            <Header {...props} BtnPress={BackBtnPress} title={'项目管理'} />
            <Text style={{ alignSelf: 'center', marginBottom: 2 }}>{projectItem.id}</Text>
            <View style={{ width: '100%', alignItems: 'center', marginBottom: 10 }}>
                <Text style={{ fontSize: 16, color: 'black', fontWeight: "bold" }}>人员状态</Text>
            </View>
            <View style={{ paddingHorizontal: 30 }}>
                <View style={styles.maincontent}>
                    <Text style={styles.textheader}>名字</Text>
                    <Text style={styles.textheader}>权限</Text>
                    <Text style={styles.textheader}>STEP</Text>
                    <Text style={styles.textheader}>位置</Text>
                </View>
                <View>
                    {
                        data.length == 0 ?
                            <View>
                                <Text style={{ fontsi: 12, color: 'black', alignSelf: 'center', marginTop: 30 }}>没有数据</Text>
                            </View>
                            :
                            <FlatList
                                data={data}
                                renderItem={renderItem}
                                onEndReachedThreshold={0.5}
                            />
                    }
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    allcontent: {
        position: 'relative',
        height: Dimensions.get('window').height,
        backgroundColor: '#F2F2F2',
    },
    maincontent: {
        flexDirection: 'row',
        height: 50,
        backgroundColor: "#BCBCBC",
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        borderTopStartRadius: 5,
        borderTopEndRadius: 5,
    },
    buttonWraper: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: '5%',
        justifyContent: 'space-around',
        width: '90%',
        alignSelf: 'center'
    },
    textheader: {
        fontSize: 14,
        color: "black",
        width: "25%",
        fontWeight: "bold"
    },
    textcontent: {
        fontSize: 12,
        color: "black",
        width: "25%"
    }
});

export default Personal;