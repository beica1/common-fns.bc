/**
 * Date: 2019/3/25
 * Author: beicai
 * Description: JSBridge
 * @warn __IMPURE__
 */
import * as R from 'ramda'
import Inject from './Inject'
import { guid } from '../common'

const BRIDGE = '$$bridge_register'
const CALLBACK_NAME = '$bridge_callback'
const customEvent = R.constructN(2, CustomEvent)

const REGISTER_TYPE = {
  INIT: 1,
  CALLBACK: 2,
  METHOD: 3
}

const register = (...args) => {
  const fn = window[BRIDGE] || R.identity
  return fn(...args)
}

// bridge注册成功后 注册回调机制
export const registerCallback = () => {
  const token = guid()
  window[CALLBACK_NAME] = (detail = {}) => {
    const isValidEvent = R.both(R.has('event'), R.propEq('token', token))
    if (isValidEvent(detail)) {
      // 自定义事件数据载体必须为detail属性
      window.dispatchEvent(customEvent(detail.event, { detail }))
    }
  }
  register(REGISTER_TYPE.CALLBACK, CALLBACK_NAME, token)
}

// 注册bridge
export const registerBridge = (ticket = '') => {
  const token = register(REGISTER_TYPE.INIT, ticket)
  if (token) {
    registerCallback()
  }
}

// js 注册全局方法
export const registerMethod = name => {
  const token = guid()
  window[name] = detail => {
    if (R.propEq('token', token, detail)) {
      // 自定义事件数据载体必须为detail属性
      window.dispatchEvent(customEvent(name, { detail }))
    }
  }
  register(REGISTER_TYPE.METHOD, name, token)
}

const createInject = R.constructN(1, Inject)

// 调用native端注入的方法
export const nativeCall = (type, ...rest) => createInject(type).execute(...rest)
