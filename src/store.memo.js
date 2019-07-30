/**
 * Date: 2019/3/21
 * Author: beicai
 * Description: store
 * @warn __IMPURE__
 */
import * as R from 'ramda'

export const createStore = (key, initialValue) => {
  const store = {}

  if (key) {
    store[key] = initialValue

    return Object.freeze({
      get () {
        return store[key]
      },
      set (v) {
        store[key] = v
      }
    })
  }

  return Object.freeze({
    get: R.prop(R.__, store),
    set: R.curry((k, v) => { store[k] = v })
  })
}

export const storeMemo = obj => Object.freeze({
  get () { return obj },
  set: R.curry((k, v) => { obj[k] = v }) // eslint-disable-line
})
