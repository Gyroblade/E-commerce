import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { changeGoods } from '../redux/reducers/cardsReducer'

const CardsButtons = (props) => {
  const { _card, _countInBasket } = props
  const dispatch = useDispatch()
  const basket = useSelector((store) => store.cardsReducer.basket) // массив объектов с товарами в корзине
  return (
    <div>
      {basket.filter((it) => it.id === _card.id).length > 0 ? (
        <div>
          <div>Count: {basket.filter((it) => it.id === _card.id)[0].count}</div>
          <div>
            <button
              type="button"
              className="btn"
              onClick={(e) =>
                dispatch(changeGoods(basket, _card.id, 1, _card.title, _card.image, _card.price))
              }
            >
              +
            </button>
            /
            <button
              type="button"
              className="btn"
              onClick={(e) =>
                dispatch(changeGoods(basket, _card.id, -1, _card.title, _card.image, _card.price))
              }
            >
              -
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className="btn"
          onClick={(e) =>
            dispatch(changeGoods(basket, _card.id, 1, _card.title, _card.image, _card.price))
          }
        >
          Add
        </button>
      )}
    </div>
  )
}

export default CardsButtons
