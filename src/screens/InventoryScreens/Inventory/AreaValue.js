import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, Text, StyleSheet, Alert, FlatList, Dimensions, TextInput } from 'react-native';
import ApiObject from '../../../support/Api';
import CStyles from '../../../styles/CommonStyles';
import Button from '../../../components/Button';
import Header from '../../../components/Header';
import DropBox from '../../../components/DropBox';
import FooterBar4 from '../../../components/FooterBar4';
import QRcodeScanScreen from '../../../components/QRcodeScanScreen';
import { INV_TYPE, PROGRAM_NAME } from '../../../constants';
import { DB, tbName, getPianquList } from '../../../hooks/dbHooks';
import SoundObject from '../../../utils/sound';
import { setRowPos, setScreenLoading, setColumnPos, setGongweiPos } from '../../../reducers/BaseReducer';

const AreaValue = (props) => {
  const dispatch = useDispatch();
  const { user, project } = useSelector((state) => state.base);
  const { scandataTb, gongweiMasterTb } = tbName(user.id);

  const [flatListData, setFlatListData] = useState([]);
  const [pianqushow, setPianqushow] = useState(false);
  const [openScan, setOpenScan] = useState(false);
  const [gongwei, setGongwei] = useState('');
  const [pianqu, setPianqu] = useState('');
  const [pianquList, setPianquList] = useState([]);
  const [pianquListOpen, setPianquListOpen] = useState(false);

  const toNextStep = useCallback(async () => {
    if (gongwei !== '') {
      const results = await Promise.all([
        new Promise((resolve, reject) => {
          DB.transaction((tx) => {
            tx.executeSql(
              `SELECT * FROM ${gongweiMasterTb} WHERE gongwei = ?`,
              [Number(gongwei)],
              (tx, results) => {
                resolve(results);
              },
              (error) => {
                reject(error);
              }
            );
          });
        }),
        getPianquList(user.id)
      ]);

      const gongweiResults = results[0];
      const listresult = results[1];

      if (gongweiResults.rows.length > 0) {
        gongWeiWorkCheck(gongweiResults.rows.item(0));
      } else {
        Alert.alert(
          PROGRAM_NAME,
          '此工位不存在。 你想继续吗？',
          [
            {
              text: '是(Y)',
              onPress: async () => {
                if (listresult.length > 0) {
                  setPianquList(listresult);
                } else {
                  let list = [
                    { label: '卖场', value: '卖场' },
                    { label: '库房', value: '库房' }
                  ];
                  setPianquList(list);
                }
                setPianqushow(true);
              }
            },
            { text: '否(N)', onPress: () => setGongwei('') }
          ],
          { cancelable: false }
        );
      }
    } else {
      Alert.alert(
        PROGRAM_NAME,
        '请正确输入工位位置信息。',
        [{ text: '是(ok)', onPress: () => { } }],
        { cancelable: false }
      );
    }

    dispatch(setScreenLoading(false));
  }, [dispatch, gongwei, gongweiMasterTb, getPianquList, setGongwei, setPianquList, setPianqushow, user.id]);

  // ...

  // Use the memoized toNextStep function
  <Button
    ButtonTitle={'Next Step'}
    BtnPress={toNextStep}
    type={'YellowBtn'}
    BTnWidth={130}
  />

  const gongWeiWorkCheck = async (gongweiItem) => {
    var result = await ApiObject.gongweiCheck({ qrcode: project.qrcode, position: gongweiItem.gongwei, work_type: INV_TYPE, force: false });

    if (result !== null) {
      if (result == 'reApiForce') {
        result = await ApiObject.gongweiCheck({ qrcode: project.qrcode, position: gongweiItem.gongwei, work_type: INV_TYPE, force: true });
        if (result !== null) {
          gotoInventoryMain(gongweiItem);
        }
      } else {
        gotoInventoryMain(gongweiItem);
      }
    }
  };

  const gotoInventoryMain = async (gongweiItem) => {
    const result = await new Promise((resolve, reject) => {
      DB.transaction((tx) => {
        tx.executeSql(
          `SELECT * FROM ${scandataTb} WHERE gongwei_id = ?`,
          [gongweiItem.id],
          (tx, results) => {
            if (results.rows.length === 0) {
              resolve({ row: '1', column: '1' });
            } else {
              const lastRow = results.rows.item(results.rows.length - 1).row.toString();
              const lastColumn = (results.rows.item(results.rows.length - 1).column + 1).toString();
              resolve({ row: lastRow, column: lastColumn });
            }
          },
          (error) => {
            reject(error);
          }
        );
      });
    });

    dispatch(setRowPos(result.row));
    dispatch(setColumnPos(result.column));


    dispatch(setGongweiPos(gongweiItem));
    props.navigation.push('InventoryMain');
  }

  const newGongweiAdd = async () => {
    dispatch(setScreenLoading(true));

    if (pianqu == "") {
      Alert.alert(
        PROGRAM_NAME,
        '请选择一个',
        [{ text: '是(OK)', onPress: () => { } }],
        { cancelable: false },
      );
    } else {
      var result = await ApiObject.newGongweiAdd({ qrcode: project.qrcode, pianqu: pianqu, gongwei: Number(gongwei.toString().slice(0, 16)) });
      if (result !== null) {
        DB.transaction((txn) => {
          txn.executeSql(
            `INSERT INTO ${gongweiMasterTb} ("id", "pianqu", "gongwei") VALUES (?,?,?)`,
            [
              result,
              pianqu,
              Number(gongwei.toString().slice(0, 16))
            ],
            async (txn, results) => {
              gongWeiWorkCheck({ id: result, pianqu: pianqu, gongwei: Number(gongwei.toString().slice(0, 16)) });
              setPianqushow(false);
            },
          );
        });
      }
    }

    dispatch(setScreenLoading(false));
  };

  const getAllScanData = async () => {
    const results = await new Promise((resolve, reject) => {
      DB.transaction((tx) => {
        tx.executeSql(
          `SELECT * FROM ${scandataTb} LEFT JOIN ${gongweiMasterTb} ON ${scandataTb}.gongwei_id = ${gongweiMasterTb}.id`,
          [],
          (tx, results) => {
            resolve(results);
          },
          (error) => {
            reject(error);
          }
        );
      });
    });

    if (results.rows.length === 0) {
      Alert.alert(
        PROGRAM_NAME,
        '没有数据。',
        [{ text: '是(ok)', onPress: () => { } }],
        { cancelable: false },
      );
    } else {
      var tableDataArray = [];
      for (let i = 0; i < results.rows.length; i++) {
        var item = [];

        item.push(results.rows.item(i).pianqu);
        item.push(results.rows.item(i).gongwei.toString().padStart(project.gongwei_max, "0"));
        item.push(results.rows.item(i).commodity_sku);
        item.push(results.rows.item(i).count);
        item.push(results.rows.item(i).commodity_name);
        item.push(results.rows.item(i).row);
        item.push(results.rows.item(i).column);
        item.push(results.rows.item(i).color);
        item.push(results.rows.item(i).size);

        tableDataArray.push(item);
      }

      setFlatListData(tableDataArray);
    }
  }

  const gongweiInputChange = (e) => {
    // var inp = e.nativeEvent.key;
    // SoundObject.playSound(inp);
  };

  const soundplaycontrol = async (value) => {
    if(value!=""){
      SoundObject.playSound(parseInt(value.slice(-1)[0]));
    }
    
    if (gongwei.length < value.length && value[value.length - 2] == value[value.length - 1]) {
      SoundObject.playSound('alert');
    }
   
    setGongwei(value.replace(/[^0-9]/g, ''));
  };

  const BackBtnPress = () => {
    props.navigation.push('Inventory');
  };

  const renderInventoryDataView = ({ item, index }) => (
    <View key={index} style={{ flexDirection: 'row', textAlign: 'center' }}>
      <Text style={[styles.sumdata, { flex: 1 }]}>{item[0]}</Text>
      <Text style={[styles.sumdata, { flex: 2 }]}>{item[1]}</Text>
      <Text style={[styles.sumdata, { flex: 1 }]}>{item[5]}</Text>
      <Text style={[styles.sumdata, { flex: 1 }]}>{item[6]}</Text>
      <Text style={[styles.sumdata, { flex: 2 }]}>{item[2]}</Text>
      <Text style={[styles.sumdata, { flex: 2 }]}>{item[4]}</Text>
      <Text style={[styles.sumdata, { flex: 1 }]}>{item[7]}</Text>
      <Text style={[styles.sumdata, { flex: 1 }]}>{item[8]}</Text>
      <Text style={[styles.sumdata, { flex: 1 }]}>{item[3]}</Text>
    </View>
  );

  return (
    <>
      {openScan && <QRcodeScanScreen skuScanOK={(val) => {
        setGongwei(val);
        setOpenScan(false);
      }} skuScanCancel={() => setOpenScan(false)} />}
      <View style={{ position: 'relative', height: Dimensions.get('window').height }}>
        <View style={{}}>
          <Header
            {...props}
            BtnPress={BackBtnPress}
            title={'盘点'}
          />
        </View>

        <View style={{ flex: 1, position: 'relative' }}>
          <View style={{ justifyContent: 'center', flexDirection: 'row', paddingHorizontal: 30, paddingVertical: 10 }}>
            <Text style={CStyles.TextStyle}>工位:</Text>
            <TextInput
              value={gongwei}
              autoFocus={true}
              keyboardType="none"
              onChangeText={(val)=>soundplaycontrol(val)}
              onKeyPress={gongweiInputChange}
              placeholder={''}
              style={CStyles.InputStyle}
              maxLength={15}
            />
            <Button
              ButtonTitle={'扫描'}
              BtnPress={() => setOpenScan(true)}
              type={'yellowBtn'}
              BTnWidth={70}
            />
          </View>
          <View
            style={{
              marginTop: 10,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
            }}
          >
            <Button
              ButtonTitle={'下一步'}
              BtnPress={() => { dispatch(setScreenLoading(true)), toNextStep() }}
              type={'blueBtn'}
              BTnWidth={Dimensions.get('window').width * 0.9}
            />
          </View>

          <View
            style={{
              marginTop: 10,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
            }}
          >
            <Button
              ButtonTitle={'综合数据'}
              BtnPress={() => getAllScanData()}
              type={'blueBtn'}
              BTnWidth={Dimensions.get('window').width * 0.9}
            />
          </View>

          {flatListData.length !== 0 && (
            <View style={{ padding: 10 }}>
              <View style={styles.container}>
                <Text style={[styles.head, { flex: 1 }]}>片区</Text>
                <Text style={[styles.head, { flex: 2 }]}>工位</Text>
                <Text style={[styles.head, { flex: 1 }]}>层</Text>
                <Text style={[styles.head, { flex: 1 }]}>列</Text>
                <Text style={[styles.head, { flex: 2 }]}>sku</Text>
                <Text style={[styles.head, { flex: 2 }]}>姓名</Text>
                <Text style={[styles.head, { flex: 1 }]}>颜色</Text>
                <Text style={[styles.head, { flex: 1 }]}>尺码</Text>
                <Text style={[styles.head, { flex: 1 }]}>数量</Text>
              </View>

              <FlatList
                vertical={true}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={true}
                data={flatListData}
                renderItem={renderInventoryDataView}
                keyExtractor={(item, index) => index + `${item.id}`}
                removeClippedSubviews={false}
                style={{ marginBottom: 100 }}
              />
            </View>
          )}
        </View>

        <FooterBar4
          screenInventory={() => props.navigation.push('InventoryInit')}
          screenQuantity={() => props.navigation.push('QuantityInit')}
        />

        {pianqushow && (
          <View style={CStyles.ModalContainer}>
            <View style={CStyles.ModalBack} />
            <View style={CStyles.ModalBoxBack}>
              <View>
                <Text style={{ fontSize: 14 }}>{PROGRAM_NAME}</Text>
              </View>

              <View style={{ alignItems: 'center', marginVertical: 20 }}>
                <Text style={{ textAlign: 'left', fontSize: 12 }}>
                  有多个片区入货架的区域。请选择一个。
                </Text>
              </View>

              <View style={{ justifyContent: 'center', flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 3 }}>
                <Text style={{ ...CStyles.TextStyle, textAlign: 'right' }}>片区:</Text>
                <DropBox
                  zIndex={2000}
                  zIndexInverse={2000}
                  open={pianquListOpen}
                  setOpen={setPianquListOpen}
                  value={pianqu}
                  setValue={setPianqu}
                  items={pianquList}
                  setItems={setPianquList}
                  searchable={true}
                  listMode='MODAL'
                />
              </View>

              <View
                style={{
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexDirection: 'row',
                  marginTop: 20,
                }}
              >
                <Button
                  ButtonTitle={'确定'}
                  BtnPress={() => newGongweiAdd()}
                  type={'YellowBtn'}
                  BTnWidth={130}
                />
                <Button
                  ButtonTitle={'返回'}
                  BtnPress={() => setPianqushow(false)}
                  type={'blueBtn'}
                  BTnWidth={130}
                />
              </View>
            </View>
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flexDirection: 'row',
  },

  sumdata: {
    flex: 2,
    borderWidth: 1,
    borderColor: '#9f9f9f',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    color: "black"
  },

  head: {
    height: 30,
    textAlignVertical: 'center',
    borderWidth: 1,
    borderColor: '#9f9f9f',
    marginTop: 10,
    backgroundColor: '#f1f8ff',
    fontSize: 10,
    textAlign: 'center'
  },
});

export default AreaValue;
