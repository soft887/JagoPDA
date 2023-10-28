import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, Modal, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Dimensions, TextInput } from 'react-native';
import Header from '../../components/Header';
import CStyles from '../../styles/CommonStyles';
import Icon from 'react-native-vector-icons/AntDesign';
import Button from '../../components/Button';
import { help } from 'mathjs';

const Infor = (props) => {

  const [isEditable, setIsEditable] = useState(false);
  const [data, setData] = useState([]);
  const [isVisible, setisVisible] = useState(false)
  const { projectItem } = useSelector((state) => state.base);

  const renderItem = ({ item }) => {
    return (
      <View style={styles.textinputContent}>
        <Text style={{ width: '50%', color: '#282828', fontSize: 12 }}>{item.name}:</Text>
        <View style={{ width: '50%' }}>
          <Text style={{ color: '#282828', fontSize: 12 }}>{item.value}</Text>
        </View>
      </View>
    );
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    let data = [
      {
        name: '客户名称',
        value: projectItem?.client_name
      },
      {
        name: '客户编码',
        value: projectItem?.client_id.toString()
      },
      {
        name: '庳存类型',
        value: projectItem?.inventory_type.toString()
      },
      {
        name: '门店名称',
        value: projectItem?.store_name
      },
      {
        name: '门店编码',
        value: projectItem?.store_id
      },
      {
        name: '品牌',
        value: projectItem?.brand
      },
      {
        name: '门店联系人',
        value: projectItem?.store_link_name
      },
      {
        name: '门店联系电话',
        value: projectItem?.store_link_phone
      },
      {
        name: '门店经理',
        value: projectItem?.store_manager
      },
      {
        name: '客户现场代表',
        value: projectItem?.client_store_leader
      },
      {
        name: '客户门店地址',
        value: projectItem?.store_address
      },
      {
        name: '参考库存',
        value: projectItem?.estimated
      },
      {
        name: '排班人',
        value: projectItem?.scheduler_name.toString()
      },
      {
        name: '领队',
        value: projectItem?.leader_name
      },
      {
        name: '建议起始日期',
        value: projectItem?.prefer_starttime
      },
      {
        name: '建议结束日期',
        value: projectItem?.prefer_endtime
      },
    ]
    setData(data)
  };

  const BackBtnPress = async () => {
    props.navigation.push('PromanageMain')
  };

  return (
    <View style={styles.allcontent}>
      <Header {...props} BtnPress={BackBtnPress} title={'项目管理'} />
      <Text style={{ alignSelf: 'center', marginBottom: 2 }}>{projectItem.id}</Text>
      <TouchableOpacity onPress={() => props.navigation.push('PromanageInforEdit')}>
        <Icon name="edit" size={30} style={{ alignSelf: 'flex-end', marginRight: 30, marginBottom: 10, color: '#000000' }} />
      </TouchableOpacity>
      <FlatList
        data={data}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  allcontent: {
    position: 'relative',
    height: Dimensions.get('window').height,
    backgroundColor: '#F2F2F2'
  },
  textinputContent: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 30,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#5e5e56',
    width: '90%',
    alignSelf: 'center'
  },
  calendarContent: {
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 30,
    paddingVertical: 10,
    alignItems: 'center',
    width: '100%'
  },
  scrollContentTop: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    alignItems: 'center',
    width: '100%'
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

export default Infor;