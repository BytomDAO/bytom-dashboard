import { BaseList, TableList } from 'features/shared/components'

import ListItem from './ListItem'
import {withNamespaces} from 'react-i18next'

const type = 'account'

const mapStateToProps = (state, ownProps) => {
  return {
    ...BaseList.mapStateToProps(type, ListItem, {
      wrapperComponent: TableList,
      wrapperProps: {
        titles: ownProps.t('account.formTitle',  { returnObjects: true })
      }
    })(state)
  }
}
export default withNamespaces('translations') (BaseList.connect(
  mapStateToProps,
  BaseList.mapDispatchToProps(type)
))
