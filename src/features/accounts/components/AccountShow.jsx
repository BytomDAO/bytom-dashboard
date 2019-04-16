import React from 'react'
import {
  BaseShow,
  CopyableBlock,
  KeyValueTable,
  PageContent,
  PageTitle,
  RawJsonButton,
} from 'features/shared/components'
import componentClassNames from 'utility/componentClassNames'

class AccountShow extends BaseShow {
  constructor(props) {
    super(props)

    this.createReceiver = this.createReceiver.bind(this)
    this.createAddress = this.createAddress.bind(this)
    this.listAddress = this.listAddress.bind(this)

    this.listAddress()
  }

  listAddress() {
    this.props.listAddress(this.props.params.id).then(data => {
      if (data.status !== 'success') {
        return
      }
      const normalAddresses = data.data.filter(address => !address.change).map((address) => {return {address: address.address, program: address.controlProgram}})
      const changeAddresses = data.data.filter(address => address.change).map((address) => {return {address: address.address, program: address.controlProgram}})

      this.setState({addresses: normalAddresses, changeAddresses})
    })
  }

  createReceiver() {
    this.props.createReceiver({
      account_alias: this.props.item.alias
    }).then(({data: receiver}) => this.props.showModal(<div>
      <p>Copy this one-time use address to use in a transaction:</p>
      <CopyableBlock value={JSON.stringify({
        controlProgram: receiver.controlProgram,
        expiresAt: receiver.expiresAt
      }, null, 1)}/>
    </div>))
  }

  createAddress() {
    const t = this.props.t
    this.props.createAddress({
      account_alias: this.props.item.alias
    }).then(({data}) => {
      this.listAddress()
      this.props.showModal(<div>
        <p>{t('account.copyAddress')}</p>
        <CopyableBlock value={data.address}/>
      </div>)
    })
  }

  showProgram(program){
    const t = this.props.t
    this.props.showModal(
      <div>
        <p>{t('account.copyProgram')}</p>
        <CopyableBlock value={program}/>
      </div>
    )
  }

  render() {
    const item = this.props.item
    const t = this.props.t

    let view
    if (item) {
      const title = <span>
        {t('account.account')}
        <code>{item.alias ? item.alias : item.id}</code>
      </span>

      view = <div className={componentClassNames(this)}>
        <PageTitle
          title={title}
          actions={[
            <button className='btn btn-link' onClick={this.createAddress}>
              {t('account.newAddress')}
            </button>,
          ]}
        />

        <PageContent>
          <KeyValueTable
            id={item.id}
            object='account'
            title={t('form.detail')}
            actions={[
              // TODO: add back first 2 buttons
              // <button key='show-txs' className='btn btn-link' onClick={this.props.showTransactions.bind(this, item)}>Transactions</button>,
              // <button key='show-balances' className='btn btn-link' onClick={this.props.showBalances.bind(this, item)}>Balances</button>,
              <RawJsonButton key='raw-json' item={item}/>
            ]}
            items={[
              {label: 'ID', value: item.id},
              {label: t('form.alias'), value: item.alias, editUrl: `/accounts/${item.id}/alias`},
              {label: t('form.xpubs'), value: (item.xpubs || []).length},
              {label: t('form.quorum') , value: item.quorum},
            ]}
          />

          {(item.xpubs || []).map((key, index) =>
            <KeyValueTable
              key={index}
              title={t('account.xpubs', {id: index + 1})}
              items={[
                {label: t('account.accountXpub'), value: key},
                {label: t('account.keyIndex'), value: item.keyIndex},
              ]}
            />
          )}

          {(this.state.addresses || []).length > 0 &&
          <KeyValueTable title={t('account.address')}
                         items={this.state.addresses.map((item, index) => ({
                           label: index+1,
                           value: item.address,
                           program: (e => this.showProgram(item.program))
                         }))}/>
          }

          {(this.state.changeAddresses || []).length > 0 &&
          <KeyValueTable title={t('account.changeAddress')}
                         items={this.state.changeAddresses.map((item, index) => ({
                           label: index+1,
                           value: item.address,
                           program: (e => this.showProgram(item.program))
                         }))}/>
          }
        </PageContent>
      </div>
    }
    return this.renderIfFound(view)
  }
}

// Container

import {connect} from 'react-redux'
import actions from 'actions'
import {withNamespaces} from 'react-i18next'

const mapStateToProps = (state, ownProps) => ({
  item: state.account.items[ownProps.params.id],
})

const mapDispatchToProps = (dispatch) => ({
  fetchItem: (id) => dispatch(actions.account.fetchItems({id: `${id}`})),
  showTransactions: (item) => {
    let filter = `inputs(account_id='${item.id}') OR outputs(account_id='${item.id}')`
    if (item.alias) {
      filter = `inputs(account_alias='${item.alias}') OR outputs(account_alias='${item.alias}')`
    }

    dispatch(actions.transaction.pushList({filter}))
  },
  showBalances: (item) => {
    let filter = `account_id='${item.id}'`
    if (item.alias) {
      filter = `account_alias='${item.alias}'`
    }

    dispatch(actions.balance.pushList({filter}))
  },
  createReceiver: (data) => dispatch(actions.account.createReceiver(data)),
  createAddress: (data) => dispatch(actions.account.createAddress(data)),
  showModal: (body) => dispatch(actions.app.showModal(
    body,
    actions.app.hideModal
  )),
  listAddress: actions.account.listAddresses
})

export default withNamespaces('translations') (connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountShow))
