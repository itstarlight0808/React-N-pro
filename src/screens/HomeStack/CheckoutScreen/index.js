import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import Preference from 'react-native-preference';
import moment from 'moment';
import NetInfo from '@react-native-community/netinfo';
import { connectRealm } from 'react-native-realm';

//components
import Header from '../../../components/Header';
import Loader from '../../../components/Loader';
import Button from '../../../components/Button';

//utils
import colors from '../../../utils/colors';
import preferenceKeys from '../../../utils/preferenceKeys';
import { requestPost, BASE_URL } from '../../../utils/API';

//assets
import images from '../../../assets/images';
import icons from '../../../assets/icons';
import {getImages, questionImagesKeys, sentryMessage} from "../../../utils/utils";

const { width } = Dimensions.get('window');
let status;

class CheckoutScreen extends Component {
  constructor(props) {
    super(props);
    const { params } = props.route;
    let apiData = {};
    let appointment = {};
    let isNotVited = false;
    let checkInDateTime = null;
    if (params) {
      apiData = params.apiData;
      appointment = params.appointment;
      isNotVited = params.isNotVited;
      checkInDateTime = params.checkInDateTime;
    }
    this.state = {
      loading: false,
	    loadingOnCheckout: false,
      uploadingImage: 0,
      uploadingImageError: false,
      apiData: apiData,
      appointment: appointment,
      clientId: Preference.get(preferenceKeys.CLIENT_ID),
      userId: Preference.get(preferenceKeys.USER_ID),
      isNotVited: isNotVited,
      checkInDateTime: checkInDateTime,
	    questionImages: []
    };
  }

  componentDidMount() {
    // console.log("Appointment", this.state.appointment[1])
    sentryMessage('Checkout mount');
    this.statusCheck();
  }
  statusCheck() {
    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        status = true;
      } else {
        status = false;
      }
    })
  }

  onCheckoutPress = () => {
    sentryMessage('onCheckoutPress');
    this.statusCheck()
    const { navigation } = this.props;
    const { apiData, appointment, clientId, userId, isNotVited } = this.state;
    const CCCSOACTION = appointment[0].split(';').pop();
    const bodyDetails = {
      SERVICE: 'SetData',
      CLIENTID: clientId,
      APPID: 1001,
      OBJECT: 'CRMCUSNAIRE',
      KEY: '',
      FORM: 'GENERALQSTR',
      DATA: {
        CRMCUSNAIRE: [
          {
            CCCSOACTION: CCCSOACTION, ///// IT'S THE ID OF THE MEETING, FROM SOMEETING OBJECT, BROWSER SOneP, THE ID IS LOCATED IN ZOOMINFO FIELD, AND IT'S ALWAYS THE LAST PART OF THE STRING WHICH IS NUMERIC FOR EXAMPLE IN THIS MEETING "SOMEETING,FORM:Πρόγραμμα Εγκαταστάσεων;248468" THE ID IS THE 248468
            USERS: userId, /////USER ID, WE GET IT FROM THE WEBSERVICEINST BROWSER, OBJECT INST. IN OUR EXAMPLE IS THE 10359
            CCCNOHINTBOOK: apiData.questionTwoOptions[0].isChecked ? 1 : 0, /////QUESTION CHECKBOX: Δεν υπάρχει βιβλίο υποδείξεων
            CCCNOHINTBOOKR1: apiData.questionTwoOptions[0].comment, /////COMMENT OF THE ABOVE QUESTION
            CCCHINTBOOKNOTAVL: apiData.questionTwoOptions[1].isChecked ? 1 : 0, ///// Το βιβλίο υποδείξεων δεν ήταν διαθέσιμο κατά την επίσκεψη
            CCCHINTBOOKNOTAVLR1: apiData.questionTwoOptions[1].comment, /////COMMENT OF THE ABOVE QUESTION
            CCC3RECKEEP: apiData.questionTwoOptions[2].isChecked ? 1 : 0,//	Το Βιβλίο Υποδείξεων δεν υπογράφεται από τον υπεύθυνο της εγκατάστασης CCC3RECKEEP
            CCCNOACCIDENTBOOK: apiData.questionTwoOptions[3].isChecked ? 1 : 0, ////// Δεν υπάρχει Βιβλίο Ατυχημάτων
            CCCNOACCIDENTBOOKR1: apiData.questionTwoOptions[3].comment, /////COMMENT OF THE ABOVE QUESTION
            CCC5RECKEEP: apiData.questionTwoOptions[4].isChecked ? 1 : 0, /////	Το Βιβλίο Ατυχημάτων δεν συμπληρώνεται
            CCC6RECKEEP: apiData.questionTwoOptions[5].isChecked ? 1 : 0, /////	Δεν υπάρχει Βιβλίο Συντήρησης Συστημάτων Ασφαλείας
            CCCNOOCCUPRISKAS: apiData.questionTwoOptions[6].isChecked ? 1 : 0, /////Δεν υπάρχει Εκτίμηση Επαγγελματικού Κινδύνου
            CCCNOOCCUPRISKAS1R: apiData.questionTwoOptions[6].comment, /////COMMENT OF THE ABOVE QUESTION
            CCC8RECKEEP: apiData.questionTwoOptions[7].isChecked ? 1 : 0, /////	Η Εκτίμηση Επαγγελματικού Κινδύνου χρήζει αναθεώρησης
            CCC9RECKEEP: apiData.questionTwoOptions[8].isChecked ? 1 : 0, /////	Άλλο
            CCC9RECKEEPR1: apiData.questionTwoOptions[8].comment, /////COMMENT OF THE ABOVE QUESTION
            CCCNOFIRESAFETYPLANS: apiData.questionThreeOptions[0].isChecked ? 1 : 0, /////Δεν υπάρχει εγκεκριμένη μελέτη ή σχέδια πυρασφάλειας
            CCCNOFIRESAFETYPLANSR1: apiData.questionThreeOptions[0].comment, /////COMMENT OF THE ABOVE QUESTION
            CCC2FIRESAFETY: apiData.questionThreeOptions[1].isChecked ? 1 : 0, /////	Η μελέτη και τα σχέδια πυρασφάλειας δεν ανταποκρίνονται στην υπάρχουσα κατάσταση
            CCC3FIRESAFETY: apiData.questionThreeOptions[2].isChecked ? 1 : 0, /////	Δεν υπάρχουν πυροσβεστήρες
            CCCUNMARKEDFIREEXTING: apiData.questionThreeOptions[3].isChecked
              ? 1
              : 0, /////Εντοπίστηκαν πυροσβεστήρες χωρίς σήμανση
            CCC4FIRESAFETYR1: apiData.questionThreeOptions[3].comment, /////COMMENT OF THE ABOVE QUESTION
            CCCINACCESFIREEXTING: apiData.questionThreeOptions[4].isChecked
              ? 1
              : 0, /////Εντοπίστηκαν μη προσβάσιμοι πυροσβεστήρες
            CCC5FIRESAFETYR1: apiData.questionThreeOptions[4].comment, /////COMMENT OF THE ABOVE QUESTION
            CCC6FIRESAFETY: apiData.questionThreeOptions[5].isChecked
              ? 1
              : 0, /////	Εντοπίστηκαν πυροσβεστήρες εκτός ορίων ελέγχου
            CCC6FIRESAFETYR1: apiData.questionThreeOptions[5].comment, /////COMMENT OF THE ABOVE QUESTION
            CCC7FIRESAFETY: apiData.questionThreeOptions[6].isChecked
              ? 1
              : 0,//	Εντοπίστηκαν οδεύσεις διαφυγής χωρίς σήμανση  (possibility of two photos :  ,   )
            CCC7FIRESAFETYR1: apiData.questionThreeOptions[6].comment, /////COMMENT OF THE ABOVE QUESTION
            CCCEMERGEXITSINACCESS: apiData.questionThreeOptions[7].isChecked
              ? 1
              : 0, ////Εντοπίστηκαν οδεύσεις διαφυγής/έξοδοι κινδύνου μη προσπελάσιμες
            CCC8FIRESAFETYR1: apiData.questionThreeOptions[7].comment, /////COMMENT OF THE ABOVE QUESTION
            CCC9FIRESAFETY: apiData.questionThreeOptions[8].isChecked ? 1 : 0, ////	Δεν υπάρχουν σχέδια διαφυγής
            CCC10FIRESAFETY: apiData.questionThreeOptions[9].isChecked ? 1 : 0, ////	Τα σχέδια διαφυγής δεν ανταποκρίνονται στην υπάρχουσα κατάσταση
            CCC11FIRESAFETY: apiData.questionThreeOptions[10].isChecked
              ? 1
              : 0, //Τα σχέδια διαφυγής δεν είναι βάσει του προτύπου (ISO 23601 – διάστασης Α3)
            CCCUNMARKEDFIRENESTS: apiData.questionThreeOptions[11].isChecked
              ? 1
              : 0, ////Εντοπίστηκαν πυροσβεστικές φωλιές χωρίς σήμανση
            CCCINACCESSFIRENESTS: apiData.questionThreeOptions[12].isChecked
              ? 1
              : 0, ////Εντοπίστηκαν μη προσβάσιμες πυροσβεστικές φωλιές
            CCCNOFIRESAFETYTEAM: apiData.questionThreeOptions[13].isChecked
              ? 1
              : 0, ////Δεν υπάρχει ομάδα πυρασφάλειας
            CCCNOFIRESAFETYTEAMR1: apiData.questionThreeOptions[13].comment, ////COMMENT FOR THE ABOVE QUESTION
            CCC15FIRESAFETY: apiData.questionThreeOptions[14].isChecked
              ? 1
              : 0,//Δεν έχει γίνει ενημέρωση για ενέργειες σε περίπτωση εκκένωσης -εργασία σε εγκαταστάσεις πελατών
            CCC15FIRESAFETYR1: apiData.questionThreeOptions[14].comment, /////COMMENT OF THE ABOVE QUESTION
            CCC16FIRESAFETY: apiData.questionThreeOptions[15].isChecked
              ? 1
              : 0,// Οι εργαζόμενοι δεν έχουν συμμετάσχει σε άσκηση εκκένωσης της εγκατάστασης
            CCC17FIRESAFETY: apiData.questionThreeOptions[16].isChecked
              ? 1
              : 0,// Δεν υπάρχει σήμανση στον ανελκυστήρα για μη χρήση σε περίπτωση φωτιάς και σεισμού
            CCC18FIRESAFETY: apiData.questionThreeOptions[17].isChecked
              ? 1
              : 0,// Το πιστοποιητικό πυροπροστασίας έχει λήξει
            CCC18FIRESAFETYR1: apiData.questionThreeOptions[17].comment, /////COMMENT OF THE ABOVE QUESTION
            CCC19FIRESAFETY: apiData.questionThreeOptions[18].isChecked
              ? 1
              : 0,// Το κόκκινο βιβλίο συντήρησης δεν είναι ενημερωμένο
            CCC19FIRESAFETYR1: apiData.questionThreeOptions[18].comment, /////COMMENT OF THE ABOVE QUESTION
            CCC20FIRESAFETY: apiData.questionThreeOptions[19].isChecked
              ? 1
              : 0,// Άλλο
            CCC20FIRESAFETYR1: apiData.questionThreeOptions[19].comment, /////COMMENT OF THE ABOVE QUESTION


            CCC1ELECTRICINST: apiData.questionFourOptions[0].isChecked
              ? 1
              : 0, ////	Δεν υπάρχει Πιστοποιητικό ηλεκτρολογικής εγκατάστασης
            CCCNOELECTRINSTCERT: apiData.questionFourOptions[1].isChecked
              ? 1
              : 0, ////Δεν υπάρχει - επιδείχθηκε Πιστοποιητικό ηλεκτρολογικής εγκατάστασης
            CCCNOELECTRINSTCERTR1: apiData.questionFourOptions[1].comment, ////COMMENT FOR THE ABOVE QUESTION
            CCCNORELAY30MA: apiData.questionFourOptions[2].isChecked ? 1 : 0, ////Εντοπίστηκαν πίνακες χωρίς ρελέ 30 mA
            CCCNOTHUNDERSIGN: apiData.questionFourOptions[3].isChecked ? 1 : 0, ////Εντοπίστηκαν πίνακες χωρίς σήμανση (κεραυνός)
            CCC5ELECTRICINST: apiData.questionFourOptions[4].isChecked ? 1 : 0, ////Εντοπίστηκαν πίνακες χωρίς καπάκι
            CCC6ELECTRICINST: apiData.questionFourOptions[5].isChecked ? 1 : 0, ////6.	Εκτεθειμένα καλώδια στα δάπεδα (εκτός καναλιών)
            CCC7ELECTRICINST: apiData.questionFourOptions[6].isChecked ? 1 : 0, ////Συσκευές / εγκαταστάσεις με φθαρμένα καλώδια / πρίζες
            CCC8ELECTRICINST: apiData.questionFourOptions[7].isChecked ? 1 : 0, ////Άλλο
            CCC8ELECTRICINSTR1: apiData.questionFourOptions[7].comment, ////COMMENT FOR THE ABOVE QUESTION

            CCC1BUILDINGS: apiData.questionFiveOptions[0].isChecked ? 1 : 0, ////Υπάρχουν δάπεδα φθαρμένα (σημαντικό σε περιπτώσεις χρήσης από οχήματα)
            CCC2BUILDINGS: apiData.questionFiveOptions[1].isChecked
              ? 1
              : 0,// Υπάρχουν εμπόδια στα δάπεδα
            CCC3BUILDINGS: apiData.questionFiveOptions[2].isChecked
              ? 1
              : 0,// Παρουσιάζουν επικίνδυνες κλίσεις
            CCC3BUILDINGSR1: apiData.questionFiveOptions[2].comment, /////COMMENT OF THE ABOVE QUESTION
            CCC4BUILDINGS: apiData.questionFiveOptions[3].isChecked
              ? 1
              : 0,// Παρουσιάζουν κινδύνους ολισθήματος
            CCC5BUILDINGS: apiData.questionFiveOptions[4].isChecked
              ? 1
              : 0,// Υπάρχουν ακάλυπτα ανοίγματα (φρεάτια – λάκκοι – λακούβες)
            CCC5BUILDINGSR1: apiData.questionFiveOptions[4].comment, /////COMMENT OF THE ABOVE QUESTION
            CCC6BUILDINGS: apiData.questionFiveOptions[5].isChecked
              ? 1
              : 0,// Υπάρχει συσσώρευση υδάτων – υγρών

            CCC7BUILDINGS: apiData.questionFiveOptions[6].isChecked
              ? 1
              : 0,// Άλλο
            CCC7BUILDINGSR1: apiData.questionFiveOptions[6].comment, /////COMMENT OF THE ABOVE QUESTION
            CCC8BUILDINGS: apiData.questionFiveOptions[7].isChecked
              ? 1
              : 0,// Υπάρχουν διαφανή ή διαφώτιστα ή υαλωτά τοιχώματα κοντά σε θέσεις εργασίας και σε διαδρόμους κυκλοφορίας,

            CCC9BUILDINGS: apiData.questionFiveOptions[8].isChecked
              ? 1
              : 0,// Υπάρχουν διαφανή ή διαφώτιστα ή υαλωτά τοιχώματα κοντά σε θέσεις εργασίας και σε διαδρόμους κυκλοφορίας

            CCC10BUILDINGS: apiData.questionFiveOptions[9].isChecked
              ? 1
              : 0,// Άλλο
            CCC10BUILDINGSR1: apiData.questionFiveOptions[9].comment, /////COMMENT OF THE ABOVE QUESTION
            CCC11BUILDINGS: apiData.questionFiveOptions[10].isChecked
              ? 1
              : 0,// Δεν έχουν επισήμανση, σε ύψος οφθαλμών, στις θύρες που είναι διαφανείς.
            CCC12BUILDINGS: apiData.questionFiveOptions[11].isChecked
              ? 1
              : 0,// Δεν είναι διαφανείς (ή έχουν κάποιο παράθυρο) Θύρες και πύλες που ανοίγονται και προς τις δύο κατευθύνσεις

            CCC13BUILDINGS: apiData.questionFiveOptions[12].isChecked
              ? 1
              : 0,// Υπάρχουν συρόμενες πόρτες που δεν διαθέτουν σύστημα ασφαλείας, το οποίο να τις εμποδίζει να βγαίνουν από τις τροχιές τους και να πέφτουν
            CCC14BUILDINGS: apiData.questionFiveOptions[13].isChecked
              ? 1
              : 0,// Υπάρχουν θύρες και πύλες που ανοίγουν προς τα πάνω χωρίς να είναι εφοδιασμένες με σύστημα ασφαλείας, το οποίο να τις εμποδίζει να πέφτουν
            CCC15BUILDINGS: apiData.questionFiveOptions[14].isChecked
              ? 1
              : 0,// Υπάρχουν μηχανοκίνητες θύρες και πύλες χωρίς να είναι εφοδιασμένες με συστήματα επείγουσας ακινητοποίησης, τα οποία να εντοπίζονται εύκολα.
            CCC16BUILDINGS: apiData.questionFiveOptions[15].isChecked
              ? 1
              : 0,// Υπάρχουν θύρες που ανοίγουν προς διάδρομο ή κλιμακοστάσιο, με κίνδυνο να τραυματιστεί διερχόμενος εργαζόμενος κατά το άνοιγμα

            CCC17BUILDINGS: apiData.questionFiveOptions[16].isChecked
              ? 1
              : 0,// Άλλο
            CCC17BUILDINGSR1: apiData.questionFiveOptions[16].comment, /////COMMENT OF THE ABOVE QUESTION
            CCC18BUILDINGS: apiData.questionFiveOptions[17].isChecked
              ? 1
              : 0,// Δεν υπάρχει προστασία έναντι πτώσης σε κάθε δάπεδο που έχουν πρόσβαση οι εργαζόμενοι και που βρίσκεται σε ύψος μεγαλύτερο του 0.75 μέτρα

            CCC19BUILDINGS: apiData.questionFiveOptions[18].isChecked
              ? 1
              : 0,// Υπάρχουν τεχνικοί και ηλεκτρομηχανολογικοί χώροι χωρίς έλεγχο εισόδου, μόνο για εξουσιοδοτημένα άτομα


            CCC19BUILDINGSR1: apiData.questionFiveOptions[18].comment, /////COMMENT OF THE ABOVE QUESTION
            CCC20BUILDINGS: apiData.questionFiveOptions[19].isChecked
              ? 1
              : 0,// Υπάρχουν φρεάτια, ανοίγματα, με κίνδυνο πτώσης

            CCC21BUILDINGS: apiData.questionFiveOptions[20].isChecked
              ? 1
              : 0,// Ράμπες και εξέδρες φόρτωσης χωρίς προσθαφαιρούμενο κιγκλίδωμα προστασίας

            CCC22BUILDINGS: apiData.questionFiveOptions[21].isChecked
              ? 1
              : 0,// Άλλο
            CCC22BUILDINGSR1: apiData.questionFiveOptions[21].comment, /////COMMENT OF THE ABOVE QUESTION
            CCC23BUILDINGS: apiData.questionFiveOptions[22].isChecked
              ? 1
              : 0,// Υπάρχουν κλιμακοστάσια χωρίς χειρολισθήρα (και στις δύο πλευρές αν το πλάτος είναι >1,2 μέτρα)



            CCC23BUILDINGSR1: apiData.questionFiveOptions[22].comment, /////COMMENT OF THE ABOVE QUESTION
            CCC24BUILDINGS: apiData.questionFiveOptions[23].isChecked
              ? 1
              : 0,// Υπάρχουν κλιμακοστάσια χωρίς αντιολισθητική επεξεργασία στα σκαλοπάτια ή αντιολισθητικές ταινίες


            CCC25BUILDINGS: apiData.questionFiveOptions[24].isChecked
              ? 1
              : 0,// Άλλο
            CCC25BUILDINGSR1: apiData.questionFiveOptions[24].comment, /////COMMENT OF THE ABOVE QUESTION
            CCC26BUILDINGS: apiData.questionFiveOptions[25].isChecked
              ? 1
              : 0,// Δεν υπάρχουν κατάλληλες διαστάσεις χώρου εργασίας
            CCC27BUILDINGS: apiData.questionFiveOptions[26].isChecked
              ? 1
              : 0,// Δεν υπάρχει φυσικός ή τεχνητός αερισμός
            CCC28BUILDINGS: apiData.questionFiveOptions[27].isChecked
              ? 1
              : 0,// Δεν υπάρχει φυσικός φωτισμός
            CCC29BUILDINGS: apiData.questionFiveOptions[28].isChecked
              ? 1
              : 0,// Δεν υπάρχει δυνατότητα επίτευξης κατάλληλης θερμοκρασίας (κυρίως σε διοικητικούς χώρους)
            CCC30BUILDINGS: apiData.questionFiveOptions[29].isChecked
              ? 1
              : 0,// Δεν τηρούνται εργονομικοί κανόνες (καθίσματα χωρίς ρύθμιση ύψους- στήριξη πλάτης, αντανακλάσεις


            CCC31BUILDINGS: apiData.questionFiveOptions[30].isChecked
              ? 1
              : 0,// Άλλο
            CCC31BUILDINGSR1: apiData.questionFiveOptions[30].comment, /////COMMENT OF THE ABOVE QUESTION


            CCCBYPASSPROTECTDEVICES : apiData.questionSixOptions[0].isChecked
              ? 1
              : 0,//Πραγματοποιείται χρήση χειρισμός εξοπλισμού, με παράκαμψη των προστατευτικών διατάξεων πχ μη χρήση προστατευτικών διατάξεων σε μηχανές κοπής, διάτρησης συμπίεσης, πάσης φύσεως)

            CCC1EQUIPR1: apiData.questionSixOptions[0].comment, /////COMMENT OF THE ABOVE QUESTION

            CCCNOAPPROPTOOLS: apiData.questionSixOptions[1].isChecked ? 1 : 0, ////Δεν χρησιμοποιούνται τα  κατάλληλα εργαλεία χειρός ή δεν είναι σε καλή κατάσταση ανάλογα το είδος της εργασίας (πχ φθαρμένα εργαλεί, ακατάλληλα κοπίδια, ηλεκτρικά εργαλεία χωρίς μόνωση ή προστατευτικά)
            CCC3EQUIP: apiData.questionSixOptions[2].isChecked
              ? 1
              : 0,// Υπάρχουν ανυψωτικά (περονοφόρα, παλετοφόρα, ανελκυστήρες, αναβατόρια, γερανογέφυρες, γερανοί) χωρίς πιστοποιητικό ανυψωτικής ικανότητας
            CCC3EQUIPR1: apiData.questionSixOptions[2].comment, /////COMMENT OF THE ABOVE QUESTION
            CCC4EQUIP: apiData.questionSixOptions[3].isChecked
              ? 1
              : 0,// Δεν τηρείται αρχείο συντήρησης εξοπλισμού
            CCC5EQUIP: apiData.questionSixOptions[4].isChecked
              ? 1
              : 0,// Υπάρχουν ακάλυπτα κινούμενα μέρη σε μηχανήματα – εξοπλισμό
            CCC6EQUIP: apiData.questionSixOptions[5].isChecked
              ? 1
              : 0,// Δεν υπάρχουν στις θέσεις εργασίας/χειρισμού, κομβία ακαριαίας πέδησης (σε μηχανές ή συγκροτήματα μηχανών όπως μηχανές παραγωγής, ιμαντοταινίες, ραουλόδρομοι κ.α
            CCC7EQUIP: apiData.questionSixOptions[6].isChecked
              ? 1
              : 0,// Υπάρχουν όργανα χειρισμού σε επικίνδυνα σημεία και ζώνες

            CCC7EQUIPR1: apiData.questionSixOptions[6].comment, /////COMMENT OF THE ABOVE QUESTION
            CCC8EQUIP: apiData.questionSixOptions[7].isChecked
              ? 1
              : 0,// Χειρισμός μηχανημάτων τεχνικού έργου  χωρίς (α) άδεια χειριστή εφόσον η ισχύς είναι ≥ 10KW ή (β) έγγραφη ανάθεση εφόσον η ισχύς είναι < 10KWγια το (α)
            CCC8EQUIPR1: apiData.questionSixOptions[7].comment, /////COMMENT OF THE ABOVE QUESTION
            CCC9EQUIP: apiData.questionSixOptions[8].isChecked
              ? 1
              : 0,// Δεν υπάρχουν ασφαλιστικές διατάξεις (για μετακίνηση φορτίου, ασφαλιστικά δικτύων αερίων και υγρών, στήριξη καταπακτών κ.α)
            CCC10EQUIP: apiData.questionSixOptions[9].isChecked
              ? 1
              : 0,// Παρατηρείται δυσλειτουργία εξοπλισμού με κίνδυνο ατυχήματος (πχ πάγος σε ψυγεία, διαρροές)
            CCC10EQUIPR1: apiData.questionSixOptions[9].comment, /////COMMENT OF THE ABOVE QUESTION
            CCC11EQUIP: apiData.questionSixOptions[10].isChecked
              ? 1
              : 0,// Άλλο
            CCC11EQUIPR1: apiData.questionSixOptions[10].comment, /////COMMENT OF THE ABOVE QUESTION

            CCC1DANGER: apiData.questionSevenOptions[0].isChecked
              ? 1
              : 0,// Χρήση φορητών κλιμάκων χωρίς μέτρα προστασίας (2ος εργαζόμενος για συγκράτηση, κατάσταση κλιμάκων, σημεία τοποθέτησης)
            CCC2DANGER: apiData.questionSevenOptions[1].isChecked
              ? 1
              : 0,// Χρήση ακατάλληλου εξοπλισμού για πρόσβαση σε ύψος (πχ σκάλες χωρίς κατάλληλο ύψος, σκαμπό)
            CCC2DANGERR1: apiData.questionSevenOptions[1].comment, /////COMMENT OF THE ABOVE QUESTION
            CCC3DANGER: apiData.questionSevenOptions[2].isChecked
              ? 1
              : 0,// Εργασία σε ύψος χωρίς προστασία (σε χώρους χωρίς κιγκλιδώματα ή χωρίς χρήση ζώνης ή χωρίς 2ο εργαζόμενο να κρατάει την φορητή σκάλα)

            CCC4DANGER: apiData.questionSevenOptions[3].isChecked
              ? 1
              : 0,//Ανύψωση εργαζομένων με παλετοφόρα χωρίς ειδικό καλάθι
            CCC5DANGER: apiData.questionSevenOptions[4].isChecked
              ? 1
              : 0,//Τεχνική εργασία από εργαζομένους που δεν έχουν κατάλληλη άδεια (ηλεκτρολόγοι- ψυκτικοί-υδραυλικοί κ.α)
            CCC5DANGERR1: apiData.questionSevenOptions[4].comment, /////COMMENT OF THE ABOVE QUESTION
            CCC6DANGER: apiData.questionSevenOptions[5].isChecked
              ? 1
              : 0,//Μοναχική εργασία σε χώρους που δεν εποπτεύονται
            CCC6DANGERR1: apiData.questionSevenOptions[5].comment, /////COMMENT OF THE ABOVE QUESTION
            CCCNOMAPUSE: apiData.questionSevenOptions[6].isChecked ? 1 : 0, ////Εργασία χωρίς χρήση ΜΑΠ, εφόσον απαιτούνται
            CCC7DANGERR1: apiData.questionSevenOptions[6].comment, ////Εργασία χωρίς χρήση ΜΑΠ, εφόσον απαιτούνται
            CCC8DANGER: apiData.questionSevenOptions[7].isChecked
              ? 1
              : 0,//Άλλο
            CCC8DANGERR1: apiData.questionSevenOptions[7].comment, /////COMMENT OF THE ABOVE QUESTION

            CCCNOISEEXPOSURE: apiData.questionEightOptions[0].isChecked ? 1 : 0, ////Έκθεση σε θόρυβο χωρίς μέτρα προστασίας (Μετρήσεις- χρήση ΜΑΠ)
            CCC1EXPOSURER1: apiData.questionEightOptions[0].comment, /////COMMENT OF THE ABOVE QUESTION
            CCCUSEOFCHEMICALS: apiData.questionEightOptions[1].isChecked
              ? 1
              : 0, ////Χρήση χημικών χωρίς μέτρα προστασίας (ΜΑΠ βάσει δελτίων χημικών)
            CCC2EXPOSURER1: apiData.questionEightOptions[1].comment, /////COMMENT OF THE ABOVE QUESTION
            CCC3EXPOSURE: apiData.questionEightOptions[2].isChecked
              ? 1
              : 0,//Έκθεση σε Βιολογικούς παράγοντες χωρίς μέτρα προστασίας (ΜΑΠ)
            CCC3EXPOSURER1: apiData.questionEightOptions[2].comment, /////COMMENT OF THE ABOVE QUESTION
            CCC4EXPOSURE: apiData.questionEightOptions[3].isChecked
              ? 1
              : 0,//Εργασία σε ακτινοβολίες (χωρίς αξιολόγηση μέτρων προστασίας)
            CCC4EXPOSURER1: apiData.questionEightOptions[3].comment, /////COMMENT OF THE ABOVE QUESTION
            CCC5EXPOSURE: apiData.questionEightOptions[4].isChecked
              ? 1
              : 0,//Εργασία σε ακτινοβολίες (χωρίς αξιολόγηση μέτρων προστασίας)
            CCC5EXPOSURER1: apiData.questionEightOptions[4].comment, /////COMMENT OF THE ABOVE QUESTION

            CCC1SAFETYRULES: apiData.questionNineOptions[0].isChecked
              ? 1
              : 0,//Δεν υπάρχουν σαφείς οδηγίες ή και εκπαίδευση (πχ εργαζόμενοι σε βιομηχανία, super market, καθαριότητα)
            CCC1SAFETYRULESR1: apiData.questionNineOptions[0].comment, /////COMMENT OF THE ABOVE QUESTION
            CCC2SAFETYRULES: apiData.questionNineOptions[1].isChecked
              ? 1
              : 0,//Δεν τηρούνται οι οδηγίες/ κανόνες ασφάλειας
            CCC2SAFETYRULESR1: apiData.questionNineOptions[1].comment, /////COMMENT OF THE ABOVE QUESTION
            CCC3SAFETYRULES: apiData.questionNineOptions[2].isChecked
              ? 1
              : 0,//Δεν χορηγούνται τα κατάλληλα ΜΑΠ
            CCC3SAFETYRULESR1: apiData.questionNineOptions[2].comment, /////COMMENT OF THE ABOVE QUESTION
            CCC4SAFETYRULES: apiData.questionNineOptions[3].isChecked
              ? 1
              : 0,//Δεν γίνεται χρήση των ΜΑΠ
            CCC4SAFETYRULESR1: apiData.questionNineOptions[3].comment, /////COMMENT OF THE ABOVE QUESTION
            CCC5SAFETYRULES: apiData.questionNineOptions[4].isChecked
              ? 1
              : 0,//Πραγματοποίηση εργασιών από εργαζόμενους που δεν έχουν κατάλληλη άδεια
            CCC5SAFETYRULESR1: apiData.questionNineOptions[4].comment, /////COMMENT OF THE ABOVE QUESTION
            CCC6SAFETYRULES: apiData.questionNineOptions[5].isChecked
              ? 1
              : 0,//Άλλο
            CCC6SAFETYRULESR1: apiData.questionNineOptions[5].comment, /////COMMENT OF THE ABOVE QUESTION
            CCC7SAFETYRULES: apiData.questionNineOptions[6].isChecked
              ? 1
              : 0,//Πραγματοποιήθηκε εκπαίδευση εργαζομένων (συμπληρώστε τον τύπο εκπαίδευσης)
            CCC7SAFETYRULESR1: apiData.questionNineOptions[6].comment, /////COMMENT OF THE ABOVE QUESTION
            CCC8SAFETYRULES: apiData.questionNineOptions[7].isChecked
              ? 1
              : 0,//Αριθμό εκπαιδευομένων
            CCC8SAFETYRULESR1: apiData.questionNineOptions[7].comment, /////COMMENT OF THE ABOVE QUESTION
            CCC9SAFETYRULES: apiData.questionNineOptions[8].isChecked
              ? 1
              : 0,//Παρακαλώ εισάγετε φωτογραφία εντύπου εκπαιδεύσεων
            CCCVISITCARDPHOTO: apiData.visitCardImage
              ? `data:image/png;base64, ${apiData.visitCardImage?.base64}`
              : '', ////Insert the Visit Card Photo
            ...questionImagesKeys.reduce((p,c) =>({...p,[c]:''}),{})
          },
        ],
      },
    };
	  const images = getImages(apiData);
    let id = Math.floor(100000 + Math.random() * 900000);
    // console.log('bodyDetails: --->\n\n\n\n' + JSON.stringify(bodyDetails));
    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        this.setState({ loadingOnCheckout: true });
        requestPost(BASE_URL, JSON.stringify(bodyDetails))
          .then((response) => {
            console.log(
              'onCheckoutPress',
              'API',
              'requestPost-response',
              response,
            );
            if (response.success) {
              console.log('onCheckoutPress', 'response', response);
              this.setState({responseId:response.id});
	            const questionImages = Object.keys(images).map(name => ({questionId:id,
                name, image:images[name],key:response.id,clientId,userId,CCCSOACTION,uploaded:images[name]?0:1}));
	            this.storeImagesInDB(questionImages);
	            this.updateStatus(clientId, CCCSOACTION, response.id)
		            .then(() => {
									this.uploadImages(questionImages,response.id);
                });
            } else {
              this.setState({ loadingOnCheckout: false });
              Alert.alert(null, response.error);
            }
          })
          .catch((error) => {
            this.setState({ loadingOnCheckout: false });
            console.log('onCheckoutPress', 'error', error);
            Alert.alert(null, 'Something went wrong');
          });
      }
    });
    Preference.set(preferenceKeys.LAST_QUESTION_ID, id);
    const apptitle = appointment[5];
    this.storeQuestionInDB({
      id: id,
      apiData: apiData,
      onlineStatus: status,
      date: this.state.checkInDateTime,
      questionDate: this.state.appointment[1],
      title: apptitle,
      facility: this.state.appointment[6],
      CRMCUSNAIRE: bodyDetails.DATA.CRMCUSNAIRE,
    });
  };
  storeImagesInDB = (questionImages) =>{
	  const { realm } = this.props;
	  try {
		  realm.write(() => {
			  const saved = questionImages.map(q => realm.create('QuestionImages', q));
			  console.log(saved.length);
			  this.setState({questionImages:saved});
		  });
	  } catch (e) {
		  console.log(e,e.message);
	  }
  };
  uploadImages = async (questionImages) => {
  	let {uploadingImage} = this.state;
	  const { realm,navigation } = this.props;
    try {
      const remain = questionImages.filter(p => !p.uploaded);
    this.setState({uploadingImageError:false,uploadingRemain:remain.length});
		  for (let q of remain) {
        const {clientId, image, name, key, CCCSOACTION, userId,} = q;
			  uploadingImage++;
			  this.setState({uploadingImage});
			  console.log(`uploading ${name}`);
			  const bodyDetails = {
				  SERVICE: 'SetData',
				  CLIENTID: clientId,
				  APPID: 1001,
				  OBJECT: 'CRMCUSNAIRE',
				  KEY: key,
				  FORM: 'GENERALQSTR',
				  DATA: {
					  CRMCUSNAIRE: [
						  {
							  CCCSOACTION,
							  USERS: userId,
							  [name]: image
						  },
					  ],
				  },
			  };
			  await requestPost(BASE_URL, JSON.stringify(bodyDetails))
				  .then((response) => {
					  this.setState({loadingOnCheckout: false});
					  console.log('uploadImage', 'API', 'requestPost-response', response);
					  if (response.success) {
              realm.write(() => {
                q.uploaded = 1;
              });
					  } else {
						  console.log('uploadImage', 'error', response);
					  }
				  })
		  }
		  Alert.alert(
			  null,
			  `Η επίσκεψη ολοκληρώθηκε επιτυχώς με ID: ${this.state.responseId}`,
			  [
				  {
					  text: 'OK',
					  onPress: () => {
						  navigation.pop(5);
					  },
				  },
			  ],
			  {cancelable: false},
		  )
		  console.log('completed image uploading');
	  } catch (e) {
	    this.setState({uploadingImageError:true});
		  console.log('some error occured',e.message);
		  Alert.alert(null, 'Something went wrong');
	  }
  };
  storeQuestionInDB(body) {
    sentryMessage('storeQuestionInDB');
    const { navigation } = this.props;
    let temp = JSON.parse(
      this.props.realm.objects('HomeDates')[0].appointments[0],
    );
    let newArray = [];
    const { realm } = this.props;
    try {
      realm.write(() => {
        realm.delete(realm.objects('HomeDates'));
      });
      realm.write(() => {
        let appointment = realm.create('Questions', {questions: []});
        appointment.questions.push(JSON.stringify(body));
      });
    } catch (e) {
      sentryMessage('storeQuestionInDB error'+e.message,e);
      console.log(e,e.message);
    }
    for (let i = 0; i < temp.length; i++) {
      if (temp[i][0] == this.state.appointment[0]) {
        let tempArray = temp[i];
        tempArray[tempArray.length - 2] = 3;
        newArray.push(tempArray);
      } else {
        newArray.push(temp[i]);
      }
    }
    try {
      realm.write(() => {
        realm.create('HomeDates', {appointments: [JSON.stringify(newArray)]});
      });
    } catch (e) {
      console.log(e,e.message);
    }
    NetInfo.fetch().then((state) => {
      !state.isConnected && navigation.pop(5);
    });
  }
  updateStatus = (clientId, CCCSOACTION, responseId) => {
    const { checkInDateTime } = this.state;
    const { navigation } = this.props;
    const bodyDetails = {
      SERVICE: 'SetData',
      CLIENTID: clientId,
      APPID: 1001,
      OBJECT: 'SOMEETING',
      KEY: CCCSOACTION,
      FORM: 'Πρόγραμμα Εγκαταστάσεων',
      DATA: {
        SOACTION: [
          {
            NUM04: responseId,
            ACTSTATUS: 3,
            Date04: checkInDateTime,
            Date05: moment().format('YYYY-MM-DD HH:mm'),
          },
        ],
      },
    };
   return requestPost(BASE_URL, JSON.stringify(bodyDetails))
      .then((response) => {
        this.setState({ loadingOnCheckout: false });
        console.log('onCheckoutPress', 'API', 'requestPost-response', response);
        if (response.success) {
          console.log('onCheckoutPress', 'response', response);
          this.setState({ loadingOnCheckout: false });
          sentryMessage('submitted responseId -'+responseId);
          // Alert.alert(
          //   null,
          //   `Η επίσκεψη ολοκληρώθηκε επιτυχώς με ID: ${responseId}`,
          //   [
          //     {
          //       text: 'OK',
          //       onPress: () => {
          //         navigation.pop(5);
          //       },
          //     },
          //   ],
          //   { cancelable: false },
          // );
        } else {
          Alert.alert(null, response.error);
        }
      })
      .catch((error) => {
        this.setState({ loadingOnCheckout: false });
        console.log('onCheckoutPress', 'error', error);
        Alert.alert(null, 'Something went wrong');
      });
  };


  render() {
    const { loading, loadingOnCheckout,questionImages,uploadingRemain, uploadingImage ,uploadingImageError} = this.state;
    const { navigation } = this.props;
    return (
      <SafeAreaView style={styles.container}>
        <View
          style={{
            height: 60,
            width: '100%',
            justifyContent: 'flex-end',
            marginTop: Platform.OS == 'android' ? StatusBar.currentHeight : 0,
          }}>
          <Image
            style={{ width: 120, height: 35, resizeMode: 'contain' }}
            source={images.logoImage}
          />
        </View>
        <Header
          hearderText={"Facility's Name"}
          containerStyle={{ backgroundColor: colors.lightBlue }}
          leftIcon={icons.backArrowIcon}
          leftButtonIconStyle={{ tintColor: colors.white, height: 22 }}
          onLeftAction={() => {
            navigation.goBack();
          }}
        />
        <View style={styles.contentContainer}>
          <Text style={{ fontSize: 18, marginTop: 80 }}>
            {'Questionnaire completed successfully'}
          </Text>
          <Button
            activityIndicatorProps={{ loading: loadingOnCheckout }}
            containerStyle={{
              backgroundColor: colors.primary,
              width: '70%',
              marginTop: 80,
            }}
            buttonTextStyle={{ color: colors.white, fontSize: 18 }}
            buttonText={'Check Out'}
            onPressButton={() => {
              this.onCheckoutPress();
            }}
          />

	        {uploadingImage > 0 && <Text style={{ fontSize: 18, marginTop: 20 }}>
		        {`Uploading image ${uploadingImage} of ${uploadingRemain}`}
	        </Text>}
          {uploadingImageError && <Button
            containerStyle={{
              backgroundColor: colors.primary,
              width: '70%',
              marginTop: 20,
            }}
            buttonTextStyle={{ color: colors.white, fontSize: 18 }}
            buttonText={'Retry'}
            onPressButton={() => {
              this.uploadImages(questionImages);
            }}
          />}
          {loadingOnCheckout && <View style={StyleSheet.absoluteFill} />}
        </View>
      </SafeAreaView>
    );
  }
}
export default connectRealm(CheckoutScreen, {
  schemas: ['HomeDates', 'Questions'],
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
    width: '100%',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.white,
    width: '100%',
    height: '100%',
  },
});
