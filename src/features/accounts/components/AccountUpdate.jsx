import React from 'react'
import { BaseUpdate, FormContainer, FormSection, JsonField, NotFound } from 'features/shared/components'
import { reduxForm } from 'redux-form'

class Form extends React.Component {
  constructor(props) {
    super(props)

    this.submitWithErrors = this.submitWithErrors.bind(this)

    this.state = {}
  }

  submitWithErrors(data) {
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
    const lang = this.props.lang

    if (!item) {
      return <div>Loading...</div>
    }

    const {
      fields: { tags },
      error,
      handleSubmit,
      submitting
    } = this.props

    const title = <span>
      {lang === 'zh' ? '编辑账户标签' : 'Edit account tags '}
      <code>{item.alias ? item.alias :item.id}</code>
    </span>

    const tagsString = Object.keys(item.tags || {}).length === 0 ? '{\n\t\n}' : JSON.stringify(item.tags || {}, null, 1)
    const tagLines = tagsString.split(/\r\n|\r|\n/).length
    let JsonFieldHeight

    if (tagLines < 5) {
      JsonFieldHeight = '80px'
    } else if (tagLines < 20) {
      JsonFieldHeight = `${tagLines * 17}px`
    } else {
      JsonFieldHeight = '340px'
    }

    return <FormContainer
      error={error}
      label={title}
      onSubmit={handleSubmit(this.submitWithErrors)}
      submitting={submitting}
      lang={lang}>

      <FormSection title= {lang === 'zh' ? '账户标签' : 'Account Tags' }>
        <JsonField
          height={JsonFieldHeight}
          fieldProps={tags}
          lang={lang} />

        <p>
          { lang === 'zh' ? ('注意：账户标签可用于查询交易，unspent outputs和余额。查询反映了提交交易时出现的帐户标签。只有新的交易活动才会反映更新后的标签。 '
          ) :(
            'Note: Account tags can be used for querying transactions, unspent outputs, and balances.' +
            ' Queries reflect the account tags that are present when transactions are submitted. ' +
            'Only new transaction activity will reflect the updated tags. '
          )}
        </p>
      </FormSection>
    </FormContainer>
  }
}

const mapStateToProps = (state, ownProps) => ({
  item: state.account.items[ownProps.params.id],
  lang: state.core.lang
})

const initialValues = (state, ownProps) => {
  const item = state.account.items[ownProps.params.id]
  if (item) {
    const tags = Object.keys(item.tags || {}).length === 0 ? '{\n\t\n}' : JSON.stringify(item.tags || {}, null, 1)
    return {
      initialValues: {
        tags: tags
      }
    }
  }
  return {}
}

const updateForm = reduxForm({
  form: 'updateAccountForm',
  fields: ['tags'],
  validate: values => {
    const errors = {}

    const jsonFields = ['tags']
    jsonFields.forEach(key => {
      const fieldError = JsonField.validator(values[key])
      if (fieldError) { errors[key] = fieldError }
    })

    return errors
  }
}, initialValues)(Form)

export default BaseUpdate.connect(
  mapStateToProps,
  BaseUpdate.mapDispatchToProps('account'),
  updateForm
)
