import React from 'react'
import styles from './ObjectSelectorField.scss'
import { DropdownButton, MenuItem } from 'react-bootstrap'
import { FieldLabel } from 'features/shared/components'

const ALIAS_SELECTED = 'Alias'
const ID_SELECTED = 'ID'

class ObjectSelectorField extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showDropdown: false,
      selected: ALIAS_SELECTED
    }

    this.select = this.select.bind(this)
    this.toggleDropwdown = this.toggleDropwdown.bind(this)
    this.closeDropdown = this.closeDropdown.bind(this)
  }

  toggleDropwdown() {
    this.setState({ showDropdown: !this.state.showDropdown })
  }

  closeDropdown() {
    this.setState({ showDropdown: false })
  }

  select(value) {
    this.setState({ selected: value })
    this.closeDropdown()
  }

  render() {
    const idOnChange = (event) => {
      this.props.fieldProps.id.onChange(event.target.value)
      this.props.fieldProps.alias.onChange('')
    }

    const aliasOnChange = value => {
      this.props.fieldProps.alias.onChange(value)
      this.props.fieldProps.id.onChange('')
    }

    const idProps = Object.assign({...this.props.fieldProps.id}, {onChange: idOnChange})
    const aliasProps = Object.assign({...this.props.fieldProps.alias}, {onChange: aliasOnChange})

    return(
      <div className='form-group'>
        {this.props.title && <FieldLabel>{this.props.title}</FieldLabel>}
        <div className='input-group'>
          <div className={`input-group-btn ${this.state.showDropdown && 'open'}`}>
            <DropdownButton
              className={styles.dropdownButton}
              id='input-dropdown-addon'
              title={this.state.selected}
              onSelect={this.select}
            >
              <MenuItem eventKey={ALIAS_SELECTED}>Alias</MenuItem>
              <MenuItem eventKey={ID_SELECTED}>ID</MenuItem>
            </DropdownButton>
          </div>

          {this.state.selected == ID_SELECTED &&
            <input className='form-control'
              type={this.state.type}
              placeholder={`${this.props.title} ID`}
              {...idProps} />}

          {this.state.selected == ALIAS_SELECTED &&
            <this.props.aliasField
              className={styles.aliasFieldGroupItem}
              placeholder={`Start typing ${this.props.title.toLowerCase()} alias...`}
              fieldProps={aliasProps} />}

        </div>
        {this.props.hint && <span className='help-block'>{this.props.hint}</span>}
      </div>
    )
  }
}

export default ObjectSelectorField
