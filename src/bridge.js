/**
 * Date: 2019/3/25
 * Author: beicai
 * Description: JSBridge
 * @warn __IMPURE__
 */
import { guid } from './common'
import * as R from 'ramda'

const MOUNT_POINT = 'hc_js_bridge'
const CALLBACK_NAME = '$emit'
const ACTIVATED = '$activated'

const getEventId = R.concat('jsBridge_callback.')

class Inject {
  constructor (type) {
    this.type = type
    this.callback = null
    this.id = guid()
  }

  execute (data = {}, cb) {
    let params = data
    let callback = cb

    if (typeof params === 'function') {
      callback = data
      params = {}
    }

    if (typeof callback === 'function') {
      this.registerCallback(callback, true)
    }

    const target = window[MOUNT_POINT] || {}

    const fn = target.emit || (() => {
      if (this.callback) {
        // 如果在在没有js注入的环境中(浏览器等)存在回调需手动调用以保证逻辑的正常执行 -1表示注入缺失
        callback(-1)
      }
      this.removeCallback()
      return false
    })

    // @warn 这里用call 否则 target.fn 的方式
    return fn.call(target, this.type, JSON.stringify(mergeRight(params, { id: this.id })))
  }

  setCallback (cb, autoRemove) {
    this.callback = ({ detail: { event, result, data } }) => {
      if (event === this.id && cb) {
        cb(result === 'ok' ? data : false)
        if (autoRemove) {
          this.removeCallback()
        }
      }
    }
  }

  registerCallback (...rest) {
    this.removeCallback()
    this.setCallback(...rest)
    window.addEventListener(getEventId(this.id), this.callback)
  }

  removeCallback () {
    if (this.callback) {
      window.removeEventListener(getEventId(this.id), this.callback)
      this.destroy()
    }
  }

  destroy () {
    this.callback = null
    this.id = null
    this.type = null
  }
}

export const register = () => {
  const customEvent = R.constructN(2, CustomEvent)

  window[CALLBACK_NAME] = (detail = {}) => {
    if (detail.event) {
      // 自定义事件数据载体必须为detail属性
      window.dispatchEvent(customEvent(getEventId(detail.event), { detail }))
    }
  }

  window[ACTIVATED] = detail => {
    window.dispatchEvent(customEvent('activated', { detail }))
  }
}

const createInject = R.constructN(1, Inject)

export const nativeCall = (type, ...rest) => createInject(type).execute(...rest)
