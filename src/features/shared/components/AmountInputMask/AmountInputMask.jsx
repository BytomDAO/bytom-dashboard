import React from 'react'
import { parseBTMAmount, formatBTMAmount, addZeroToDecimalPosition } from 'utility/buildInOutDisplay'
import { FieldLabel } from 'features/shared/components'
import pick from 'lodash/pick'


const TEXT_FIELD_PROPS = [
  'value',
  'onBlur',
  'onChange',
  'onFocus',
  'name'
]

class AmountInputMask extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      value: props.fieldProps.value,
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
  }

  componentDidMount() {
    if(this.props.fieldProps.value){
      const value = (this.props.fieldProps.value/ Math.pow(10, 8)).toString()

      this.props.fieldProps.onChange(
        parseBTMAmount(value, this.props.decimal )
      )
      this.setState({ value: ( this.props.decimal === 0 ? value: addZeroToDecimalPosition( value, this.props.decimal ) ) })
    }
  }

  componentDidUpdate(prevProps){
    if(prevProps.decimal !== this.props.decimal && prevProps.fieldProps.value){
      const value = (prevProps.fieldProps.value/ Math.pow(10, prevProps.decimal)).toString()

      this.props.fieldProps.onChange(
        parseBTMAmount(value, this.props.decimal )
      )
      this.setState({ value: ( this.props.decimal === 0 ? value: addZeroToDecimalPosition( value, this.props.decimal ) ) })
    }
  }

  handleBlur(event) {
    const value = event.target.value
    if( this.props.decimal > 0 ){
      this.setState({ value: addZeroToDecimalPosition( value, this.props.decimal ) })
    }
    if (this.props.fieldProps.onBlur) {
      // Swallow the event to prevent Redux Form from
      // extracting the form value
      this.props.fieldProps.onBlur()
    }
  }

  handleChange(event) {
    const value = event.target.value
    // Update the internal state to trigger a re-render
    // using the formatted value
    this.setState({ value: value })
    if (this.props.fieldProps.onChange) {
      // Notify the normalized value
      this.props.fieldProps.onChange(
        parseBTMAmount(value, this.props.decimal )
      )
    }
  }

  render() {
    const fieldProps = pick(this.props.fieldProps, TEXT_FIELD_PROPS)
    const {touched, error} = this.props.fieldProps

    return(
      <div className='form-group'>
        {this.props.title && <FieldLabel>{this.props.title}</FieldLabel>}
          <input className='form-control'
            type={'text'}
            {...fieldProps}
            value={formatBTMAmount(this.state.value, this.props.decimal)}
            placeholder={this.props.placeholder}
            autoFocus={!!this.props.autoFocus}
            onBlur={this.handleBlur}
            onChange={this.handleChange}
            disabled={this.props.disabled}
          />
        {touched && error && <span className='text-danger'><strong>{error}</strong></span>}
        {this.props.hint && <span className='help-block'>{this.props.hint}</span>}
      </div>
    )
  }
}

export default AmountInputMask
