import { useState, useEffect } from 'react'
import './App.css'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import APIPTBR from './api-pt-br.json'
import APIENUS from './api-en-us.json'
import ptBR from './assets/lang/pt-br'
import enUS from './assets/lang/en-us'

const translations = {
  en: enUS,
  pt: ptBR
};

const apis = {
  en: APIENUS,
  pt: APIPTBR
}

function App() {
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en')
  const [currentStep, setCurrentStep] = useState(0)
  const [Answers, setAnswers] = useState([])
  const [memoriaResp, setMemoriaResp] = useState([])
  const [finalizado, setFinalizado] = useState(false)
  const [questionTitle, setQuestionTitle] = useState('Carregando...')
  const [questionDescription, setQuestionDescription] = useState('')
  const [buttonName, setButtonName] = useState(translations[language].startButton)
  const [API, setAPI] = useState({})

  const alpha = Array.from(Array(26)).map((e, i) => i + 65);
  const alphabet = alpha.map((x) => String.fromCharCode(x));

  const changeLanguage = (lang) => {
    setLanguage(lang)
    localStorage.setItem('language', lang)
  };

  const getDados = async () => {
        setAPI(apis[language])
        setQuestionTitle(apis[language].Name)
        setQuestionDescription(translations[language].startDescription)
    }

  const sendDados = async (data) => {
    console.log(data);

    setQuestionTitle(translations[language].thanksFeedback);
    setQuestionDescription(translations[language].sentMessage);
  }

  useEffect(() => {
    getDados();
  }, [])

  useEffect(()=>{
    if(finalizado) {
      setQuestionTitle('Enviando...')
      setQuestionDescription('Por favor aguarde um momento.')
      sendDados({"Id":0,"Answers":Answers})
    }
  },[finalizado])

  useEffect(() => {
    changeButton(API.Questions)
    changeDescription()
    checkAnswers()
    console.log(Answers);
  }, [currentStep])

  function changeButton(obj) {
    if(currentStep == 0) {
    setButtonName(translations[language].startButton)
    } else if(currentStep == obj.length) {
      setButtonName(translations[language].sendButton)
    } else {
      setButtonName(translations[language].nextButton)
    }
  }

  function changeDescription() {
    if(currentStep == 0) {
      if(API.Name) {
        setQuestionTitle(API.Name)
        setQuestionDescription(translations[language].startDescription)
      }
      let element = document.getElementById('prev')
      if(element != null)
        element.classList.remove("btn-active")
    } else {
      if(API.Name) {
        setQuestionTitle(API.Questions[currentStep-1].Name)
        if(API.Questions[currentStep-1].Type == 2 || API.Questions[currentStep-1].Type == 3 || API.Questions[currentStep-1].Type == 4) {
          setQuestionDescription(translations[language].selectOne)
        } else if(API.Questions[currentStep-1].Type == 1) {
          setQuestionDescription(translations[language].selectOpen)
        }else {
          setQuestionDescription(translations[language].selectMultiple)
        }
      }
    }
  }

  function checkAnswers() {
    let obj = API.Questions
    if(currentStep != 0) {
      if(obj[currentStep-1].Type == 2 || obj[currentStep-1].Type == 3 || obj[currentStep-1].Type == 4) {
        for (let i = memoriaResp.length - 1; i >= 0; --i) {
          if (memoriaResp[i].QuestionID == currentStep) {
            let option = document.getElementById(memoriaResp[i].ElementoId)
            if(option != null) {
              option.classList.add('selected')
              break;
            }
          }
        }
      } else if(obj[currentStep-1].Type == 1) {
        for (let i = memoriaResp.length - 1; i >= 0; --i) {
          if (memoriaResp[i].QuestionID == currentStep) {
            let respostaaberta = document.getElementById('aberta')
            if(respostaaberta != null) {
              document.getElementById('aberta').value = memoriaResp[i].Resposta
              break;
            }
          }
        }
      } else {

      }
    }
  }

  function prevStep() {
    let obj = API.Questions
    if(currentStep != 0 && finalizado == false) { // Not in the start but also not in the end
      for(let i = 0; i < obj[currentStep-1].Answers.length; i++) {
        let element = document.getElementById(i)
        if(element != null)
          if(element.classList.contains("selected")) {
            element.classList.remove("selected")
          }
      }
      for (let i = Answers.length - 1; i >= 0; --i) {
        if (Answers[i].QuestionID == currentStep-1) {
          Answers.splice(i,1);
        }
      }
      setCurrentStep(currentStep-1)
    }
  }

  function nextStep() {
    let obj = API.Questions
    let element = document.getElementById('prev')
    if(element != null)
      element.classList.add("btn-active")
      if(currentStep != 0) {
        if(obj[currentStep-1].Type == 1) {
          let respostaaberta = document.getElementById('aberta').value
          setAnswers(Answers => [...Answers, {
            "QuestionID": currentStep,
            "Answer": respostaaberta
          }])
          setMemoriaResp(memoriaResp => [...memoriaResp, {
            "QuestionID": currentStep,
            "Answer": respostaaberta,
          }])
        } else {
          let selected = document.getElementsByClassName("selected")
          for(let i = 0; i < selected.length; i++) {
            let resposta = selected[i].textContent.trim().slice(2)
            setAnswers(Answers => [...Answers, {
              "QuestionID": currentStep,
              "Answer": resposta
            }])
          }
          for(let i = 0; i < selected.length; i++) {
            let resposta = selected[i].textContent.trim().slice(2)
            let id = selected[i]?.id
            setMemoriaResp(memoriaResp => [...memoriaResp, {
              "QuestionID": currentStep,
              "Answer": resposta,
              "ElementoId": id
            }])
          }
        }
      }

    if(currentStep == obj.length) { // If in the end of the questionnaire
      setFinalizado(true)
      let element = document.getElementById('prev') // disable back button
      if(element != null) // disable back button
        element.classList.remove("btn-active") // disable back button
    } else { // If not in the end of the questionnaire
      for(let i = 0; i < obj[currentStep].Answers.length; i++) {
        let element = document.getElementById(i)
        if(element != null)
          if(element.classList.contains("selected")) {
            element.classList.remove("selected")
          }
      }

      setCurrentStep(currentStep+1)
      setQuestionTitle(API.Questions[currentStep].Name) 
    }
  }

  function selectOption(idx) {
    let obj = API.Questions[currentStep-1]

    if(obj.Type == 0) { //Type 0 - Multiple choice
      let element = document.getElementById(idx)
      if(element != null) {
        if(element.classList.contains("selected")) {
          checkAnswers(idx)
          element.classList.remove("selected")
        } else {
          element.classList.add("selected")
        }
      }
    }

    if(obj.Type == 2 || obj.Type == 3 || obj.Type == 4) { //Type 2 - Yes/No OU Type 4 - One choice
      for(let i = 0; i < obj.Answers.length; i++) {
        let element = document.getElementById(i)
        if(element != null)
          if(element.classList.contains("selected")) {
            element.classList.remove("selected")
          }
      }
      let element = document.getElementById(idx)
      if(element != null) {
        if(element.classList.contains("selected")) {
          checkAnswers(idx)
          element.classList.remove("selected")
        } else {
          element.classList.add("selected")
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
        <span className='text-muted'>{currentStep == 0 ? API.Questions?.length+' Pergunta(s)':'Pergunta '+currentStep+' de '+API.Questions.length}</span>
          <h2>{questionTitle}</h2>
          <span>{questionDescription}</span>
        </section>
        {currentStep != 0 && finalizado != true &&
        <section>
          {API.Questions[currentStep-1].Type == 1 ?
            (
            <textarea id='aberta' rows="4" cols="90">
            </textarea>
            )
            :
            <ul>
              {apis[language].Questions[currentStep - 1].Answers.map((op, idx) => (
                <li key={idx} id={idx} onClick={() => selectOption(idx)}>
                  <span className='item'>{alphabet[idx]}</span> {op.Name}
                </li>
              ))}
            </ul>
          }
        </section>}
        {finalizado != true && <button className='o-btn o-btn-action' onClick={() => nextStep()}><span>{buttonName}</span></button>}
      </div>
    </main>
    <footer>
      <div className='footer-inner-wrap'>
        <div className="nav">
          <a id="prev" className="prev" href="#" role="button" aria-label="Passo anterior" onClick={() => prevStep()}>&#10094;</a>
          <a id="next" className="next btn-active" href="#" role="button" aria-label="Próximo passo" onClick={() => nextStep()}>&#10095;</a>
        </div>
      </div>
    </footer>
  </>
  )
}

export default App;