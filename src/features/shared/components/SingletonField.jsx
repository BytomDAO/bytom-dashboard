import React from 'react'
import pick from 'lodash/pick'
import disableAutocomplete from 'utility/disableAutocomplete'

const TEXT_FIELD_PROPS = [
  'value',
  'onBlur',
  'onChange',
  'onFocus',
  'name'
]

class SingletonField extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const fieldProps = pick(this.props.fieldProps, TEXT_FIELD_PROPS)
    const {touched, error} = this.props.fieldProps

    return(
      <div className={` ${this.props.className} ${touched && error &&'has-error'}`}>
        <input
          className='form-control'
          autoFocus={!!this.props.autoFocus}
          {...disableAutocomplete}
          {...fieldProps} />
      </div>
    )
  }
}

export default SingletonField
