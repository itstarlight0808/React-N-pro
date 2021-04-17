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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import moment from 'moment'
import Preference from 'react-native-preference'

//components
import Header from '../../../components/Header'
import Button from '../../../components/Button'
import QuestionComponent from '../../../components/QuestionAnsComponent';
import KeyboardAccessoryView from '../../../components/KeyboardAccessoryView';

//utils
import icons from '../../../assets/icons';
import images from '../../../assets/images';
import colors from '../../../utils/colors'
import { permissionCamera } from '../../../utils/permissions'
import { QUESTION_OPTIONS } from '../../../utils/constants';
import { BASE_URL, requestPost } from '../../../utils/API';
import preferenceKeys from '../../../utils/preferenceKeys';

const { width } = Dimensions.get('window')
const inputAccessoryViewID = "FacilityQuestionnaireScreen"
const options = {
    title: 'Select Image',
    // maxWidth: 512,
    // maxHeight: 512,
    // quality: 0.4,
    rotation : 360,
    includeBase64: true,
};

export default class CheckoutScreen extends Component {
    constructor(props) {
        super(props);
        const { params } = props.route
        this.state = {
            ...params.questions
        }
    }

    componentDidMount() {
        const { params } = this.props.route
        // console.log("New Screen",params.questions)
    }

    onChooseFromLibraryPress = (imageNo, menuId, itemIndex) => {
        launchImageLibrary(options, (response) => {
            this._onImagePickerResponse(response, imageNo, menuId, itemIndex)
        })
    }

    onTakePhotoPress = (imageNo, menuId, itemIndex) => {
        launchCamera(options, (response) => {
            this._onImagePickerResponse(response, imageNo, menuId, itemIndex)
        })
    }

    _onImagePickerResponse = (response, imageNo, menuId, itemIndex) => {
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
            this.setImageSource(source, imageNo, menuId, itemIndex)
        }
    }

    setImageSource = (source, imageNo, menuId, itemIndex) => {
        const { questionThreeOptions, questionFourOptions, questionFiveOptions } = this.state
        let stateValue = {}
        let stateKey = 'dummy'
        switch (menuId) {
            case 2:
                stateValue = questionThreeOptions
                stateKey = 'questionThreeOptions'
                break;
            case 3:
                stateValue = questionFourOptions
                stateKey = 'questionFourOptions'
                break;
            case 4:
                stateValue = questionFiveOptions
                stateKey = 'questionFiveOptions'
                break;
            default:
                break;
        }
        if (imageNo == 1) {
            stateValue[itemIndex].imageOne = source
        } else {
            stateValue[itemIndex].imageTwo = source
        }
        this.setState({ [stateKey]: stateValue })
    }

    onSubmitPress = () => {
        const { navigation, route, } = this.props
        const { questionOneSeIectedIndex } = this.state

        let appointment = {}
        let checkInDateTime = null
        const { params } = route
        if (params) {
            appointment = params.appointment
            checkInDateTime = params.checkInDateTime
        }
        if (questionOneSeIectedIndex == 0) {
            const apiData = this.state
            navigation.navigate('VisitVerificationScreen', { apiData, appointment, checkInDateTime })
        } else {
            this.updateStatusWithReason(appointment)
            // navigation.navigate('CheckoutScreen', { apiData: { questionComment }, appointment, isNotVited: true, checkInDateTime })
        }
    }

    updateStatusWithReason = (appointment) => {
        const { navigation } = this.props
        const { questionComment } = this.state
        const CCCSOACTION = appointment[0].split(';').pop()
        const clientId = Preference.get(preferenceKeys.CLIENT_ID)
        // if(questionComment == ''){
        //     Alert.alert(null, 'Resion is required')
        // }

        const bodyDetails = {
            "SERVICE": "SetData",
            "CLIENTID": clientId,
            "APPID": 1001,
            "OBJECT": "SOMEETING",
            "KEY": CCCSOACTION,
            "FORM": "Πρόγραμμα Εγκαταστάσεων",
            "DATA": {
                "SOACTION": [
                    {
                        "CCCREMARKS2": questionComment,   /// THE REASON THAT WE NOW ASK IN THIS STEP
                        "ACTSTATUS": 6        ////WHEN THE QUESTIONNAIRE IS NOT COMPLETED THEN THE ACTSTATUS SHOULD BE 4 (CANCELLED)
                    }
                ],
            }
        }
        this.setState({ loadingOnSubmit: true })
        requestPost(BASE_URL, JSON.stringify(bodyDetails)).then((response) => {
            this.setState({ loadingOnSubmit: false })
            console.log('onCheckoutPress', 'API', 'requestPost-response', response);
            if (response.success) {
                console.log('onCheckoutPress', 'response', response)
                Alert.alert(null, "Η καταχώρηση πραγματοποιηθηκε",
                    [{
                        text: "OK", onPress: () => {
                            navigation.pop(4)
                        }
                    }],
                    { cancelable: false }
                )
            } else {
                Alert.alert(null, response.error)
            }
        }).catch((error) => {
            this.setState({ loadingOnSubmit: false })
            console.log('onCheckoutPress', 'error', error)
            Alert.alert(null, 'Something went wrong')
        })
    }

    renderOptionModel = () => {
        const { showOptionModal, imageNo, menuId, itemIndex } = this.state
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
                                            this.onChooseFromLibraryPress(imageNo, menuId, itemIndex)
                                        }, 500)
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
                                            this.onTakePhotoPress(imageNo, menuId, itemIndex)
                                        }, 500)
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
            loadingOnSubmit,
            questionComment,
            selectedMenuIndex,
            questionOneSeIectedIndex,
            questionOneOptions,
            questionTwoSeIectedIndex,
            questionTwoOptions,
            questionThreeSeIectedIndex,
            questionThreeOptions,
            questionFourSeIectedIndex,
            questionFourOptions,
            questionFiveSeIectedIndex,
            questionFiveOptions,
            questionSixSeIectedIndex,
            questionSixOptions,
            questionSevenSeIectedIndex,
            questionSevenOptions,
            questionEightSeIectedIndex,
            questionEightOptions,
            questionNineSeIectedIndex,
            questionNineOptions,
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
                    hearderText={'Questionnaire'}
                    containerStyle={{ backgroundColor: colors.lightBlue }}
                    leftIcon={icons.backArrowIcon}
                    leftButtonIconStyle={{ tintColor: colors.white, height: 22 }}
                    onLeftAction={() => {
                        navigation.goBack()
                    }}
                />
                <KeyboardAwareScrollView
                    innerRef={ref => { this.scroll = ref }}
                    // bounces={false}
                    // keyboardShouldPersistTaps='handled'
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    extraHeight={200}
                    contentContainerStyle={{ flexGrow: 1 }}
                    style={{ flexGrow: 1, width: '100%', paddingTop: 20, paddingBottom: 50 }}>
                    <View style={styles.contentContainer}>
                        {/* <QuestionComponent
                            containerStyle={{ marginTop: 10 }}
                            question={'Πραγματοποίηση Επίσκεψης'}
                            questionOptions={questionOneOptions}
                            questionSeIectedIndex={questionOneSeIectedIndex}
                            onCheckBoxPress={(item, index) => {
                                this.setState({ questionOneSeIectedIndex: index, selectedMenuIndex: 0 })
                            }}
                            showResionInput={questionOneSeIectedIndex == 1}
                            questionInputProps={{
                                value: questionComment,
                                placeholder: 'Reason',
                                onChangeText: (text) => {
                                    this.setState({ questionComment: text })
                                },
                                inputAccessoryViewID: inputAccessoryViewID
                            }}
                        /> */}
                        {this.state.visitCardImage.uri != undefined &&
                        <Image
                        source={{uri:this.state.visitCardImage.uri}}
                        style={{height:100,width:200,resizeMode:"cover"}}
                        />}
                        {questionOneSeIectedIndex == 0 &&
                            <>
                                <QuestionComponent
                                    containerStyle={{ marginTop: 10 }}
                                    menuTitle={'ΤΗΡΗΣΗ ΑΡΧΕΙΩΝ'}
                                    question={'Τήρηση αρχείων-Θέματα που εντοπίστηκαν'}
                                    questionOptions={questionTwoOptions}
                                    questionSeIectedIndex={questionTwoSeIectedIndex}
                                    isMultiSelect={true}
                                    onCheckBoxPress={(item, index) => {
                                        let questionTwoOptionsTemp = questionTwoOptions
                                        questionTwoOptionsTemp[index].isChecked = questionTwoOptionsTemp[index].isChecked == true ? false : true
                                        this.setState({ showCommentInput: true, questionTwoOptions: questionTwoOptionsTemp })
                                    }}
                                    selectedMenuIndex={selectedMenuIndex}
                                    questionIndex={1}
                                    onMenuPress={(index) => { this.setState({ selectedMenuIndex: index, questionTwoSeIectedIndex: 0, showCommentInput: true, showImagePickers: false }) }}
                                    questionInputProps={{
                                        placeholder: 'Comment',
                                        onChangeText: (item, itemIndex, text) => {
                                            let questionTwoOptionsTemp = questionTwoOptions
                                            questionTwoOptionsTemp[itemIndex].comment = text
                                            this.setState({ questionTwoOptions: questionTwoOptionsTemp })
                                        },
                                        inputAccessoryViewID: inputAccessoryViewID
                                    }}
                                />
                                <QuestionComponent
                                    containerStyle={{ marginTop: 10 }}
                                    menuTitle={'ΠΥΡΑΣΦΑΛΕΙΑ'}
                                    question={'Πυρασφάλεια-Θέματα που εντοπίστηκαν'}
                                    questionOptions={questionThreeOptions}
                                    questionSeIectedIndex={questionThreeSeIectedIndex}
                                    isMultiSelect={true}
                                    onCheckBoxPress={(item, index) => {
                                        let questionThreeOptionsTemp = questionThreeOptions
                                        questionThreeOptionsTemp[index].isChecked = questionThreeOptionsTemp[index].isChecked == true ? false : true
                                        this.setState({
                                            questionThreeOptions: questionThreeOptionsTemp,
                                            showCommentInput: index == 0 || index == 4 || index == 7,
                                            showImagePickers: index == 1 || index == 2 || index == 3 || index == 5 || index == 6,
                                        })
                                    }}
                                    selectedMenuIndex={selectedMenuIndex}
                                    questionIndex={2}
                                    onMenuPress={(index) => { this.setState({ selectedMenuIndex: index, questionThreeSeIectedIndex: 0, showCommentInput: true, showImagePickers: false, imageOne: null, imageTwo: null }) }}
                                    onCameraPress={(item, itemIndex, imageNo) => {
                                        this.setState({ showOptionModal: true, imageNo, menuId: 2, itemIndex })
                                    }}
                                    onCrossIconPress={(item, itemIndex, imageNo) => {
                                        this.setImageSource(null, imageNo, 2, itemIndex)
                                    }}
                                    questionInputProps={{
                                        placeholder: 'Comment',
                                        onChangeText: (item, itemIndex, text) => {
                                            let questionThreeOptionsTemp = questionThreeOptions
                                            questionThreeOptionsTemp[itemIndex].comment = text
                                            this.setState({ questionThreeOptions: questionThreeOptionsTemp })
                                        },
                                        inputAccessoryViewID: inputAccessoryViewID
                                    }}
                                />
                                <QuestionComponent
                                    containerStyle={{ marginTop: 10 }}
                                    menuTitle={'ΗΛΕΚΤΡΙΚΕΣ ΕΓΚΑΤΑΣΤΑΣΕΙΣ'}
                                    question={'Ηλεκτρικές εγκαταστάσεις-Θέματα που εντοπίστηκαν'}
                                    questionOptions={questionFourOptions}
                                    questionSeIectedIndex={questionFourSeIectedIndex}
                                    isMultiSelect={true}
                                    onCheckBoxPress={(item, index) => {
                                        let questionFourOptionsTemp = questionFourOptions
                                        questionFourOptionsTemp[index].isChecked = questionFourOptionsTemp[index].isChecked == true ? false : true
                                        this.setState({
                                            questionFourOptions: questionFourOptionsTemp,
                                            showCommentInput: index == 0,
                                            showImagePickers: index == 1 || index == 2,
                                        })
                                    }}
                                    selectedMenuIndex={selectedMenuIndex}
                                    questionIndex={3}
                                    onMenuPress={(index) => { this.setState({ selectedMenuIndex: index, questionFourSeIectedIndex: 0, showCommentInput: true, showImagePickers: false, imageOne: null, imageTwo: null }) }}
                                    onCameraPress={(item, itemIndex, imageNo) => {
                                        this.setState({ showOptionModal: true, imageNo, menuId: 3, itemIndex })
                                    }}
                                    onCrossIconPress={(item, itemIndex, imageNo) => {
                                        this.setImageSource(null, imageNo, 3, itemIndex)
                                    }}
                                    questionInputProps={{
                                        placeholder: 'Comment',
                                        onChangeText: (item, itemIndex, text) => {
                                            let questionFourOptionsTemp = questionFourOptions
                                            questionFourOptionsTemp[itemIndex].comment = text
                                            this.setState({ questionFourOptions: questionFourOptionsTemp })
                                        },
                                        inputAccessoryViewID: inputAccessoryViewID
                                    }}
                                />
                                <QuestionComponent
                                    containerStyle={{ marginTop: 10 }}
                                    menuTitle={'ΚΤΙΡΙΑΚΕΣ ΔΟΜΕΣ – ΣΥΝΘΗΚΕΣ ΕΡΓΑΣΙΑΣ'}
                                    question={'Κτιριακές Δομές – Συνθήκες Εργασίας-Θέματα που εντοπίστηκαν'}
                                    questionOptions={questionFiveOptions}
                                    questionSeIectedIndex={questionFiveSeIectedIndex}
                                    isMultiSelect={true}
                                    onCheckBoxPress={(item, index) => {
                                        let questionFiveOptionsTemp = questionFiveOptions
                                        questionFiveOptionsTemp[index].isChecked = questionFiveOptionsTemp[index].isChecked == true ? false : true
                                        this.setState({ questionFiveOptions: questionFiveOptionsTemp, showImagePickers: index == 0 })
                                    }}
                                    selectedMenuIndex={selectedMenuIndex}
                                    questionIndex={4}
                                    onMenuPress={(index) => { this.setState({ selectedMenuIndex: index, questionFiveSeIectedIndex: 0, showImagePickers: true, imageOne: null, imageTwo: null }) }}
                                    onCameraPress={(item, itemIndex, imageNo) => {
                                        this.setState({ showOptionModal: true, imageNo, menuId: 4, itemIndex })
                                    }}
                                    onCrossIconPress={(item, itemIndex, imageNo) => {
                                        this.setImageSource(null, imageNo, 4, itemIndex)
                                    }}
                                    questionInputProps={{
                                        placeholder: 'Comment',
                                        onChangeText: (item, itemIndex, text) => {
                                            let questionFiveOptionsTemp = questionFiveOptions
                                            questionFiveOptionsTemp[itemIndex].comment = text
                                            this.setState({ questionFiveOptions: questionFiveOptionsTemp })
                                        },
                                        inputAccessoryViewID: inputAccessoryViewID
                                    }}
                                />
                                <QuestionComponent
                                    containerStyle={{ marginTop: 10 }}
                                    menuTitle={'ΜΗΧΑΝΗΜΑΤΑ ΕΞΟΠΛΙΣΜΟΣ'}
                                    question={'Μηχανήματα - Εξοπλισμός'}
                                    questionOptions={questionSixOptions}
                                    questionSeIectedIndex={questionSixSeIectedIndex}
                                    isMultiSelect={true}
                                    onCheckBoxPress={(item, index) => {
                                        let questionSixOptionsTemp = questionSixOptions
                                        questionSixOptionsTemp[index].isChecked = questionSixOptionsTemp[index].isChecked == true ? false : true
                                        this.setState({ questionSixOptions: questionSixOptionsTemp })
                                    }}
                                    selectedMenuIndex={selectedMenuIndex}
                                    questionIndex={5}
                                    onMenuPress={(index) => { this.setState({ selectedMenuIndex: index, questionSixSeIectedIndex: 0 }) }}
                                    questionInputProps={{
                                        placeholder: 'Comment',
                                        onChangeText: (item, itemIndex, text) => {
                                            let questionSixOptionsTemp = questionSixOptions
                                            questionSixOptionsTemp[itemIndex].comment = text
                                            this.setState({ questionSixOptions: questionSixOptionsTemp })
                                        },
                                        inputAccessoryViewID: inputAccessoryViewID
                                    }}
                                />
                                <QuestionComponent
                                    containerStyle={{ marginTop: 10 }}
                                    menuTitle={'ΕΠΙΚΙΝΔΥΝΕΣ ΕΡΓΑΣΙΕΣ'}
                                    question={'Επικίνδυνες εργασίες'}
                                    questionOptions={questionSevenOptions}
                                    questionSeIectedIndex={questionSevenSeIectedIndex}
                                    isMultiSelect={true}
                                    onCheckBoxPress={(item, index) => {
                                        let questionSevenOptionsTemp = questionSevenOptions
                                        questionSevenOptionsTemp[index].isChecked = questionSevenOptionsTemp[index].isChecked == true ? false : true
                                        this.setState({ questionSevenOptions: questionSevenOptionsTemp })
                                    }}
                                    selectedMenuIndex={selectedMenuIndex}
                                    questionIndex={6}
                                    onMenuPress={(index) => { this.setState({ selectedMenuIndex: index, questionSevenSeIectedIndex: 0 }) }}
                                    questionInputProps={{
                                        placeholder: 'Comment',
                                        onChangeText: (item, itemIndex, text) => {
                                            let questionSevenOptionsTemp = questionSevenOptions
                                            questionSevenOptionsTemp[itemIndex].comment = text
                                            this.setState({ questionSevenOptions: questionSevenOptionsTemp })
                                        },
                                        inputAccessoryViewID: inputAccessoryViewID
                                    }}
                                />
                                <QuestionComponent
                                    containerStyle={{ marginTop: 10 }}
                                    menuTitle={'ΕΚΘΕΣΗ ΣΕ ΠΑΡΑΓΟΝΤΕΣ'}
                                    question={'Έκθεση σε παράγοντες (Χημικούς- Φυσικούς-Βιολογικούς)'}
                                    questionOptions={questionEightOptions}
                                    questionSeIectedIndex={questionEightSeIectedIndex}
                                    isMultiSelect={true}
                                    onCheckBoxPress={(item, index) => {
                                        let questionEightOptionsTemp = questionEightOptions
                                        questionEightOptionsTemp[index].isChecked = questionEightOptionsTemp[index].isChecked == true ? false : true
                                        this.setState({ questionEightOptions: questionEightOptionsTemp })
                                    }}
                                    selectedMenuIndex={selectedMenuIndex}
                                    questionIndex={7}
                                    onMenuPress={(index) => { this.setState({ selectedMenuIndex: index, questionEightSeIectedIndex: 0 }) }}
                                    questionInputProps={{
                                        placeholder: 'Comment',
                                        onChangeText: (item, itemIndex, text) => {
                                            let questionEightOptionsTemp = questionEightOptions
                                            questionEightOptionsTemp[itemIndex].comment = text
                                            this.setState({ questionEightOptions: questionEightOptionsTemp })
                                        },
                                        inputAccessoryViewID: inputAccessoryViewID
                                    }}
                                />
                                <QuestionComponent
                                    containerStyle={{ marginTop: 10 }}
                                    menuTitle={'ΕΚΠΑΙΔΕΥΣΗ ΚΑΝΟΝΕΣ ΑΣΦΑΛΕΙΑΣ'}
                                    question={'Εκπαίδευση Κανόνες ασφάλειας'}
                                    questionOptions={questionNineOptions}
                                    questionSeIectedIndex={questionNineSeIectedIndex}
                                    isMultiSelect={true}
                                    onCheckBoxPress={(item, index) => {
                                        let questionNineOptionsTemp = questionNineOptions
                                        questionNineOptionsTemp[index].isChecked = questionNineOptionsTemp[index].isChecked == true ? false : true
                                        this.setState({ questionNineOptions: questionNineOptionsTemp })
                                    }}
                                    selectedMenuIndex={selectedMenuIndex}
                                    questionIndex={8}
                                    onMenuPress={(index) => {
                                        this.setState({ selectedMenuIndex: index, questionNineSeIectedIndex: 0 })
                                    }}
                                    questionInputProps={{
                                        placeholder: 'Comment',
                                        onChangeText: (item, itemIndex, text) => {
                                            let questionNineOptionsTemp = questionNineOptions
                                            questionNineOptionsTemp[itemIndex].comment = text
                                            this.setState({ questionNineOptions: questionNineOptionsTemp })
                                        },
                                        inputAccessoryViewID: inputAccessoryViewID
                                    }}
                                />
                            </>
                        }
                        <View style={{ flex: 1 }} />
                        {/* {questionOneSeIectedIndex !== -1 &&
                            <View style={{ width: '100%', marginBottom: 20 }}>
                                <Button
                                    activityIndicatorProps={{ loading: loadingOnSubmit }}
                                    containerStyle={{ backgroundColor: colors.primary, marginBottom: 20, width: 120, height: 40 }}
                                    buttonTextStyle={{ color: colors.white, fontSize: 18 }}
                                    buttonText={'Submit'}
                                    onPressButton={() => {
                                        this.onSubmitPress()
                                    }}
                                />
                            </View>
                        } */}
                    </View>
                </KeyboardAwareScrollView>
                <KeyboardAccessoryView inputAccessoryViewID={inputAccessoryViewID} />
                { this.renderOptionModel()}
                {loadingOnSubmit && <View style={StyleSheet.absoluteFill} />}
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
        paddingHorizontal: 20,
        paddingBottom:40
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
});
