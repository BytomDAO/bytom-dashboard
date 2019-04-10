import React from 'react'
import {connect} from 'react-redux'
import {ErrorBanner, FileField} from 'features/shared/components'
import actions from 'actions'
import {reduxForm} from 'redux-form'
import {withNamespaces} from 'react-i18next'
import style from './RestoreKeystore.scss'

class RestoreKeystore extends React.Component {
  constructor(props) {
    super(props)
    this.submitWithValidations = this.submitWithValidations.bind(this)
  }

  submitWithValidations(data) {
    return new Promise((resolve, reject) => {
      this.props.restoreKeystore(data, this.props.success)
        .catch((err) => reject({_error: err}))
    })
  }

  render() {
    const t = this.props.t

    const {
      fields: {file},
      error,
      handleSubmit,
      submitting
    } = this.props


    return (
      <div >
        <div>
          <h4 >{t('init.restoreWallet')}</h4>
          <div>
            <form onSubmit={handleSubmit(this.submitWithValidations)}>
              <p>{t('init.restoreLabel')}</p>

              <FileField
                fieldProps={file}
              />

              {error &&
              <ErrorBanner
                title={t('init.errorTitle')}
                error={error}/>}

              <button type='submit' className={`btn btn-primary ${style.submitButton}`} disabled={submitting}>
                {t('init.restore')}
              </button>

            </form>
          </div>
        </div>
      </div>
    )
  }
}


export default withNamespaces('translations')( connect(
  () => ({}),
  (dispatch) => ({
    restoreKeystore: (token, success) => dispatch(actions.initialization.restoreKeystore(token, success)),
  })
)(reduxForm({
  form: 'restoreKeystore',
  fields: ['file'],
})(RestoreKeystore)))
