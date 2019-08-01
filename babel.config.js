/**
 * babel.config.js of common-fns.bc
 * Created by beica on 2019/7/31
 */
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current'
        }
      }
    ]
  ]
}
