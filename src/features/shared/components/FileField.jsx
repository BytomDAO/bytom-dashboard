import React from 'react'
import { FieldLabel } from 'features/shared/components'

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

    return(
      <div className='form-group'>
        {this.props.title && <FieldLabel>{this.props.title}</FieldLabel>}
        <input
          type='file'
          onChange={this.onChange}
        />
        {this.props.hint && <span className='help-block'>{this.props.hint}</span>}
      </div>
    )
  }
}

export default FileField