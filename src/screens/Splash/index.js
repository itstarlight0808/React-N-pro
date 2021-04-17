import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
} from 'react-native';

import Preference from 'react-native-preference'

import preferenceKeys from '../../utils/preferenceKeys'

export default class Splash extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
        }
    }
    componentDidMount() {
        const { navigation } = this.props
        // Preference.clear()
        let nextRouteName = 'AuthStack'
        const hassSession = Preference.get(preferenceKeys.HAS_SESSION)
        console.log('hassSession', hassSession)
        if (hassSession) nextRouteName = 'HomeStack'
        setTimeout(() => {
            // navigation.reset({ index: 0, routes: [{ name: nextRouteName }] });
        }, 3000);
    }

    render() {
        const { navigation } = this.props
        return (
            <View style={styles.container}>
                <Text style={{ color: 'red' }}>{'Splash screen'}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: "center",
        width: '100%',
        height: '100%',
    },
});

