import React, { Component } from 'react';
import {
  View,
  Image,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Alert,
  TouchableOpacity,
  Text,
  Platform,
  StatusBar,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import DatePicker from 'react-native-date-picker';
import Preference from 'react-native-preference';
import moment from 'moment';
import NetInfo from '@react-native-community/netinfo';
import { connectRealm } from 'react-native-realm';

//components
import Header from '../../../components/Header';
import Loader from '../../../components/Loader';
import FloatingLabelInputField from '../../../components/FloatingLabelInputField';

//utils
import preferenceKeys from '../../../utils/preferenceKeys';
import colors from '../../../utils/colors';
import images from '../../../assets/images';
import icons from '../../../assets/icons';

import { requestPost, BASE_URL } from '../../../utils/API';
import { color } from 'react-native-reanimated';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';



let i = 0;
let newArray = [];

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      markedDays: {},
      date: '',
      appointments: [],
      timestamp: new Date(),
      showDatePicker: false,
      dateSelected: moment().format('YYYY-MM-DD'),
      width: { width } = Dimensions.get('window')
    };
    const { navigation } = this.props;
    this.onFocusListener = navigation.addListener('focus', () => {
      this.checkInternet();
    });
  }

  componentDidMount() {
    const { realm } = this.props;
    let temp = realm.objects('Questions');
    NetInfo.fetch().then(async (state) => {
      if (state.isConnected && temp.length > 0) {
        await this.uploadDataApi(temp);
      }
    });
  }

  uploadDataApi = (temp) => {
    const { realm } = this.props;
    // console.log(i);
    let length = temp.length;
    if (i < length) {
      let apiHitData = JSON.parse(temp[i].questions[0])||{};
      if (!apiHitData.onlineStatus) {
        const clientId = Preference.get(preferenceKeys.CLIENT_ID);
        const bodyDetails = {
          SERVICE: 'SetData',
          CLIENTID: clientId,
          APPID: 1001,
          OBJECT: 'CRMCUSNAIRE',
          KEY: '',
          FORM: 'GENERALQSTR',
          DATA: { CRMCUSNAIRE: apiHitData.CRMCUSNAIRE },
        };
        requestPost(BASE_URL, JSON.stringify(bodyDetails)).then((response) => {
          if (response.success) {
            // console.log('IN Question APi');
            const bodyDetails = {
              SERVICE: 'SetData',
              CLIENTID: clientId,
              APPID: 1001,
              OBJECT: 'SOMEETING',
              KEY: apiHitData.CRMCUSNAIRE[0].CCCSOACTION,
              FORM: 'Πρόγραμμα Εγκαταστάσεων',
              DATA: {
                SOACTION: [
                  {
                    NUM04: response.id,
                    ACTSTATUS: 3,
                    Date04: apiHitData.date,
                    Date05: moment().format('YYYY-MM-DD HH:mm'),
                  },
                ],
              },
            };
            requestPost(BASE_URL, JSON.stringify(bodyDetails)).then(
              (response) => {
                if (response.success) {
                  let tempArray = apiHitData;
                  tempArray.onlineStatus = true;
                  newArray.push(tempArray);
                  i++;
                  this.uploadDataApi(temp);
                }
              },
            );
          }
        });
      } else {
        let tempArray = apiHitData;
        tempArray.onlineStatus = true;
        newArray.push(tempArray);
        i++;
        this.uploadDataApi(temp);
      }
    } else {
      realm.write(() => {
        realm.delete(realm.objects('Questions'));
      });
      for (let i = 0; i < newArray.length; i++) {
        realm.write(() => {
          let appointment = realm.create('Questions', { questions: [] });
          appointment.questions.push(JSON.stringify(newArray[i]));
        });
      }
    }
  };

  updateStatus = (clientId, CCCSOACTION, responseId, date) => {
    const bodyDetails = {
      SERVICE: 'SetData',
      CLIENTID: clientId,
      APPID: 1001,
      OBJECT: 'SOMEETING',
      KEY: CCCSOACTION,
      FORM: 'Πρόγραμμα Εγκαταστάσεων',
      DATA: {
        SOACTION: [
          {
            NUM04: responseId,
            ACTSTATUS: 3,
            Date04: date,
            Date05: moment().format('YYYY-MM-DD HH:mm'),
          },
        ],
      },
    };
    requestPost(BASE_URL, JSON.stringify(bodyDetails)).then((response) => {
      if (response.success) {
        // console.log('IN RESPONSE Status');
      }
    });
  };

  checkInternet() {
    NetInfo.fetch().then((state) => {
      this.dataFetching(state.isConnected);
    });
  }
  dataFetching(isConnected) {
    if (isConnected) {
      this.getAppointments();
    } else {
      this.getAppointmentsFromDB();
    }
  }
  componentWillUnmount() {
    this.onFocusListener = null;
  }
  getAppointmentsFromDB() {
    let temp = this.props.realm.objects('HomeDates')[0].appointments[0];
    // console.log("Local DB Data",temp)
    let markedDates = this.getMarkedDates(JSON.parse(temp));
    this.setState({ appointments: JSON.parse(temp), markedDays: markedDates });
  }
  getAppointments = () => {
    const clientId = Preference.get(preferenceKeys.CLIENT_ID);
    Preference.get(preferenceKeys.AUTHENTICATED);
    const bodyDetails = {
      service: 'getBrowserInfo',
      clientID: clientId,
      appId: '1001',
      object: 'SOMEETING',
      list: 'SOneP',
      start: '0',
      limit: '100000',
    };
    this.setState({ loading: true });
    requestPost(BASE_URL, JSON.stringify(bodyDetails))
      .then((response) => {
        this.setState({ loading: false });
        // console.log('API', 'requestPost-response', response.columns);
        if (response.success) {
          // console.log('getAppointments', 'response', response.rows);
          let markedDates = this.getMarkedDates(response.rows);
          this.setState({ appointments: response.rows, markedDays: markedDates });
          this.storeInLocalDB(response.rows);
          this.storeColumn(response.columns);
        } else {
          Alert.alert(null, response.error);
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
        console.log('getAppointments', 'error', error);
        Alert.alert(null, 'Something went wrong');
      });
  };
  storeInLocalDB = (data) => {
    const { realm } = this.props;
    realm.write(() => {
      realm.delete(realm.objects('HomeDates'));
    });
    realm.write(() => {
      realm.create('HomeDates', { appointments: [JSON.stringify(data)] });
    });
  };
  storeColumn = (data) => {
    const { realm } = this.props;
    let newArray = [];
    newArray.push('');
    for (let i = 0; i < data.length; i++) {
      newArray.push(data[i].header);
    }
    realm.write(() => {
      realm.delete(realm.objects('Columns'));
    });
    realm.write(() => {
      realm.create('Columns', { ColumnsData: [JSON.stringify(newArray)] });
    });
  };

  getMarkedDates = (appointments) => {
    let markedDates = {};
    let prevItem = [-1, -1, '1980-01-01 00:00:00'];
    let preSameItems = [];
    let preColor = [];
    let preDate = '1980-01-01';
    appointments?.map(async (item, index) => {
      const dateString = moment(item[2], 'YYYY-MM-DD hh:mm:ss').format(
        'YYYY-MM-DD',
      );
      const itemStatus = item[18];
      // console.log('itemStatus', dateString, itemStatus)
      let dotColor =
        itemStatus == 1 || itemStatus == 2
          ? colors.green
          : itemStatus == 3
            ? colors.blue
            : itemStatus == 4
              ? colors.red
              : itemStatus == 6
                ? colors.orange
                : colors.green;
      if (
        moment(prevItem[2], 'YYYY-MM-DD hh:mm:ss').format('YYYY-MM-DD') !=
        dateString
      ) {
        if (preSameItems.length > 1) {
          let updatedColor = preColor;
          let counterComplete = 0;
          let counterCanceled = 0;
          preSameItems.map((subItem) => {
            const subItemstatus = subItem[18];
            if (subItemstatus == 1 || subItemstatus == 2)
              updatedColor = colors.green;
            else if (subItemstatus == 3) counterComplete++;
            else if (subItemstatus == 4) counterCanceled++;
          });
          if (counterComplete == preSameItems.length)
            updatedColor = colors.blue;
          if (counterCanceled == preSameItems.length) updatedColor = colors.red;
          markedDates = {
            ...markedDates,
            [preDate]: {
              selected: true,
              marked: true,
              selectedColor: updatedColor,
            },
            [dateString]: {
              selected: true,
              marked: true,
              selectedColor: dotColor,
            },
          };
          preSameItems = [];
          preSameItems.push(item);
          prevItem = item;
          preColor = dotColor;
          preDate = dateString;
        } else {
          markedDates = {
            ...markedDates,
            [dateString]: {
              selected: true,
              marked: true,
              selectedColor: dotColor,
            },
          };
          preSameItems = [];
          preSameItems.push(item);
          prevItem = item;
          preColor = dotColor;
          preDate = dateString;
        }
      } else {
        preSameItems.push(item);
      }
    });

    return markedDates;
  };

  onDaySelect = (day) => {
    const { navigation } = this.props;
    const { appointments, markedDays, selectedDate } = this.state;
    let appointmentTemp = appointments.find(
      (item, index) =>
        day.dateString ==
        moment(item[2], 'YYYY-MM-DD hh:mm:ss').format('YYYY-MM-DD'),
    );
    if (appointmentTemp?.length > 0) {
      this.setState({
        date: day.dateString,
        selectedDate: day.dateString,
        dateSelected: day.dateString,
        timestamp: day.timestamp,
      });
      navigation.navigate('DateAppointments', { date: day.dateString });
    } else {
      let markedDates = this.getMarkedDates(appointments);
      this.setState({
        date: day.dateString,
        markedDays: {
          ...markedDays,
          [day.dateString]: {
            selected: true,
            marked: true,
            selectedColor: '#00000050',
          },
          [selectedDate]: { selected: false, marked: false },
          ...markedDates,
        },
        selectedDate: day.dateString,
        dateSelected: day.dateString,
        timestamp: day.timestamp,
      });
    }
  };

  onDateConfirmed = () => {
    const { appointments, markedDays, selectedDate, dateSelected } = this.state;
    let markedDates = this.getMarkedDates(appointments);
    this.setState({
      showDatePicker: false,
      date: dateSelected,
      markedDays: {
        ...markedDays,
        [dateSelected]: {
          selected: true,
          marked: true,
          selectedColor: '#00000050',
        },
        [selectedDate]: { selected: false, marked: false },
        ...markedDates,
      },
      selectedDate: dateSelected,
      timestamp: parseInt(moment(dateSelected, 'YYYY-MM-DD').format('x')),
    });
  };

  render() {
    const {
      loading,
      markedDays,
      date,
      showDatePicker,
      dateSelected,
      timestamp,
    } = this.state;
    const { navigation } = this.props;
    return (
      <SafeAreaView style={styles.container}>
        <View
          style={{
            height: 60,
            width: '100%',
            justifyContent: 'flex-end',
            marginTop: Platform.OS == 'android' ? StatusBar.currentHeight : 0,
          }}>
          <Image
            style={{ width: 120, height: 35, resizeMode: 'contain' }}
            source={images.logoImage}
          />
        </View>
        <Header
          hearderText={"Appointments' Calendar"}
          containerStyle={{ backgroundColor: colors.lightBlue }}
          leftIcon={icons.menuIcon}
          onLeftAction={() => {
            navigation.openDrawer();
          }}
        />
        <View style={{ flex: 1 }}>
          <KeyboardAwareScrollView
            innerRef={ref => { this.scroll = ref }}
            // bounces={false}
            // keyboardShouldPersistTaps='handled'
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            extraHeight={200}
            contentContainerStyle={{ flexGrow: 1 }}
            style={{ flexGrow: 1, width: '100%' }}>
            <FloatingLabelInputField
              hideLabel={true}
              value={date}
              editable={false}
              placeholder={moment().format('YYYY-MM-DD')}
              autoCapitalize={'none'}
              inputContainer={{
                marginTop: 0,
                borderWidth: 3,
                borderRadius: 0,
                paddingRight: 5,
              }}
              onChangeText={(text) => {
                this.setState({ date: text });
              }}
              rightIcon={icons.calendarIcon}
              onRightIconPress={() => {
                this.setState({ showDatePicker: true });
              }}
            />

            <Calendar
              key={moment().format('x').toString()}
              style={{ width: '100%' }}
              current={new Date(timestamp)}
              markingType={'multi-dot'}
              // minDate={new Date()}
              firstDay={1}
              onDayPress={this.onDaySelect}
              markedDates={markedDays}
              hideExtraDays={true}
              theme={{
                backgroundColor: colors.white,
                calendarBackground: colors.white,
                selectedDayBackgroundColor: '#73A803',
                selectedDayTextColor: 'white',
                todayTextColor: 'green',
                dayTextColor: 'black',
                textDisabledColor: '#ACACAC',
                textSectionTitleColor: 'black',
                arrowColor: 'black',
                monthTextColor: 'black',
                textDayFontSize: 16,
                textMonthFontSize: 18,
                textDayHeaderFontSize: 16,
                dotColor: '#73A803',
                'stylesheet.calendar.header': {
                  header: {
                    backgroundColor: colors.white,
                    color: 'black',
                    flexDirection: 'row',
                    height: 60,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  },
                },
              }}
            />
            {showDatePicker && (
              <View style={[styles.datePickerContainer]}>
                <View
                  style={[
                    {
                      backgroundColor: 'white',
                      width: '100%',
                      borderTopLeftRadius: 10,
                      borderTopRightRadius: 10,
                      alignItems: 'center',
                    },
                    styles.shadowElevation,
                  ]}>
                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                      height: 55,
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={[{ flex: 1, marginRight: 5 }, styles.datePickerButton]}
                      onPress={() => {
                        this.setState({
                          showDatePicker: false,
                          dateSelected: date,
                        });
                      }}>
                      <Text style={{ color: 'red' }}>{'Cancel'}</Text>
                    </TouchableOpacity>
                    <View
                      style={{
                        height: 30,
                        width: 1,
                        backgroundColor: colors.primary,
                      }}
                    />
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={[{ flex: 1, marginLeft: 5 }, styles.datePickerButton]}
                      onPress={() => {
                        this.onDateConfirmed();
                      }}>
                      <Text style={{ color: colors.primary }}>{'Confirm'}</Text>
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      borderBottomColor: 'grey',
                      borderBottomWidth: 1,
                      width: '90%',
                    }}
                  />
                  <View
                    style={{
                      width: '100%',
                      alignItems: 'center',
                      overflow: 'hidden',
                    }}>
                    <DatePicker
                      mode={'date'}
                      date={new Date(dateSelected)}
                      minimumDate={new Date('1997-01-01')}
                      onDateChange={(date) => {
                        // console.log('date', date);
                        const dateSelected = moment(date).format('YYYY-MM-DD');
                        // console.log('dateSelected', dateSelected);
                        this.setState({ dateSelected: dateSelected });
                      }}
                    />
                  </View>
                </View>
              </View>
            )}
          </KeyboardAwareScrollView>
          <Loader loading={loading} />
        </View>
      </SafeAreaView>
    );
  }
}
export default connectRealm(HomeScreen, {
  schemas: ['HomeDates', 'Columns'],
  mapToProps(results, realm, ownProps) {
    return {
      realm,
    };
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundGrey,
    width: '100%',
  },
  datePickerContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
    // borderRadius: 20,
    // backgroundColor: colors.lightGrey,
  },
  datePickerButton: {
    flexDirection: 'row',
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  shadowElevation: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10.84,

    elevation: 5,
  },
});
