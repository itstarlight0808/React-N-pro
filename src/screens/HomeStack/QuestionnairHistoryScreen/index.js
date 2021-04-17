import React, { Component } from 'react';
import {
  View,
  Image,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Text,
  Alert,
  RefreshControl,
  ScrollView,
  Platform,
  StatusBar,
  TextInput,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import Preference from 'react-native-preference';
import moment from 'moment';
import { connectRealm } from 'react-native-realm';

//components
import Header from '../../../components/Header';
import Loader from '../../../components/Loader';
import FloatingLabelInputField from '../../../components/FloatingLabelInputField';

//utils
import colors from '../../../utils/colors';
import preferenceKeys from '../../../utils/preferenceKeys';
import { BASE_URL, requestGetWithToken, requestPost } from '../../../utils/API';
import images from '../../../assets/images';
import icons from '../../../assets/icons';
import {sentryMessage} from "../../../utils/utils";

const { width } = Dimensions.get('window');

class QuestionnairHistoryScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      isFetching: false,
      appointments: [],
      searchText:'',
      clientArray: [],
      clientArrayTemp: [],
      facilityArray: [],
      facilitySelectionArray: [],
      ClientSelectionArray: [],
    };
  }
  textInput;

  componentDidMount() {
    const { navigation } = this.props;
	  sentryMessage('QHS mount');

	  this.onFocusListener = navigation.addListener('focus', () => {
      if (this.textInput) {
        this.textInput.clear();
      }
        this.getQuestionsFromDB();
    });
  }
  componentWillUnmount() {
    if (this.onFocusListener) {
      this.onFocusListener();
    }
  }
  getQuestionsFromDB() {
    console.log('fetching');
    let temp = this.props.realm.objects('Questions');
    let newArray = [];
    temp.forEach((p, i) => {
      const {
        title: clientName,
        questionDate: date,
        facility,
        apiData: question,
      } = JSON.parse(p.questions);
      const existingClient = newArray.find((c) => c.clientName === clientName);
      if (existingClient) {
        const existingFacility = existingClient.facility.find(
          (f) => f.facility === facility
        );
        if (existingFacility) {
          const existingDate = existingFacility.date.find(
            (d) =>
              moment(d.date).format('YYYY-MM-DD') ===
              moment(date).format('YYYY-MM-DD')
          );
          if (existingDate) {
            existingDate.question.push({question, date});
          } else {
            existingFacility.date.push({date, question: [{question, date}]});
          }
        } else {
          existingClient.facility.push({
            facility,
            date: [{date, question: [{question, date}]}],
          });
        }
      } else {
        newArray.push({
          id: i,
          clientName,
          facility: [{facility, date: [{date, question: [{question, date}]}]}],
        });
      }
    });
    console.log('fetching done');
	  sentryMessage('QHS',{length:temp.length});
	  // console.log(newArray);
    // for (let i = 0; i < temp.length; i++) {
    //   console.log(JSON.parse(temp[i].questions).title);
    //   // console.log('hamza', JSON.parse(temp[i].questions).facility);
    //   newArray.push({
    //     id: i,
    //     date: [{date: JSON.parse(temp[i].questions).questionDate}],
    //     clientName: JSON.parse(temp[i].questions).title,
    //     question: JSON.parse(temp[i].questions).apiData,
    //     facility: JSON.parse(temp[i].questions).facility,
    //   });
    // }
    // newArray = newArray.filter(
    //   (item, index, self) =>
    //     self.map((t) => t.clientName).indexOf(item.clientName) == index,
    // );
    // for (let i = 0; i < newArray.length; i++) {
    //   for (let j = 0; j < temp.length; j++) {
    //     if (newArray[i].clientName == JSON.parse(temp[j].questions).title) {
    //       if (
    //         moment(newArray[i].date[0].date).format('YYYY-MM-DD') !=
    //         moment(JSON.parse(temp[j].questions).questionDate).format(
    //           'YYYY-MM-DD',
    //         )
    //       ) {
    //         newArray[i].date.push({
    //           date: JSON.parse(temp[j].questions).questionDate,
    //         });
    //       }
    //     }
    //   }
    // }
    // console.log("Filtered Data",value)
    this.setState({clientArray: newArray, clientArrayTemp: newArray});
    if (this.state.searchText?.length > 1) {
      this.searchFilterFunction(this.state.searchText);
    }
  }

  renderItem = ({item, index}) => {
    // console.log(item);
    let tempArray = this.state.clientArray;
    return (
      <View>
        {(index == 0 ||
          tempArray[index].clientName !== tempArray[index - 1].clientName) && (
          <View>
            <TouchableOpacity
              onPress={() => {
                // this.setState({
                //   facilityArray: [
                //     {
                //       id: 1,
                //       facility: item.facility,
                //       question: item.question,
                //       date: item.date,
                //     },
                //   ],
                // });
                tempArray[index].selected = !item.selected;
                this.setState({clientArray: tempArray});
                // const tempCleints = this.state.ClientSelectionArray;
                // const id = item.facility + item.clientName + item.date;
                // const selectedCLient = tempCleints.find((s) => s.id === id);
                // if (selectedCLient) {
                //   selectedCLient.selected = !selectedCLient.selected;
                // } else {
                //   tempCleints.push({id, selected: true});
                // }
                // this.setState({ClientSelectionArray: tempCleints});
              }}
              style={styles.barView}>
              <Text style={{textAlign: 'center'}}>{item.clientName}</Text>
            </TouchableOpacity>
            {item.selected && (
              <View>
                <FlatList
                  listKey={'Facilities_' + moment().format('x')}
                  data={item.facility}
                  extraData={{testIndex: index}}
                  renderItem={this.renderItemFacilities}
                  //   keyExtractor={(item, index) => `${item.title}_${index}`}
                  contentContainerStyle={{}}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            )}
          </View>
        )}
      </View>
    );
  };
  renderItemFacilities = ({item, index}) => {
    // console.log(item);
    // let Array = this.state.facilityArray;
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            // this.setState({
            //   appointments: item.date,
            // });
            const tempFacilities = this.state.facilitySelectionArray;
            const id = item.facility + item.clientName;
            const selectedFacility = tempFacilities.find((s) => s.id === id);
            if (selectedFacility) {
              selectedFacility.selected = !selectedFacility.selected;
            } else {
              tempFacilities.push({id, selected: true});
            }
            item.selected = !item.selected;
            // this.setState({facilityArray: Array});
            this.setState({facilitySelectionArray: tempFacilities});
          }}
          style={styles.barView2}>
          <Text>
            {item.facility + this.state.facilitySelectionArray.length}
          </Text>
        </TouchableOpacity>
        {item.selected && (
          <View>
            <FlatList
              listKey={moment().format('x') + 'Facilities'}
              data={item.date}
              renderItem={this.renderItemQuestions}
              //   keyExtractor={(item, index) => `${item.title}_${index}`}
              contentContainerStyle={{}}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}
      </View>
    );
  };
  renderItemQuestions = ({item, index}) => {
    // console.log(item);
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.navigation.navigate('NoOFQuestionAnswered', {
            questions: item.question,
          });
        }}
        style={styles.barView3}>
        <Text>{moment(item.date).format('YYYY-MM-DD')}</Text>
      </TouchableOpacity>
    );
  };
  searchFilterFunction = (text) => {
    let temp = this.state.clientArray;
    let newTemp = [];
    if (text !== '') {
      newTemp = temp.filter((item) => {
        return ((item.facility.some(p => p.facility.toLowerCase().indexOf((text + "").toLowerCase()) >= 0)))
          // ||
          // (('+' + item.callingCode[0]).toLowerCase().indexOf((text + "").toLowerCase()) >= 0)
          ||
          ((item.clientName).toLowerCase().indexOf((text + "").toLowerCase()) >= 0)
      })
    }

    this.setState({
      clientArrayTemp: newTemp,
    });

    if (text.length < 1) {
      this.setState({
        clientArrayTemp: temp,
      });
    }

  };
  render() {
    const { loading } = this.state;
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
          hearderText={`Questionnaire History`}
          containerStyle={{ backgroundColor: colors.lightBlue }}
          leftIcon={icons.menuIcon}
          leftButtonIconStyle={{ tintColor: colors.white, height: 22 }}
          onLeftAction={() => {
            navigation.openDrawer();
          }}
        />
        <View style={{ flex: 1 }}>
          <View>
            <TextInput
              placeholder="Search"
              ref={input => { this.textInput = input }}
              placeholderTextColor={colors.lightBlue}
              style={styles.searchBox}
              onChangeText={(text) => this.searchFilterFunction(text)}
            />
          </View>
          <ScrollView>
            <FlatList
              listKey={'Clients_' + moment().format('x')}
              data={this.state.clientArrayTemp}
              renderItem={this.renderItem}
              //   keyExtractor={(item, index) => `${item.title}_${index}`}
              contentContainerStyle={{}}
              showsVerticalScrollIndicator={false}
            />
          </ScrollView>
          <Loader loading={loading} />
        </View>
      </SafeAreaView>
    );
  }
}
export default connectRealm(QuestionnairHistoryScreen, {
  schemas: ['Questions'],
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
  itemStyle: {
    flexDirection: 'row',
    width: '70%',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    height: 60,
    borderBottomWidth: 1,
  },
  searchBox: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: 'black',
    marginVertical: 10,
    color: colors.lightBlue,
    textAlign: 'center',
  },
  barView: {
    width: '90%',
    height: 60,
    backgroundColor: colors.lightBlue,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    borderBottomLeftRadius: 20,
    marginRight: 10,
    // marginHorizontal:20
  },
  barView2: {
    width: '80%',
    height: 50,
    backgroundColor: colors.orange,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    borderTopEndRadius: 20,
    // borderTopStartRadius:20,
    borderBottomLeftRadius: 20,
    marginRight: 10,
    // marginHorizontal: 20,
  },
  barView3: {
    width: '70%',
    height: 50,
    backgroundColor: colors.lightBlue,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    borderTopEndRadius: 20,
    borderBottomLeftRadius: 20,
    marginRight: 10,
  },
});
