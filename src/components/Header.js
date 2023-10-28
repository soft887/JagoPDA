import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert, DrawerLayoutAndroid, Dimensions, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Modal from 'react-native-modal';
import ApiObject from '../support/Api';
import { setAccessToken, setUser } from '../reducers/BaseReducer';

import { PROGRAM_NAME, SERVER_URL } from '../constants';

const Header = (props) => {

  let drawerRef = null;
  const dispatch = useDispatch();

  const { user, project } = useSelector(state => state.base);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [SidebarVisible, setSidebarVisible] = useState(false)
  const [headerTitle, setHeaderTitle] = useState(false)

  const screenWidth = Dimensions.get('window').width;
  const screenWidthUnit = screenWidth / 360;
  const screenHeight = Dimensions.get('window').height;
  const screenHeightUnit = screenHeight / 640;

  const signOutCheck = () => {
    Alert.alert(
      PROGRAM_NAME,
      '你真的退出了吗？',
      [
        { text: '是(Y)', onPress: () => signOut() },
        { text: '否(N)', onPress: () => { } },
      ],
      { cancelable: true },
    );
  };

  const signOut = async () => {
    await ApiObject.logoutAction();
    dispatch(setUser({}));
    dispatch(setAccessToken(''));
    props.navigation.navigate('Login');
  };

  const renderAvatarImage = () => {
    if (user?.picture != '' && user?.picture != null) {
      return (
        <Image style={styles.avatar} source={{ uri: SERVER_URL + user.picture }} />
      );
    } else {
      return (
        <Image style={styles.avatar} source={require('../assets/images/male.jpg')} />
      );
    }
  }

  const toProjectScan = async () => {
    setIsModalVisible(false);
    if (project != null) {
      Alert.alert(
        PROGRAM_NAME,
        '您没有退出当前项目 无法加入新的项目！',
        [{ text: '是(Y)', onPress: () => { } }],
        { cancelable: false },
      );
      return;
    } else {
      props.navigation.push('ProjectMainScreen');
    }
  };

  const toNextScene = async nextScene => {
    setIsModalVisible(false);
    props.navigation.push(nextScene);
  };

  return (
    <View>
      <DrawerLayoutAndroid
        style={{
          position: 'absolute',
          width: screenWidth,
          height: screenHeight,
          zIndex: SidebarVisible ? 100 : 0,
        }}
        drawerBackgroundColor="rgba(0,0,0,0.5)"
        ref={ref => (drawerRef = ref)}
        onDrawerClose={() => setSidebarVisible(false)}
        drawerWidth={screenWidth - 70}
        drawerPosition="left"
        renderNavigationView={() => (
          <View
            style={{
              flex: 1,
              backgroundColor: '#F2F2F2',
              zIndex: 1000000,
            }}>
            <View style={styles.headercontent}>
              <Image style={styles.drawavatar} source={require('../assets/images/icon.png')} />
              <Text style={{ fontSize: 25, color: '#012964', marginTop: '17%' }}>GongXing 盘点</Text>
            </View>
            <ScrollView style={{ flex: 1 }}>
              <View style={{ marginTop: 30, marginLeft: 30, width: 100, display: 'flex', }}>
                <TouchableOpacity style={styles.section}
                  onPress={() => props.navigation.push('PromanageDashboard')}
                >
                  <Image style={styles.drawIcon} source={require('../assets/images/project-icon.png')} />
                  <Text style={styles.contentText}>项目管理</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.section}>
                  <Image style={styles.drawIcon} source={require('../assets/images/members-icon.png')} />
                  <Text style={styles.contentText}>雇员管理</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => props.navigation.push('ClientDashboard')}
                  style={styles.section}>
                  <Image style={styles.drawIcon} source={require('../assets/images/raphael_customer.png')} />
                  <Text style={styles.contentText}>客户管理</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.section}>
                  <Image style={styles.drawIcon} source={require('../assets/images/mdi_user-multiple-check-outline.png')} />
                  <Text style={styles.contentText}>考勤</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.section}
                  onPress={() => props.navigation.push('Inventory')}
                >
                  <Image style={styles.drawIcon} source={require('../assets/images/uil_layers.png')} />
                  <Text style={styles.contentText}>进行中项目</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.section}
                  onPress={() => props.navigation.push('UserInfo')}
                >
                  <Image style={styles.drawIcon} source={require('../assets/images/Group.png')} />
                  <Text style={styles.contentText}>个人信息</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.section}
                  onPress={() => props.navigation.push('SystemInfo')}
                >
                  <Image style={styles.drawIcon} source={require('../assets/images/ant-design_setting-outlined.png')} />
                  <Text style={styles.contentText}>设置</Text>
                </TouchableOpacity>
              </View>
              <View style={{ marginTop: 10, marginLeft: 30, width: 100, display: 'flex', }}>
                <TouchableOpacity style={styles.section}
                  onPress={() => signOutCheck()}
                >
                  <Image style={styles.drawIcon} source={require('../assets/images/logout.png')} />
                  <Text style={styles.contentText}>登出</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        )}>
      </DrawerLayoutAndroid>
      <Modal isVisible={isModalVisible}>
        <View style={styles.modalView}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => setIsModalVisible(false)}
          >
            <Image
              source={require('../assets/images/close.png')}
              style={{ width: 15, height: 15 }}
            />
          </TouchableOpacity>
          <Text
            style={{
              ...styles.TitleTxt,
              fontSize: 25,
              marginBottom: 10,
              fontWeight: 'bold',
            }}
          >
            操作菜单
          </Text>
          <TouchableOpacity
            style={styles.navigationBtn}
            onPress={() => {
              setIsModalVisible(false);
              props.navigation.push('Inventory');
            }}
          >
            <Text style={styles.TitleTxt}>主页面</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navigationBtn}
            onPress={() => toProjectScan()}
          >
            <Text style={styles.TitleTxt}>登录项目</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navigationBtn}
            onPress={() => toNextScene('AreaValue')}
          >
            <Text style={styles.TitleTxt}>进入初盘</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navigationBtn}
            onPress={() => toNextScene('InventoryReview')}
          >
            <Text style={styles.TitleTxt}>进入复盘</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navigationBtn}
            onPress={() => toNextScene('DifferenceSurvey')}
          >
            <Text style={styles.TitleTxt}>差异调查</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: 'row',
          padding: 5,
        }}
      >
        <TouchableOpacity
          style={{ zIndex: SidebarVisible ? 0 : 1000 }}
          onPress={() => {
            drawerRef.openDrawer();
            setSidebarVisible(true);
          }}
        >
          <Image
            style={styles.menuIcon}
            source={require('../assets/images/menuIcon.png')}
          />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 20,
            color: '#000',
            fontWeight: 'bold',
          }}
        >
          {props.title}
        </Text>
        {renderAvatarImage()}
      </View>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          backgroundColor: '#012964',
          padding: 3,
        }}
      >
        <Text
          style={{
            fontSize: 13,
            color: '#fff',
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          {project.client_name ? project.client_name + '/' + project.store_name + '/' + project.start_time : '---没有进行中---'}
        </Text>
      </View>
      {props.BackBtn !== 'noback' && (
        <View style={{ padding: 10 }}>
          <TouchableOpacity
            onPress={() => props.BtnPress()}
            style={{
              height: 35,
              width: 35,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#d6d3d3',
              borderRadius: 20,
            }}
          >
            <Icon name="left" size={30} color="#000" style={{}} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headercontent: {
    width: '90%',
    height: 100,
    borderBottomWidth: 1,
    borderBottomColor: '#878787',
    alignSelf: 'center',
    flexDirection: 'row'
  },
  drawavatar: {
    width: 70,
    height: 70,
    borderRadius: 17.5,
    marginTop: '10%'
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
  },
  drawIcon: {
    color: '#838383',
    marginRight: 10,
    width: 35
  },
  menuIcon: {
    width: 38,
    height: 38,
  },

  section: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },

  modalView: {
    width: '90%',
    height: 370,
    borderRadius: 10,
    alignSelf: 'center',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },

  closeBtn: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 30,
    height: 30,
  },

  navigationBtn: {
    borderWidth: 2,
    borderColor: '#012964',
    borderRadius: 20,
    width: '80%',
    height: 40,
    alignContent: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },

  TitleTxt: {
    fontSize: 20,
    textAlign: 'center',
    color: "black"
  },
  contentText: {
    fontSize: 18,
    color: '#000000'
  }
});

export default Header;
