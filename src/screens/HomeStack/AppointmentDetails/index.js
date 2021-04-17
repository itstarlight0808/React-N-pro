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
    Platform,
    StatusBar
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import moment from 'moment'

//components
import Header from '../../../components/Header'

//utils
import colors from '../../../utils/colors'
import images from '../../../assets/images';
import icons from '../../../assets/icons';

const { width } = Dimensions.get('window')

export default class AppointmentDetails extends Component {
    constructor(props) {
        super(props);
        const { params } = props.route
        let appointment = []
        if (params) {
            appointment = params.appointment
        }
        this.state = {
            loading: false,
            appointment: appointment
        }
    }

    componentDidMount() {

    }

    renderItem = ({ item, index }) => {
        if (item == ''
            || index == 0
            || index == 3
            || index == 4
            || index == 9
            || index == 14
            || index == 11
            || index == 16
            || index == 18
        ) return null
        return (
            <TouchableOpacity
                disabled={true}
                activeOpacity={1}
                style={styles.itemStyle}
                onPress={() => {

                }}>
                <Text style={{ margin: 5, }}>{item}</Text>
            </TouchableOpacity>
        )
    }

    render() {
        const { loading, appointment } = this.state
        const { navigation } = this.props
        return (
            <SafeAreaView style={styles.container}>
                <View style={{ height: 60, width: '100%', justifyContent: 'flex-end', marginTop: Platform.OS == 'android'? StatusBar.currentHeight : 0 }}>
                    <Image
                        style={{ width: 120, height: 35, resizeMode: 'contain' }}
                        source={images.logoImage}
                    />
                </View>
                <Header
                    hearderText={'Appointment Details'}
                    containerStyle={{ backgroundColor: colors.lightBlue }}
                    leftIcon={icons.backArrowIcon}
                    leftButtonIconStyle={{ tintColor: colors.white, height: 22 }}
                    onLeftAction={() => {
                        navigation.goBack()
                    }}
                />
                <FlatList
                    listKey={moment().format('x') + "ProfileFavorites"}
                    data={appointment}
                    renderItem={this.renderItem}
                    keyExtractor={(item, index) => (`${item.title}_${index}`)}
                    contentContainerStyle={{}}
                    showsVerticalScrollIndicator={false}
                />
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundGrey,
        width: '100%'
    },
    itemStyle: {
        flexDirection: 'row',
        width: '90%',
        alignItems: "center",
        justifyContent: 'center',
        alignSelf: 'center',
        height: 40,
        borderBottomWidth: 1
    }
});

