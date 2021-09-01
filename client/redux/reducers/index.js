import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import auth from './auth'
import cardsReducer from './cardsReducer'
import logReducer from './logReducer'

const createRootReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    auth,
    cardsReducer,
    logReducer
  })

export default createRootReducer
