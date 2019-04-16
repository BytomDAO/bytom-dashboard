import React from 'react'
import { BaseUpdate, FormContainer, FormSection, TextField, NotFound } from 'features/shared/components'
import { reduxForm } from 'redux-form'
import {withNamespaces} from 'react-i18next'

class Form extends React.Component {
  constructor(props) {
    super(props)

    this.submitWithValidations = this.submitWithValidations.bind(this)

    this.state = {}
  }

  submitWithValidations(data) {
    return this.props.submitForm(data, this.props.item.id).catch(err => {
      throw {_error: err}
    })
  }

  componentDidMount() {
    this.props.fetchItem(this.props.params.id).then(resp => {
      if (resp.data.length == 0) {
        this.setState({notFound: true})
      }
    })
  }

  render() {
    if (this.state.notFound) {
      return <NotFound />
    }
    const item = this.props.item

    if (!item) {
      return <div>Loading...</div>
    }

    const {
      fields: { alias },
      error,
      handleSubmit,
      submitting,
      t
    } = this.props

    const title = <span>
      {t('account.editAlias')}
      <code>{item.alias ? item.alias :item.id}</code>
    </span>


    return <FormContainer
      error={error}
      label={title}
      onSubmit={handleSubmit(this.submitWithValidations)}
      submitting={submitting}
    >

      <FormSection title={t('account.alias') }>
        <TextField
          placeholder={ t('account.aliasPlaceholder')}
          fieldProps={alias}
          type= 'text'
        />
      </FormSection>
    </FormContainer>
  }
}

const mapStateToProps = (state, ownProps) => ({
  item: state.account.items[ownProps.params.id],
})

const initialValues = (state, ownProps) => {
  const item = state.account.items[ownProps.params.id]
  if (item) {
    return {
      initialValues: {
        alias: item.alias
      }
    }
  }
  return {}
}

const updateForm = reduxForm({
  form: 'updateAccountForm',
  fields: ['alias']
}, initialValues)(Form)

export default withNamespaces('translations') (BaseUpdate.connect(
  mapStateToProps,
  BaseUpdate.mapDispatchToProps('account'),
  updateForm
))
