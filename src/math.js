/**
 * Date: 2019/1/14
 * Author: beicai
 * Description: math
 */
import * as R from 'ramda'

const getPrecision = (a = 0) => ((a.toString().split('.')[1] || []).length)

const _mul = (a, b) => {
  const snReg = /[eE]+/
  const d = a.toString()
  const e = b.toString()
  if (snReg.test(d) || snReg.test(e)) {
    return a * b
  }

  let c = 0
  c += getPrecision(d)
  c += getPrecision(e)
  return Number(d.replace('.', '')) * Number(e.replace('.', '')) / 10 ** c
}

const _sub = (a, b) => {
  const c = getPrecision(a)
  const d = getPrecision(b)
  const e = 10 ** Math.max(c, d)
  return (_mul(a, e) - _mul(b, e)) / e
}

const _div = (a, b) => {
  let e = 0
  let f = 0
  try {
    e = getPrecision(a)
    f = getPrecision(b)
  } catch (g) {
    // console.error(g)
  }
  const c = Number(a.toString().replace('.', ''))
  const d = Number(b.toString().replace('.', ''))
  return _mul((c / d), 10 ** (f - e))
}

const _add = (a, b) => {
  const c = getPrecision(a)
  const d = getPrecision(b)
  const e = 10 ** Math.max(c, d)
  return (_mul(a, e) + _mul(b, e)) / e
}

const isEven = R.pipe(R.length, R.modulo(R.__, 2), R.equals(0))

const completeWith = x => R.ifElse(isEven, R.identity, R.append(x))

const processWithAcc = (acc, act) => R.unapply(
  R.pipe(completeWith(acc), R.splitEvery(2), R.reduce(R.useWith(act, [R.identity, R.apply(act)]), acc))
)

export const mul = processWithAcc(1, _mul)

export const mul2 = R.curryN(2, _mul)

export const add = processWithAcc(0, _add)

export const sub = R.curryN(2, _sub)

export const div = R.curryN(2, _div)
