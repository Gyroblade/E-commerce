import axios from 'axios'
import { CHANGE_SORT, SET_CURRENCY } from './cardsReducer'

const LOCATION_CHANGE = '@@router/LOCATION_CHANGE'
const GET_LOGS = 'GET_LOGS'

const initialState = {
  lastAction: '',
  logsArr: []
}

export const sendLog = (_arg) => {
  axios({
    method: 'patch',
    url: '/api/v1/logs',
    data: {
      log: _arg,
      time: new Date().toLocaleString()
    }
  }).catch(() => 'log error')
}

export function getLogsFromServer() {
  return (dispatch) => {
    axios.get(`/api/v1/logs/`).then((it) => {
      dispatch({ type: GET_LOGS, logsArr: it.data })
    })
  }
}

export function clearLogsOnServer() {
  return (dispatch) => {
    axios
      .delete('/api/v1/logs/')
      .then(() => dispatch({ type: GET_LOGS, logsArr: [] }))
      .catch(() => dispatch({ type: GET_LOGS, logsArr: [] }))
  }
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_LOGS: {
      return { ...state, logsArr: action.logsArr }
    }
    case CHANGE_SORT: {
      sendLog(`sort by ${action.sortType}`)
      return { ...state, lastAction: action.sortType}
    }
    case SET_CURRENCY: {
      sendLog(`change currency from ${state.currency} to ${action.currency}`)
      return { ...state, lastAction: action.currency }
    }
    case LOCATION_CHANGE: {
      if (action.payload.location.pathname !== '/logs') {
        sendLog(`navigate to ${action.payload.location.pathname}`)
      }
      return { ...state, lastAction: action.payload.location.pathname }
    }
    default:
      return state
  }
}