import React from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import './header.scss'
import { setSort, setCurrency } from '../redux/reducers/cardsReducer'

const Header = () => {
  const dispatch = useDispatch()
  const basket = useSelector((store) => store.cardsReducer.basket)
  const currency = useSelector((store) => store.cardsReducer.currency)
  const ratesObj = useSelector((store) => store.cardsReducer.ratesObj)
  const location = useSelector((store) => store.router.location.pathname)
    return (
      <div>
        <div className="header">
          <div>Location: {location}</div>
          <div>
            <select onChange={(e) => dispatch(setCurrency(e.target.value))}>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="CAD">CAD</option>
            </select>
          </div>
          <div>
            <select onChange={(e) => dispatch(setSort(e.target.value))}>
              <option value="title">title ASC</option>
              <option value="-title">title DESC</option>
              <option value="price">price ASC</option>
              <option value="-price">price DESC</option>
            </select>
          </div>
          <div className="border-black border-2">
            <div>
              TOTAL GOODS:
              {basket.reduce((a, r) => a + r.count, 0)}
            </div>
            <div>
              TOTAL PRICE:
              {basket.reduce((a, r) => a + r.price * ratesObj[currency] * r.count, 0).toFixed(2)}
              {` ${currency}`}
            </div>
          </div>
          <div>
            <Link to="/basket">Go to Basket</Link>
          </div>
          <div>
            <Link to="/"> Go to Main</Link>
          </div>
          <div>
            <Link to="/logs"> Go to Logs</Link>
          </div>
        </div>
      </div>
    )
  }

export default Header