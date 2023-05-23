import { useState, useEffect } from 'react'
import './App.css'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import API from './API.json'

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [finalizado, setFinalizado] = useState(false);
  const [TitlPerg, setTitlPerg] = useState('')
  const [DescrPerg, setDescrPerg] = useState('Gostariamos de saber seu nível de satisfação através deste breve questionário.')
  const [buttonName, setButtonName] = useState('Iniciar');

  const alpha = Array.from(Array(26)).map((e, i) => i + 65);
  const alphabet = alpha.map((x) => String.fromCharCode(x));

  useEffect(() => {
    setTitlPerg(API.Nome)
  }, []);

  function nextStep() {
    var obj = API.Perguntas;
    if(currentStep != obj.length) {
      if(obj[currentStep].Tipo == 1) { //TIPO 1 Uma escolha 
        setDescrPerg('Selecione apenas uma das opções');
      } else {
        setDescrPerg('Selecione uma ou mais opções');
      }

      for(var i = 0; i < obj[currentStep].Respostas.length; i++) {
        var element = document.getElementById(i);
        if(element != null)
          if(element.classList.contains("selected")) {
            element.classList.remove("selected");
          }
      }
    }
    if(currentStep > (API.Perguntas.length-1)) {
      setFinalizado(true);
      setTitlPerg('Agradecemos pelo feedback!')
      setDescrPerg('Respostas registradas com sucesso.');
    } else if(currentStep == API.Perguntas.length-1) {
      setCurrentStep(currentStep+1)
      setButtonName('Enviar respostas');
      setTitlPerg(API.Perguntas[currentStep].Nome)
    } else {
      setTitlPerg(API.Perguntas[currentStep].Nome)
      setButtonName('Próximo');
      setCurrentStep(currentStep+1)
    }
  }

  function selectOption(idx) {
    var obj = API.Perguntas[currentStep-1];
    if(obj.Tipo == 1) { //TIPO 1 Uma escolha
      for(var i = 0; i < obj.Respostas.length; i++) {
        var element = document.getElementById(i);
        if(element != null)
          if(element.classList.contains("selected")) {
            element.classList.remove("selected");
          }
      }
      var element = document.getElementById(idx);
      if(element != null) {
        if(element.classList.contains("selected")) {
          element.classList.remove("selected");
        } else {
          element.classList.add("selected");
        }
      }
    } else { //TIPO 2 Múltipla escolha
      var element = document.getElementById(idx);
      if(element != null) {
        if(element.classList.contains("selected")) {
          element.classList.remove("selected");
        } else {
          element.classList.add("selected");
        }
      }
    }
  }

  return (
    <>
      <Header />
      <main>
        <div className='container'>
          <section>
          <span className='text-muted'>{currentStep == 0 ? API.Perguntas.length+' Pergunta(s)':'Pergunta '+currentStep+' de '+API.Perguntas.length}</span>
            <h2>{TitlPerg}</h2>
            <span>{DescrPerg}</span>
          </section>
          {currentStep != 0 && finalizado != true &&
          <section>
            <ul>
            {API.Perguntas[currentStep-1].Respostas.map(function(op, idx){
              return (<li key={idx} id={idx} onClick={() => selectOption(idx)}><span className='item'>{alphabet[idx]}</span> {op.Nome}</li>)
            })}
            </ul>
          </section>}
          {finalizado != true && <button className='o-btn o-btn-action' onClick={() => nextStep()}><span>{buttonName}</span></button>}
        </div>
      </main>
      <Footer />
    </>
  )
}

export default App
