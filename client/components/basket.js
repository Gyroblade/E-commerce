import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { sortArray, changeGoods } from '../redux/reducers/cardsReducer'

const Basket = () => {
  const dispatch = useDispatch()
  const basket = useSelector((store) => store.cardsReducer.basket)
  const currency = useSelector((store) => store.cardsReducer.currency)
  const ratesObj = useSelector((store) => store.cardsReducer.ratesObj)
  const sortType = useSelector((store) => store.cardsReducer.sortType) // тип сортировки

  const basketElement = (
    <div>
      <div className="box">
        {sortArray(basket, sortType).map((it) => {
          return (
            <div key={it.id} className="el">
              <div>{it.title}</div>
              <img src={it.image} alt={basket.title} />
              <div>
                Price: {(it.price * ratesObj[currency]).toFixed(2)} {` ${currency}`}
              </div>
              <div>Count: {it.count}</div>
              <div>Total: {(it.price * ratesObj[currency] * it.count).toFixed(2)}</div>
              <div>
                <button
                  type="button"
                  className="btn"
                  onClick={(e) =>
                    dispatch(changeGoods(basket, it.id, 1, it.title, it.image, it.price))
                  }
                >
                  +
                </button>
                /
                <button
                  type="button"
                  className="btn"
                  onClick={(e) =>
                    dispatch(changeGoods(basket, it.id, -1, it.title, it.image, it.price))
                  }
                >
                  -
                </button>
              </div>
            </div>
          )
        })}
      </div>
      <div className="border-black border-4 p-8">
        TOTAL FOR ALL:{' '}
        {basket.reduce((a, r) => a + r.price * ratesObj[currency] * r.count, 0).toFixed(2)}
        {` ${currency}`}
      </div>
    </div>
  )

  return (
    <div>
      {basket.length > 0 ? (
        basketElement
      ) : (
        <button type="button" className="btn">
          EMPTY:(
        </button>
      )}
    </div>
  )
}

export default Basket
