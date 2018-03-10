import React from 'react'
import styles from './AmountUnitField.scss'
import { DropdownButton, MenuItem } from 'react-bootstrap'
import { FieldLabel } from 'features/shared/components'
import pick from 'lodash/pick'

const BTMAmountUnit = ['BTM', 'mBTM', 'NEU']

const TEXT_FIELD_PROPS = [
  'value',
  'onBlur',
  'onChange',
  'onFocus',
  'name'
]

class AmountUnitField extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showDropdown: false,
      selected: 'BTM',
      value: props.value,
    }

    this.select = this.select.bind(this)
    this.toggleDropwdown = this.toggleDropwdown.bind(this)
    this.closeDropdown = this.closeDropdown.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      value: nextProps.value,
    })
  }

  toggleDropwdown() {
    this.setState({ showDropdown: !this.state.showDropdown })
  }

  closeDropdown() {
    this.setState({ showDropdown: false })
  }

  select(value) {
    this.setState({ selected: value })
    const amount = this.props.fieldProps.value
    switch (value){
      case 'BTM':
        this.props.fieldProps.value = amount/100000000
        break
      case 'mBTM':
        this.props.fieldProps.value = amount/100000
        break
      case 'NEU':
        this.props.fieldProps.value = amount
    }
    this.closeDropdown()
  }

  handleBlur() {
    if (this.props.onBlur) {
      // Swallow the event to prevent Redux Form from
      // extracting the form value
      this.props.onBlur()
    }
  }

  handleChange(event) {
    const value = event.target.value

    // Update the internal state to trigger a re-render
    // using the formatted value
    this.setState({value: value})

    if (this.props.onChange) {
      // Notify the normalized value
      debugger
      this.props.onChange(
        this.props.normalize(value)
      )
    }
  }

  render() {
    const fieldProps = pick(this.props.fieldProps, TEXT_FIELD_PROPS)
    const {touched, error} = this.props.fieldProps

    return(
      <div className='form-group'>
        {this.props.title && <FieldLabel>{this.props.title}</FieldLabel>}
        <div className='input-group'>


          {<input className='form-control'
            type={this.state.type}
            placeholder={this.props.placeholder}
            autoFocus={!!this.props.autoFocus}
            {...fieldProps}
            value={this.props.format(this.state.value)}
            onChange={this.handleChange}
            onBlur={this.handleBlur}
          />}


          <div className={`input-group-btn ${this.state.showDropdown && 'open'}`}>
            <DropdownButton
              className={styles.dropdownButton}
              id='input-dropdown-addon'
              title={this.state.selected}
              onSelect={this.select}
            >
              {BTMAmountUnit.map((option) =>
                <MenuItem eventKey={option}>{option}</MenuItem>
              )}
            </DropdownButton>
          </div>

        </div>
        {touched && error && <span className='text-danger'><strong>{error}</strong></span>}
        {this.props.hint && <span className='help-block'>{this.props.hint}</span>}
      </div>
    )
  }
}

export default AmountUnitField