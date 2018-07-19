import { BaseList } from 'features/shared/components'
import { ProgressBar } from 'react-bootstrap'
import ListItem from './ListItem'
import React from 'react'
import actions from 'actions'
import RescanDialog from './RescanDialog/RescanDialog'

const type = 'balance'

class List extends React.Component {
  rescanWallet(){
    // this.props.rescan()

    // debugger
    // if (this.props.rescanning) {
    //   window.setTimeout(this.props.info(), 1000)
    // }

    // let progressInstance = (<ProgressBar now={now} />)
    // let now = 0
    //
    // this.setStat = () => {
    //   if (this.props.rescanning) {
    //     this.props.info()
    //     now = this.props.rescanProgress.bestBlockHeight? this.props.rescanProgress.walletHeight/ this.props.rescanProgress.bestBlockHeight :0
    //     setTimeout(this.setStat, 1000)
    //   }else{
    //     this.props.info()
    //     console.log('successfully rescan')
    //   }
    // }

    // this.setStat()

    this.props.showModal(
      <RescanDialog
        // now={now}
        lang={this.props.lang}
        closeModal = {this.props.closeModal()}
      />
    )
  }

  render() {
    const ItemList = BaseList.ItemList
    const newButton = <button key='showRescan' className='btn btn-primary' onClick={() => this.rescanWallet()}>
      {this.props.lang === 'zh' ? '重新扫描' : 'Rescan'}
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
  List
)
