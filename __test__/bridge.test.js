/**
 * bridge.test.js of common-fns.bc
 * Created by beica on 2019/7/31
 */
import { nativeCall } from '../src/bridge/api'
import Inject from '../src/bridge/Inject'

jest.mock('../src/bridge/Inject')

test('test', () => {
  nativeCall('jojo')
  expect(Inject).toHaveBeenCalledTimes(1)
})
