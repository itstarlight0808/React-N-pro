import * as Sentry from "@sentry/react-native";

export const groupBy = function (xs, key) {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

export const questionImagesKeys = [
  'CCCUNMARKEDFIREEXTINGP1',
  'CCCUNMARKEDFIREEXTINGP2',
  'CCCINACCESFIREEXTINGP1',
  'CCCINACCESFIREEXTINGP2',
  'CCC7FIRESAFETYP1',
  'CCC7FIRESAFETYP2',
  'CCCEMERGEXITSINACCESSP1',
  'CCCEMERGEXITSINACCESSP2',
  'CCC11FIRESAFETYP1',
  'CCC11FIRESAFETYP2',
  'CCCUNMARKEDFIRENESTSP1',
  'CCCUNMARKEDFIRENESTSP2',
  'CCCINACCESSFIRENESTS1',
  'CCCINACCESSFIRENESTS2',
  'CCCNORELAY30MAP1',
  'CCCNORELAY30MAP2',
  'CCCNOTHUNDERSIGNP1',
  'CCCNOTHUNDERSIGNP2',
  'CCC5ELECTRICINSTP1',
  'CCC5ELECTRICINSTP2',
  'CCC6ELECTRICINSTP1',
  'CCC6ELECTRICINSTP2',
  'CCC7ELECTRICINSTP1',
  'CCC7ELECTRICINSTP2',
  'CCC1BUILDINGSP1',
  'CCC1BUILDINGSP2',
  'CCC2BUILDINGSP1',
  'CCC2BUILDINGSP2',
  'CCC3BUILDINGSP1',
  'CCC3BUILDINGSP2',
  'CCC5BUILDINGSP1',
  'CCC5BUILDINGSP2',
  'CCC6BUILDINGSP1',
  'CCC6BUILDINGSP2',
  'CCC8BUILDINGSP1',
  'CCC8BUILDINGSP2',
  'CCC9BUILDINGSP1',
  'CCC9BUILDINGSP2',
  'CCC11BUILDINGSP1',
  'CCC11BUILDINGSP2',
  'CCC12BUILDINGSP1',
  'CCC12BUILDINGSP2',
  'CCC16BUILDINGSP1',
  'CCC16BUILDINGSP2',
  'CCC18BUILDINGSP1',
  'CCC18BUILDINGSP2',
  'CCC19BUILDINGSP1',
  'CCC19BUILDINGSP2',
  'CCC20BUILDINGSP1',
  'CCC20BUILDINGSP2',
  'CCC21BUILDINGSP1',
  'CCC21BUILDINGSP2',
  'CCC23BUILDINGSP1',
  'CCC23BUILDINGSP2',
  'CCC24BUILDINGSP1',
  'CCC24BUILDINGSP2',
  'CCC30BUILDINGSP1',
  'CCC30BUILDINGSP2',
  'CCC1EQUIPP1',
  'CCC1EQUIPP2',
  'CCC5EQUIPP1',
  'CCC5EQUIPP2',
  'CCC7EQUIPP1',
  'CCC7EQUIPP2',
  'CCC9EQUIPP1',
  'CCC9EQUIPP2',
  'CCC10EQUIPP1',
  'CCC10EQUIPP2',
  'CCC1DANGERP1',
  'CCC1DANGERP2',
  'CCC3DANGERP1',
  'CCC3DANGERP2',
  'CCC9SAFETYRULESP1',
  'CCC9SAFETYRULESP2',
  'CCCHINTBOOKPHOTO1',
  'CCCHINTBOOKPHOTO2',
];

export const getImages = (apiData) => {
  return {
    CCCUNMARKEDFIREEXTINGP1: apiData.questionThreeOptions[3].imageOne
      ? `data:image/png;base64, ${apiData.questionThreeOptions[3].imageOne?.base64}`
      : '', ////BASE64 IMAGE
    CCCUNMARKEDFIREEXTINGP2: apiData.questionThreeOptions[3].imageTwo
      ? `data:image/png;base64, ${apiData.questionThreeOptions[3].imageTwo?.base64}`
      : '', ////BASE64 IMAGE
    CCCINACCESFIREEXTINGP1: apiData.questionThreeOptions[4].imageOne
      ? `data:image/png;base64, ${apiData.questionThreeOptions[4].imageOne?.base64}`
      : '', ////BASE64 IMAGE
    CCCINACCESFIREEXTINGP2: apiData.questionThreeOptions[4].imageTwo
      ? `data:image/png;base64, ${apiData.questionThreeOptions[4].imageTwo?.base64}`
      : '', ////BASE64 IMAGE
    CCC7FIRESAFETYP1: apiData.questionThreeOptions[6].imageOne
      ? `data:image/png;base64, ${apiData.questionThreeOptions[6].imageOne?.base64}`
      : '', ////BASE64 IMAGE
    CCC7FIRESAFETYP2: apiData.questionThreeOptions[6].imageTwo
      ? `data:image/png;base64, ${apiData.questionThreeOptions[6].imageTwo?.base64}`
      : '', ////BASE64 IMAGE
    CCCEMERGEXITSINACCESSP1: apiData.questionThreeOptions[7].imageOne
      ? `data:image/png;base64, ${apiData.questionThreeOptions[7].imageOne?.base64}`
      : '', ////BASE64 IMAGE
    CCCEMERGEXITSINACCESSP2: apiData.questionThreeOptions[7].imageTwo
      ? `data:image/png;base64, ${apiData.questionThreeOptions[7].imageTwo?.base64}`
      : '', ////BASE64 IMAGE
    CCC11FIRESAFETYP1: apiData.questionThreeOptions[10].imageOne
      ? `data:image/png;base64, ${apiData.questionThreeOptions[10].imageOne?.base64}`
      : '', ////BASE64 IMAGE
    CCC11FIRESAFETYP2: apiData.questionThreeOptions[10].imageTwo
      ? `data:image/png;base64, ${apiData.questionThreeOptions[10].imageTwo?.base64}`
      : '', ////BASE64 IMAGE
    CCCUNMARKEDFIRENESTSP1: apiData.questionThreeOptions[11].imageOne
      ? `data:image/png;base64, ${apiData.questionThreeOptions[11].imageOne?.base64}`
      : '', ////BASE64 IMAGE
    CCCUNMARKEDFIRENESTSP2: apiData.questionThreeOptions[11].imageTwo
      ? `data:image/png;base64, ${apiData.questionThreeOptions[11].imageTwo?.base64}`
      : '', ////BASE64 IMAGE
    CCCINACCESSFIRENESTS1: apiData.questionThreeOptions[12].imageOne
      ? `data:image/png;base64, ${apiData.questionThreeOptions[12].imageOne?.base64}`
      : '', ////BASE64 IMAGE
    CCCINACCESSFIRENESTS2: apiData.questionThreeOptions[12].imageTwo
      ? `data:image/png;base64, ${apiData.questionThreeOptions[12].imageTwo?.base64}`
      : '', ////BASE64 IMAGE
    CCCNORELAY30MAP1: apiData.questionFourOptions[2].imageOne
      ? `data:image/png;base64, ${apiData.questionFourOptions[2].imageOne?.base64}`
      : '', ////BASE64 IMAGE
    CCCNORELAY30MAP2: apiData.questionFourOptions[2].imageTwo
      ? `data:image/png;base64, ${apiData.questionFourOptions[2].imageTwo?.base64}`
      : '', ////BASE64 IMAGE
    CCCNOTHUNDERSIGNP1: apiData.questionFourOptions[3].imageOne
      ? `data:image/png;base64, ${apiData.questionFourOptions[3].imageOne?.base64}`
      : '', ////BASE64 IMAGE
    CCCNOTHUNDERSIGNP2: apiData.questionFourOptions[3].imageTwo
      ? `data:image/png;base64, ${apiData.questionFourOptions[3].imageTwo?.base64}`
      : '', ////BASE64 IMAGE
    CCC5ELECTRICINSTP1: apiData.questionFourOptions[4].imageOne
      ? `data:image/png;base64, ${apiData.questionFourOptions[4].imageOne?.base64}`
      : '', ////BASE64 IMAGE
    CCC5ELECTRICINSTP2: apiData.questionFourOptions[4].imageTwo
      ? `data:image/png;base64, ${apiData.questionFourOptions[4].imageTwo?.base64}`
      : '', ////BASE64 IMAGE
    CCC6ELECTRICINSTP1: apiData.questionFourOptions[5].imageOne
      ? `data:image/png;base64, ${apiData.questionFourOptions[5].imageOne?.base64}`
      : '', ////BASE64 IMAGE
    CCC6ELECTRICINSTP2: apiData.questionFourOptions[5].imageTwo
      ? `data:image/png;base64, ${apiData.questionFourOptions[5].imageTwo?.base64}`
      : '', ////BASE64 IMAGE
    CCC7ELECTRICINSTP1: apiData.questionFourOptions[6].imageOne
      ? `data:image/png;base64, ${apiData.questionFourOptions[6].imageOne?.base64}`
      : '', ////BASE64 IMAGE
    CCC7ELECTRICINSTP2: apiData.questionFourOptions[6].imageTwo
      ? `data:image/png;base64, ${apiData.questionFourOptions[6].imageTwo?.base64}`
      : '', ////BASE64 IMAGE
    CCC1BUILDINGSP1: apiData.questionFiveOptions[0].imageOne
      ? `data:image/png;base64, ${apiData.questionFiveOptions[0].imageOne?.base64}`
      : '', ////BASE64 IMAGE
    CCC1BUILDINGSP2: apiData.questionFiveOptions[0].imageTwo
      ? `data:image/png;base64, ${apiData.questionFiveOptions[0].imageTwo?.base64}`
      : '', ////BASE64 IMAGE
    CCC2BUILDINGSP1: apiData.questionFiveOptions[1].imageOne
      ? `data:image/png;base64, ${apiData.questionFiveOptions[1].imageOne?.base64}`
      : '', ////BASE64 IMAGE
    CCC2BUILDINGSP2: apiData.questionFiveOptions[1].imageTwo
      ? `data:image/png;base64, ${apiData.questionFiveOptions[1].imageTwo?.base64}`
      : '', ////BASE64 IMAGE
    CCC3BUILDINGSP1: apiData.questionFiveOptions[2].imageOne
      ? `data:image/png;base64, ${apiData.questionFiveOptions[2].imageOne?.base64}`
      : '', ////BASE64 IMAGE
    CCC3BUILDINGSP2: apiData.questionFiveOptions[2].imageTwo
      ? `data:image/png;base64, ${apiData.questionFiveOptions[2].imageTwo?.base64}`
      : '', ////BASE64 IMAGE
    CCC5BUILDINGSP1: apiData.questionFiveOptions[4].imageOne
      ? `data:image/png;base64, ${apiData.questionFiveOptions[4].imageOne?.base64}`
      : '', ////BASE64 IMAGE
    CCC5BUILDINGSP2: apiData.questionFiveOptions[4].imageTwo
      ? `data:image/png;base64, ${apiData.questionFiveOptions[4].imageTwo?.base64}`
      : '', ////BASE64 IMAGE
    CCC6BUILDINGSP1: apiData.questionFiveOptions[5].imageOne
      ? `data:image/png;base64, ${apiData.questionFiveOptions[5].imageOne?.base64}`
      : '', ////BASE64 IMAGE
    CCC6BUILDINGSP2: apiData.questionFiveOptions[5].imageTwo
      ? `data:image/png;base64, ${apiData.questionFiveOptions[5].imageTwo?.base64}`
      : '', ////BASE64 IMAGE
    CCC8BUILDINGSP1: apiData.questionFiveOptions[7].imageOne
      ? `data:image/png;base64, ${apiData.questionFiveOptions[7].imageOne?.base64}`
      : '', ////BASE64 IMAGE
    CCC8BUILDINGSP2: apiData.questionFiveOptions[7].imageTwo
      ? `data:image/png;base64, ${apiData.questionFiveOptions[7].imageTwo?.base64}`
      : '', ////BASE64 IMAGE
    CCC9BUILDINGSP1: apiData.questionFiveOptions[8].imageOne
      ? `data:image/png;base64, ${apiData.questionFiveOptions[8].imageOne?.base64}`
      : '', ////BASE64 IMAGE
    CCC9BUILDINGSP2: apiData.questionFiveOptions[8].imageTwo
      ? `data:image/png;base64, ${apiData.questionFiveOptions[8].imageTwo?.base64}`
      : '', ////BASE64 IMAGE
    CCC11BUILDINGSP1: apiData.questionFiveOptions[10].imageOne
      ? `data:image/png;base64, ${apiData.questionFiveOptions[10].imageOne?.base64}`
      : '', ////BASE64 IMAGE
    CCC11BUILDINGSP2: apiData.questionFiveOptions[10].imageTwo
      ? `data:image/png;base64, ${apiData.questionFiveOptions[10].imageTwo?.base64}`
      : '', ////BASE64 IMAGE
    CCC12BUILDINGSP1: apiData.questionFiveOptions[11].imageOne
      ? `data:image/png;base64, ${apiData.questionFiveOptions[11].imageOne?.base64}`
      : '', ////BASE64 IMAGE
    CCC12BUILDINGSP2: apiData.questionFiveOptions[11].imageTwo
      ? `data:image/png;base64, ${apiData.questionFiveOptions[11].imageTwo?.base64}`
      : '', ////BASE64 IMAGE
    CCC16BUILDINGSP1: apiData.questionFiveOptions[15].imageOne
      ? `data:image/png;base64, ${apiData.questionFiveOptions[15].imageOne?.base64}`
      : '', ////BASE64 IMAGE
    CCC16BUILDINGSP2: apiData.questionFiveOptions[15].imageTwo
      ? `data:image/png;base64, ${apiData.questionFiveOptions[15].imageTwo?.base64}`
      : '', ////BASE64 IMAGE
    CCC18BUILDINGSP1: apiData.questionFiveOptions[17].imageOne
      ? `data:image/png;base64, ${apiData.questionFiveOptions[17].imageOne?.base64}`
      : '', ////BASE64 IMAGE
    CCC18BUILDINGSP2: apiData.questionFiveOptions[17].imageTwo
      ? `data:image/png;base64, ${apiData.questionFiveOptions[17].imageTwo?.base64}`
      : '', ////BASE64 IMAGE
    CCC19BUILDINGSP1: apiData.questionFiveOptions[18].imageOne
      ? `data:image/png;base64, ${apiData.questionFiveOptions[18].imageOne?.base64}`
      : '', ////BASE64 IMAGE
    CCC19BUILDINGSP2: apiData.questionFiveOptions[18].imageTwo
      ? `data:image/png;base64, ${apiData.questionFiveOptions[18].imageTwo?.base64}`
      : '', ////BASE64 IMAGE
    CCC20BUILDINGSP1: apiData.questionFiveOptions[19].imageOne
      ? `data:image/png;base64, ${apiData.questionFiveOptions[19].imageOne?.base64}`
      : '', ////BASE64 IMAGE
    CCC20BUILDINGSP2: apiData.questionFiveOptions[19].imageTwo
      ? `data:image/png;base64, ${apiData.questionFiveOptions[19].imageTwo?.base64}`
      : '', ////BASE64 IMAGE
    CCC21BUILDINGSP1: apiData.questionFiveOptions[20].imageOne
      ? `data:image/png;base64, ${apiData.questionFiveOptions[20].imageOne?.base64}`
      : '', ////BASE64 IMAGE
    CCC21BUILDINGSP2: apiData.questionFiveOptions[19].imageTwo
      ? `data:image/png;base64, ${apiData.questionFiveOptions[20].imageTwo?.base64}`
      : '', ////BASE64 IMAGE
    CCC23BUILDINGSP1: apiData.questionFiveOptions[22].imageOne
      ? `data:image/png;base64, ${apiData.questionFiveOptions[22].imageOne?.base64}`
      : '', ////BASE64 IMAGE
    CCC23BUILDINGSP2: apiData.questionFiveOptions[22].imageTwo
      ? `data:image/png;base64, ${apiData.questionFiveOptions[22].imageTwo?.base64}`
      : '', ////BASE64 IMAGE
    CCC24BUILDINGSP1: apiData.questionFiveOptions[23].imageOne
      ? `data:image/png;base64, ${apiData.questionFiveOptions[23].imageOne?.base64}`
      : '', ////BASE64 IMAGE
    CCC24BUILDINGSP2: apiData.questionFiveOptions[23].imageTwo
      ? `data:image/png;base64, ${apiData.questionFiveOptions[23].imageTwo?.base64}`
      : '', ////BASE64 IMAGE
    CCC30BUILDINGSP1: apiData.questionFiveOptions[29].imageOne
      ? `data:image/png;base64, ${apiData.questionFiveOptions[29].imageOne?.base64}`
      : '', ////BASE64 IMAGE
    CCC30BUILDINGSP2: apiData.questionFiveOptions[29].imageTwo
      ? `data:image/png;base64, ${apiData.questionFiveOptions[29].imageTwo?.base64}`
      : '', ////BASE64 IMAGE
    CCC1EQUIPP1: apiData.questionSixOptions[0].imageOne
      ? `data:image/png;base64, ${apiData.questionSixOptions[0].imageOne?.base64}`
      : '', ////BASE64 IMAGE
    CCC1EQUIPP2: apiData.questionSixOptions[0].imageTwo
      ? `data:image/png;base64, ${apiData.questionSixOptions[0].imageTwo?.base64}`
      : '', ////BASE64 IMAGE
    CCC5EQUIPP1: apiData.questionSixOptions[4].imageOne
      ? `data:image/png;base64, ${apiData.questionSixOptions[4].imageOne?.base64}`
      : '', ////BASE64 IMAGE
    CCC5EQUIPP2: apiData.questionSixOptions[4].imageTwo
      ? `data:image/png;base64, ${apiData.questionSixOptions[4].imageTwo?.base64}`
      : '', ////BASE64 IMAGE
    CCC7EQUIPP1: apiData.questionSixOptions[6].imageOne
      ? `data:image/png;base64, ${apiData.questionSixOptions[6].imageOne?.base64}`
      : '', ////BASE64 IMAGE
    CCC7EQUIPP2: apiData.questionSixOptions[6].imageTwo
      ? `data:image/png;base64, ${apiData.questionSixOptions[6].imageTwo?.base64}`
      : '', ////BASE64 IMAGE
    CCC9EQUIPP1: apiData.questionSixOptions[8].imageOne
      ? `data:image/png;base64, ${apiData.questionSixOptions[8].imageOne?.base64}`
      : '', ////BASE64 IMAGE
    CCC9EQUIPP2: apiData.questionSixOptions[8].imageTwo
      ? `data:image/png;base64, ${apiData.questionSixOptions[8].imageTwo?.base64}`
      : '', ////BASE64 IMAGE
    CCC10EQUIPP1: apiData.questionSixOptions[9].imageOne
      ? `data:image/png;base64, ${apiData.questionSixOptions[9].imageOne?.base64}`
      : '', ////BASE64 IMAGE
    CCC10EQUIPP2: apiData.questionSixOptions[9].imageTwo
      ? `data:image/png;base64, ${apiData.questionSixOptions[9].imageTwo?.base64}`
      : '', ////BASE64 IMAGE
    CCC1DANGERP1: apiData.questionSevenOptions[0].imageOne
      ? `data:image/png;base64, ${apiData.questionSevenOptions[0].imageOne?.base64}`
      : '', ////BASE64 IMAGE
    CCC1DANGERP2: apiData.questionSevenOptions[0].imageTwo
      ? `data:image/png;base64, ${apiData.questionSevenOptions[0].imageTwo?.base64}`
      : '', ////BASE64 IMAGE
    CCC3DANGERP1: apiData.questionSevenOptions[2].imageOne
      ? `data:image/png;base64, ${apiData.questionSevenOptions[2].imageOne?.base64}`
      : '', ////BASE64 IMAGE
    CCC3DANGERP2: apiData.questionSevenOptions[2].imageTwo
      ? `data:image/png;base64, ${apiData.questionSevenOptions[2].imageTwo?.base64}`
      : '', ////BASE64 IMAGE
    CCC9SAFETYRULESP1: apiData.questionNineOptions[8].imageOne
      ? `data:image/png;base64, ${apiData.questionNineOptions[8].imageOne?.base64}`
      : '', ////BASE64 IMAGE
    CCC9SAFETYRULESP2: apiData.questionNineOptions[8].imageTwo
      ? `data:image/png;base64, ${apiData.questionNineOptions[8].imageTwo?.base64}`
      : '', ////BASE64 IMAGE
    CCCHINTBOOKPHOTO1: apiData.hintBookImageOne
      ? `data:image/png;base64, ${apiData.hintBookImageOne?.base64}`
      : '', /////Insert the Hint Book Photo
    CCCHINTBOOKPHOTO2: apiData.hintBookImageTwo
      ? `data:image/png;base64, ${apiData.hintBookImageTwo?.base64}`
      : '', ////Insert the Hint Book Photo2
    CCCVISITCARDPHOTO: apiData.visitCardImage
      ? `data:image/png;base64, ${apiData.visitCardImage?.base64}`
      : '', ////Insert the Visit Card Photo
  };
}

export function sentryMessage(message: string, extra: any) {
  Sentry.withScope(scope => {
    scope.setExtras(extra);
    Sentry.captureMessage(message);
  });
}
