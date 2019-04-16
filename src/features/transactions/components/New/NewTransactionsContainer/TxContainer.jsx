import React from 'react'
import { ErrorBanner, FormSection, SubmitIndicator } from 'features/shared/components'
import disableAutocomplete from 'utility/disableAutocomplete'

import styles from './TxContainer.scss'
import {withNamespaces} from 'react-i18next'

class TxContainer extends React.Component {
  render() {
    const t = this.props.t
    return(
      <form className={this.props.className} onSubmit={this.props.onSubmit} {...disableAutocomplete}>
        {this.props.children}

        <FormSection>
          {this.props.error && this.props.error.message !== 'PasswordWrong' &&
          <ErrorBanner
            title={ t('form.errorTitle')}
            error={this.props.error} />}

          <div className={styles.submit}>
            <button type='submit' className='btn btn-primary' disabled={this.props.submitting || this.props.disabled}>
              {this.props.submitLabel ||  (t('form.submit'))}
            </button>

            {this.props.showSubmitIndicator && this.props.submitting &&
            <SubmitIndicator />
            }
          </div>
        </FormSection>
      </form>
    )
  }
}

export default withNamespaces('translations') (TxContainer)
