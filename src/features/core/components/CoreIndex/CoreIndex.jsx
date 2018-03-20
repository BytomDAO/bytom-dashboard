import { chainClient } from 'utility/environment'
import { connect } from 'react-redux'
import {DropdownButton, MenuItem} from 'react-bootstrap'
import componentClassNames from 'utility/componentClassNames'
import { PageContent, ErrorBanner, PageTitle } from 'features/shared/components'
import React from 'react'
import styles from './CoreIndex.scss'
import testnetUtils from 'features/testnet/utils'
import { docsRoot } from 'utility/environment'
import actions from 'actions'
import {navAdvancedState} from '../../../app/reducers'


class CoreIndex extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      btmAmountUnit: 'BTM'
    }
    this.deleteClick = this.deleteClick.bind(this)
    this.handleAdvancedOptionChange = this.handleAdvancedOptionChange.bind(this)
    this.changeBTMamount = this.changeBTMamount.bind(this)
  }

  componentDidMount() {
    const fetchInfo = () => {
      if(this.refs.requestComponent) {
        chainClient().config.info().then(resp => {
          this.setState({requestStatus: resp.data})
        })
      }
    }
    setInterval(fetchInfo.bind(this), 2 * 1000)
  }

  deleteClick() {
    if (!window.confirm('Are you sure you want to delete all data on this core?')) {
      return
    }

    this.setState({deleteDisabled: true})

    chainClient().config.reset(true).then(() => {
      // TODO: Use Redux state reset and nav action instead of window.location.
      // Also, move confirmation message to a bonafide flash div. alert() in a
      // browser microtask is going away. cf https://www.chromestatus.com/features/5647113010544640
      setTimeout(function(){
        window.location.href = '/'
      }, 500)
    }).catch((err) => {
      this.setState({
        deleteError: err,
        deleteDisabled: false,
      })
    })
  }

  changeBTMamount(value) {
    this.setState({ btmAmountUnit: value })
    this.props.uptdateBtmAmountUnit(value)
  }

  handleAdvancedOptionChange(event) {
    const target = event.target
    if( target.checked ){
      this.props.showNavAdvanced()
    }else{
      this.props.hideNavAdvanced()
    }
  }

  render() {
    const {
      onTestnet,
      testnetBlockchainMismatch,
      testnetNetworkMismatch,
      testnetNextReset,
    } = this.props

    let generatorUrl
    if (this.props.core.generator) {
      generatorUrl = window.location.origin
    } else if (onTestnet) {
      generatorUrl = <span>
        {this.props.core.generatorUrl}
        &nbsp;
        <span className='label label-primary'>Chain Testnet</span>
      </span>
    } else {
      generatorUrl = this.props.core.generatorUrl
    }

    let navState = this.props.navAdvancedState === 'advance'

    let configBlock = (
      <div className={[styles.left, styles.col].join(' ')}>
        <div>
          <h4>Configuration</h4>
          <table className={styles.table}>
            <tbody>
              <tr>
                <td className={styles.row_label}>Core type:</td>
                <td>{this.props.core.coreType}</td>
              </tr>
              <tr>
                <td className={styles.row_label}>Setup time:</td>
                <td>{this.props.core.configuredAt}</td>
              </tr>
              <tr>
                <td className={styles.row_label}>Version:</td>
                <td><code>{this.props.core.version}</code></td>
              </tr>
              <tr>
                <td className={styles.row_label}>Language:</td>
                <td>{this.props.core.lang === 'zh' ? '中文' : 'English'}</td>
              </tr>
              <tr>
                <td className={styles.row_label}>MockHSM enabled:</td>
                <td><code>{this.props.core.mockhsm.toString()}</code></td>
              </tr>
              <tr>
                <td className={styles.row_label}>Localhost auth:</td>
                <td><code>{this.props.core.localhostAuth.toString()}</code></td>
              </tr>
              <tr>
                <td className={styles.row_label}>Reset enabled:</td>
                <td><code>{this.props.core.reset.toString()}</code></td>
              </tr>
              <tr>
                <td className={styles.row_label}>Non-TLS HTTP requests enabled:</td>
                <td><code>{this.props.core.httpOk.toString()}</code></td>
              </tr>
              <tr>
                <td colSpan={2}><hr /></td>
              </tr>
              <tr>
                <td className={styles.row_label}>Generator URL:</td>
                <td>{generatorUrl}</td>
              </tr>
              {onTestnet && !!testnetNextReset &&
                <tr>
                  <td className={styles.row_label}>Next Chain Testnet data reset:</td>
                  <td>{testnetNextReset.toString()}</td>
                </tr>}
              {!this.props.core.generator &&
                <tr>
                  <td className={styles.row_label}>Generator Access Token:</td>
                  <td><code>{this.props.core.generatorAccessToken}</code></td>
                </tr>}
              <tr>
                <td className={styles.row_label}>Blockchain ID:</td>
                <td><code className={styles.block_hash}>{this.props.core.blockchainId}</code></td>
              </tr>
              <tr>
                <td colSpan={2}><hr /></td>
              </tr>
              <tr>
                <td className={styles.row_label}>Advanced: </td>
                <td>
                  <label className={styles.switch}>
                    <input
                      type='checkbox'
                      onChange={this.handleAdvancedOptionChange}
                      checked={navState}
                    />
                    <span className={styles.slider}></span>
                  </label>
                </td>
              </tr>
              <tr>
                <td className={styles.row_label} >Unit to show amount in </td>
                <td>
                  <DropdownButton
                    bsSize='xsmall'
                    id='input-dropdown-amount'
                    title={this.props.core.btmAmountUnit || this.state.btmAmountUnit}
                    onSelect={this.changeBTMamount}
                  >
                    <MenuItem eventKey='BTM'>BTM</MenuItem>
                    <MenuItem eventKey='mBTM'>mBTM</MenuItem>
                    <MenuItem eventKey='NEU'>NEU</MenuItem>
                  </DropdownButton>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )

    let testnetErr
    if (onTestnet) {
      if (testnetBlockchainMismatch) {
        testnetErr = 'Chain Testnet has been reset. Please reset your core below.'
      } else if (testnetNetworkMismatch) {
        testnetErr = {message: <span>This core is no longer compatible with Chain Testnet. <a href={`${docsRoot}/core/get-started/install`} target='_blank'>Please upgrade Chain Core</a>.</span>}
      }
    }

    let requestStatusBlock =
        this.state.requestStatus && (<div className={styles['sub-row']}>
          <h4>Request status</h4>
          <table className={styles.table}>
            <tbody>
            {Object.keys(this.state.requestStatus).map(key => (
              <tr key={key}>
                <td className={styles.row_label}> {key}: </td>
                <td className={styles.row_value}>{ String(this.state.requestStatus[key])}</td>
              </tr>))}
            </tbody>
          </table>
        </div>
    )

    let networkStatusBlock = (
      <div className={styles.right}>
        <div ref='requestComponent'>
          <div className={[styles.top, styles['sub-row']].join(' ')}>
            <h4>Network status</h4>
            <table className={styles.table}>
              <tbody>
              <tr>
                <td className={styles.row_label}>Generator block:</td>
                <td className={styles.row_value}>{this.props.core.generatorBlockHeight}</td>
              </tr>
              <tr>
                <td className={styles.row_label}>Local block:</td>
                <td className={styles.row_value}>{this.props.core.blockHeight}</td>
              </tr>
              <tr>
                <td className={styles.row_label}>Replication lag:</td>
                <td className={`${styles.replication_lag} ${styles[this.props.core.replicationLagClass]}`}>
                  {this.props.core.replicationLag === null ? '???' : this.props.core.replicationLag}
                </td>
              </tr>
              </tbody>
            </table>
          </div>
          {requestStatusBlock}
        </div>
        {testnetErr && <ErrorBanner title='Chain Testnet error' error={testnetErr} />}
      </div>
    )

    let resetDataBlock = (
      <div className='row'>
        <div className='col-sm-6'>
          <h4>Reset data</h4>

          {this.props.core.reset ?
            <div>
              <p>
                This will permanently delete all data stored in this core,
                including blockchain data, accounts, assets, indexes,
                and MockHSM keys.
              </p>

              {this.state.deleteError && <ErrorBanner
                title='Error resetting data'
                message={this.state.deleteError.toString()}
              />}

              <button
                className='btn btn-danger'
                onClick={this.deleteClick}
                disabled={this.state.deleteDisabled}
              >
                Delete all data
              </button>
            </div> :
            <p>
              This core is not configured with reset capabilities.
            </p>}
        </div>
      </div>
    )

    return (
      <div className={componentClassNames(this, 'flex-container', styles.mainContainer)}>
        <PageTitle title='Core' />

        <PageContent>
          <div className={`${styles.top} ${styles.flex}`}>
            {configBlock}
            {networkStatusBlock}
          </div>
          {resetDataBlock}
        </PageContent>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  core: state.core,
  navAdvancedState: state.app.navAdvancedState,
  onTestnet: state.core.onTestnet,
  testnetBlockchainMismatch: testnetUtils.isBlockchainMismatch(state),
  testnetNetworkMismatch: testnetUtils.isCrosscoreRpcMismatch(state),
  testnetNextReset: state.testnet.nextReset,
})

const mapDispatchToProps = (dispatch) => ({
  showNavAdvanced: () => dispatch(actions.app.showNavAdvanced),
  hideNavAdvanced: () => dispatch(actions.app.hideNavAdvanced),
  uptdateBtmAmountUnit: (param) => dispatch(actions.core.updateBTMAmountUnit(param))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CoreIndex)
