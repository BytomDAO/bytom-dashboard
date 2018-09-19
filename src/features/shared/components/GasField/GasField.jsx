import React from 'react'
import pick from 'lodash/pick'

const TEXT_FIELD_PROPS = [
  'value',
  'onBlur',
  'onChange',
  'onFocus',
  'name'
]

class SliderField extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const fieldProps = pick(this.props.fieldProps, TEXT_FIELD_PROPS)
    const {touched, error} = this.props.fieldProps

    return(
      <div className='form-group'>
        <span>{fieldProps.value}</span>
        <input className='form-control'
               type='range'
               min={this.props.min}
               max={this.props.max}
               step='1'
               {...fieldProps} />

        {touched && error && <span className='text-danger'><strong>{error}</strong></span>}
        {this.props.hint && <span className='help-block'>{this.props.hint}</span>}
      </div>
    )
  }
}

export default SliderField
