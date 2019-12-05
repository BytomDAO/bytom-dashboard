import React from 'react'
import { FieldLabel } from 'features/shared/components'
import pick from 'lodash/pick'

const TEXT_FIELD_PROPS = [
  'value',
  'onBlur',
  'onFocus',
  'name'
]

class FileField extends React.Component {
  constructor(props) {
    super(props)
    this.onChange = this.onChange.bind(this)
  }

  onChange(e) {
    const { fieldProps: { onChange } } = this.props
    onChange(e.target.files[0])
  }

  render() {
    const fieldProps = pick(this.props.fieldProps, TEXT_FIELD_PROPS)
    const {touched, error} = this.props.fieldProps
    return(
      <div className='form-group'>
        {this.props.title && <FieldLabel>{this.props.title}</FieldLabel>}
        <input
          type='file'
          onChange={this.onChange}
        />

        {touched && error && <span className='text-danger'><strong>{error}</strong></span>}
        {this.props.hint && <span className='help-block'>{this.props.hint}</span>}
      </div>
    )
  }
}

export default FileField