import React, { useState } from 'react'
import BasicInfo from './pages/BasicInfo'
import ModePage from './pages/ModePage'
import QuestionPage from './pages/QuestionPage'
import ResultPage from './pages/ResultPage'

const Controller = () => {
  const [currentPage, setCurrentPage] = useState(0)
  const [basicInfo, setBasicInfo] = useState(null)
  const [modeInfo, setModeInfo] = useState(null)
  const [questionInfo, setQuestionInfo] = useState(null)
  const [resultInfo, setResultInfo] = useState(null)

  const nextPage = () => {
    setCurrentPage(prevPage => (prevPage + 1)%4 )
  }

  const handleBasicInfoComplete = (data) => {
    console.log("基本資料完成，所有答案：\n", data);
    setBasicInfo(data)
    nextPage()
  }

  const handleModeComplete = (data) => {
    setModeInfo(data)
    nextPage()
  }

  const handleQuestionComplete = (data) => {
    setQuestionInfo(data)
    console.log("測驗完成，所有答案：\n", basicInfo, modeInfo, questionInfo, resultInfo);
    nextPage()
  }

  const handleResultComplete = (data) => {
    setResultInfo(data)
    nextPage()
    // 這裡可以添加完成所有關卡後的邏輯
  }

  return (
      <>
        {currentPage === 0 && <BasicInfo onComplete={handleBasicInfoComplete} />}
        {currentPage === 1 && <ModePage onComplete={handleModeComplete}/>}
        {currentPage === 2 && <QuestionPage onComplete={handleQuestionComplete} />}
        {currentPage === 3 && <ResultPage resultInfo={questionInfo} onComplete={handleResultComplete} />}
      </>
  );
}

export default Controller