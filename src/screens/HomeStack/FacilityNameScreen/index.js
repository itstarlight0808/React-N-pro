import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    SafeAreaView,
    Dimensions,
    FlatList,
    TouchableOpacity,
    Platform,
    StatusBar
} from 'react-native';
import moment from 'moment'
import { connectRealm } from 'react-native-realm';
import Preference from 'react-native-preference';

//components
import Header from '../../../components/Header'
import Button from '../../../components/Button'

//utils
import colors from '../../../utils/colors'
import images from '../../../assets/images';
import icons from '../../../assets/icons';
import preferenceKeys from '../../../utils/preferenceKeys';
import {sentryMessage} from "../../../utils/utils";

const { width } = Dimensions.get('window')

 class FacilityNameScreen extends Component {
    constructor(props) {
        super(props);
        const { params } = props.route
        let appointment = []
        if (params) {
            appointment = params.appointment
            // console.log('appointment', appointment);
        }
        this.state = {
            loading: false,
            loadingOnCheckIn: false,
            appointment: appointment,
            column: [],
            hintExist:false,
        }
    }

    componentDidMount() {
      sentryMessage('FNS mount');
      let temp = this.props.realm.objects('Columns')[0].ColumnsData
        // console.log("DATA",JSON.parse(temp))
        this.setState({column:JSON.parse(temp)});
        this.CheckHintExist();
    }

    renderItem = ({ item, index }) => {
        const { column } = this.state;
        if (item == ''
            || index == 0
            || index == 3
            || index == 8
            || index == 9
            || index == 14
            || index == 15
            || index == 16
            || index == 18
        ) return null

        let title =
            index == 1 ? column[1] : // column[1]
                index == 2 ? column[2] :// column[2]
                    index == 3 ? column[3] :// column[4]
                        index == 4 ? column[4] :// column[4]
                            index == 5 ? column[5] :// column[5]
                                index == 6 ? column[6] :// column[6]
                                    index == 7 ? column[7] :// column[7]
                                        index == 8 ? column[8] :// column[7]
                                            index == 9 ? column[9] :// column[9]
                                                index == 10 ? column[10] :// column[10]
                                                    index == 11 ? column[11] :// column[11]
                                                        index == 12 ? column[12] :// column[12]
                                                            index == 13 ? column[13] :// column[13]
                                                                index == 14 ? column[14] :// column[13]
                                                                    index == 15 ? column[15] :// column[13]
                                                                        index == 16 ? column[16] :// column[13]
                                                                            index == 17 ? column[17] :// column[17]
                                                                                index == 18 ? column[18] :// column[17]
                                                                                    index == 19 ? column[19] : ""// column[19]


        return (
            <TouchableOpacity
                disabled={true}
                activeOpacity={1}
                style={styles.itemStyle}
                onPress={() => {

                }}>
                <View style={{ flex: 1, width: '100%', flexDirection: 'row', justifyContent: 'center', marginVertical: 10 }}>
                    {title != '' && <Text style={{ fontWeight: '600' }}>{`${title}: `}</Text>}
                    <View style={{ flex: 1 }}>
                        <Text style={{}}>{item}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
 CheckDate() {

        let temp = this.props.realm.objects('Questions');
        for (let i = 0; i <temp.length; i++) {
            if (this.state.appointment[6] == JSON.parse(temp[i].questions)?.facility) {
                    this.props.navigation.navigate('QuestionAnswer', {
                        questions: JSON.parse(temp[i].questions)?.apiData,
                    });
            }
        }
    }
    CheckHintExist () {

        let temp = this.props.realm.objects('Questions');
      try {
        for (let i = 0; i < temp.length; i++) {
          console.log(temp[i].questions?.length);
          console.log(this.state.appointment[6],temp[i].questions[0]?.length);
          if (temp[i].questions && this.state.appointment[6] == JSON.parse(temp[i].questions)?.facility) {
            this.setState({hintExist: true});
          }
        }
        sentryMessage('CheckHintExist done');
      } catch (e) {
        sentryMessage('CheckHintExist - '+e.message, e);
        console.log(e);
      }
    }

    render() {
        // console.log('testing ',this.state.appointment)
        const { loading, loadingOnCheckIn, appointment, hintExist } = this.state
        const { navigation } = this.props
        const status = appointment[18]
        return (
            <SafeAreaView style={styles.container}>
                <View style={{ height: 60, width: '100%', justifyContent: 'flex-end', marginTop: Platform.OS == 'android' ? StatusBar.currentHeight : 0 }}>
                    <Image
                        style={{ width: 120, height: 35, resizeMode: 'contain' }}
                        source={images.logoImage}
                    />
                </View>
                <Header
                    hearderText={this.state.appointment[6]}
                    containerStyle={{ backgroundColor: colors.lightBlue }}
                    leftIcon={icons.backArrowIcon}
                    leftButtonIconStyle={{ tintColor: colors.white, height: 22 }}
                    onLeftAction={() => {
                        // navigation.openDrawer()
                        navigation.goBack()
                    }}
                />
                <View style={styles.contentContainer}>
                    <Text style={{ fontSize: 18, marginVertical: 20 }}>{'Facility\'s Details'}</Text>
                    <View style={{ flex: 1, width: '100%' }}>
                        <FlatList
                            listKey={moment().format('x') + "ProfileFavorites"}
                            data={appointment}
                            renderItem={this.renderItem}
                            keyExtractor={(item, index) => (`${item.title}_${index}`)}
                            contentContainerStyle={{ width: '100%' }}
                            style={{ width: '100%' }}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                    {(status == 1 || status == 2) &&
                        <Button
                            activityIndicatorProps={{ loading: loadingOnCheckIn }}
                            containerStyle={{ backgroundColor: colors.primary, width: '70%', marginVertical: 30 }}
                            buttonTextStyle={{ color: colors.white, fontSize: 18 }}
                            buttonText={'Check In'}
                            onPressButton={() => {
                                navigation.navigate("FacilityQuestionnaireScreen", { appointment, checkInDateTime: moment().format('YYYY-MM-DD HH:mm') })
                            }}
                        />
                    }
                    {(status == 1 || status == 2) && (this.state.hintExist) &&
                        <Button
                            activityIndicatorProps={{ loading: loadingOnCheckIn }}
                            containerStyle={{ backgroundColor: colors.primary, width: '70%' }}
                            buttonTextStyle={{ color: colors.white, fontSize: 18 }}
                            buttonText={'Last Questionnaire'}
                            onPressButton={() => {
                                this.CheckDate();
                                // navigation.navigate("FacilityQuestionnaireScreen", { appointment, checkInDateTime: moment().format('YYYY-MM-DD HH:mm') })
                            }}
                        />
                    }
                </View>
            </SafeAreaView>
        )
    }
}
export default connectRealm(FacilityNameScreen, {
    schemas: ['Columns'],
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
        width: '100%'
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: colors.white,
        width: '100%',
        height: '100%',
        paddingBottom: 20
    },
    itemStyle: {
        flexDirection: 'row',
        width: '90%',
        alignItems: "center",
        justifyContent: 'center',
        alignSelf: 'center',
        minHeight: 40,
        borderBottomWidth: 1,
    }
});

