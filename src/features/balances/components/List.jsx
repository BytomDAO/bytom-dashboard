import { BaseList } from 'features/shared/components'
import ListItem from './ListItem'

const type = 'balance'

const newStateToProps = (state, ownProps) => {
  const props =  {
    ...BaseList.mapStateToProps(type, ListItem)(state, ownProps),
    skipCreate: true
  }

  return props
}

export default BaseList.connect(
  newStateToProps,
  BaseList.mapDispatchToProps(type)
)
