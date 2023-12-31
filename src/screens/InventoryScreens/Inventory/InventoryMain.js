import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { StyleSheet, View, Text, Alert, TextInput, Dimensions, ScrollView, Keyboard } from 'react-native';
import uuid from 'react-native-uuid';
import Button from '../../../components/Button';
import Header from '../../../components/Header';
import CalculatorScreen from '../../../components/CalculatorScreen';
import QRcodeScanScreen from '../../../components/QRcodeScanScreen';
import CStyles from '../../../styles/CommonStyles';
import FooterBar1 from '../../../components/FooterBar1';
import { PROGRAM_NAME, SCAN_INPUT, HAND_INPUT } from '../../../constants';
import { setScreenLoading, setColumnPos, setSkuCount } from '../../../reducers/BaseReducer';
import { DB, tbName, pipeiSKU } from '../../../hooks/dbHooks';
import SoundObject from '../../../utils/sound';
import InvEndModal from '../../../components/InvEndModal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import KeyEvent from 'react-native-keyevent';

const InventoryMain = (props) => {
  const dispatch = useDispatch();
  const { user, project, gongweiPos, rowPos, columnPos, skuCount, useZudang } = useSelector(state => state.base);
  const { scandataTb } = tbName(user.id);


  const [scanScreen, setScanScreen] = useState(false);
  const [calScreen, setCalScreen] = useState(false);
  const [skuInputFocus, setSkuInputFocus] = useState(true);
  const [countInputFocus, setCountInputFocus] = useState(false);
  const [camera, setCamera] = useState(true)

  const [row, setRow] = useState(rowPos)
  const [column, setColumn] = useState(columnPos)
  const [skuC, setskuC] = useState(skuCount)


  const [status, setStatus] = useState(true)

  const [count, setCount] = useState('');
  const [commoditySku, setCommoditySku] = useState('');
  const [pihao, setPihao] = useState('');
  const [codeInputMethod, setCodeInputMethod] = useState(SCAN_INPUT);

  const [pipeiItem, setPipeiItem] = useState(null);
  const [sumCount, setSumCount] = useState(0);

  const [quantityClose, setQuantityClose] = useState(true);
  const [endModalOpen, setEndModalOpen] = useState(false);

  const skuRef = useRef(null);
  const countRef = useRef(null);

  const [first, setFirst] = useState(true)


  useEffect(() => {
    skuRef.current.focus();
    setCamera(true)
  }, [])
  

  useEffect(() => {
   
    dispatch(setScreenLoading(true));

    if (project.quantity_min == project.quantity_max) {
      setCount(project.quantity_min);
    }

    callGetGongweiData();

    dispatch(setScreenLoading(false));
  }, []);

  // useEffect(() => {
  //   countChanged();
  // }, [count]);

  useEffect(() => {
    if (status) {
    
      skuRef.current.focus();
    }
  }, [status])


  useEffect(() => {
    if (commoditySku.indexOf('\n') !== -1) {
      setCommoditySku(commoditySku.replace(/\n/g, ""));
      countRef.current.focus();
    }
  }, [commoditySku]);

  // useEffect(() => {
  //   if (countInputFocus) {
  //     pipei();
  //   }
  // }, [countInputFocus]);

  // useEffect(() => {
  //   if (Number(count) !== 0 && commoditySku != "") {
  //     setStatus(true);
  //   }
  //   else {
  //     setStatus(false);
  //   }
  // }, [count, commoditySku])

  const countChanged = () => {
    if (Number(count) !== 0 && count !== '' && (Number(count) > project.quantity_max || Number(count) < project.quantity_min)) {
      if (quantityClose) {
        SoundObject.playSound('alert');
        Alert.alert(
          PROGRAM_NAME,
          '输入的数量超出设置范围。 是否要输入超出设置范围的数量？',
          [
            { text: '是(Y)', onPress: () => setQuantityClose(false) },
            {
              text: '不(N)',
              onPress: () => {
                setCount('');
                countRef.current.focus();
              },
            },
          ],
          { cancelable: false },
        );
      }
    }
  };

  const callGetGongweiData = () => {
    DB.transaction(tx => {
      tx.executeSql(`SELECT SUM("count") as sumCount FROM ${scandataTb} WHERE gongwei_id = ? AND row = ?`,
        [gongweiPos.id, rowPos],
        (tx, results) => {
          setSumCount(results.rows.item(0).sumCount ?? 0);
        }
      )
    });
    setFirst(true)
  };

  const BackBtnPress = async () => {
    setEndModalOpen(true);
  };

  const screenNavigate = (id) => {
    if (id == 1) {
      props.navigation.push('InventoryMain');
    } else if (id == 2) {
      dispatch(setColumnPos(column));
      dispatch(setSkuCount(skuC));
      props.navigation.push('InventoryLayer');
    } else if (id == 3) {
      dispatch(setColumnPos(column));
      dispatch(setSkuCount(skuC));
      props.navigation.push('InventoryEditData');
    }
  }

  const countInputChange = (e) => {
    var inp = e.nativeEvent.key;
    SoundObject.playSound(inp);
  };

  const pipei = async () => {
    if (commoditySku == '') {
      Alert.alert(
        PROGRAM_NAME,
        '请正确输入SKU和数量置信息。',
        [{ text: '是(OK)', onPress: () => skuRef.current.focus() }],
        { cancelable: false },
      );
    } else {
      if (useZudang == 0) {
        let result = await pipeiSKU(commoditySku, user.id);
        if (result !== null) {
          setPipeiItem(result);
          if (project.quantity_min == project.quantity_max && camera == true) {
            insertRowConfirm(result);
          }
        } else {
          Alert.alert(
            PROGRAM_NAME,
            '条形码不存在',
            [
              { text: '是(Y)', onPress: () => project.quantity_min == project.quantity_max && camera == true && insertRowConfirm() },
              { text: '不(N)', onPress: () => { if (camera) skuRef.current.focus(); } },
            ],
            { cancelable: false },
          );
        }
      }
      else {
        setPipeiItem(null)
        if (project.quantity_min == project.quantity_max && camera == true) {
          insertRowConfirm(null);
          if (camera) skuRef.current.focus();
        }
        else if (camera == false) {
          insertRowConfirm(null);
        }
      }
    }
    setCamera(false);
  }

  const insertRowConfirm = (pipeiItemVal = pipeiItem) => {
    if ((Number(count) === 0 || count === '')) {
      Alert.alert(
        PROGRAM_NAME,
        '数量信息为空。 请输入正确的数量。',
        [{ text: '是(OK)', onPress: () => countRef.current.focus() }],
        { cancelable: false },
      );
    } else {
      insertRow(pipeiItemVal);
      if (!camera) setCommoditySku("")
      // maxSkuCountCheck();
    }
  }

  const insertRow = (pipeiItemVal) => {
    var date = new Date();
    var scantime =
      [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-') +
      ' ' +
      [date.getHours(), date.getMinutes(), date.getSeconds()].join(':');

    DB.transaction((txn) => {
      txn.executeSql(
        `INSERT INTO ${scandataTb} (
          "commodity_sku", 
          "pihao", 
          "codeinput_method", 
          "count", 
          "column", 
          "row", 
          "delete_flag",
          "record_id",
          "scan_time",
          "gongwei_id",
          "commodity_price",
          "upload",
          "commodity_name",
          "color",
          "size"
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
          commoditySku,
          pihao,
          codeInputMethod,
          count,
          column,
          rowPos,
          0,
          uuid.v4(),
          scantime,
          gongweiPos.id,
          pipeiItemVal?.commodity_price,
          "new",
          pipeiItemVal?.commodity_name,
          pipeiItemVal?.color_code,
          pipeiItemVal?.size_code
        ],
        (txn, results) => {
          setPipeiItem(null);
          if (camera) setCommoditySku('');
          setCount(project.quantity_min == project.quantity_max ? project.quantity_min : '');
          setQuantityClose(true);
          let colu = column + 1;
          setColumn(colu)
        },
      );
      txn.executeSql(`SELECT SUM("count") as sumCount FROM ${scandataTb} WHERE gongwei_id = ? AND row = ?`,
        [gongweiPos.id, rowPos],
        (txn, results) => {
          setSumCount(results.rows.item(0).sumCount ?? 0);
          setStatus(true);
        }
      );
    });
  };

  const maxSkuCountCheck = () => {
    if (Number(skuCount) == Number(project.max_sku)) {
      Alert.alert(
        PROGRAM_NAME,
        '您已经对' + skuCount + '个SKU进行了盘点。 您想继续吗？',
        [{ text: 'OK', onPress: () => { } }],
        { cancelable: false },
      );
    }
  };

  const skuScanOKFunc = (val) => {
    setCamera(true);

    setCommoditySku(val);
    setCodeInputMethod(SCAN_INPUT);
    countRef.current.focus();
    setScanScreen(false);
  }

  const skuScanCancelFunc = () => {
    skuRef.current.focus();
    setScanScreen(false);
  }

  const skuHandFunc = async (val) => {
    await setCommoditySku(val);
  }

  const countCalFunc = (val) => {
    setCount(val);
    setCalScreen(false);
  }



  return (
    <>
      {calScreen && <CalculatorScreen closeCal={countCalFunc} cancel={() => setCalScreen(false)} />}
      {scanScreen && <QRcodeScanScreen skuScanOK={skuScanOKFunc} skuScanCancel={skuScanCancelFunc} />}
      <View style={{ position: 'relative', height: Dimensions.get('window').height }}>
        <Header {...props} BtnPress={BackBtnPress} title={'盘点'} />

        <ScrollView style={{ flex: 1 }}>
          <View style={{ justifyContent: 'center', flexDirection: 'row', paddingHorizontal: 30, paddingVertical: 10 }}>
            <Text style={CStyles.TextStyle}>SKU:</Text>
            <TextInput
              ref={skuRef}
              value={commoditySku}
              autoFocus={false}
              onBlur={() => setSkuInputFocus(false)}
              onFocus={() => setSkuInputFocus(true)}
              onChangeText={skuHandFunc}
              placeholder={''}
              selectTextOnFocus={true}
              style={CStyles.InputStyle}
              multiline={false}
              blurOnSubmit={false}
              onKeyPress={async ({ nativeEvent }) => {
                // console.log("3333333333333333333")
                if (nativeEvent.key == 'Enter' && status) {
                  setCamera(true);
                  setStatus(false)
                  if (useZudang == 0) {
                    let result = await pipeiSKU(commoditySku, user.id);
                    if (result !== null) {
                      setPipeiItem(result);
                      if (project.quantity_min == project.quantity_max && camera == true) {
                        insertRow(result);
                      }
                    } else {
                      Alert.alert(
                        PROGRAM_NAME,
                        '条形码不存在',
                        [
                          { text: '是(Y)', onPress: () => project.quantity_min == project.quantity_max && camera == true && insertRowConfirm() },
                          { text: '不(N)', onPress: () => { if (camera) skuRef.current.focus(); } },
                        ],
                        { cancelable: false },
                      );
                      insertRow(null)
                    }
                  }
                  else {
                    insertRow(null)
                  }
                }
              }}
            />
            <Button
              disabled={false}
              ButtonTitle={'匹配'}
              BtnPress={pipei}
              type={'blueBtn'}
              BTnWidth={100}
            />
          </View>
          <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
            <Button
              disabled={false}
              ButtonTitle={'扫描'}
              BtnPress={() => setScanScreen(true)}
              type={'yellowBtn'}
              BTnWidth={300}
            />
          </View>
          <View style={{ justifyContent: 'center', flexDirection: 'row', paddingHorizontal: 30, paddingVertical: 10 }}>
            <Text style={CStyles.TextStyle}>数量:</Text>
            <TextInput
              ref={countRef}
              value={count.toString()}
              keyboardType={'numeric'}
              autoFocus={false}
              onBlur={() => setCountInputFocus(false)}
              onFocus={() => setCountInputFocus(true)}
              onChangeText={(val) => setCount(val.replace(/[^0-9]/g, ''))}
              placeholder={''}
              onKeyPress={countInputChange}
              style={CStyles.InputStyle}
            />
            <Button
              disabled={false}
              ButtonTitle={'计算机'}
              BtnPress={() => setCalScreen(true)}
              type={'yellowBtn'}
              BTnWidth={100}
            />
          </View>
          <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
            <Button
              disabled={false}
              ButtonTitle={'记录数据'}
              BtnPress={() => pipei()}
              type={'yellowBtn'}
              BTnWidth={300}
            />
          </View>
          <View style={{ marginTop: 20 }}>
            <View style={styles.container}>
              <Text style={{ ...styles.cell, flex: 1 }}>商品名称</Text>
              <Text style={{ ...styles.cell, flex: 3 }}>{pipeiItem?.commodity_name}</Text>
            </View>
            <View style={styles.container}>
              <Text style={{ ...styles.cell, flex: 1 }}>价搭</Text>
              <Text style={{ ...styles.cell, flex: 3 }}>{pipeiItem ? (parseFloat(pipeiItem?.commodity_price).toFixed(2).toString()) + '元' : ''}</Text>
            </View>
            <View style={styles.container}>
              <Text style={{ ...styles.cell, flex: 1 }}>类别No</Text>
              <Text style={{ ...styles.cell, flex: 3 }}>{pipeiItem?.major_code}</Text>
            </View>
            <View style={styles.container}>
              <Text style={{ ...styles.cell, flex: 1 }}>类别名</Text>
              <Text style={{ ...styles.cell, flex: 3 }}>{pipeiItem?.a_category_name}</Text>
            </View>
            <View style={styles.container}>
              <Text style={{ ...styles.cell, flex: 1 }}>规格</Text>
              <Text style={{ ...styles.cell, flex: 3 }}>{pipeiItem?.size_code}</Text>
            </View>
            <View style={styles.container}>
              <Text style={{ ...styles.cell, flex: 1 }}>单位</Text>
              <Text style={{ ...styles.cell, flex: 3 }}>{pipeiItem?.unit}</Text>
            </View>
            <View style={styles.container}>
              <Text style={{ ...styles.cell, flex: 1 }}>颜色</Text>
              <Text style={{ ...styles.cell, flex: 3 }}>{pipeiItem?.color_code}</Text>
            </View>

            <View style={{ justifyContent: 'center', marginTop: 20 }}>
              <View
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: 25,
                }}
              >
                <Text style={{ fontSize: 14, color: "black" }}>
                  区域: {gongweiPos.pianqu}
                </Text>
                <Text style={{ fontSize: 14, color: "black" }}>
                  工位: {gongweiPos.gongwei?.toString().padStart(project.gongwei_max, "0")}
                </Text>
                <Text style={{ fontSize: 14, color: "black" }}>
                  当前层: {rowPos}
                </Text>
              </View>
              <View
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginTop: 20,
                  paddingHorizontal: 25,
                }}
              >
                <Text style={{ flex: 1, fontSize: 12, color: "black" }}>
                  当前层汇总：
                </Text>
                <Text style={{ flex: 1, fontSize: 12, color: "black" }}>
                  {columnPos} 条
                </Text>
                <Text style={{ flex: 1, fontSize: 12, color: "black" }}>
                  {sumCount} 件
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
        <FooterBar1 screenNavigate={screenNavigate} activeBtn={1} />


        {endModalOpen && (
          <InvEndModal setEndModalOpen={setEndModalOpen} navigation={props.navigation} />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
  },

  cell: {
    height: 25,
    lineHeight: 25,
    borderWidth: 1,
    borderColor: '#9f9f9f',
    backgroundColor: '#f1f8ff',
    fontSize: 10,
    textAlign: 'center',
    color: "black"
  },
});

export default InventoryMain;
