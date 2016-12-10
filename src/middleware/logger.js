import * as loglevel from 'loglevel'

if (!__PROD__) {
  loglevel.setLevel('trace')
} else {
  loglevel.setLevel('error')
}

export default loglevel
