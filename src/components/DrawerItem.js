import React, { Component } from 'react';
import {
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator
} from 'react-native';
import colors from '../utils/colors';

export default DrawerItem = (props) => {
    return (
        <TouchableOpacity
            activeOpacity={0.5}
            style={[styles.drawerItemContainer, props.containerStyle]}
            onPress={() => {
                if (props.onPress && typeof props.onPress == 'function') props.onPress()
            }}>
            <Text style={[{ color: colors.black }, props.titleStyle]}>{props.title}</Text>
            {props.loading &&
                <ActivityIndicator
                    animating={props.loading}
                    size={'small'}
                    color={colors.red}
                    style={[{ marginLeft: 5 }]}
                />
            }
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    drawerItemContainer: {
        width: '100%',
        height: 40,
        justifyContent: 'center',
        marginTop: 10,
        // borderTopColor: colors.backgroundGrey,
        borderRadius: 5,
        borderBottomWidth: 1,
        paddingHorizontal: 5,
    }
})