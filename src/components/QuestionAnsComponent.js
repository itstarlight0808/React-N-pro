import React from 'react';
import {
    StyleSheet,
    View,
    Image,
    Text,
    TouchableOpacity,
} from 'react-native';

import FloatingLabelInputField from './FloatingLabelInputField';

import colors from "../utils/colors";
import icons from '../assets/icons';
import images from '../assets/images';

const QuestionComponent = (props) => {
    const {
        containerStyle,
        question,
        questionInputProps,
        questionOptions,
        onCheckBoxPress,
        onCameraPress,
        showResionInput,
        showCommentInput,
        questionSeIectedIndex,
        menuTitle,
        selectedMenuIndex,
        questionIndex,
        onMenuPress,
        isMultiSelect,
        onCrossIconPress,
    } = props

    return (
        <View style={[styles.container, containerStyle]}>
            {menuTitle &&
                <TouchableOpacity
                    activeOpacity={1}
                    style={{ width: '100%', height: 55, borderRadius: 5, backgroundColor: colors.white, justifyContent: 'center' }}
                    onPress={() => {
                        if (onMenuPress && typeof onMenuPress == 'function') onMenuPress(questionIndex)
                    }}>
                    <Text style={{ fontSize: 18, marginLeft: 10 }}>{menuTitle}</Text>
                </TouchableOpacity>
            }
            {(selectedMenuIndex == questionIndex || menuTitle == null) &&
                <>
                    <Text style={{ fontSize: 18, marginTop: 10 }}>{question}</Text>
                    {questionOptions && Array.isArray(questionOptions) && questionOptions.map((item, index) => (
                        <View style={{ marginTop: 10, }}>
                            <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                                <TouchableOpacity
disabled={true}
                                    activeOpacity={0.5}
                                    style={[styles.checkBoxContainer, styles.shedowElevation, isMultiSelect ? { backgroundColor: item.isChecked == true ? colors.primary : colors.white } : {}]}
                                    onPress={() => {
                                        if (onCheckBoxPress && typeof onCheckBoxPress == 'function') onCheckBoxPress(item, index)
                                    }}>
                                    {isMultiSelect ?
                                        item.isChecked == true &&
                                        <Image
                                            style={{ width: '100%', height: '100%', resizeMode: 'contain', tintColor: colors.white }}
                                            source={icons.checkIcon}
                                        />
                                        :
                                        questionSeIectedIndex == index &&
                                        <View style={{ width: 15, height: 15, borderRadius: 7.5, backgroundColor: colors.primary }} />
                                    }
                                </TouchableOpacity>
                                <View style={{ flex: 1, padding: 1 }}>
                                    <Text style={{ fontSize: 14, marginLeft: 10 }}>{item.optionTitle}</Text>
                                </View>
                            </View>
                            <View style={{ flex: 1 }}>
                                {(item.isChecked == true && item.showCommentInput == true) &&
                                    <FloatingLabelInputField
                                        value={item.comment}
                                        {...questionInputProps}
                                        onChangeText={(text) => {
                                            questionInputProps.onChangeText(item, index, text)
                                        }}
                                    />
                                }
                                {item.isChecked == true && item.showImagePickers == true &&
                                    <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                                        <TouchableOpacity
disabled={true}
                                            activeOpacity={0.6}
                                            style={styles.imageContainer}
                                            onPress={() => {
                                                if (onCameraPress && typeof onCameraPress == 'function') onCameraPress(item, index, 1)
                                            }}>
                                            <Image
                                                style={{ position: 'absolute', width: '100%', height: '100%', resizeMode: 'cover' }}
                                                source={item.imageOne}
                                            />
                                            <Image
                                                style={{ width: 25, height: 25, resizeMode: 'contain' }}
                                                source={icons.cameraIcon}
                                            />
                                            {item.imageOne &&
                                                <TouchableOpacity
disabled={true}
                                                    style={styles.closeIconContainer}
                                                    onPress={() => {
                                                        if (onCrossIconPress && typeof onCrossIconPress == 'function') onCrossIconPress(item, index, 1)
                                                    }}>
                                                    <Image
                                                        style={{ width: 13, height: 13, resizeMode: 'contain', tintColor: colors.white }}
                                                        source={icons.closeIcon}
                                                    />
                                                </TouchableOpacity>
                                            }
                                        </TouchableOpacity>
                                        <TouchableOpacity
disabled={true}
                                            activeOpacity={0.6}
                                            style={styles.imageContainer}
                                            onPress={() => {
                                                if (onCameraPress && typeof onCameraPress == 'function') onCameraPress(item, index, 2)
                                            }}>
                                            <Image
                                                style={{ position: 'absolute', width: '100%', height: '100%', resizeMode: 'cover' }}
                                                source={item.imageTwo}
                                            />
                                            <Image
                                                style={{ width: 25, height: 25, resizeMode: 'contain' }}
                                                source={icons.cameraIcon}
                                            />
                                            {item.imageTwo &&
                                                <TouchableOpacity
disabled={true}
                                                    style={styles.closeIconContainer}
                                                    onPress={() => {
                                                        if (onCrossIconPress && typeof onCrossIconPress == 'function') onCrossIconPress(item, index, 2)
                                                    }}>
                                                    <Image
                                                        style={{ width: 13, height: 13, resizeMode: 'contain', tintColor: colors.white }}
                                                        source={icons.closeIcon}
                                                    />
                                                </TouchableOpacity>
                                            }
                                        </TouchableOpacity>
                                    </View>
                                }
                            </View>
                        </View>
                    ))
                    }
                    {(showResionInput || showCommentInput) &&
                        <FloatingLabelInputField
                            {...questionInputProps}
                        />
                    }
                </>
            }
        </View >
    )
}


const styles = StyleSheet.create({
    container: {
        width: '100%'
    },
    checkBoxContainer: {
        width: 25,
        height: 25,
        padding: 5,
        borderRadius: 12.5,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#fff'
    },
    shedowElevation: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    imageContainer: {
        width: '48%',
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        backgroundColor: colors.white,
    },
    closeIconContainer: {
        position: 'absolute',
        top: -10,
        right: -10,
        zIndex: 999,
        backgroundColor: colors.red,
        width: 20,
        height: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
})

export default QuestionComponent