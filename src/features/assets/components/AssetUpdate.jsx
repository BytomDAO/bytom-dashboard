import React from 'react'
import { BaseUpdate, FormContainer, FormSection, NotFound, TextField } from 'features/shared/components'
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
      if (resp.status == 'fail') {
        this.setState({notFound: true})
      }
    })
  }

  render() {
    const lang = this.props.lang
    if (this.state.notFound) {
      return <NotFound lang={lang}/>
    }
    const item = this.props.item

    if (!item) {
      return <div>Loading...</div>
    }

    const {
      fields: { alias },
      error,
      handleSubmit,
      submitting
    } = this.props

    const title = <span>
      {lang === 'zh' ? '编辑资产别名' : 'Edit asset alias '}
      <code>{item.alias ? item.alias :item.id}</code>
    </span>

    return <FormContainer
      error={error}
      label={title}
      onSubmit={handleSubmit(this.submitWithErrors)}
      submitting={submitting}
      lang={lang}>

      <FormSection title={lang === 'zh' ? '资产别名' : 'Asset Alias' }>
        <TextField
          placeholder={ lang === 'zh' ? '请输入资产别名' : 'Please entered asset alias' }
          fieldProps={alias}
          type= 'text'
        />
      </FormSection>
    </FormContainer>
  }
}

const mapStateToProps = (state, ownProps) => ({
  item: state.asset.items[ownProps.params.id],
  lang: state.core.lang
})

const initialValues = (state, ownProps) => {
  const item = state.asset.items[ownProps.params.id]
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
  form: 'updateAssetForm',
  fields: ['alias'],
}, initialValues)(Form)

export default BaseUpdate.connect(
  mapStateToProps,
  BaseUpdate.mapDispatchToProps('asset'),
  updateForm
)
