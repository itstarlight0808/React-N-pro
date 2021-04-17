import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    Alert,
    StyleSheet,
    ScrollView,
    Platform,
    StatusBar
} from 'react-native';
import Preference from 'react-native-preference';
import NetInfo from '@react-native-community/netinfo';
import {connectRealm} from 'react-native-realm';
import moment from 'moment';
import images from '../assets/images';

//Utils
import colors from '../utils/colors';
import preferenceKeys from '../utils/preferenceKeys';
import {requestPost, BASE_URL} from '../utils/API';

//Components
import DrawerItem from './DrawerItem';
import DrawerItemSynced from './DrawerItemSynced';
import {getImages} from "../utils/utils";

let values = 0;
let i = 0;
let newArray = [];

class CompanyDrawerContent extends Component {
    constructor(props) {
        super(props)

        this.state = {
            loadingOnLogout: false,
            loadingOnSync: false,uploadingImage:0,
        }
    }
    componentDidMount() {
        const {navigation} = this.props;
        this.onFocusListener = navigation.addListener('focus', () => {
            values = 0;
        const {realm} = this.props;
        let temp = realm.objects('Questions');
        console.log("length",temp.length)
        for(let i=0;i<temp.length;i++){
            if(!JSON.parse(temp[i].questions[0])?.onlineStatus){
                values ++;
            }
        }
        });
    }
    uploadData () {
        const {realm} = this.props;
    let temp = realm.objects('Questions');
      NetInfo.fetch().then(async (state) => {
      if (state.isConnected && temp.length > 0) {
          if(values == 0) {
            alert("No data to sync");
          } else {
        await this.uploadDataApi(temp);
          }
      } else {
          if(values == 0) {
            alert("No data to sync");
          } else {
          alert("You are offline");
        }
      }
    });
    }
  uploadImages = async (questionImages) => {
    let {uploadingImage} = this.state;
    try {
      for (let {clientId, image, name, key, CCCSOACTION, userId,} of questionImages.filter(p => !!p.image)) {
        uploadingImage++;
        this.setState({uploadingImage});
        console.log(`uploading ${name}`);
        const bodyDetails = {
          SERVICE: 'SetData',
          CLIENTID: clientId,
          APPID: 1001,
          OBJECT: 'CRMCUSNAIRE',
          KEY: key,
          FORM: 'GENERALQSTR',
          DATA: {
            CRMCUSNAIRE: [
              {
                CCCSOACTION,
                USERS: userId,
                [name]: image
              },
            ],
          },
        };
        await requestPost(BASE_URL, JSON.stringify(bodyDetails))
          .then((response) => {
            this.setState({loadingOnCheckout: false});
            console.log('uploadImage', 'API', 'requestPost-response', response);
            if (response.success) {
            } else {
              console.log('uploadImage', 'error', response);
            }
          })
          .catch((error) => {
            // this.setState({ loadingOnCheckout: false });
            console.log('uploadImage', 'error', error);
            // Alert.alert(null, 'Something went wrong');
          });
      }
      console.log('completed image uploading');
    } catch (e) {
      console.log('some error occured',e.message);
      Alert.alert(null, 'Something went wrong');
    }
  };

  uploadDataApi = (temp) => {
        this.setState({loadingOnSync:true})
        const {realm} = this.props;
        // console.log(i);
        let length = temp.length;
        if (i < length) {
          let apiHitData = JSON.parse(temp[i].questions[0]) ||{};
          if (!apiHitData.onlineStatus) {
            const clientId = Preference.get(preferenceKeys.CLIENT_ID);
            const bodyDetails = {
              SERVICE: 'SetData',
              CLIENTID: clientId,
              APPID: 1001,
              OBJECT: 'CRMCUSNAIRE',
              KEY: '',
              FORM: 'GENERALQSTR',
              DATA: {CRMCUSNAIRE: apiHitData.CRMCUSNAIRE},
            };
            requestPost(BASE_URL, JSON.stringify(bodyDetails)).then((response) => {
              if (response.success) {
                const key = response.id;
                // console.log('IN Question APi',response);
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
                      // console.log('IN STATUS CHANGE',response);
                      let tempArray = apiHitData;
                      tempArray.onlineStatus = true;
                      newArray.push(tempArray);
                      i++;
                      const images = getImages(apiHitData.apiData);
	                    const questionImages = Object.keys(images).map(name => ({
		                    userId: Preference.get(preferenceKeys.USER_ID),
		                    name,image:images[name],key,clientId,CCCSOACTION:apiHitData.CRMCUSNAIRE[0].CCCSOACTIO,
		                    uploaded:images[name]?0:1}));

	                    console.log(questionImages.length,'aasdas');
                      this.uploadImages(questionImages)
                        .then(() => this.uploadDataApi(temp));
                    }
                  },
                );
              }
            });
          } else {
            let tempArray = apiHitData;
            newArray.push(tempArray);
            i++;
            this.uploadDataApi(temp);
          }
        } else {
          // console.log('IN realm');
          realm.write(() => {
            realm.delete(realm.objects('Questions'));
          });
          for (let i = 0; i < newArray.length; i++) {
          realm.write(() => {
            let appointment = realm.create('Questions', {questions: []});
              // console.log("hamza",newArray[i]);
              appointment.questions.push(JSON.stringify(newArray[i]));
          })
        }
          values = 0;
          this.setState({loadingOnSync:false})
        }
      };

    render() {
        const { navigation } = this.props
        const { loadingOnLogout, loadingOnSync } = this.state
        return (
            <ScrollView
                bounces={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.drawerContainer}>
                    <View style={{ height: 60, width: '100%', justifyContent: 'flex-end', marginTop: Platform.OS == 'android' ? StatusBar.currentHeight : 0 }}>
                        <Image
                            style={{ width: 120, height: 35, resizeMode: 'contain' }}
                            source={images.logoImage}
                        />
                    </View>
                    <DrawerItem
                        title={'Home'}
                        containerStyle={{}}
                        onPress={() => {
                            navigation.navigate("HomeScreen")
                        }}
                    />
                    <DrawerItem
                        title={'Today\'s Appointments'}
                        onPress={() => {
                            navigation.navigate("TodaysAppointments")
                        }}
                    />
                    <DrawerItem
                        title={'Questionnaire History'}
                        onPress={() => {
                            navigation.navigate("QuestionnairHistoryScreen")
                        }}
                    />
                    <DrawerItemSynced
                        title={'Un-Synced Data'}
                        loading={loadingOnSync}
                        counter={values}
                        onPress={() => {
                            this.uploadData();
                        }}
                    />
                    <DrawerItem
                        title={'Tasks'}
                        onPress={() => {

                        }}
                    />
                    <View style={{ flex: 1 }} />
                    <DrawerItem
                        loading={loadingOnLogout}
                        containerStyle={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', borderBottomWidth: 0 }}
                        titleStyle={{ color: colors.red }}
                        title={'Logout'}
                        onPress={() => {
                            let id = Preference.get(preferenceKeys.LAST_QUESTION_ID)
                            Preference.clear()
                            Preference.set(preferenceKeys.LAST_QUESTION_ID, id);
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'AuthStack' }],
                            });
                        }}
                    />
                </View>
            </ScrollView>
        )
    }
}
export default connectRealm(CompanyDrawerContent, {
    schemas: ['HomeDates', 'Columns'],
    mapToProps(results, realm, ownProps) {
      return {
        realm,
      };
    },
  });

const styles = StyleSheet.create({
    drawerContainer: {
        flex: 1,
        backgroundColor: colors.white,
        paddingVertical: 40,
        alignItems: 'center',
        paddingHorizontal: 20
    },
})
