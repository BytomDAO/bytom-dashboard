import React from 'react'
import pick from 'lodash/pick'
import { normalizeBTMAmountUnit } from 'utility/buildInOutDisplay'
import { btmID } from 'utility/environment'
import styles from './GasField.scss'

const TEXT_FIELD_PROPS = [
  'value',
  'onBlur',
  'onChange',
  'onFocus',
  'name'
]

class GasField extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const fieldProps = pick(this.props.fieldProps, TEXT_FIELD_PROPS)
    const {touched, error} = this.props.fieldProps

    return(
      <div className={`form-group ${styles.slider}`}>
        {this.props.gas && <span>{normalizeBTMAmountUnit(btmID, fieldProps.value* this.props.gas, this.props.btmAmountUnit)}</span>}
        <input className={fieldProps.value>0&&styles[`gradient-${fieldProps.value}`]}
               type='range'
               min={0}
               max={3}
               step='1'
               {...fieldProps} />

        {touched && error && <span className='text-danger'><strong>{error}</strong></span>}
        {this.props.hint && <span className='help-block'>{this.props.hint}</span>}
      </div>
    )
  }
}

export default GasField
