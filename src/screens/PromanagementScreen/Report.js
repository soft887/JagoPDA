import React, { useState, useRef, useEffect } from 'react';
import { View, Modal, Text, StyleSheet, TouchableOpacity, Alert, PermissionsAndroid, Dimensions, TextInput } from 'react-native';
import Header from '../../components/Header';

import Icon from 'react-native-vector-icons/MaterialIcons';
import Button from '../../components/Button';
import { useSelector, useDispatch } from 'react-redux';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';
import { PROGRAM_NAME } from '../../constants';

const Report = (props) => {

    const { projectItem, accessToken } = useSelector((state) => state.base);

    const downloadFile = async (url, type, fileName) => {
        const downloadFolderPath = RNFS.DownloadDirectoryPath;

        const path = `${downloadFolderPath}/${fileName}`;

        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
                title: "Storage Permission",
                message: "App needs access to memory to download the file "
            }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            try {
                const response = await RNFetchBlob.fetch('POST', url, {
                    'Content-Type': 'application/json',
                    Authorization: accessToken,
                }, JSON.stringify({
                    id: projectItem.id,
                    case: type
                }));

                let base64Str = response.data;
                await RNFS.writeFile(path, base64Str, 'base64');
                Alert.alert(
                    PROGRAM_NAME,
                    '下载成功!',
                    [{ text: '是(Y)', onPress: () => console.log("") }],
                    { cancelable: false },
                );
                console.log('The file saved to', path);
                // console.log('The file saved to ', path);
            } catch (error) {
                Alert.alert(
                    PROGRAM_NAME,
                    '下载失败',
                    [{ text: '是(Y)', onPress: () => console.log("") }],
                    { cancelable: false },
                );
                console.error("Error in downloadFile: ", error);
            }
        }

    };

    const downloadData = async (type) => {
        try {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            downloadFile('http://39.97.209.255:8000/api/reportDownload', type, uniqueSuffix + "-" + type + '.xlsx');

            // download.then(({ response }) => {
            //     const totalLength = parseInt(response.headers['content-length'], 10);
            //     response.data.on('data', (chunk) => {
            //         setProgress(prevProgress => prevProgress + chunk.length / totalLength);
            //     });
            // });
        } catch (error) {
            console.error("Error in downloadData: ", error);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const [isVisible, setisVisible] = useState(false)

    const fetchData = () => {

    };

    const BackBtnPress = async () => {
        props.navigation.push('PromanageMain')
    };

    return (
        <View style={styles.allcontent}>
            <Header {...props} BtnPress={BackBtnPress} title={'项目管理'} />
            <Text style={{ alignSelf: 'center', marginBottom: 2 }}>{projectItem.id}</Text>
            <View style={styles.main}>
                <Button
                    ButtonTitle={'盘点确认单'}
                    BtnPress={() => downloadData("inventoryReport")}
                    type={'yellowBtn'}
                    BTnWidth={300}
                    BTnHeight={"85%"}
                />
                <TouchableOpacity style={{ zIndex: 100000000, position: 'absolute', right: 70 }}>
                    <Icon name="file-download" style={{ alignSelf: 'center', marginBottom: 10 }} color={'#FFFFFF'} size={20} />
                </TouchableOpacity>
            </View>
            <View style={styles.main}>
                <Button
                    ButtonTitle={'单品差异确认单'}
                    BtnPress={() => downloadData("detailDiffReport")}
                    type={'yellowBtn'}
                    BTnWidth={300}
                    BTnHeight={"85%"}
                />
                <TouchableOpacity style={{ zIndex: 100000000, position: 'absolute', right: 70 }}>
                    <Icon name="file-download" style={{ alignSelf: 'center', marginBottom: 10 }} color={'#FFFFFF'} size={20} />
                </TouchableOpacity>
            </View>
            <View style={styles.main}>
                <Button
                    ButtonTitle={'实盘清单'}
                    BtnPress={() => downloadData("realReport")}
                    type={'yellowBtn'}
                    BTnWidth={300}
                    BTnHeight={"85%"}
                />
                <TouchableOpacity style={{ zIndex: 100000000, position: 'absolute', right: 70 }}>
                    <Icon name="file-download" style={{ alignSelf: 'center', marginBottom: 10 }} color={'#FFFFFF'} size={20} />
                </TouchableOpacity>
            </View>
            <View style={styles.main}>
                <Button
                    ButtonTitle={'片区报告'}
                    BtnPress={() => downloadData("areaReport")}
                    type={'yellowBtn'}
                    BTnWidth={300}
                    BTnHeight={"85%"}
                />
                <TouchableOpacity style={{ zIndex: 100000000, position: 'absolute', right: 70 }}>
                    <Icon name="file-download" style={{ alignSelf: 'center', marginBottom: 10 }} color={'#FFFFFF'} size={20} />
                </TouchableOpacity>
            </View>
            <View style={styles.main}>
                <Button
                    ButtonTitle={'盘点数据'}
                    BtnPress={() => downloadData("realInventoryReport")}
                    type={'yellowBtn'}
                    BTnWidth={300}
                    BTnHeight={"85%"}
                />
                <TouchableOpacity style={{ zIndex: 100000000, position: 'absolute', right: 70 }}>
                    <Icon name="file-download" style={{ alignSelf: 'center', marginBottom: 10 }} color={'#FFFFFF'} size={20} />
                </TouchableOpacity>
            </View>
            <View style={styles.main}>
                <Button
                    ButtonTitle={'不在档盘点数据'}
                    BtnPress={() => downloadData("buzaiReport")}
                    type={'yellowBtn'}
                    BTnWidth={300}
                    BTnHeight={"85%"}
                />
                <TouchableOpacity style={{ zIndex: 100000000, position: 'absolute', right: 70 }}>
                    <Icon name="file-download" style={{ alignSelf: 'center', marginBottom: 10 }} color={'#FFFFFF'} size={20} />
                </TouchableOpacity>
            </View>
            {/* <View style={styles.uploadingcontent}>
                <View style={{ flexDirection: 'row', alignSelf: 'flex-start', marginBottom: 5 }}>
                    <Icon2 name="arrow-up" size={15} color={"#E19706"} />
                    <Text style={{ color: '#E19706', fontSize: 10, marginLeft: 5 }}>Uploading</Text>
                </View>
                <ProgressBar progress={progress} width={screenWidth * 0.9 * 0.8} color={'#E19706'} />
            </View> */}
        </View>
    );
}

const styles = StyleSheet.create({
    allcontent: {
        position: 'relative',
        height: Dimensions.get('window').height,
        backgroundColor: '#F2F2F2',
    },
    main: {
        position: 'relative',
        justifyContent: 'center',
        flexDirection: 'row',
        paddingHorizontal: 30,
        alignItems: 'center',
        width: '90%',
        alignSelf: 'center',
        height: "10%",
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
    modalheader: {
        height: '20%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
    },
    modalMain: {
        height: '50%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalBottom: {
        height: '20%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    uploadingcontent: {
        alignItems: 'center',
        width: '90%',
        height: 70,
        backgroundColor: '#FCF1CA',
        alignSelf: 'center',
        padding: 7,
        marginTop: 10,
        borderRadius: 5
    },
});

export default Report;