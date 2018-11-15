import { BaseList } from 'features/shared/components'
import { ProgressBar } from 'react-bootstrap'
import ListItem from './ListItem'
import React from 'react'
import actions from 'actions'
import RescanDialog from './RescanDialog/RescanDialog'
import {withNamespaces} from 'react-i18next'

const type = 'balance'

class List extends React.Component {
  rescanWallet(){
    this.props.showModal(
      <RescanDialog
        closeModal = {this.props.closeModal()}
      />
    )
  }

  render() {
    const ItemList = BaseList.ItemList
    const newButton = <button key='showRescan' className='btn btn-primary' onClick={() => this.rescanWallet()}>
      {this.props.t('balances.rescan')}
    </button>
    return <div>
      <ItemList
        actions={[newButton]}
      {...this.props}
      />
    </div>
  }
}

const newStateToProps = (state, ownProps) => {
  const props =  {
    ...BaseList.mapStateToProps(type, ListItem)(state, ownProps),
    rescanning: state.balance.rescanning,
    rescanProgress: state.balance.rescanProgress,
    skipCreate: true
  }

  return props
}

const mapDispatchToProps = ( dispatch ) => ({
  rescan: () => dispatch(actions.balance.rescan()),
  info: () => dispatch(actions.balance.walletInfo()),
  showModal: (body) => dispatch(actions.app.showModal(
    body,
    actions.app.hideModal,
    null,
    {
      dialog: true,
      noCloseBtn: true
    }
  )),
  closeModal:() => dispatch(actions.app.hideModal),
  ...BaseList.mapDispatchToProps(type),
})

export default BaseList.connect(
  newStateToProps,
  mapDispatchToProps,
  withNamespaces('translations')(List)
)
