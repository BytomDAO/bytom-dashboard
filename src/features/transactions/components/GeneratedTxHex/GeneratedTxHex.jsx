import React from 'react'
import { connect } from 'react-redux'
import { NotFound, PageContent, PageTitle } from 'features/shared/components'
import styles from './GeneratedTxHex.scss'
import { copyToClipboard } from 'utility/clipboard'
import {withNamespaces} from 'react-i18next'

class Generated extends React.Component {
  render() {
    const t = this.props.t

    if (!this.props.hex) return <NotFound />
    return (
      <div>
        <PageTitle title={t('transaction.advance.generated.title')} />

        <PageContent>
          <div className={styles.main}>
            <p>{t('transaction.advance.generated.lead')}</p>

            <button
              className='btn btn-primary'
              onClick={() => copyToClipboard(this.props.hex)}
            >
              {t('account.copyClipboard')}
            </button>

            <pre className={styles.hex}>{this.props.hex}</pre>
          </div>
        </PageContent>
      </div>
    )
  }
}

export default connect(
  // mapStateToProps
  (state, ownProps) => {
    const generated = (state.transaction || {}).generated || []
    const found = generated.find(i => i.id == ownProps.params.id)
    if (found) return {hex: found.hex}
    return {}
  }
)(withNamespaces('translations') ( Generated) )
