import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getLogsFromServer, clearLogsOnServer } from '../redux/reducers/logReducer'

const Logs = () => {
  const dispatch = useDispatch()
  const logsArr = useSelector((store) => store.logReducer.logsArr) // массив объектов с логами
  const lastAction = useSelector((store) => store.logReducer.lastAction) // массив объектов с логами

  useEffect(() => {
    dispatch(getLogsFromServer())
  }, [])
  return (
    <div>
      <div>Logs array length: {logsArr.length}</div>
      <div>Last actions: {lastAction}</div>
      <div>
        <button type="button" className="btn" onClick={(e) => dispatch(clearLogsOnServer())}>
          Clear logs
        </button>
        <button type="button" className="btn" onClick={(e) => dispatch(getLogsFromServer())}>
          Refresh
        </button>
      </div>
      {logsArr.length < 1 || typeof logsArr === 'undefined' ? (
        'empty log'
      ) : (
        <div>
          {logsArr.map((it) => (
            <div key={it.time}>{`${it.time} - ${it.log}`}</div>
          ))}
        </div>
      )}
    </div>
  )
}

Logs.propTypes = {}

export default Logs