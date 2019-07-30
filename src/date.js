/**
 * Date: 2019/1/8
 * Author: beicai
 * Description: date
 */
import * as R from 'ramda'
import { zeroize } from './common'

const least2Chars = zeroize(2)

const isDate = R.both(R.is(Date), R.o(R.complement(R.equals(NaN)), R.invoker(0, 'getTime')))

const formatter = [
  { index: 0, reg: /y+/, method: R.invoker(0, 'getFullYear') },
  { index: 1, reg: /M+/, method: R.o(R.inc, R.invoker(0, 'getMonth')) },
  { index: 2, reg: /d+/, method: R.invoker(0, 'getDate') },
  { index: 3, reg: /H+/, method: R.invoker(0, 'getHours') },
  { index: 4, reg: /m+/, method: R.invoker(0, 'getMinutes') },
  { index: 5, reg: /s+/, method: R.invoker(0, 'getSeconds') }
]

const _get = R.converge(R.unapply(R.identity), R.pluck('method', formatter))

const _makeReplace = data => (template, item) => R.ifElse(
  R.identity,
  R.replace(R.__, least2Chars(R.nth(item.index, data)), template),
  R.always(template)
)(R.nth(0, R.match(item.reg, template)))

export const formatTime = R.curry((template, time) => {
  const _format = R.pipe(_get, _makeReplace, reduce(R.__, template, formatter))
  const process = R.o(R.ifElse(isDate, _format, R.always(time)), R.constructN(1, Date))
  return process(time)
})

export const addMonth = R.curry((step, time) => {
  const date = R.constructN(1, Date)(time)
  const _modify = ([m, y]) => R.cond([
    [R.lt(R.__, 0), R.always([R.add(12, m), R.dec(y)])],
    [R.gt(R.__, 11), R.always([R.add(-12, m), R.inc(y)])],
    [R.T, R.always([m, y])]
  ])(m)
  const _apply = R.apply(R.useWith(R.always(date), [R.invoker(1, 'setMonth')(R.__, date), R.invoker(1, 'setFullYear')(R.__, date)]))
  const _addMonth = R.pipe(
    R.juxt([R.pipe(R.invoker(0, 'getMonth'), R.add(step)), R.invoker(0, 'getFullYear')]),
    _modify,
    _apply,
  )
  const _process = R.ifElse(isDate, _addMonth, R.always(time))
  return _process(date)
})

export const addDay = R.curry((d, date) => {
  const process = R.pipe(R.of, R.append(d), R.apply(R.useWith(R.add, [R.o(R.invoker(0, 'getTime'), R.constructN(1, Date)), multiply(86400000)])))
  return R.ifElse(isDate, process, R.identity)(date)
})

const getFirstWeekdayOfMonth = R.pipe(
  R.pair,
  R.over(R.lensIndex(1), R.dec),
  R.append(1),
  R.apply(R.constructN(3, Date)),
  R.invoker(0, 'getDay')
)

const getMonthDaysCount = R.pipe(R.constructN(3, Date)(R.__, R.__, 0), R.invoker(0, 'getDate'))

export const getMonthData = R.pipe(
  R.constructN(1, Date),
  _get,
  R.juxt([
    R.apply(getFirstWeekdayOfMonth),
    R.apply(getMonthDaysCount),
    R.o(R.apply(getMonthDaysCount), R.over(R.lensIndex(1), R.dec))
  ])
)

// export const getCalendarData = (year, month) => {}
