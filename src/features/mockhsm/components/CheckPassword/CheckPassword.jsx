import React, {Component} from 'react'
import { reduxForm } from 'redux-form'

import { FormContainer, FormSection, PasswordField} from 'features/shared/components'

class CheckPassword extends Component {
  constructor(props) {
    super(props)
    this.submitWithErrors = this.submitWithErrors.bind(this)
    this.state = {}
  }

  submitWithErrors(data, xpub) {
    return new Promise((resolve, reject) => {
      const arg = {
        'xpub': xpub,
        'password': data.password,
      }
      this.props.checkPassword(arg)
        .then(() =>
          resolve()
        )
        .catch((err) => reject({_error: err.message}))
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
    const lang = this.props.lang

    if (!item) {
      return <div>Loading...</div>
    }

    const success = this.props.successMsg

    const {
      fields: { password },
      error,
      handleSubmit,
    } = this.props

    const title = <span>
      {lang === 'zh' ? '密码校验' : 'Try Password'}
      <code>{item.alias}</code>
    </span>

    return (
      <FormContainer
        error={error}
        success={success}
        label={title}
        onSubmit={handleSubmit(value => this.submitWithErrors(value, item.xpub))}
        submitLabel= { lang === 'zh' ? '密码校验' : 'Try Password' }
        lang={lang}>

        <FormSection>
          <PasswordField
            title = { lang === 'zh' ? '密码' : 'Password' }
            placeholder={ lang === 'zh' ? '请输入校验密码' : 'Please entered the password that you need to check.' }
            fieldProps={password}
            />
        </FormSection>
      </FormContainer>
    )
  }
}

import {connect} from 'react-redux'
import actions from 'actions'

const mapStateToProps = (state, ownProps) => ({
  item: state.key.items[ownProps.params.id],
  lang: state.core.lang,
  successMsg: state.key.success
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
})(CheckPassword))
