/**
 * Date: 2019/1/8
 * Author: beicai
 * Description: dom
 */
import * as R from 'ramda'

export const hasClass = R.curry((name, target) => R.ifElse(
  R.hasIn('className'),
  R.pipe(R.prop('className'), R.test(R.constructN(1, RegExp)(name))),
  R.always(false)
)(target))

export const getData = R.curry((key, dom) => R.pathOr(null, ['dataset', key], dom))

export const query = R.invoker(1, 'querySelectorAll')

export const emit = R.useWith(R.invoker(1, 'dispatchEvent'), [R.constructN(1, Event), R.identity])
