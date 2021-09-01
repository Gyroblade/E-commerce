import React from 'react'
import { Route } from 'react-router-dom'
import Head from './head'
import Header from './header'
import Basket from './basket'
import Cards from './cards'
import Logs from './logs'

const Main = () => {

  return (
    <div>
      <Head title="Gyroblade" />
      <Header />
      <Route exact path="/basket" component={() => <Basket />} onClick />
      <Route exact path="/logs" component={() => <Logs />} onClick />
      <Route exact path="/" component={() => <Cards />} />
    </div>
  )
}

Main.propTypes = {}

export default React.memo(Main)
