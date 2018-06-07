import introduction from './introduction.json'

const router = ['/backup','/access-control','/core','/keys/create','/keys','/balances','/accounts/create',
  '/assets/create','/assets','/accounts','/transactions/create','/transactions', '/access-control/create-token']

export const location = (state = { visited: [], isVisited: false }, action) => {
  if (action.type == '@@router/LOCATION_CHANGE' ) {
    if ( !state.visited.includes(action.payload.pathname ) &&  router.includes(action.payload.pathname)){
      if(action.payload.pathname !== '/access-control' ||
        ( action.payload.search.includes('?type=token') && action.payload.pathname === '/access-control' )){
        return {  ...state, visited: [  action.payload.pathname, ...state.visited ], isVisited: false }
      }
    }else if (action.payload.pathname.match(/^\/keys.*reset-password$/g) && !state.visited.includes('/keys/:id/reset-password'))
    {
      return {  ...state, visited: [  '/keys/:id/reset-password', ...state.visited ], isVisited: false }
    } else{
      return{ ...state, isVisited:true }
    }
  }
  if (action.type == 'DISMISS_TUTORIAL')   return{ ...state, isVisited:true }

  return state
}

export default (state = {}, action) => {
  const newState = {
    location: location(state.location, action)
  }

  newState.content = introduction[newState.location.visited[0]]
  return newState
}
