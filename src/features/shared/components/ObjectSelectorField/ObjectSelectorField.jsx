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

    const lang = this.props.lang
    const alias_title = ( lang === 'zh' ? '别名' : ALIAS_SELECTED )

    const idProps = Object.assign({...this.props.fieldProps.id}, {onChange: idOnChange})
    const aliasProps = Object.assign({...this.props.fieldProps.alias}, {onChange: aliasOnChange})



    return(
      <div className='form-group'>
        {this.props.title && <FieldLabel>{this.props.title}</FieldLabel>}
        <div className='input-group'>
          <div className={`input-group-btn ${this.state.showDropdown && 'open'}`}>
            <DropdownButton
              className={styles.dropdownButton}
              id={ this.props.keyIndex? `input-dropdown-addon-${this.props.keyIndex}` : 'input-dropdown-addon' }
              title={(this.state.selected === ALIAS_SELECTED)? alias_title: this.state.selected}
              onSelect={this.select}
            >
              <MenuItem eventKey={ALIAS_SELECTED}>{ lang === 'zh' ? '别名' : 'Alias'}</MenuItem>
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
              placeholder={ lang === 'zh' ? `输入${this.props.title.toLowerCase()}别名...` : `Start typing ${this.props.title.toLowerCase()} alias...`}
              fieldProps={aliasProps} />}

        </div>
        {this.props.hint && <span className='help-block'>{this.props.hint}</span>}
      </div>
    )
  }
}

export default ObjectSelectorField
