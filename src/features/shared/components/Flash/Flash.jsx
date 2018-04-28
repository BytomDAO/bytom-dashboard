import React from 'react'
import styles from './Flash.scss'

const messageLabel ={
  'CREATED_ASSET': <p>
    Asset has been created successfully.
  </p>,
  'CREATED_ACCOUNT':  <p>
    Account has been created successfully.
  </p>,
  'CREATED_TRANSACTION':  <p>
    Transaction has been submitted successfully.
  </p>,
  'CREATED_KEY':  <p>
    Key has been created successfully.
  </p>,
  'RESET_PASSWORD_KEY':  <p>
    Key password has been reset successfully.
  </p>,
  'CREATE_REGISTER_ACCOUNT':  <p>
    Default account and key have been initialized successfully.
  </p>,
  'RESTORE_SUCCESS': <p>
    Wallet restore successfully
  </p>,
  'UPDATED_ASSET': <p>
    Updated asset alias.
  </p>
}

const messageZHLabel ={
  'CREATED_ASSET': <p>
    资产已经成功创建。
  </p>,
  'CREATED_ACCOUNT':  <p>
    账户已经成功创建。
  </p>,
  'CREATED_TRANSACTION':  <p>
    交易已经成功提交。
  </p>,
  'CREATED_KEY':  <p>
    密钥已经成功创建。
  </p>,
  'RESET_PASSWORD_KEY':  <p>
    密钥密码已经重置成功。
  </p>,
  'CREATE_REGISTER_ACCOUNT':  <p>
    默认账户和密钥已经初始化成功。
  </p>,
  'RESTORE_SUCCESS': <p>
    钱包已经成功恢复。
  </p>,
  'UPDATED_ASSET': <p>
    资产别名更改成功。
  </p>
}

class Flash extends React.Component {
  constructor(props) {
    super(props)
    Object.keys(props.messages).forEach(key => {
      const item = props.messages[key]
      if (!item.displayed) {
        this.props.markFlashDisplayed(key)
        setTimeout(() => {
          this.props.dismissFlash(key)
        }, 5000)
      }
    })
  }

  componentWillReceiveProps(nextProps) {
    Object.keys(nextProps.messages).forEach(key => {
      const item = nextProps.messages[key]
      if (!item.displayed) {
        this.props.markFlashDisplayed(key)
        setTimeout(() => {
          this.props.dismissFlash(key)
        }, 5000)
      }
    })
  }


  render() {
    if (!this.props.messages || this.props.hideFlash) {
      return null
    }

    const lang = this.props.lang
    const messages = []
    // Flash messages are stored in an objecty key with a random UUID. If
    // multiple messages are displayed, we rely on the browser maintaining
    // object inerstion order of keys to display messages in the order they
    // were created.
    Object.keys(this.props.messages).forEach(key => {
      const item = this.props.messages[key]
      const messageKey = Object.keys(messageLabel).filter(key => key === item.message)
      const messageContent = (lang ==='zh' ?  messageZHLabel[messageKey]: messageLabel[messageKey]) ||  item.message
      messages.push(
        <div className={`${styles.alert} ${styles[item.type]} ${styles.main}`} key={key}>
          <div className={styles.content}>
            {item.title && <div><strong>{item.title}</strong></div>}
            {messageContent}
          </div>

          <button type='button' className='close' onClick={() => this.props.dismissFlash(key)}>
            <span>&times;</span>
          </button>
        </div>)
    })

    return (
      <div className={this.props.className}>
        {messages}
      </div>
    )
  }
}

import { connect } from 'react-redux'

const mapStateToProps = (state) => ({
  // hideFlash: state.tutorial.isShowing && state.routing.locationBeforeTransitions.pathname.includes(state.tutorial.route)
  hideFlash: false,
  lang: state.core.lang
})

export default connect(
  mapStateToProps
)(Flash)
