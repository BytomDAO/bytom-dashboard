import _ from 'lodash'

export const sum = function(items, prop){
  return items.reduce( function(a, b){
    return a + Number(_.get(b,prop))
  }, 0)
}
