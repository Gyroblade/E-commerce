import axios from 'axios'
import { sendLog } from './logReducer'

const initialState = {
  sortType: 'title',
  currency: 'USD',
  cardsArr: [],
  ratesObj: {},
  basket: []
}

export const CHANGE_SORT = 'CHANGE_SORT'
const GET_PRODUCTS = 'GET_PRODUCTS'
const GET_RATES = 'GET_RATES'
export const SET_CURRENCY = 'SET_CURRENCY'
const CHANGE_GOODS = 'CHANGE_GOODS'

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_PRODUCTS: {
      return { ...state, cardsArr: action.payload }
    }
    case CHANGE_SORT: {
      localStorage.setItem('localSort', action.payload)
      return { ...state, sortType: action.payload }
    }
    case GET_RATES: {
      return { ...state, ratesObj: action.payload }
    }
    case SET_CURRENCY: {
      localStorage.setItem('localCurrency', action.payload)
      return { ...state, currency: action.payload }
    }
    case CHANGE_GOODS: {
      localStorage.setItem('localBasket', JSON.stringify(action.payload))
      return { ...state, basket: action.payload }
    }
    default:
      return state
  }
}

export function changeGoods(_arr, _id, _count, _title, _image, _price) {
  const newArr = [{ id: _id, count: _count, title: _title, image: _image, price: _price }]
  if (_count > 0) { sendLog(`add ${_title} to the backet`)}
  else {sendLog(`remove ${_title} from the backet`)}
  // если объекта нет в массиве - добавляем весь объект
  if (_arr.filter((it) => it.id === _id).length === 0) {
    return { type: CHANGE_GOODS, payload: [..._arr, ...newArr] }
  }
  // если объект есть - добавяет в поле count
  return {
    type: CHANGE_GOODS,
    payload: _arr
      .map((it) =>
        it.id === _id
          ? { ...it, count: it.count + _count, title: _title, image: _image, price: _price }
          : it
      )
      .filter((it2) => it2.count > 0) // если count 0 - убираем из массива
  }
}

export function setCurrency(currency) {
  return { type: SET_CURRENCY, payload: currency }
}

export function setSort(sortType) {
  return { type: CHANGE_SORT, payload: sortType }
}

export function getProductsFromServer() {
  return (dispatch) => {
    axios.get(`/api/v1/data`).then((it) => {
      dispatch({ type: GET_PRODUCTS, payload: it.data })
    })
  }
}

export function getRatesFromServer() {
   return async (dispatch) => {
    await axios.get(`/api/v1/rates`).then((it) => {
      dispatch({ type: GET_RATES, payload: it.data })
    })
  }
}

export function sortArray (_arr, _sortProp)  {
  const sortProperty = _sortProp[0] !== '-' ? _sortProp : _sortProp.substring(1)
  let sorted = [..._arr].sort((a, b) => {
    if (a[sortProperty] > b[sortProperty]) {
      return 1
    }
    if (a[sortProperty] < b[sortProperty]) {
      return -1
    }
    return 0
  })
  if (_sortProp[0] === '-') {
    sorted = sorted.reverse()
  }
  return sorted
}