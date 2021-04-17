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
    Platform,
    StatusBar
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import Preference from 'react-native-preference';
import moment from 'moment'
import NetInfo from '@react-native-community/netinfo';
import { connectRealm } from 'react-native-realm';

//components
import Header from '../../../components/Header'
import Loader from '../../../components/Loader'
import FloatingLabelInputField from '../../../components/FloatingLabelInputField'

//utils
import colors from '../../../utils/colors'
import preferenceKeys from '../../../utils/preferenceKeys'
import { BASE_URL, requestGetWithToken, requestPost } from '../../../utils/API';
import images from '../../../assets/images';
import icons from '../../../assets/icons';
import {sentryMessage} from "../../../utils/utils";

const { width } = Dimensions.get('window')

class TodaysAppointments extends Component {
    constructor(props) {
        super(props);
        const { params } = props.route
        let dateFrom = moment().format('YYYY-MM-DD')
        let dateTo = moment().add(1, 'day').format('YYYY-MM-DD')
        let isFromCalendar = false
        if (params) {
            if (params.date) {
                dateFrom = params.date
                dateTo = moment(params.date, 'YYYY-MM-DD').add(1, 'day').format('YYYY-MM-DD')
                isFromCalendar = true
            }
        }
        this.state = {
            loading: false,
            isFetching: false,
            dateFrom: dateFrom,
            dateTo: dateTo,
            isFromCalendar: isFromCalendar,
            appointments: [],
        }
        const { navigation } = this.props
        this.onFocusListener = navigation.addListener('focus', () => {
            this.checkInternet()
        });
    }
    checkInternet() {
        NetInfo.fetch().then(state => {
          this.dataFetching(state.isConnected)
        });

      }
      dataFetching(isConnected) {
        if (isConnected){
            this.getRequestId()
        }
        else {
            this.getAppointmentsFromDB()
        }
    }
    getAppointmentsFromDB(){
        let temp = JSON.parse(this.props.realm.objects('HomeDates')[0].appointments[0]);
        let newArray = [];
        for(let i = 0; i<temp.length;i++){
            if (moment(temp[i][1]).format('YYYY-MM-DD') == this.state.dateFrom){
                newArray.push(temp[i])
            }
        }
        this.setState({ appointments: newArray })
    }
    componentDidMount() {
        sentryMessage('TA mount');
    }

    getRequestId = () => {
        const clientId = Preference.get(preferenceKeys.CLIENT_ID)
        const { dateFrom, dateTo } = this.state
        console.log('dateFrom', dateFrom, 'dateTo', dateTo)
        const bodyDetails = {
            "service": "getBrowserInfo",
            "clientID": clientId,
            "appId": "1001",
            "object": "SOMEETING",
            "list": "SOneP",
            "filters": `SOACTION.FROMDATE=${dateFrom} & SOACTION.FROMDATE_TO=${dateTo}`
        }
        // console.log('getRequestId', 'bodyDetails', bodyDetails)
        this.setState({ loading: true })
        requestPost(BASE_URL, JSON.stringify(bodyDetails)).then((response) => {
            console.log('getRequestId', 'response', response)
            if (response.success) {
                console.log('clientId', clientId)
                console.log('response.reqID', response.reqID)
                this.getAppointments(response.reqID)
            } else {
                this.setState({ loading: false, isFetching: false, })
                Alert.alert(null, response.error)
            }
        }).catch((error) => {
            this.setState({ loading: false, isFetching: false, })
            console.log('getAppointments', 'error', error)
            Alert.alert(null, 'Something went wrong')
        })
    }

    getAppointments = (requestId) => {
        const clientId = Preference.get(preferenceKeys.CLIENT_ID)
        const bodyDetails = {
            "service": "getBrowserData",
            "clientID": clientId,
            "appId": "1001",
            "reqID": requestId,
            "object": "SOMEETING",
            "key": "1001",
            "start": "0",
            "limit": "100000"
        }
        // this.setState({ loading: true })
        requestPost(BASE_URL, JSON.stringify(bodyDetails)).then((response) => {
            this.setState({ loading: false, isFetching: false, })
            if (response.success) {
                // console.log('getAppointments', 'response', JSON.stringify(response.rows[0]))
                this.setState({ appointments: response.rows })
            } else {
                Alert.alert(null, 'No appointments')
            }
        }).catch((error) => {
            this.setState({ loading: false, isFetching: false, })
            console.log('getAppointments', 'error', error)
            Alert.alert(null, 'Something went wrong')
        })
    }

    renderItem = ({ item, index }) => {
        const { navigation } = this.props
        const status = item[18]
        console.log('status', status)
        let showStatus = false
        let statusColor = colors.transparent
        let statusIcon = icons.minusIcon
        if (status == 3) {
            showStatus = true
            statusColor = colors.green
            statusIcon = icons.checkIcon
        } else if (status == 4) {
            showStatus = true
            statusColor = colors.red
            statusIcon = icons.closeIcon
        } else if (status == 6) {
            showStatus = true
            statusColor = colors.orange
            statusIcon = icons.minusIcon
        }
        return (
            <TouchableOpacity
                activeOpacity={0.5}
                style={styles.itemStyle}
                onPress={() => {
                    navigation.navigate('FacilityNameScreen', { appointment: item })
                }}>
                <Image
                    style={{ width: 20, height: 20, resizeMode: 'contain' }}
                    source={icons.starIcon}
                />
                <Text style={{ margin: 5, }}>{item[5]}</Text>
                {showStatus &&
                    <View style={{ backgroundColor: statusColor, width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
                        <Image
                            style={{ width: 13, height: 13, resizeMode: 'contain', tintColor: colors.white }}
                            source={statusIcon}
                        />
                    </View>
                }
            </TouchableOpacity>
        )
    }

    render() {
        const { loading, isFetching, appointments, isFromCalendar, dateFrom } = this.state
        const { navigation } = this.props
        return (
            <SafeAreaView style={styles.container}>
                <View style={{ height: 60, width: '100%', justifyContent: 'flex-end', marginTop: Platform.OS == 'android' ? StatusBar.currentHeight : 0 }}>
                    <Image
                        style={{ width: 120, height: 35, resizeMode: 'contain' }}
                        source={images.logoImage}
                    />
                </View>
                <Header
                    hearderText={`${isFromCalendar ? dateFrom : 'Today\'s'} Appointments`}
                    containerStyle={{ backgroundColor: colors.lightBlue }}
                    leftIcon={isFromCalendar ? icons.backArrowIcon : icons.menuIcon}
                    leftButtonIconStyle={{ tintColor: colors.white, height: 22 }}
                    onLeftAction={() => {
                        if (isFromCalendar) {
                            navigation.goBack()
                        } else {
                            navigation.openDrawer()
                        }
                    }}
                />
                <View style={{ flex: 1 }}>
                    <FlatList
                        refreshControl={
                            <RefreshControl
                                title='Refreshing...'
                                tintColor={colors.primary}
                                colors={[colors.primary, colors.lightGrey]}
                                refreshing={isFetching}
                                onRefresh={() => {
                                    this.setState({ isFetching: true })
                                    this.getRequestId()
                                }}
                            />
                        }
                        listKey={moment().format('x') + "ProfileFavorites"}
                        data={appointments}
                        renderItem={this.renderItem}
                        keyExtractor={(item, index) => (`${item.title}_${index}`)}
                        contentContainerStyle={{}}
                        showsVerticalScrollIndicator={false}
                    />
                    <Loader loading={loading} />
                </View>
            </SafeAreaView>
        )
    }
}
export default connectRealm(TodaysAppointments, {
    schemas: ['HomeDates'],
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
    itemStyle: {
        flexDirection: 'row',
        width: '70%',
        alignItems: "center",
        justifyContent: 'center',
        alignSelf: 'center',
        height: 60,
        borderBottomWidth: 1
    }
});

