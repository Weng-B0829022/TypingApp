import React, { useState } from 'react';
import BasicInfo from './pages/BasicInfo';
import ModePage from './pages/ModePage';
import QuestionPage from './pages/QuestionPage';
import ResultPage from './pages/ResultPage';
import AdminPage from './pages/AdminPage';

const Controller = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [basicInfo, setBasicInfo] = useState(null);
  const [modeInfo, setModeInfo] = useState(null);
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
    setModeInfo(data);
    nextPage();
  };

  const handleQuestionComplete = (data) => {
    setQuestionInfo(data);
    nextPage();
  };

  const handleResultComplete = (data) => {
    setResultInfo(data);
    nextPage();
    // Add logic for after completing all stages here
  };

  const isAdmin = basicInfo?.name === 'admin' && basicInfo?.researchCode === 'admin';

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      {currentPage === 0 && <BasicInfo onComplete={handleBasicInfoComplete} />}
      {currentPage === 1 && (
        isAdmin ? <AdminPage /> : <ModePage onComplete={handleModeComplete} />
      )}
      {currentPage === 2 && (
        <QuestionPage
          startCountdown={modeInfo?.startCountdown}
          queIntervel={modeInfo?.queIntervel}
          onComplete={handleQuestionComplete}
        />
      )}
      {currentPage === 3 && (
        <ResultPage 
          resultInfo={questionInfo} 
          basicInfo={basicInfo}
          modeInfo={modeInfo}
          onComplete={handleResultComplete} 
        />
      )}
    </div>
  );
};

export default Controller;