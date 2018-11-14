import React from 'react'
import styles from './Flash.scss'

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

    const {t} = this.props
    const messages = []
    // Flash messages are stored in an objecty key with a random UUID. If
    // multiple messages are displayed, we rely on the browser maintaining
    // object inerstion order of keys to display messages in the order they
    // were created.
    Object.keys(this.props.messages).forEach(key => {
      const item = this.props.messages[key]
      const messageContent = t([`message.${item.message}`, item.message])

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
import {withNamespaces} from 'react-i18next'

const mapStateToProps = (state) => ({
  // hideFlash: state.tutorial.isShowing && state.routing.locationBeforeTransitions.pathname.includes(state.tutorial.route)
  hideFlash: false,
})

export default connect(
  mapStateToProps
)(withNamespaces('translations') (Flash))
