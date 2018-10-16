import { PageTitle } from 'features/shared/components'
import React from 'react'
import { connect } from 'react-redux'
import styles from './New.scss'
import actions from 'actions'
import componentClassNames from 'utility/componentClassNames'
import Tutorial from 'features/tutorial/components/Tutorial'
import NormalTxForm from './NormalTransactionForm'
import AdvancedTxForm from './AdvancedTransactionForm'
import { withRouter } from 'react-router'
import {getValues} from 'redux-form'
import {withNamespaces} from 'react-i18next'

class Form extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showAdvanceTx: false
    }
    this.handleFormEmpty = this.handleFormEmpty.bind(this)
  }

  componentDidMount() {
    if (!this.props.autocompleteIsBalanceLoaded) {
      this.props.fetchBalanceAll().then(() => {
        this.props.didLoadBalanceAutocomplete()
      })
    }
    if (!this.props.autocompleteIsAssetLoaded) {
      this.props.fetchAssetAll().then(() => {
        this.props.didLoadAssetAutocomplete()
      })
    }
    this.props.router.setRouteLeaveHook(this.props.route, (nextLocation) => {
      if (!(this.handleFormEmpty() || nextLocation.state || nextLocation.pathname.startsWith('/transactions/generated/')))
        return this.props.t('transaction.new.unsaveWarning')
    })
  }

  handleKeyDown(e, cb, disable) {
    if (e.key === 'Enter' && e.shiftKey === false && !disable) {
      e.preventDefault()
      cb()
    }
  }

  handleFormEmpty() {
    if(!this.state.showAdvanceTx){
      const array = [
        'accountAlias',
        'accountId',
        'assetAlias',
        'assetId',
        'password']

      for (let k in array){
        if(this.props.normalform[array[k]]){
          return false
        }
      }

      return !(this.props.normalform['receivers'].length > 1)
    }else{
      return !(this.props.advform['actions'].length > 0 ||
      this.props.advform['signTransaction'] ||
      this.props.advform['password'])
    }
  }

  showForm(e, type){
    e.preventDefault()
    const showAdTx = (type === 'advanced')
    if ( this.state.showAdvanceTx === showAdTx ||
      ( !this.handleFormEmpty() && !window.confirm(this.props.t('transaction.new.unsaveWarning')) )){
      return
    }
    this.setState({ showAdvanceTx: showAdTx })
  }

  render() {
    const t = this.props.t

    return (
      <div className={componentClassNames(this, 'flex-container')}>
        <PageTitle title={t('transaction.new.new')} />

        <div className={`${styles.mainContainer} flex-container`}>

          <div className={styles.center}>
            <div className={styles.btnGroup} >
              <div className={'btn-group'} role='group'>
                <button
                  className={`btn btn-default ${this.state.showAdvanceTx ? null : 'active'}`}
                  onClick={(e) => this.showForm(e, 'normal')}>
                  {t('transaction.new.normal')}
                  </button>
                <button
                  className={`btn btn-default ${this.state.showAdvanceTx ? 'active' : null}`}
                  onClick={(e) => this.showForm(e, 'advanced')}>
                  {t('transaction.new.advanced')}
                  </button>
              </div>
            </div>

              {!this.state.showAdvanceTx &&
              <NormalTxForm
                btmAmountUnit={this.props.btmAmountUnit}
                asset={this.props.asset}
                balances ={this.props.balances}
                handleKeyDown={this.handleKeyDown}
                tutorialVisible={this.props.tutorialVisible}
              /> }

              {this.state.showAdvanceTx &&
              <AdvancedTxForm
                btmAmountUnit={this.props.btmAmountUnit}
                asset={this.props.asset}
                handleKeyDown={this.handleKeyDown}
              />}
          </div>


          <Tutorial types={['TutorialForm']} advTx={this.state.showAdvanceTx}/>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  let balances = []
  for (let key in state.balance.items) {
    balances.push(state.balance.items[key])
  }

  return {
    autocompleteIsBalanceLoaded: state.balance.autocompleteIsLoaded,
    autocompleteIsAssetLoaded: state.asset.autocompleteIsLoaded,
    btmAmountUnit: state.core.btmAmountUnit,
    balances,
    asset: Object.keys(state.asset.items).map(k => state.asset.items[k]),
    normalform: getValues(state.form.NormalTransactionForm),
    advform: getValues(state.form.AdvancedTransactionForm),
    tutorialVisible: !state.tutorial.location.isVisited
  }
}

const mapDispatchToProps = (dispatch) => ({
  didLoadBalanceAutocomplete: () => dispatch(actions.balance.didLoadAutocomplete),
  fetchBalanceAll: (cb) => dispatch(actions.balance.fetchAll(cb)),
  didLoadAssetAutocomplete: () => dispatch(actions.asset.didLoadAutocomplete),
  fetchAssetAll: (cb) => dispatch(actions.asset.fetchAll(cb)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)( withNamespaces('translations')  (withRouter(Form)) )