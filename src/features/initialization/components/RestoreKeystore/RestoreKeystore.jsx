import React from 'react'
import {connect} from 'react-redux'
import {ErrorBanner, FileField} from 'features/shared/components'
import actions from 'actions'
import {reduxForm} from 'redux-form'
import {withNamespaces} from 'react-i18next'

class RestoreKeystore extends React.Component {
  constructor(props) {
    super(props)
    this.submitWithErrors = this.submitWithErrors.bind(this)
  }

  submitWithErrors(data) {
    return new Promise((resolve, reject) => {
      this.props.restoreKeystore(data)
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
          <h2 >{t('init.restoreWallet')}</h2>
          <div>
            <form onSubmit={handleSubmit(this.submitWithErrors)}>
              <p>{t('init.restoreLabel')}</p>

              <FileField
                fieldProps={file}
              />

              {error &&
              <ErrorBanner
                title={t('init.errorTitle')}
                error={error}/>}

              <button type='submit' className='btn btn-primary' disabled={submitting}>
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
    restoreKeystore: (token) => dispatch(actions.initialization.restoreKeystore(token)),
  })
)(reduxForm({
  form: 'restoreKeystore',
  fields: ['file'],
})(RestoreKeystore)))
