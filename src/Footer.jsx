function Footer() {

  return (
    <footer>
        <div className='footer-inner-wrap'><span>Copyright IzzyWay © {new Date().toLocaleDateString('pt-BR').slice(6,10)}</span></div>
    </footer>
  )
}

export default Footer