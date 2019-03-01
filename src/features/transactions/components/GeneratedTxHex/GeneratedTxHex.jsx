import React from 'react'
import { connect } from 'react-redux'
import { NotFound, PageContent, PageTitle, Section } from 'features/shared/components'
import styles from './GeneratedTxHex.scss'
import { copyToClipboard } from 'utility/clipboard'
import {withNamespaces} from 'react-i18next'
import actions from 'actions'
import QrCode from './QrCode'

class Generated extends React.Component {
  constructor(props) {
    super(props)
    this.showQrCode = this.showQrCode.bind(this)
    this.showSignatureQrCode = this.showSignatureQrCode.bind(this)
  }

  showQrCode(e) {
    e.preventDefault()
    this.props.showModal(
      <QrCode
        hex={this.props.hex}
      />
    )
  }

  showSignatureQrCode(e) {
    e.preventDefault()
    const hex = JSON.parse(this.props.hex)
    const signatures = hex.signingInstructions.map(obj => obj.witnessComponents[0].signatures)
    const signingInstructionsSignatures = {signingInstructionsSignatures:signatures}
    this.props.showModal(
      <QrCode
        hex={JSON.stringify(signingInstructionsSignatures)}
      />
    )
  }

  render() {
    const t = this.props.t

    if (!this.props.hex) return <NotFound />
    return (
      <div>
        <PageTitle title={t('transaction.advance.generated.title')} />

        <PageContent>
          <Section
            title={t('transaction.advance.generated.title')}
            actions={[
              <button
                className='btn btn-link'
                onClick={this.showQrCode}
              >
                {t('transaction.advance.generated.qrBtnText')}
              </button>,
              <button
                className='btn btn-link'
                onClick={this.showSignatureQrCode}
              >
                {t('transaction.advance.generated.signatureQrBtnText')}
              </button>

            ]}>
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
          </Section>


        </PageContent>
      </div>
    )
  }
}


const mapDispatchToProps = (dispatch) => ({
  showModal: (body) => dispatch(actions.app.showModal(
    body,
    actions.app.hideModal,
    null,
    {
      noCloseBtn: true
    }
  ))
})

export default connect(
  (state, ownProps) => {
    const generated = (state.transaction || {}).generated || []
    const found = generated.find(i => i.id == ownProps.params.id)
    if (found) return {hex: found.hex}
    return {}
  },
  mapDispatchToProps
)(withNamespaces('translations') ( Generated) )
