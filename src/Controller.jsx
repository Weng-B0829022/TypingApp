import React, { useState } from 'react';
import BasicInfo from './pages/BasicInfo';
import ModePage from './pages/ModePage';
import ResultPage from './pages/ResultPage';
import AdminPage from './pages/AdminPage';
import TrueFalseQuestionPage from './pages/TrueFalseQuestionPage';
import MultipleChoiceQuestionPage from './pages/MultipleChoiceQuestionPage';
import { QueryClient, QueryClientProvider } from 'react-query';


const queryClient = new QueryClient();
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
    pronunciationType: '', // 新增：發音類型（注音/發音）
    isRetryIncorrect: '否',
    errorRetry:'加入最後面',
    questions:[{"text": "","target": "","ans": "","display": ""}]
  });
  const [answerInfo, setAnswerInfo] = useState(null);

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

  const handleQuestionComplete = (data) => {//完成答題後將結果存入AnswerInfo
    setAnswerInfo(data);
    console.log("測驗完成，所有答案：\n", basicInfo, modeInfo);
    nextPage();
  };

  const handleResultComplete = (data) => {
    console.log("結果查看面完成，所有答案：\n", basicInfo, modeInfo, answerInfo, data);
    nextPage();
  };

  const isAdmin = basicInfo?.name === 'admin' && basicInfo?.researchCode === 'admin';

  return (
    <QueryClientProvider client={queryClient}>
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
              isFeedbackImmediately={modeInfo.mode === '立即回饋'}
              isRetryIncorrect={modeInfo.isRetryIncorrect === '是'}
              errorRetry={modeInfo.errorRetry}
              questions={modeInfo.questions}
              onComplete={handleQuestionComplete}
            />
          ) : (
            <MultipleChoiceQuestionPage
              startCountdown={modeInfo.startCountdown}
              queIntervel={modeInfo.queIntervel}
              answerTiming={modeInfo.answerTiming}
              pronunciationType={modeInfo.pronunciationType}
              isFeedbackImmediately={modeInfo.mode === '立即回饋'}
              isRetryIncorrect={modeInfo.isRetryIncorrect === '是'}
              errorRetry={modeInfo.errorRetry}
              questions={modeInfo.questions}
              onComplete={handleQuestionComplete}
            />
          )
        )}
        {currentPage === 3 && (
          <ResultPage 
            answerInfo={answerInfo} 
            basicInfo={basicInfo}
            modeInfo={modeInfo}
            onComplete={handleResultComplete}
          />
        )}
      </div>
    </QueryClientProvider>
  );
};

export default Controller;