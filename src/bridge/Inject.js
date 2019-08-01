/**
 * Inject.js of common-fns.bc
 * Created by beica on 2019/8/1
 */
import * as R from 'ramda'
import { guid } from '../common'

const MOUNT_POINT = 'hc_js_bridge'

export default class Inject {
  constructor (type) {
    this.type = type
    this.callback = null
    this.event = '_callback' + guid()
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
    return fn.call(target, this.type, JSON.stringify(R.mergeRight(params, { event: this.event })))
  }
  
  setCallback (cb, autoRemove) {
    this.callback = ({ detail: { event, result, data } }) => {
      if (event === this.event && cb) {
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
    window.addEventListener(this.event, this.callback)
  }
  
  removeCallback () {
    if (this.callback) {
      window.removeEventListener(this.event, this.callback)
      this.destroy()
    }
  }
  
  destroy () {
    this.callback = null
    this.event = null
    this.type = null
  }
}
