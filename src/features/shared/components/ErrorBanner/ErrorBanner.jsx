import React from 'react'
import styles from './ErrorBanner.scss'
import {withNamespaces} from 'react-i18next'

class ErrorBanner extends React.Component {
  render() {
    const {t, i18n} = this.props
    const error = this.props.error || ''
    const codeMessage = error.code && i18n.exists(`btmError.${error.code}`) && t(`btmError.${error.code}`)
    const success = this.props.success
    const message = codeMessage || error.chainMessage || error.message || error || success

    return (
      <div className={success? styles.mainSuccess:  styles.main }>
        {this.props.title && <strong>{this.props.title}<br/></strong>}

        {message &&
          <div className={(error.code || error.requestId) ? styles.message : ''}>
            {message}
          </div>}

        {error.code &&
          <div className={styles.extra}>{t('commonWords.errorCode')} <strong>{error.code}</strong></div>}

        {error.requestId &&
          <div className={styles.extra}>{t('commonWords.requestId')} <strong>{error.requestId}</strong></div>}
      </div>
    )
  }
}

export default withNamespaces('translations')  (ErrorBanner)
