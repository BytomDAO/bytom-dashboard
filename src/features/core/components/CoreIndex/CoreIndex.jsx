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
    this.handleMiningState = this.handleMiningState.bind(this)
    this.handleAdvancedOptionChange = this.handleAdvancedOptionChange.bind(this)
    this.changeBTMamount = this.changeBTMamount.bind(this)
  }

  componentDidMount() {
    if(window.ipcRenderer){
      window.ipcRenderer.on('btmAmountUnitState', (event, arg) => {
        this.props.uptdateBtmAmountUnit(arg)
      })
    }
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

  handleMiningState(event){
    const target = event.target
    if( target.checked ){
      this.props.updateMiningState(true)
    }else{
      this.props.updateMiningState(false)
    }
  }

  render() {
    let navState = this.props.navAdvancedState === 'advance'
    let miningState = this.props.core.mingStatus

    let configBlock = (
      <div className={[styles.left, styles.col].join(' ')}>
        <div>
          <h4>Configuration</h4>
          <table className={styles.table}>
            <tbody>
            <tr>
              <td className={styles.row_label}>Language:</td>
              <td>{this.props.core.lang === 'zh' ? '中文' : 'English'}</td>
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
              <td className={styles.row_label}>Mining: </td>
              <td>
                <label className={styles.switch}>
                  <input
                    type='checkbox'
                    onChange={this.handleMiningState}
                    checked={miningState}
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

    let coreData = this.props.core.coreData
    let requestStatusBlock =(
      <div className={styles['sub-row']}>
          <h4>Network status</h4>
          <table className={styles.table}>
            <tbody>
            {Object.keys(coreData).map(key => (
              <tr key={key}>
                <td className={styles.row_label}> {key.replace(/([a-z])([A-Z])/g, '$1 $2')}: </td>
                <td className={styles.row_value}><code>{ String(coreData[key])}</code></td>
              </tr>))}
            </tbody>
          </table>
        </div>
      )

    let networkStatusBlock = (
      <div className={styles.right}>
        <div ref='requestComponent'>
          {requestStatusBlock}
        </div>
      </div>
    )

    return (
      <div className={componentClassNames(this, 'flex-container', styles.mainContainer)}>
        <PageTitle title='Core' />

        <PageContent>
          <div className={`${styles.flex}`}>
            {configBlock}
            {networkStatusBlock}
          </div>
        </PageContent>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  core: state.core,
  navAdvancedState: state.app.navAdvancedState,
})

const mapDispatchToProps = (dispatch) => ({
  showNavAdvanced: () => dispatch(actions.app.showNavAdvanced),
  hideNavAdvanced: () => dispatch(actions.app.hideNavAdvanced),
  uptdateBtmAmountUnit: (param) => dispatch(actions.core.updateBTMAmountUnit(param)),
  updateMiningState: (param) => dispatch(actions.core.updateMiningState(param))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CoreIndex)
