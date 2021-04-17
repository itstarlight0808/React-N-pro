import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    SafeAreaView,
    StatusBar
} from 'react-native';

import _ from 'lodash'
import colors from '../utils/colors';

export default Header = (props) => {

    return (
        <SafeAreaView>
            <View style={[styles.container, props.containerStyle]} >
                <TouchableOpacity
                    disabled={_.isNil(props.onLeftAction)}
                    onPress={() => {
                        if (props.onLeftAction && typeof props.onLeftAction) {
                            props.onLeftAction()
                        }
                    }}
                    style={[styles.buttonLeftContainer, props.leftButtonContainerStyle]}>
                    {props.leftIconChildren ?
                        props.leftIconChildren
                        :
                        props.leftIcon &&
                        <Image
                            style={[styles.buttonIcon, props.leftButtonIconStyle]}
                            source={props.leftIcon}
                        />
                    }
                    {props.leftText &&
                        <Text style={[styles.buttonText, props.leftButtonTextStyle]}>
                            {props.leftText}
                        </Text>
                    }
                </TouchableOpacity>
                <View style={[styles.centerComponentStyle, props.centerComponentExtraStyle]}>
                    {props.centerComponent}
                    {props.hearderText &&
                        <Text style={[styles.hearderText, props.hearderTextStyle]}>
                            {props.hearderText}
                        </Text>
                    }
                </View>
                <TouchableOpacity
                    disabled={_.isNil(props.onRightAction)}
                    onPress={() => {
                        if (props.onRightAction && typeof props.onRightAction) {
                            props.onRightAction()
                        }
                    }}
                    style={[styles.buttonRightContainer, props.rightButtonContainerStyle]}>
                    {props.rightIcon &&
                        <Image
                            style={[styles.buttonIcon, props.rightButtonIconStyle]}
                            source={props.rightIcon}
                        />
                    }
                    {props.rightText &&
                        <Text style={[styles.buttonText, props.rightButtonTextStyle]}>
                            {props.rightText}
                        </Text>
                    }
                </TouchableOpacity>
            </ View>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 60,
        width: '100%',
        backgroundColor: '#00000000',
        alignItems: 'center',
    },
    buttonLeftContainer: {
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 15,
        flexDirection: 'row',
    },
    buttonRightContainer: {
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: 15,
        flexDirection: 'row',
    },
    centerComponentStyle: {
        flex: 1,
        height: '100%',
        justifyContent: 'center',
        // textAlign: 'left'
    },
    buttonIcon: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
    },
    buttonText: {

    },
    hearderText: {
        fontSize: 17,
        fontWeight: 'bold',
        color: colors.white,
        textAlign: 'center'
    }
})
