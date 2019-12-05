import React, {Component} from 'react'
import { reduxForm } from 'redux-form'

import {NotFound, FormContainer, FormSection, PasswordField} from 'features/shared/components'

class CheckPassword extends Component {
  constructor(props) {
    super(props)
    this.submitWithValidations = this.submitWithValidations.bind(this)
    this.state = {}
  }

  submitWithValidations(data, xpub) {
    return new Promise((resolve, reject) => {
      const arg = {
        'xpub': xpub,
        'password': data.password,
      }
      this.props.checkPassword(arg)
        .then(() =>
          resolve()
        )
        .catch((err) => reject({_error: err}))
    })
  }

  componentDidMount() {
    this.props.fetchItem().then(resp => {
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
      fields: { password },
      error,
      handleSubmit,
      t
    } = this.props

    const success = this.props.successCode && t(`btmError.${this.props.successCode}`)

    const title = <span>
      {t('key.tryPassword')}
      <code>{item.alias}</code>
    </span>

    return (
      <FormContainer
        error={error}
        success={success}
        label={title}
        onSubmit={handleSubmit(value => this.submitWithValidations(value, item.xpub))}
        submitLabel= {t('key.tryPassword')}>

        <FormSection>
          <PasswordField
            title = { t('key.password') }
            placeholder={ t('key.tryPPlaceholder') }
            fieldProps={password}
            />
        </FormSection>
      </FormContainer>
    )
  }
}

import {connect} from 'react-redux'
import actions from 'actions'
import {withNamespaces} from 'react-i18next'

const mapStateToProps = (state, ownProps) => ({
  item: state.key.items[ownProps.params.id],
  successCode: state.key.success
})

const mapDispatchToProps = ( dispatch ) => ({
  fetchItem: () => dispatch(actions.key.fetchItems()),
  checkPassword: (params) => dispatch(actions.key.checkPassword(params))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(reduxForm({
  form: 'CheckPassword',
  fields: ['password'],
})(withNamespaces('translations')(CheckPassword)))
