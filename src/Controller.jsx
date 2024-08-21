import React, { useState } from 'react';
import BasicInfo from './pages/BasicInfo';
import ModePage from './pages/ModePage';
import ResultPage from './pages/ResultPage';
import AdminPage from './pages/AdminPage';
import TrueFalseQuestionPage from './pages/TrueFalseQuestionPage';
import MultipleChoiceQuestionPage from './pages/MultipleChoiceQuestionPage';

const Controller = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [basicInfo, setBasicInfo] = useState(null);
  const [modeInfo, setModeInfo] = useState({
    grade: '',
    level: '',
    number: '',
    mode: '',
    startCountdown: 1,
    queIntervel: 1,
    questionFormat: '',  // 新增：題目格式（是非題/二選一選擇題）
    answerTiming: '',    // 新增：答題時機（出題後答題/出題時答題）
    pronunciationType: '' // 新增：發音類型（注音/發音）
  });
  const [questionInfo, setQuestionInfo] = useState(null);
  const [resultInfo, setResultInfo] = useState(null);

  const nextPage = () => {
    setCurrentPage(prevPage => (prevPage + 1) % 4);
  };

  const handleBasicInfoComplete = (data) => {
    console.log("基本資料完成，所有答案：\n", data);
    setBasicInfo(data);
    nextPage();
  };

  const handleModeComplete = (data) => {
    console.log("模式選擇完成，所有答案：\n", data);
    setModeInfo(data);
    nextPage();
  };

  const handleQuestionComplete = async (data) => {
    setQuestionInfo(data);
    console.log("測驗完成，所有答案：\n", basicInfo, modeInfo, data, resultInfo);

    // 發送請求到後端
    try {
      const response = await fetch('http://localhost:8080/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          basicInfo,
          modeInfo,
          questionInfo: data,
          resultInfo,
        }),
      });

      if (response.ok) {
        console.log('數據發送成功');
      } else {
        console.error('數據發送失敗');
      }
    } catch (error) {
      console.error('發送請求時出錯:', error);
    }

    nextPage();
  };

  const handleResultComplete = (data) => {
    setResultInfo(data);
    nextPage();
    // 這裡可以添加完成所有關卡後的邏輯
  };

  const isAdmin = basicInfo?.name === 'admin' && basicInfo?.researchCode === 'admin';

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      {currentPage === 0 && <BasicInfo onComplete={handleBasicInfoComplete} />}
      {currentPage === 1 && (
        isAdmin ? <AdminPage /> : <ModePage onComplete={handleModeComplete} />
      )}
      {currentPage === 2 && (
        modeInfo.questionFormat === '是非題' ? (
          <TrueFalseQuestionPage
            startCountdown={modeInfo.startCountdown}
            queIntervel={modeInfo.queIntervel}
            answerTiming={modeInfo.answerTiming}
            pronunciationType={modeInfo.pronunciationType}
            onComplete={handleQuestionComplete}
          />
        ) : (
          <MultipleChoiceQuestionPage
            startCountdown={modeInfo.startCountdown}
            queIntervel={modeInfo.queIntervel}
            answerTiming={modeInfo.answerTiming}
            pronunciationType={modeInfo.pronunciationType}
            onComplete={handleQuestionComplete}
          />
        )
      )}
      {currentPage === 3 && <ResultPage resultInfo={questionInfo} onComplete={handleResultComplete} />}
    </div>
  );
};

export default Controller;