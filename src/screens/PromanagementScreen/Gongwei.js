import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, Modal, Text, StyleSheet, TouchableOpacity, FlatList, Alert, Dimensions, TextInput } from 'react-native';
import Header from '../../components/Header';
import ApiObject from '../../support/Api';
import Icon from 'react-native-vector-icons/AntDesign';
import Button from '../../components/Button';
import CStyles from '../../styles/CommonStyles';
import { de } from 'date-fns/locale';
import { PROGRAM_NAME } from '../../constants';

const Gongwei = (props) => {

    const { projectItem } = useSelector((state) => state.base);
    const [data, setData] = useState([]);
    const [isEditVisible, setisEditVisible] = useState(false)
    const [isDeleteVisible, setisDeleteVisible] = useState(false)
    const [isAddVisible, setisAddVisible] = useState(false)
    const [selectedUpdate, setSelectedUpdate] = useState([]);
    const [addstart, setAddstart] = useState('')
    const [deletestart, setDeletestart] = useState('')
    const [addend, setAddend] = useState('')
    const [deleteEnd, setDeleteEnd] = useState('')
    const [editvalue, setEditvalue] = useState('')
    const [addvalue, setAddvalue] = useState('')

    useEffect(() => {
        fetchData();
    }, []);


    const handleCalculate = (val) => {
        const value = parseFloat(val);
        if (isNaN(value)) {
            Alert.alert(
                PROGRAM_NAME,
                '请输入有效的数值.',
                [{ text: '是(ok)', onPress: () => { } }],
                { cancelable: false },
            );
        }
    };

    const fetchData = async () => {
        const result = await ApiObject.getGongweiList({
            id: projectItem.id,
        })
        setData(result)
    };

    const BackBtnPress = async () => {
        props.navigation.push('PromanageMain')
    };

    const handleUpdate = async () => {
        if (editvalue == "") {
            Alert.alert(
                PROGRAM_NAME,
                '请输入一区号码.',
                [{ text: '是(ok)', onPress: () => { } }],
                { cancelable: false },
            );
        }
        else {
            await ApiObject.updateGongwei({
                id: projectItem.id,
                pianqu: editvalue,
                start_gongwei: selectedUpdate.startgongwei,
                end_gongwei: selectedUpdate.endgongwei
            })
            fetchData();
            setisEditVisible(false)
        }
    }

    const handleAdd = async () => {
        if (addstart == "" || addend == "") {
            Alert.alert(
                PROGRAM_NAME,
                '请输入工作.',
                [{ text: '是(ok)', onPress: () => { } }],
                { cancelable: false },
            );
        }
        else {
            await ApiObject.addGongwei({
                id: projectItem.id,
                pianqu: addvalue,
                start_gongwei: addstart,
                end_gongwei: addend
            })
            fetchData();
            setisAddVisible(false)
        }
    }

    const handleDelete = async () => {
        if (deletestart == "" || deleteEnd == "") {
            Alert.alert(
                PROGRAM_NAME,
                '请输入工作.',
                [{ text: '是(ok)', onPress: () => { } }],
                { cancelable: false },
            );
        }
        else {
            await ApiObject.deleteGongwei({
                id: projectItem.id,
                start_gongwei: deletestart,
                end_gongwei: deleteEnd
            })
            fetchData();
            setisDeleteVisible(false)
        }
    }

    const renderItem = ({ item }) => {
        return (
            <View style={{ ...styles.maincontent, flexDirection: 'row', backgroundColor: '#F2F2F2', borderBottomColor: "#BCBCBC", borderBottomWidth: 1 }}>
                <Text style={{ width: '30%', fontSize: 14, color: '#000000' }}>{item.pianqu}</Text>
                <Text style={{ width: '35%', fontSize: 14, color: '#000000' }}>{item.startgongwei}~{item.endgongwei}</Text>
                <Text style={{ width: '25%', fontSize: 14, color: '#000000' }}>{parseInt(item.endgongwei) - parseInt(item.startgongwei) + 1}</Text>
                <TouchableOpacity onPress={() => { setisEditVisible(true), setSelectedUpdate(item), setEditvalue(item.pianqu) }} style={{ width: '15%' }}>
                    <Icon name="edit" size={30} style={{ alignSelf: 'flex-end', }} />
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={styles.allcontent}>
            <Header {...props} BtnPress={BackBtnPress} title={'项目管理'} />
            <Text style={{ alignSelf: 'center', marginBottom: 2 }}>{projectItem.id}</Text>
            <View style={{ width: '100%', alignItems: 'center', marginBottom: 10 }}>
                <Text style={{ fontSize: 16, color: 'black', fontWeight: "bold" }}>工位设定</Text>
            </View>
            <View style={{ paddingHorizontal: 30 }}>
                <View style={styles.maincontent}>
                    <Text style={{ width: '30%', fontSize: 14, color: '#000000' }}>片区号码</Text>
                    <Text style={{ width: '35%', fontSize: 14, color: '#000000' }}>工位号码</Text>
                    <Text style={{ width: '25%', fontSize: 14, color: '#000000' }}>工位数</Text>
                    <Text style={{ width: '15%', fontSize: 14, color: '#000000' }}>改变</Text>
                </View>
                <View>
                    {
                        data.length == 0 ?
                            <View>
                                <Text style={{ fontsi: 12, color: 'black', marginTop: 30, alignSelf: 'center' }}>没有数据</Text>
                            </View> :
                            <FlatList
                                data={data}
                                renderItem={renderItem}
                                onEndReachedThreshold={0.5}
                            />
                    }
                </View>
            </View>
            <View style={styles.buttonWraper}>
                <Button
                    ButtonTitle={'追加'}
                    BtnPress={() => setisAddVisible(true)}
                    type={'yellowBtn'}
                    BTnWidth={120}
                />
                <Button
                    ButtonTitle={'删除'}
                    BtnPress={() => setisDeleteVisible(true)}
                    type={'blueBtn'}
                    BTnWidth={120}
                />
            </View>
            <Modal
                visible={isEditVisible}
                animationType="slide"
                transparent={true}
            >
                <View style={styles.modalContainer}>
                    <View style={{ ...styles.modalContent, height: 250 }}>
                        <View style={styles.modalheader}>
                            <Text style={{ fontSize: 18, color: '#000000', fontWeight: "bold" }}>提示</Text>
                            <TouchableOpacity onPress={() => setisEditVisible(false)}>
                                <Icon name="close" size={20} style={{ marginRight: 10, color: 'black' }} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ ...styles.modalMain, height: '20%' }}>
                            <Text style={{ fontSize: 14, color: '#000000' }}>片区号码</Text>
                        </View>
                        <View style={{ height: 35, marginBottom: 30 }}>
                            <TextInput
                                value={editvalue}
                                autoFocus={true}
                                placeholder={''}
                                selectTextOnFocus={true}
                                style={{
                                    ...CStyles.InputStyle,
                                    backgroundColor: '#F2F2F2',
                                    color: '#000000',
                                }}
                                onChangeText={(val) => setEditvalue(val)}
                                multiline={false}
                            />
                        </View>
                        <Button
                            ButtonTitle={'改变'}
                            BtnPress={() => handleUpdate()}
                            type={'yellowBtn'}
                            BTnWidth={'100%'}
                        />
                    </View>
                </View>
            </Modal>
            <Modal
                visible={isAddVisible}
                animationType="slide"
                transparent={true}
            >
                <View style={styles.modalContainer}>
                    <View style={{ ...styles.modalContent, height: 350 }}>
                        <View style={{ ...styles.modalheader, height: '15%', marginBottom: '15%' }}>
                            <Text style={{ alignSelf: 'center', fontSize: 18, color: '#000000', fontWeight: "bold" }}>提示</Text>
                            <TouchableOpacity onPress={() => setisAddVisible(false)}>
                                <Icon name="close" size={20} style={{ marginRight: 10, color: 'black' }} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.modalMain}>
                            <Text style={{ fontSize: 14, color: '#000000' }}>片区号码</Text>
                        </View>
                        <View style={{ height: 35, marginBottom: 10, width: '50%' }}>
                            <TextInput
                                value={addvalue}
                                autoFocus={true}
                                placeholder={''}
                                selectTextOnFocus={true}
                                style={{
                                    ...CStyles.InputStyle,
                                    backgroundColor: '#F2F2F2',
                                    color: '#000000',
                                }}
                                multiline={false}
                                onChangeText={(val) => setAddvalue(val)}
                            />
                        </View>
                        <View style={{ flexDirection: 'row', height: '30%' }}>
                            <View style={{ width: '50%' }}>
                                <View style={{ ...styles.modalMain, height: '25%' }}>
                                    <Text style={{ fontSize: 14, color: '#000000' }}>工位:从</Text>
                                </View>
                                <View style={{ height: 35, marginBottom: 10, width: '100%' }}>
                                    <TextInput
                                        value={addstart}
                                        autoFocus={true}
                                        placeholder={''}
                                        selectTextOnFocus={true}
                                        style={{
                                            ...CStyles.InputStyle,
                                            backgroundColor: '#F2F2F2',
                                            color: '#000000',
                                        }}
                                        multiline={false}
                                        keyboardType="numeric"
                                        onChangeText={(val) => { setAddstart(val), handleCalculate(val) }}
                                    />
                                </View>
                            </View>
                            <View style={{ width: '50%' }}>
                                <View style={{ ...styles.modalMain, height: '25%' }}>
                                    <Text style={{ fontSize: 14, color: '#000000' }}>工位:至</Text>
                                </View>
                                <View style={{ height: 35, marginBottom: 10, width: '100%' }}>
                                    <TextInput
                                        value={addend}
                                        autoFocus={true}
                                        placeholder={''}
                                        selectTextOnFocus={true}
                                        style={{
                                            ...CStyles.InputStyle,
                                            backgroundColor: '#F2F2F2',
                                            color: '#000000',
                                        }}
                                        onChangeText={(val) => { setAddend(val), handleCalculate(val) }}
                                        multiline={false}
                                    />
                                </View>
                            </View>
                        </View>
                        <Button
                            ButtonTitle={'追加'}
                            BtnPress={() => handleAdd()}
                            type={'yellowBtn'}
                            BTnWidth={'100%'}
                        />
                    </View>
                </View>
            </Modal>
            <Modal
                visible={isDeleteVisible}
                animationType="slide"
                transparent={true}
            >
                <View style={styles.modalContainer}>
                    <View style={{ ...styles.modalContent, height: 350 }}>
                        <View style={{ ...styles.modalheader, height: '15%', marginBottom: '15%' }}>
                            <Text style={{ alignSelf: 'center', fontSize: 18, color: '#000000', fontWeight: "bold" }}>提示</Text>
                            <TouchableOpacity onPress={() => setisDeleteVisible(false)}>
                                <Icon name="close" size={20} style={{ marginRight: 10 }} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', height: '33%' }}>
                            <View style={{ width: '50%' }}>
                                <View style={{ ...styles.modalMain, height: '25%' }}>
                                    <Text style={{ fontSize: 14, color: '#000000' }}>工位:从</Text>
                                </View>
                                <View style={{ height: 35, width: '100%' }}>
                                    <TextInput
                                        value={deletestart}
                                        autoFocus={true}
                                        placeholder={''}
                                        selectTextOnFocus={true}
                                        style={{
                                            ...CStyles.InputStyle,
                                            backgroundColor: '#F2F2F2',
                                            color: '#000000',
                                        }}
                                        onChangeText={(val) => { setDeletestart(val), handleCalculate(val) }}
                                        multiline={false}
                                    />
                                </View>
                            </View>
                            <View style={{ width: '50%' }}>
                                <View style={{ ...styles.modalMain, height: '25%' }}>
                                    <Text style={{ fontSize: 14, color: '#000000' }}>工位:至</Text>
                                </View>
                                <View style={{ height: 35, marginBottom: 10, width: '100%' }}>
                                    <TextInput
                                        value={deleteEnd}
                                        autoFocus={true}
                                        placeholder={''}
                                        selectTextOnFocus={true}
                                        style={{
                                            ...CStyles.InputStyle,
                                            backgroundColor: '#F2F2F2',
                                            color: '#000000',
                                        }}
                                        onChangeText={(val) => { setDeleteEnd(val), handleCalculate(val) }}
                                        multiline={false}
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={{ height: '30%' }}>

                        </View>
                        <Button
                            ButtonTitle={'删除'}
                            BtnPress={() => handleDelete()}
                            type={'yellowBtn'}
                            BTnWidth={'100%'}
                        />
                    </View>
                </View>
            </Modal>
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
        borderTopEndRadius: 5
    },
    buttonWraper: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: '5%',
        justifyContent: 'space-around',
        width: '90%',
        alignSelf: 'center'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '90%',
        height: '30%',
    },
    closeButton: {
        marginTop: 10,
        alignSelf: 'flex-end',
    },
    closeButtonText: {
        color: 'blue',
    },
    modalheader: {
        height: '20%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
    },
    modalMain: {
        height: '10%',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    modalBottom: {
        height: '20%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    }
});

export default Gongwei;