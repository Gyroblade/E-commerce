import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  getProductsFromServer,
  getRatesFromServer,
  sortArray
} from '../redux/reducers/cardsReducer'
import './cards.scss'
import CardsButtons from './cardsButtons'

const Cards = () => {
  const dispatch = useDispatch()
  const sortType = useSelector((store) => store.cardsReducer.sortType) // тип сортировки
  const cardsArr = useSelector((store) => store.cardsReducer.cardsArr) // массив объектов с товарами
  const ratesObj = useSelector((store) => store.cardsReducer.ratesObj) // объект с курсами валют
  const currency = useSelector((store) => store.cardsReducer.currency) // текущая выбранная валюта

  useEffect(() => {
    dispatch(getProductsFromServer())
    dispatch(getRatesFromServer())
  }, [])

  return (
    <div>
      <div>SORT TYPE: {sortType}</div>
      <div>Currency: {currency}</div>
      <div>CurRate: {ratesObj[currency]}</div>
      <div className="box">
        {sortArray(cardsArr, sortType).map((card) => {
          return (
            <div key={card.id} className="el">
              <div>{card.title}</div>
              <img src={card.image} alt={`[${card.title}]`} />
              <div>
                Price: {(card.price * ratesObj[currency]).toFixed(2)}
                {` ${currency}`}
              </div>

              <CardsButtons _card={card} />

              <div>{card.description}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Cards
