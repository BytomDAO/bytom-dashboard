import React from 'react'
import pick from 'lodash/pick'
import { FieldLabel } from 'features/shared/components'
import styles from './RadioField.scss'

const TEXT_FIELD_PROPS = [
  'value',
  'onBlur',
  'onChange',
  'onFocus',
  'name'
]

class RadioField extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const fieldProps = pick(this.props.fieldProps, TEXT_FIELD_PROPS)
    const options = this.props.options

    return(
      <div className='form-group'>
        {this.props.title && <FieldLabel>{this.props.title}</FieldLabel>}
        <div>
            {options.map((option) =>
              <label className={styles.label}>
                <input type='radio'
                       className={styles.radio}
                       key = {option['label']}
                       {...fieldProps}
                       checked={option['value'] == fieldProps.value}
                       value={option['value']}
                       />
                {option['label']}</label>)}
        </div>

      </div>
    )
  }
}

export default RadioField