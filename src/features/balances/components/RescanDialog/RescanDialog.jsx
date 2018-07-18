import React from 'react'
import { ProgressBar } from 'react-bootstrap'
import styles from './RescanDialog.scss'
import actions from 'actions'
import {connect} from 'react-redux'

class RescanDialog extends React.Component {
  constructor(props) {
    super(props)
    this.state={
      now: 0
    }
  }

  componentDidMount(){
    let now = 0
    this.props.rescan()
      .then(()=>{
        return this.setStat()
      })

    this.setStat = () => {
      if (this.props.rescanning) {
        this.props.fetchInfo()
        now = this.props.rescanProgress.bestBlockHeight?
          (this.props.rescanProgress.walletHeight*100/ this.props.rescanProgress.bestBlockHeight).toFixed(2)
          :0
        this.setState({
          now: now
        })
        setTimeout(this.setStat, 2000)
      }else{
        this.setState({
          now: 100
        })
      }
    }
  }

  render() {
    const now = this.state.now
    const lang = this.props.lang
    const success = (lang === 'zh' ? '扫描成功!!!':'Success!!!')
    const start = (lang === 'zh' ? '扫描开始...':'Starting...')
    const rescan = (lang === 'zh' ? '扫描中...':'Rescanning...')
    return (
      <div>
        <h2 className={styles.title}>
          { now === 100?
            success:
            (now === 0? start: rescan)
          }
        </h2>
        { now === 100?
          <pre className={styles.infoContainer}>
            <p>{lang === 'zh' ? '已经成功扫描资产余额。' :'Successfully rescanned spent outputs.'}</p>
          </pre>
          :
          (now === 0?
            (<pre className={styles.infoContainer}>
              <p>{lang === 'zh' ? '扫描正在启动...' : 'Rescan is starting...'}</p>
            </pre>):
            (<pre className={styles.infoContainer}>
              <p>{lang === 'zh' ? '钱包正在扫描中...' : 'Wallet Rescanning...'}</p>
              <ProgressBar now={now} />
             </pre>))

        }
        <div className={styles.submitBtn}>
          <button
            key='submit'
            className={'btn btn-primary'}
            onClick={() => this.props.closeModal()}
            disabled={ now!==100 }
          >
            {lang === 'zh' ? '确定' : 'OK'}
          </button>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  rescanning: state.balance.rescanning,
  rescanProgress: state.balance.rescanProgress,
})


const mapDispatchToProps = ( dispatch ) => ({
  rescan: () => dispatch(actions.balance.rescan()),
  fetchInfo: () => dispatch(actions.balance.walletInfo()),
  closeModal:() => dispatch(actions.app.hideModal),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)( RescanDialog)
