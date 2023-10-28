import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, Modal, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Dimensions, TextInput } from 'react-native';
import Header from '../../components/Header';
import CStyles from '../../styles/CommonStyles';
import Icon from 'react-native-vector-icons/AntDesign';
import Button from '../../components/Button';
import { help } from 'mathjs';
import { ScrollView } from 'react-native-gesture-handler';
import ApiObject from '../../support/Api';
import { setqrcode } from '../../reducers/BaseReducer';

const CardDetail = (props) => {

  const dispatch = useDispatch();
  const { projectItem } = useSelector((state) => state.base);
  const [isEditable, setIsEditable] = useState(false);
  const [isVisible, setisVisible] = useState(false)

  const [clientName, setClientName] = useState(projectItem?.client_name)
  const [clientId, setClientId] = useState(projectItem?.client_id.toString())
  const [inventoryType, setInventoryType] = useState(projectItem?.inventory_type.toString())
  const [storename, setStorename] = useState(projectItem?.store_name)
  const [storeid, setStoreid] = useState(projectItem?.store_id);
  const [brand, setBrand] = useState(projectItem?.brand);
  const [storelinkname, setStorelinkname] = useState(projectItem?.store_link_name);
  const [storelinkphone, setStorelinkphone] = useState(projectItem?.store_link_phone);
  const [storemanager, setStoremanager] = useState(projectItem?.store_manager)
  const [clientstoreleader, setClientstoreleader] = useState(projectItem?.client_store_leader);
  const [storeaddress, setStoreaddress] = useState(projectItem?.store_address);
  const [estimated, setEstimated] = useState(projectItem?.estimated);
  const [schduleid, setSchduleid] = useState(projectItem?.scheduler_id.toString());
  const [leaderid, setLeaderid] = useState(projectItem?.leader_id);
  const [preferstarttime, setPreferstarttime] = useState(projectItem?.prefer_starttime);
  const [preferendtime, setPreferendtime] = useState(projectItem?.prefer_endtime);
  const [prostarttime, setProstarttime] = useState(projectItem?.pro_starttime);
  const [proendtime, setProendtime] = useState(projectItem?.pro_endtime);

  const updateProject = async () => {
    if (storename == '' || preferendtime == '' || preferstarttime == ''
      || storeaddress == ""
    ) {

    }
    else {
      setisVisible(false);
      const result = await ApiObject.startProject({
        setting_id: clientId,
        id: projectItem.id,
      })
      await dispatch(setqrcode(result.toString()));
      props.navigation.push('PromanageMain')
    }
  }



  const BackBtnPress = async () => {
    props.navigation.push('PromanageDashboard')
  };

  const onStart = async () => {
    setisVisible(true)
  }

  return (
    <View style={styles.allcontent}>
      <Modal
        visible={isVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalheader}>
              <Text style={{ fontSize: 18, color: '#282828', fontWeight: "bold" }}>提示</Text>
              <TouchableOpacity onPress={() => setisVisible(false)}>
                <Icon name="close" size={20} color={'black'} style={{ marginRight: 10 }} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalMain}>
              <Text style={{ fontSize: 18, color: '#282828' }}>你想开始这个项目吗?</Text>
            </View>
            <View style={styles.modalBottom}>
              <Button
                ButtonTitle={'是(Y)'}
                BtnPress={() => updateProject()}
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
      <Header {...props} BtnPress={BackBtnPress} title={'项目管理'} />
      <Text style={{ alignSelf: 'center', marginBottom: 2 }}>{projectItem.id}</Text>
      <TouchableOpacity onPress={() => props.navigation.push('PromanageInforEdit')}>
        <Icon name="edit" size={30} style={{ alignSelf: 'flex-end', marginRight: 30, marginBottom: 10 }} />
      </TouchableOpacity>
      <ScrollView>
        <View>
          <View style={styles.textinputContent}>
            <Text style={{ color: '#000000', fontSize: 12, width: '50%' }}>客户名称:</Text>
            <View style={{ color: '#000000', fontSize: 12, width: '50%' }}>
              <TextInput
                value={clientName}
                editable={isEditable}
                autoFocus={true}
                placeholder={''}
                selectTextOnFocus={true}
                style={CStyles.InputStyle}
                multiline={false}
                onChangeText={setClientName}
              />
            </View>
          </View>
          <View style={styles.textinputContent}>
            <Text style={{ color: '#000000', fontSize: 12, width: '50%' }}>客户编码:</Text>
            <View style={{ color: '#000000', fontSize: 12, width: '50%' }}>
              <TextInput
                value={clientId}
                editable={isEditable}
                autoFocus={true}
                placeholder={''}
                selectTextOnFocus={true}
                style={CStyles.InputStyle}
                multiline={false}
                onChangeText={setClientId}
              />
            </View>
          </View>
          <View style={styles.textinputContent}>
            <Text style={{ color: '#000000', fontSize: 12, width: '50%' }}>庳存类型:</Text>
            <View style={{ color: '#000000', fontSize: 12, width: '50%' }}>
              <TextInput
                value={inventoryType}
                editable={isEditable}
                autoFocus={true}
                placeholder={''}
                selectTextOnFocus={true}
                style={CStyles.InputStyle}
                multiline={false}
                onChangeText={setInventoryType}
              />
            </View>
          </View>
          <View style={styles.textinputContent}>
            <Text style={{ color: '#000000', fontSize: 12, width: '50%' }}>门店名称:</Text>
            <View style={{ color: '#000000', fontSize: 12, width: '50%' }}>
              <TextInput
                value={storename}
                editable={isEditable}
                autoFocus={true}
                placeholder={''}
                selectTextOnFocus={true}
                style={CStyles.InputStyle}
                multiline={false}
                onChangeText={setStorename}
              />
            </View>
          </View>
          <View style={styles.textinputContent}>
            <Text style={{ color: '#000000', fontSize: 12, width: '50%' }}>门店编码:</Text>
            <View style={{ color: '#000000', fontSize: 12, width: '50%' }}>
              <TextInput
                value={storeid}
                editable={isEditable}
                autoFocus={true}
                placeholder={''}
                selectTextOnFocus={true}
                style={CStyles.InputStyle}
                multiline={false}
                onChangeText={setStoreid}
              />
            </View>
          </View>
          <View style={styles.textinputContent}>
            <Text style={{ color: '#000000', fontSize: 12, width: '50%' }}>品牌:</Text>
            <View style={{ color: '#000000', fontSize: 12, width: '50%' }}>
              <TextInput
                value={brand}
                editable={isEditable}
                autoFocus={true}
                placeholder={''}
                selectTextOnFocus={true}
                style={CStyles.InputStyle}
                multiline={false}
                onChangeText={setBrand}
              />
            </View>
          </View>
          <View style={styles.textinputContent}>
            <Text style={{ color: '#000000', fontSize: 12, width: '50%' }}>门店联系人:</Text>
            <View style={{ color: '#000000', fontSize: 12, width: '50%' }}>
              <TextInput
                value={storelinkname}
                editable={isEditable}
                autoFocus={true}
                placeholder={''}
                selectTextOnFocus={true}
                style={CStyles.InputStyle}
                multiline={false}
                onChangeText={setStorelinkname}
              />
            </View>
          </View>
          <View style={styles.textinputContent}>
            <Text style={{ color: '#000000', fontSize: 12, width: '50%' }}>门店联系电话:</Text>
            <View style={{ color: '#000000', fontSize: 12, width: '50%' }}>
              <TextInput
                value={storelinkphone}
                editable={isEditable}
                autoFocus={true}
                placeholder={''}
                selectTextOnFocus={true}
                style={CStyles.InputStyle}
                multiline={false}
                onChangeText={setStorelinkphone}
              />
            </View>
          </View>
          <View style={styles.textinputContent}>
            <Text style={{ color: '#000000', fontSize: 12, width: '50%' }}>门店经理:</Text>
            <View style={{ color: '#000000', fontSize: 12, width: '50%' }}>
              <TextInput
                value={storemanager}
                editable={isEditable}
                autoFocus={true}
                placeholder={''}
                selectTextOnFocus={true}
                style={CStyles.InputStyle}
                multiline={false}
                onChangeText={setStoremanager}
              />
            </View>
          </View>
          <View style={styles.textinputContent}>
            <Text style={{ color: '#000000', fontSize: 12, width: '50%' }}>客户现场代表:</Text>
            <View style={{ color: '#000000', fontSize: 12, width: '50%' }}>
              <TextInput
                value={clientstoreleader}
                editable={isEditable}
                autoFocus={true}
                placeholder={''}
                selectTextOnFocus={true}
                style={CStyles.InputStyle}
                multiline={false}
                onChangeText={setClientstoreleader}
              />
            </View>
          </View>
          <View style={styles.textinputContent}>
            <Text style={{ color: '#000000', fontSize: 12, width: '50%' }}>客户门店地址:</Text>
            <View style={{ color: '#000000', fontSize: 12, width: '50%' }}>
              <TextInput
                value={storeaddress}
                editable={isEditable}
                autoFocus={true}
                placeholder={''}
                selectTextOnFocus={true}
                style={CStyles.InputStyle}
                multiline={false}
                onChangeText={setStoreaddress}
              />
            </View>
          </View>
          <View style={styles.textinputContent}>
            <Text style={{ color: '#000000', fontSize: 12, width: '50%' }}>参考库存:</Text>
            <View style={{ color: '#000000', fontSize: 12, width: '50%' }}>
              <TextInput
                value={estimated}
                editable={isEditable}
                autoFocus={true}
                placeholder={''}
                selectTextOnFocus={true}
                style={CStyles.InputStyle}
                multiline={false}
                onChangeText={setEstimated}
              />
            </View>
          </View>
          <View style={styles.textinputContent}>
            <Text style={{ color: '#000000', fontSize: 12, width: '50%' }}>排班人:</Text>
            <View style={{ color: '#000000', fontSize: 12, width: '50%' }}>
              <TextInput
                value={schduleid}
                editable={isEditable}
                autoFocus={true}
                placeholder={''}
                selectTextOnFocus={true}
                style={CStyles.InputStyle}
                multiline={false}
                onChangeText={setSchduleid}
              />
            </View>
          </View>
          <View style={styles.textinputContent}>
            <Text style={{ color: '#000000', fontSize: 12, width: '50%' }}>领队:</Text>
            <View style={{ color: '#000000', fontSize: 12, width: '50%' }}>
              <TextInput
                value={leaderid}
                editable={isEditable}
                autoFocus={true}
                placeholder={''}
                selectTextOnFocus={true}
                style={CStyles.InputStyle}
                multiline={false}
                onChangeText={setLeaderid}
              />
            </View>
          </View>
          <View style={styles.textinputContent}>
            <Text style={{ color: '#000000', fontSize: 12, width: '50%' }}>建议起始日期:</Text>
            <View style={{ color: '#000000', fontSize: 12, width: '50%' }}>
              <TextInput
                value={preferstarttime}
                editable={isEditable}
                autoFocus={true}
                placeholder={''}
                selectTextOnFocus={true}
                style={{ ...CStyles.InputStyle, paddingLeft: 12 }}
                multiline={false}
                onChangeText={setPreferstarttime}
              />
            </View>
          </View>
          <View style={styles.textinputContent}>
            <Text style={{ color: '#000000', fontSize: 12, width: '50%' }}>建议结束日期:</Text>
            <View style={{ color: '#000000', fontSize: 12, width: '50%' }}>
              <TextInput
                value={preferendtime}
                editable={isEditable}
                autoFocus={true}
                placeholder={''}
                selectTextOnFocus={true}
                style={{ ...CStyles.InputStyle, paddingLeft: 12 }}
                multiline={false}
                onChangeText={setPreferendtime}
              />
            </View>
          </View>
          <View style={styles.textinputContent}>
            <Text style={{ color: '#000000', fontSize: 12, width: '50%' }}>盘点起始日期:</Text>
            <View style={{ color: '#000000', fontSize: 12, width: '50%' }}>
              <TextInput
                value={prostarttime}
                editable={isEditable}
                autoFocus={true}
                placeholder={''}
                selectTextOnFocus={true}
                style={{ ...CStyles.InputStyle, paddingLeft: 12 }}
                multiline={false}
                onChangeText={setProstarttime}
              />
            </View>
          </View>
          <View style={styles.textinputContent}>
            <Text style={{ color: '#000000', fontSize: 12, width: '50%' }}>盘点结束日期:</Text>
            <View style={{ color: '#000000', fontSize: 12, width: '50%' }}>
              <TextInput
                value={proendtime}
                editable={isEditable}
                autoFocus={true}
                placeholder={''}
                selectTextOnFocus={true}
                style={{ ...CStyles.InputStyle, paddingLeft: 12 }}
                multiline={false}
                onChangeText={setProendtime}
              />
            </View>
          </View>
        </View>
        {/* <FlatList
        data={data}
        renderItem={renderItem}
      /> */}
      </ScrollView>
      <View style={{ justifyContent: 'center', flexDirection: 'row', paddingVertical: 10, marginBottom: 20 }}>
        <Button
          ButtonTitle={'开始'}
          BtnPress={() => onStart()}
          type={'yellowBtn'}
          BTnWidth={300}
        />
      </View>
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
    borderBottomColor: 'black',
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
    height: 300
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

export default CardDetail;