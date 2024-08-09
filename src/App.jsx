import { useState, useEffect } from 'react'
import './App.css'
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import APIPTBR from './api-pt-br.json';
import APIENUS from './api-en-us.json';
import ptBR from './assets/lang/pt-br';
import enUS from './assets/lang/en-US';

const translations = {
  en: enUS,
  pt: ptBR
};

const apis = {
  en: APIENUS,
  pt: APIPTBR
}

function App() {
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  useEffect(() => {
    const storedLanguage = localStorage.getItem('language');
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
  }, [language]);

  const [currentStep, setCurrentStep] = useState(0);
  const [finalizado, setFinalizado] = useState(false);
  const [questionTitle, setQuestionTitle] = useState('');
  const [questionDescription, setQuestionDescription] = useState(translations[language].startDescription);
  const [buttonName, setButtonName] = useState(translations[language].startButton);

  const alpha = Array.from(Array(26)).map((e, i) => i + 65);
  const alphabet = alpha.map((x) => String.fromCharCode(x));

  useEffect(() => {
    setQuestionTitle(apis[language].Name);
  }, []);

  function nextStep() {
    var obj = apis[language].Questions;
    if (currentStep != obj.length) {
      if (obj[currentStep].Type == 1) { //TYPE 1 Single choice
        setQuestionDescription(translations[language].selectOne);
      } else {
        setQuestionDescription(translations[language].selectMultiple);
      }

      for (var i = 0; i < obj[currentStep].Answers.length; i++) {
        var element = document.getElementById(i);
        if (element != null)
          if (element.classList.contains("selected")) {
            element.classList.remove("selected");
          }
      }
    }
    if (currentStep > (apis[language].Questions.length - 1)) {
      setFinalizado(true);
      setQuestionTitle(translations[language].thanksFeedback);
      setQuestionDescription(translations[language].sentMessage);
    } else if (currentStep == apis[language].Questions.length - 1) {
      setCurrentStep(currentStep + 1);
      setButtonName(translations[language].sendButton);
      setQuestionTitle(apis[language].Questions[currentStep].Name);
    } else {
      setQuestionTitle(apis[language].Questions[currentStep].Name);
      setButtonName(translations[language].nextButton);
      setCurrentStep(currentStep + 1);
    }
  }

  function selectOption(idx) {
    var obj = apis[language].Questions[currentStep - 1];
    if (obj.Type == 1) { //TYPE 1 Single choice
      for (var i = 0; i < obj.Answers.length; i++) {
        var element = document.getElementById(i);
        if (element != null)
          if (element.classList.contains("selected")) {
            element.classList.remove("selected");
          }
      }
      var element = document.getElementById(idx);
      if (element != null) {
        if (element.classList.contains("selected")) {
          element.classList.remove("selected");
        } else {
          element.classList.add("selected");
        }
      }
    } else { //TYPE 2 Multiple choice
      var element = document.getElementById(idx);
      if (element != null) {
        if (element.classList.contains("selected")) {
          element.classList.remove("selected");
        } else {
          element.classList.add("selected");
        }
      }
    }
  }

  return (
    <>
      <Header language={language} changeLanguage={changeLanguage} />
      <main>
        <div className='container'>
          <section>
            <span className='text-muted'>
              {currentStep == 0
                ? apis[language].Questions.length + ` ${translations[language].question}(s)`
                : `${translations[language].question} ` + currentStep + ` ${translations[language].of} ` + apis[language].Questions.length}
            </span>
            <h2>{questionTitle}</h2>
            <span>{questionDescription}</span>
          </section>
          {currentStep != 0 && !finalizado &&
          <section>
            <ul>
              {apis[language].Questions[currentStep - 1].Answers.map(function(op, idx) {
                return (<li key={idx} id={idx} onClick={() => selectOption(idx)}><span className='item'>{alphabet[idx]}</span> {op.Name}</li>);
              })}
            </ul>
          </section>}
          {!finalizado && <button className='o-btn o-btn-action' onClick={() => nextStep()}><span>{buttonName}</span></button>}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default App;
