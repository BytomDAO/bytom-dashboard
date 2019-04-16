import React from 'react'
import { ErrorBanner, PageTitle, FormSection, SubmitIndicator } from 'features/shared/components'
import componentClassNames from 'utility/componentClassNames'
import disableAutocomplete from 'utility/disableAutocomplete'

import styles from './FormContainer.scss'
import Tutorial from 'features/tutorial/components/Tutorial'
import {withNamespaces} from 'react-i18next'

class FormContainer extends React.Component {
  render() {
    const t = this.props.t
    return(
      <div className={componentClassNames(this, 'flex-container')}>
        <PageTitle title={this.props.label} />

        <div className={`${styles.main} flex-container`}>
          <div className={styles.content}>
            <form onSubmit={this.props.onSubmit} {...disableAutocomplete}>
              {this.props.children}

              <FormSection className={styles.submitSection}>
                {this.props.error &&
                  <ErrorBanner
                    title={ t('form.errorTitle')}
                    error={this.props.error} />}

                {this.props.success &&
                  <ErrorBanner
                    title={t('form.successTitle')}
                    success={this.props.success} />}

                <div className={styles.submit}>
                  {this.props.secondaryAction && <button type='button' className='btn btn-link' onClick={this.props.secondaryAction }>
                    { this.props.secondaryLabel ||t('commonWords.previous')}
                  </button>}
                  <button type='submit' className='btn btn-primary' disabled={this.props.submitting || this.props.disabled}>
                    {this.props.submitLabel ||  (t('form.submit'))}
                  </button>

                  {this.props.showSubmitIndicator && this.props.submitting &&
                    <SubmitIndicator />
                  }
                </div>
              </FormSection>
            </form>
          </div>
          <Tutorial types={['TutorialForm']} />
        </div>
      </div>
    )
  }
}

export default withNamespaces('translations') (FormContainer)
