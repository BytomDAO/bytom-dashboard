import React from 'react'
import { FormContainer, FormSection, KeyConfiguration } from 'features/shared/components'
import { reduxForm } from 'redux-form'
import { withNamespaces } from 'react-i18next'

class NewKeyAndSign extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {
      fields: { xpubs, quorum },
      error,
      previousPage,
      handleSubmit,
      submitting,
      t
    } = this.props

    const prev = () => {
      const promise = new Promise(function(resolve, reject) {
        try {
          for (let i = 0; i < xpubs.length; i++) {
            xpubs.removeField()
          }
        } catch (err) {
          reject(err)
        }
        resolve()
      })

      promise.then(previousPage)
    }

    return(
      <FormContainer
        error={error}
        label= { t('asset.new') }
        onSubmit={handleSubmit}
        submitting={submitting}
        secondaryAction={prev}
        >

        <FormSection title={t('form.keyAndSign')}>
          <KeyConfiguration
            xpubs={xpubs}
            quorum={quorum}
            quorumHint={t('asset.quorumHint')} />
        </FormSection>

      </FormContainer>
    )
  }
}

const validate = (values, props) => {
  const errors = { xpubs:{} }
  const t = props.t

  values.xpubs.forEach((xpub, index) => {
    if (!values.xpubs[index].value) {
      errors.xpubs[index] = {...errors.xpubs[index], value: t('asset.keysError')}
    }
  })

  return errors
}

const fields = [
  'alias',
  'symbol',
  'decimals',
  'reissue',
  'description[].key',
  'description[].value',
  'xpubs[].value',
  'xpubs[].type',
  'quorum'
]
export default withNamespaces('translations') (
  reduxForm({
    form: 'newAssetForm',
    fields,
    validate,
    destroyOnUnmount: false,
  })(NewKeyAndSign)
)
