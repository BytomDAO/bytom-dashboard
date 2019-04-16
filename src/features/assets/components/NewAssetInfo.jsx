import React from 'react'
import { FormContainer, FormSection, TextField, RadioField, SelectField } from 'features/shared/components'
import { reduxForm } from 'redux-form'
import {withNamespaces} from 'react-i18next'
import styles from './New.scss'

const rangeOptions = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16].map(val => ({label: val, value: val}))

class NewAssetInfo extends React.Component {
  constructor(props) {
    super(props)
    this.addReceiverItem = this.addReceiverItem.bind(this)
    this.removeReceiverItem = this.removeReceiverItem.bind(this)
  }

  addReceiverItem() {
    this.props.fields.description.addField()
  }

  removeReceiverItem(index) {
    const receiver = this.props.fields.description
    receiver.removeField(index)
  }

  render() {
    const {
      fields: { alias, symbol,decimals,reissue, description},
      error,
      handleSubmit,
      submitting,
      t
    } = this.props

    const options = [
      {label:t('form.reissueTrue') , value: 'true'},
      {label:t('form.reissueFalse')  , value: 'false'}
    ]
    return(
      <FormContainer
        error={error}
        label= { t('asset.new') }
        onSubmit={handleSubmit}
        submitting={submitting}
        submitLabel={t('commonWords.next')}
        >

        <FormSection title={t('asset.information')}>
          <TextField title={t('form.alias')} placeholder={t('asset.aliasLengthError')} fieldProps={alias} autoFocus={true} />
          <TextField title={t('form.symbol')} placeholder={t('asset.symbolPlaceholder')} fieldProps={symbol} />
          <SelectField options={rangeOptions}
                       title={t('form.decimals')}
                       hint={t('asset.decimalPlaceholder')}
                       skipEmpty={true}
                       fieldProps={decimals} />
          <RadioField title={t('form.reissueTitle')} options={options} fieldProps={reissue} />
          <label >{t('asset.additionInfo')}</label>

          <div className={styles.panel}>
            {description.map((descript, index) =>
              <div className={styles.subjectField}>
                <TextField title={t('asset.additionInfoKey')} fieldProps={descript.key}/>
                <TextField title={t('asset.additionInfoValue')} fieldProps={descript.value}/>
                <button
                  className='btn btn-danger btn-xs'
                  tabIndex='-1'
                  type='button'
                  onClick={() => this.removeReceiverItem(index)}
                >
                  {t('commonWords.remove')}
                </button>

              </div>
            )}
            <button
              type='button'
              className='btn btn-default'
              onClick={this.addReceiverItem}
            >
              {t('commonWords.addField')}
            </button>
          </div>
        </FormSection>
      </FormContainer>
    )
  }
}

const validate = (values, props) => {
  const errors = { description:{} }
  const t = props.t

  if (!values.alias) {
    errors.alias = t('asset.aliasError')
  } else if (values.alias.length > 30){
    errors.alias = t('asset.aliasLengthError')
  }

  if (!values.symbol) {
    errors.symbol = t('asset.symbolError')
  } else if (!values.symbol.isUpperCase()){
    errors.symbol = t('asset.symbolCaseError')
  }

  if (!values.decimals) {
    errors.decimals = t('asset.decimalsError')
  } else if (!/^\d+$/.test(values.decimals)){
    errors.decimals = t('asset.decimalsTypeError')
  } else if( values.decimals> 16 || values.decimals<0){
    errors.decimals = t('asset.decimalsRangeError')
  }

  values.description.forEach((descr, index) => {
    if (!values.description[index].value) {
      errors.description[index] = {...errors.description[index], value: t('asset.additionInfoValueError')}
    }
    if (!values.description[index].key) {
      errors.description[index] = {...errors.description[index], key: t('asset.additionInfoKeyError')}
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
  'quorum'
]
export default withNamespaces('translations') (
  reduxForm({
    form: 'newAssetForm',
    fields,
    validate,
    destroyOnUnmount: false,
    initialValues: {
      decimals: 8,
      reissue: 'false',
      quorum: 1,
    }
  })(NewAssetInfo)
)
