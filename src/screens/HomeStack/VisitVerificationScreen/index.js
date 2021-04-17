import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    Alert,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    Dimensions,
    Platform,
    StatusBar,
    Modal
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import moment from 'moment'

//components
import Header from '../../../components/Header'
import Button from '../../../components/Button'
import QuestionComponent from '../../../components/QuestionComponent'

//utils
import colors from '../../../utils/colors'
import images from '../../../assets/images';
import icons from '../../../assets/icons';
import { permissionCamera } from '../../../utils/permissions'
import {sentryMessage} from "../../../utils/utils";

const { width } = Dimensions.get('window')
const options = {
    title: 'Select Image',
    // maxWidth: 512,
    // maxHeight: 512,
    // quality: 0.4,
    rotation : 360,
    includeBase64: true,
};

export default class FacilityNameScreen extends Component {
    constructor(props) {
        super(props);
        const { route } = props
        const { params } = route
        let isNoHintBook = false
        if (params) {
            const { questionTwoOptions } = params.apiData
            if (questionTwoOptions[0].isChecked || questionTwoOptions[1].isChecked) {
                isNoHintBook = true
            }
        }
        this.state = {
            loading: false,
            loadingOnCheckIn: false,
            isNoHintBook: isNoHintBook,
            hintBookImageOne: null,
            hintBookImageTwo: null,
            visitCardImage: null,
            hasPermission: false,
            showOptionModal: false,
        }
    }

    componentDidMount() {
        sentryMessage('VVS mount');
        permissionCamera().then(result => {
            this.setState({ hasPermission: result.hasPermission })
        })
    }

    onChooseFromLibraryPress = (index) => {
        launchImageLibrary(options, (response) => {
            this._onImagePickerResponse(response, index)
        })
    }

    onTakePhotoPress = (index) => {
        launchCamera(options, (response) => {
            this._onImagePickerResponse(response, index)
        })
    }

    _onImagePickerResponse = (response, index) => {
        // console.log('Response = ', response);

        if (response.didCancel) {
            //// console.log('User cancelled image picker');
        } else if (response.error) {
            //// console.log('ImagePicker Error: ', response.error);
        } else {
            const source = { uri: response.uri, name: 'image_' + moment().format('x') + '.jpeg', type: 'image/jpeg', base64: response.base64 };
            // console.log('Response_source = ', JSON.stringify(source));
            // You can also display the image using data:
            // const source = { uri: 'data:image/jpeg;base64,' + response.data };
            if (index == 1) {
                this.setState({ hintBookImageOne: source })
            } else if (index == 2) {
                this.setState({ hintBookImageTwo: source })
            } else {
                this.setState({ visitCardImage: source })
            }
        }
    }

    verifyFields = () => {
        const { isNoHintBook, hintBookImageOne, hintBookImageTwo, visitCardImage } = this.state
        if (isNoHintBook == false && hintBookImageOne == null && hintBookImageTwo == null) {
            Alert.alert(null, 'Hint book image is required')
            return false
        } else if (visitCardImage == null) {
            Alert.alert(null, 'Visit Card image is required')
            return false
        }

        return true
    }

    onSubmitPress = () => {
        if (this.verifyFields()) {
            const { navigation, route } = this.props
            const { params } = route
            let apiData = {}
            let appointment = {}
            let checkInDateTime = null
            if (params) {
                apiData = params.apiData
                appointment = params.appointment
                checkInDateTime = params.checkInDateTime
            }
            const apiData2 = this.state
            navigation.navigate("CheckoutScreen", { apiData: { ...apiData, ...apiData2 }, appointment, checkInDateTime })
        }
    }

    renderOptionModel = () => {
        const { showOptionModal, selectedIndex } = this.state
        const borderRadius = 13

        return (
            <Modal
                animationType="fade"
                presentationStyle="overFullScreen"
                transparent={true}
                visible={showOptionModal}>
                <View style={[styles.modalStyle, { justifyContent: 'flex-end', overflow: 'visible' }]}>
                    <StatusBar barStyle='dark-content' backgroundColor='#00000020' />
                    <View style={[{ marginBottom: 30, }, styles.shadowElevation]}>
                        <View style={{ marginBottom: 15 }}>
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({ showOptionModal: false }, () => {
                                        setTimeout(() => {
                                            this.onChooseFromLibraryPress(selectedIndex)
                                        }, 1000)
                                    })
                                }}
                                activeOpacity={0.8}
                                style={{
                                    backgroundColor: 'white',
                                    alignItems: 'center', justifyContent: 'center',
                                    borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius
                                }}>
                                <Text style={{ color: colors.primary, padding: 14, fontSize: 20 }}>
                                    {'Choose from Library'}
                                </Text>
                            </TouchableOpacity>
                            <View style={{ height: 2, width: '100%' }} />
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({ showOptionModal: false }, () => {
                                        setTimeout(() => {
                                            this.onTakePhotoPress(selectedIndex)
                                        }, 1000)
                                    })
                                }}
                                activeOpacity={0.8}
                                style={{
                                    backgroundColor: 'white',
                                    alignItems: 'center', justifyContent: 'center',
                                    borderBottomLeftRadius: borderRadius, borderBottomRightRadius: borderRadius
                                }}>
                                <Text style={{ color: colors.primary, padding: 14, fontSize: 20 }}>{'Take Photo'}</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={{ backgroundColor: 'white', borderRadius: borderRadius, alignItems: 'center', justifyContent: 'center' }}
                            onPress={() => {
                                this.setState({ showOptionModal: false })
                            }}>
                            <Text style={{ color: colors.primary, padding: 14, fontSize: 20 }}>{'Cancel'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        )
    }

    render() {
        const {
            loading,
            loadingOnCheckIn,
            hintBookImageOne,
            hintBookImageTwo,
            visitCardImage,
            isNoHintBook,
        } = this.state
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
                    hearderText={'Visit Verification'}
                    containerStyle={{ backgroundColor: colors.lightBlue }}
                    leftIcon={icons.backArrowIcon}
                    leftButtonIconStyle={{ tintColor: colors.white, height: 22 }}
                    onLeftAction={() => {
                        navigation.goBack()
                    }}
                />
                <View style={{ flex: 1 }}>
                    <View style={styles.contentContainer}>
                        <Text style={{ fontSize: 14, marginTop: 30, textAlign: 'center' }}>{'ΠΑΡΑΚΑΛΩ ΤΡΑΒΗΞΤΕ ΦΩΤΟΓΡΑΦΙΕΣ ΤΟΥ ΒΙΒΛΙΟΥ ΥΠΟΔΕΙΞΕΩΝ ΑΠΟ ΤΗΝ ΣΗΜΕΡΙΝΗ ΣΑΣ ΕΠΙΣΚΕΨΗ'}</Text>
                        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, }}>
                            <TouchableOpacity
                                disabled={isNoHintBook}
                                activeOpacity={0.6}
                                style={styles.imageContainer}
                                onPress={() => {
                                    this.setState({ selectedIndex: 1, showOptionModal: true })
                                }}>
                                <Image
                                    style={{ position: 'absolute', width: '100%', height: '100%', resizeMode: 'cover' }}
                                    source={hintBookImageOne}
                                />
                                <Image
                                    style={{ width: 25, height: 25, resizeMode: 'contain' }}
                                    source={icons.cameraIcon}
                                />
                                {hintBookImageOne &&
                                    <TouchableOpacity
                                        style={styles.closeIconContainer}
                                        onPress={() => {
                                            this.setState({ hintBookImageOne: null })
                                        }}>
                                        <Image
                                            style={{ width: 13, height: 13, resizeMode: 'contain', tintColor: colors.white }}
                                            source={icons.closeIcon}
                                        />
                                    </TouchableOpacity>
                                }
                                {isNoHintBook &&
                                    <View style={{ position: 'absolute', flex: 1, width: '100%', height: '100%', backgroundColor: colors.disabled }} />
                                }
                            </TouchableOpacity>
                            <TouchableOpacity
                                disabled={isNoHintBook}
                                activeOpacity={0.6}
                                style={styles.imageContainer}
                                onPress={() => {
                                    this.setState({ selectedIndex: 2, showOptionModal: true })
                                }}>
                                <Image
                                    style={{ position: 'absolute', width: '100%', height: '100%', resizeMode: 'cover' }}
                                    source={hintBookImageTwo}
                                />
                                <Image
                                    style={{ width: 25, height: 25, resizeMode: 'contain' }}
                                    source={icons.cameraIcon}
                                />
                                {hintBookImageTwo &&
                                    <TouchableOpacity
                                        style={styles.closeIconContainer}
                                        onPress={() => {
                                            this.setState({ hintBookImageTwo: null })
                                        }}>
                                        <Image
                                            style={{ width: 13, height: 13, resizeMode: 'contain', tintColor: colors.white }}
                                            source={icons.closeIcon}
                                        />
                                    </TouchableOpacity>
                                }
                                {isNoHintBook &&
                                    <View style={{ position: 'absolute', flex: 1, width: '100%', height: '100%', backgroundColor: colors.disabled }} />
                                }
                            </TouchableOpacity>
                        </View>
                        <Text style={{ fontSize: 14, marginLeft: 10, marginTop: 20 }}>{'ΠΑΡΑΚΑΛΩ ΤΡΑΒΗΞΤΕ ΦΩΤΟΓΡΑΦΙΑ ΤΟΥ ΔΕΛΤΙΟΥ ΕΠΙΣΚΕΨΗΣ'}</Text>
                        <TouchableOpacity
                            activeOpacity={0.6}
                            style={styles.imageContainer}
                            onPress={() => {
                                this.setState({ selectedIndex: 3, showOptionModal: true })
                            }}>
                            <Image
                                style={{ width: 25, height: 25, resizeMode: 'contain' }}
                                source={icons.cameraIcon}
                            />
                            <Image
                                style={{ position: 'absolute', width: '100%', height: '100%', resizeMode: 'cover' }}
                                source={visitCardImage}
                            />
                            {visitCardImage &&
                                <TouchableOpacity
                                    style={styles.closeIconContainer}
                                    onPress={() => {
                                        this.setState({ visitCardImage: null })
                                    }}>
                                    <Image
                                        style={{ width: 13, height: 13, resizeMode: 'contain', tintColor: colors.white }}
                                        source={icons.closeIcon}
                                    />
                                </TouchableOpacity>
                            }
                        </TouchableOpacity>
                    </View>
                    <Button
                        activityIndicatorProps={{ loading: loadingOnCheckIn }}
                        containerStyle={{ backgroundColor: colors.primary, marginBottom: 20, marginLeft: 20, height: 40, width: 120 }}
                        buttonTextStyle={{ color: colors.white, fontSize: 18 }}
                        buttonText={'Submit'}
                        onPressButton={() => {
                            this.onSubmitPress()
                        }}
                    />
                </View>
                { this.renderOptionModel()}
            </SafeAreaView >
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundGrey,
        width: '100%'
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        // backgroundColor: colors.white,
        width: '100%',
        paddingHorizontal: 20
    },
    modalStyle: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        paddingHorizontal: 20,
        overflow: 'visible',
        backgroundColor: '#00000020'
    },
    checkBoxContainer: {
        width: 25,
        height: 25,
        padding: 5,
        borderRadius: 12.5,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff'
    },
    shadowElevation: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.10,
        shadowRadius: 10.84,

        elevation: 5,
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
    imageContainer: {
        width: '48%',
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        backgroundColor: colors.white,
        marginTop:20
    },
});

