/**
 * Date: 2019/1/8
 * Author: beicai
 * Description: common
 */
import * as R from 'ramda'

const partialGuid = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)

export const getLocalStore = R.always(localStorage)

export const guid = () => R.join('', [partialGuid(), R.join('-', R.times(partialGuid, 5)), R.join('', R.times(partialGuid, 2))])

export const getFormData = R.ifElse(
  R.both(R.identity, R.hasIn('querySelectorAll')),
  R.pipe(
    R.invoker(1, 'querySelectorAll')('input[name]'),
    reduce((acc, item) => R.mergeLeft(acc, { [item.name]: item.value }), {})
  ),
  R.always({})
)

const zeroRepeat = R.o(R.join(''), R.repeat('0'))

export const zeroize = R.curry((n, x) => {
  const process = R.pipe(R.concat(zeroRepeat(n)), slice(R.negate(n), Infinity))
  return R.ifElse(R.o(R.lt(R.__, n), length), process, R.identity)(x.toString())
})

export const zeroAppend = R.curry((n, x) => {
  const stopIndex = R.pipe(R.indexOf('.'), R.ifElse(R.lt(R.__, 0), add(2), R.inc), add(n))
  const _slice = R.converge(slice, [R.always(0), stopIndex, R.identity])
  return R.o(_slice, R.concat(R.__, zeroRepeat(n)))(x.toString())
})

export const fixTo = n => R.ifElse(R.prop('toFixed'), R.invoker(1, 'toFixed')(n), R.identity)

export const parseToJson = R.tryCatch(R.o(R.objOf('json'), JSON.parse), R.always({}))

export const hasChineseChar = R.test(/[\u4e00-\u9fa5]/)

export const canParseFloat = R.test(/^([+-])?\d*\.?\d+\D*$/)

export const getQueryParam = R.pipe(R.concat('(^|&)'), R.concat(R.__, '=([^&]*)(&|$)'), R.constructN(1, RegExp), R.match(R.__, window.location.search.slice(1)), R.nth(2), R.when(R.identity, unescape))

export const mapIndexed = R.addIndex(map)
