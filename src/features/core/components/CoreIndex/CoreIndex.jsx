import { connect } from 'react-redux'
import {DropdownButton, MenuItem} from 'react-bootstrap'
import componentClassNames from 'utility/componentClassNames'
import { PageContent, PageTitle } from 'features/shared/components'
import React from 'react'
import styles from './CoreIndex.scss'
import actions from 'actions'


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
    let coreData = this.props.core.coreData

    const lang = this.props.core.lang

    let configBlock = (
      <div className={[styles.left, styles.col].join(' ')}>
        <div>
          <h4>{lang === 'zh' ? '配置' : 'Configuration'}</h4>
          <table className={styles.table}>
            <tbody>
            <tr>
              <td className={styles.row_label}>{lang === 'zh' ? '核心版本号' : 'Core Versions'}:</td>
              <td>{coreData? coreData['version'] : null}</td>
            </tr>
            <tr>
              <td className={styles.row_label}>{lang === 'zh' ? '语言' : 'Language'}:</td>
              <td>{lang === 'zh' ? '中文' : 'English'}</td>
            </tr>
            <tr>
              <td colSpan={2}><hr /></td>
            </tr>
            <tr>
              <td className={styles.row_label}>{lang === 'zh' ? '高级导航选项' : 'Advanced'}: </td>
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
              <td className={styles.row_label}>{lang === 'zh' ? '挖矿' : 'Mining'}: </td>
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
              <td className={styles.row_label} >{lang === 'zh' ? '比原数量单位显示' : 'Unit to show amount in'} </td>
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

    let requestStatusBlock


    if(!coreData){
      requestStatusBlock = (<div>loading...</div>)
    }else {
      requestStatusBlock = (
        <div className={styles['sub-row']}>
          <h4>{lang === 'zh' ? '网络状态' : 'Network status'}</h4>
          <table className={styles.table}>
            <tbody>
            <tr key={'core-listening'}>
              <td className={styles.row_label}> {lang === 'zh' ? '节点监听' : 'Listening'}:</td>
              <td className={styles.row_value}><code>{String(coreData['listening'])}</code></td>
            </tr>
            <tr key={'core-syncing'}>
              <td className={styles.row_label}> {lang === 'zh' ? '网络同步' : 'Syncing'}:</td>
              <td className={styles.row_value}><code>{String(coreData['syncing'])}</code></td>
            </tr>
            <tr key={'core-mining'}>
              <td className={styles.row_label}> {lang === 'zh' ? '挖矿状态' : 'Mining'}:</td>
              <td className={styles.row_value}><code>{String(coreData['mining'])}</code></td>
            </tr>
            <tr key={'core-peerCount'}>
              <td className={styles.row_label}> {lang === 'zh' ? '节点数' : 'Peer Count'}:</td>
              <td className={styles.row_value}><code>{String(coreData['peerCount'])}</code></td>
            </tr>
            <tr key={'core-currentBlock'}>
              <td className={styles.row_label}> {lang === 'zh' ? '当前高度' : 'Current Block'}:</td>
              <td className={styles.row_value}><code>{String(coreData['currentBlock'])}</code></td>
            </tr>
            <tr key={'core-highestBlock'}>
              <td className={styles.row_label}> {lang === 'zh' ? '最高高度' : 'Highest Block'}:</td>
              <td className={styles.row_value}><code>{String(coreData['highestBlock'])}</code></td>
            </tr>
            <tr key={'core-networkID'}>
              <td className={styles.row_label}> {lang === 'zh' ? '网络ID' : 'Network Id'}:</td>
              <td className={styles.row_value}><code>{String(coreData['networkId'])}</code></td>
            </tr>
            </tbody>
          </table>
        </div>
      )
    }

    let networkStatusBlock = (
      <div className={styles.right}>
        <div ref='requestComponent'>
          {requestStatusBlock}
        </div>
      </div>
    )

    return (
      <div className={componentClassNames(this, 'flex-container', styles.mainContainer)}>
        <PageTitle title={lang === 'zh' ? '核心' :'Core'} />

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
