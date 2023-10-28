import React, { useState, useRef, useEffect } from 'react';
import { View, Modal, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Dimensions, ScrollView } from 'react-native';
import Header from '../../components/Header';
import CStyles from '../../styles/CommonStyles';
import Icon from 'react-native-vector-icons/AntDesign';
import Button from '../../components/Button';
import { useSelector, useDispatch } from 'react-redux';
import ApiObject from '../../support/Api';

const Main = (props) => {

  const { projectItem } = useSelector((state) => state.base);

  useEffect(() => {
    fetchData();
  }, []);

  const [isVisible, setisVisible] = useState(false)

  const fetchData = () => {

  };

  const BackBtnPress = async () => {
    props.navigation.push('PromanageDashboard')
  };

  const endProject = async () => {
    await ApiObject.endProject({
      id: projectItem.id
    })
    setisVisible(false)
    props.navigation.push('PromanageDashboard')
  }


  return (
    <View style={styles.allcontent}>
      <Header {...props} BtnPress={BackBtnPress} title={'项目管理'} />
      <Modal
        visible={isVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalheader}>
              <Text style={{ fontSize: 18, color: '##282828', fontWeight: "bold" }}>提示</Text>
              <TouchableOpacity onPress={() => setisVisible(false)}>
                <Icon name="close" size={20} style={{ marginRight: 10, color: "black" }} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalMain}>
              <Text style={{ fontSize: 18, color: '##282828' }}>你想停止这个项目吗?</Text>
            </View>
            <View style={styles.modalBottom}>
              <Button
                ButtonTitle={'是(Y)'}
                BtnPress={() => { endProject() }}
                type={'yellowBtn'}
                BTnWidth={120}
              />
              <Button
                ButtonTitle={'否(N)'}
                BtnPress={() => setisVisible(false)}
                type={'blueBtn'}
                BTnWidth={120}
              />
            </View>
          </View>
        </View>
      </Modal>
      <Text style={{ alignSelf: 'center', marginBottom: 10 }}>{projectItem.id}</Text>
      <ScrollView style={{ marginBottom: 20 }}>
        <View style={{ ...styles.main, marginTop: 30 }}>
          <Button
            ButtonTitle={'项目信息'}
            BtnPress={() => props.navigation.push('PromanageInfor')}
            type={'yellowBtn'}
            BTnWidth={300}
            BTnHeight={50}
          />
        </View>
        <View style={styles.main}>
          <Button
            ButtonTitle={'QR号码'}
            BtnPress={() => props.navigation.push('PromanageQrcode')}
            type={'yellowBtn'}
            BTnWidth={300}
            BTnHeight={50}
          />
        </View>
        <View style={styles.main}>
          <Button
            ButtonTitle={'导入主档'}
            BtnPress={() => props.navigation.push('PromanagePromaster')}
            type={'yellowBtn'}
            BTnWidth={300}
            BTnHeight={50}
          />
        </View>
        <View style={styles.main}>
          <Button
            ButtonTitle={'工位设定'}
            BtnPress={() => props.navigation.push('PromanageGongwei')}
            type={'yellowBtn'}
            BTnWidth={300}
            BTnHeight={50}
          />
        </View>
        <View style={styles.main}>
          <Button
            ButtonTitle={'提交报告'}
            BtnPress={() => props.navigation.push('PromanageReport')}
            type={'yellowBtn'}
            BTnWidth={300}
            BTnHeight={50}
          />
        </View>
        <View style={styles.main}>
          <Button
            ButtonTitle={'停止'}
            BtnPress={() => setisVisible(true)}
            type={'yellowBtn'}
            BTnWidth={300}
            BTnHeight={50}
          />
        </View>
        <View style={styles.main}>
          <Button
            ButtonTitle={'人员状态'}
            BtnPress={() => props.navigation.push('PromanagePersonal')}
            type={'yellowBtn'}
            BTnWidth={300}
            BTnHeight={50}
          />
        </View>
      </ScrollView>
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
    marginBottom: 15
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
  }
});

export default Main;