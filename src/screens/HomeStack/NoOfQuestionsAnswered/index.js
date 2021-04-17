import React, {Component} from 'react';
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
  Platform,
  StatusBar,
  TextInput,
} from 'react-native';
import {Calendar} from 'react-native-calendars';
import Preference from 'react-native-preference';
import moment from 'moment';
import {connectRealm} from 'react-native-realm';

//components
import Header from '../../../components/Header';
import Loader from '../../../components/Loader';
import FloatingLabelInputField from '../../../components/FloatingLabelInputField';

//utils
import colors from '../../../utils/colors';
import preferenceKeys from '../../../utils/preferenceKeys';
import {BASE_URL, requestGetWithToken, requestPost} from '../../../utils/API';
import images from '../../../assets/images';
import icons from '../../../assets/icons';

const {width} = Dimensions.get('window');

class QuestionnairHistoryScreen extends Component {
  constructor(props) {
    super(props);
    const { params } = props.route
    this.state = {
      loading: false,
      isFetching: false,
      appointments: [],
      clientArray: params.questions,
      clientArrayTemp: params.questions,
      facilityArray: [],
      date:params.date
    };
  }

  componentDidMount() {
    // this.getQuestionsFromDB();
  }
  getQuestionsFromDB() {
    let temp = this.props.realm.objects('Questions');
    let newArray = [];
    for (let i = 0; i < temp.length; i++) {
      // console.log('hamza', JSON.parse(temp[i].questions).date);
      if(moment(this.state.date).format('YYYY-MM-DD') == moment(JSON.parse(temp[i].questions)?.questionDate).format('YYYY-MM-DD'))
      newArray.push({
        id: i,
        date: JSON.parse(temp[i].questions)?.questionDate,
        clientName: JSON.parse(temp[i].questions)?.title,
        question: JSON.parse(temp[i].questions)?.apiData,
        facility: JSON.parse(temp[i].questions)?.facility,
        // clientName: JSON.parse(temp[i].questions).CRMCUSNAIRE[0].CCCSOACTION
        //   ? JSON.parse(temp[i].questions).CRMCUSNAIRE[0].CCCSOACTION
        //   : '',
      });
    }
    // }
    this.setState({clientArray: newArray, clientArrayTemp: newArray});
  }
  renderItem = ({item, index}) => {
    let tempArray = this.state.clientArray;
    const {title} = item;
    return (
      <View>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('QuestionAnswer', {
                  questions: item.question,
                });
              }}
              style={styles.barView}>
              <Text style={{textAlign: 'center'}}>{moment(item.date).format('YYYY-MM-DD hh:mm A')}</Text>
            </TouchableOpacity>
            {/* {item.selected == true && (
              <View>
                <FlatList
                  listKey={'Facilities_' + moment().format('x')}
                  data={this.state.facilityArray}
                  renderItem={this.renderItemFacilities}
                  //   keyExtractor={(item, index) => `${item.title}_${index}`}
                  contentContainerStyle={{}}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            )} */}
      </View>
    );
  };
  // renderItemFacilities = ({item, index}) => {
  //   let Array = this.state.facilityArray;
  //   return (
  //     <View>
  //       <TouchableOpacity
  //         onPress={() => {

  //         }}
  //         style={styles.barView2}>
  //         <Text>{item.facility}</Text>
  //       </TouchableOpacity>
  //     </View>
  //   );
  // };
  render() {
    const {loading} = this.state;
    const {navigation} = this.props;
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
            style={{width: 120, height: 35, resizeMode: 'contain'}}
            source={images.logoImage}
          />
        </View>
        <Header
          hearderText={moment(this.state.date).format('YYYY-MM-DD')}
          containerStyle={{backgroundColor: colors.lightBlue}}
          leftIcon={icons.backArrowIcon}
          leftButtonIconStyle={{tintColor: colors.white, height: 22}}
          onLeftAction={() => {
            navigation.goBack();
          }}
        />
        <View style={{flex: 1}}>
          <View>
            <FlatList
              listKey={'Clients_' + moment().format('x')}
              data={this.state.clientArrayTemp}
              renderItem={this.renderItem}
              //   keyExtractor={(item, index) => `${item.title}_${index}`}
              contentContainerStyle={{}}
              showsVerticalScrollIndicator={false}
            />
          </View>
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
