import { BaseList } from 'features/shared/components'
import ListItem from './ListItem/ListItem'
import {withNamespaces} from 'react-i18next'

const type = 'federation'

const newStateToProps = (state, ownProps) => {
  const props =  {
    skipCreate: true,
    ...BaseList.mapStateToProps(type, ListItem)(state, ownProps),
  }

  return props
}


export default  withNamespaces('translations')(BaseList.connect(
  newStateToProps,
  BaseList.mapDispatchToProps(type)
))
