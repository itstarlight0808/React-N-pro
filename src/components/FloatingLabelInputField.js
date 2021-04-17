import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    TextInput,
    View,
    Text,
    TouchableOpacity,
    Image,
} from 'react-native';
import _ from 'lodash'

export default class FloatingLabelInputField extends Component {
    state = {
        isFocused: false
    }
    render() {
        const {
            inputContainer,
            onParentPress,
            inputStyle,
            fieldRef,
            value,
            placeholder,
            onChangeText,
            onSubmitEditing,
            onFocus,
            onKeyPress,
            leftIcon,
            rightIcon,
            rightText,
            leftIconStyle,
            rightIconStyle,
            onRightIconPress,
            rightIconContainerStyle,
            hideLabel,
            labelStyle,
            labelContainerStyle,
            placeholderTextColor,
            leftComponent
        } = this.props
        const { isFocused } = this.state

        return (
            <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                    if (this.textInputLocalRef) this.textInputLocalRef.focus()
                    if (onParentPress && typeof onParentPress == 'function') onParentPress()
                }}
                style={[styles.inputContainer, inputContainer]}>
                {leftComponent ?
                    leftComponent
                    :
                    leftIcon &&
                    <Image
                        style={[styles.iconStyle, { marginRight: 5 }, leftIconStyle]}
                        source={leftIcon}
                    />
                }
                {!hideLabel && (isFocused || value?.length > 0) &&
                    <View
                        style={[{ position: 'absolute', top: -10, marginLeft: 10, backgroundColor: '#fff', paddingHorizontal: 5, borderRadius: 5 }, labelContainerStyle]}>
                        <Text style={[{}, labelStyle]}>
                            {placeholder ? placeholder : ''}
                        </Text>
                    </View>
                }
                <TextInput
                    {...this.props}
                    ref={ref => {
                        this.textInputLocalRef = ref
                        if (fieldRef && typeof fieldRef == 'function') fieldRef(ref)
                    }}
                    style={[styles.inputStyle, inputStyle]}
                    value={value}
                    placeholder={isFocused ? '' : placeholder}
                    placeholderTextColor={placeholderTextColor ? placeholderTextColor : 'gray'}
                    onChangeText={(text) => {
                        if (onChangeText && typeof onChangeText == 'function') onChangeText(text)
                    }}
                    onSubmitEditing={() => {
                        if (onSubmitEditing && typeof onSubmitEditing == 'function') onSubmitEditing()
                    }}
                    onFocus={(event: Event) => {
                        this.setState({ isFocused: true })
                        if (onFocus && typeof onFocus == 'function') onFocus(event)
                    }}
                    onBlur={(event: Event) => {
                        this.setState({ isFocused: false })
                    }}
                    onKeyPress={({ nativeEvent }) => { if (onKeyPress && typeof onKeyPress == 'function') onKeyPress(nativeEvent) }}
                />
                {rightIcon &&
                    <TouchableOpacity
                        disabled={_.isNil(onRightIconPress)}
                        style={[{ padding: 10 }, rightIconContainerStyle]}
                        onPress={() => {
                            if (onRightIconPress) onRightIconPress()
                        }}>
                        {rightText ?
                            <Text style={{}}>{rightText}</Text>
                            :
                            <Image
                                style={[styles.iconStyle, rightIconStyle]}
                                source={rightIcon}
                            />
                        }
                    </TouchableOpacity>
                }
            </TouchableOpacity >
        )
    }
}

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        height: 50,
        alignItems: 'center',
        backgroundColor: 'white',
        marginTop: 15,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: 'gray'
    },
    labelContainerStyle: {

    },
    inputStyle: {
        flex: 1,
    },
    iconStyle: {
        width: 20,
        height: 20,
        resizeMode: 'contain'
    }
})