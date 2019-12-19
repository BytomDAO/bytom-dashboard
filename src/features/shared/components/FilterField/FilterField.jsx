import React from 'react';
import styles from './FilterField.scss'
import { DropdownButton, MenuItem } from 'react-bootstrap'
import {connect} from 'react-redux'
import actions from 'actions'

class FilterField extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showDropdown: false,
      selected: props.selected || '全部'
    }

    this.select = this.select.bind(this)
    this.toggleDropwdown = this.toggleDropwdown.bind(this)
    this.closeDropdown = this.closeDropdown.bind(this)
  }

  componentDidMount() {
    if (!this.props.autocompleteIsLoaded) {
      this.props.fetchAll().then(() => {
        this.props.didLoadAutocomplete()
      })
    }
  }

  toggleDropwdown() {
    this.setState({ showDropdown: !this.state.showDropdown })
  }

  closeDropdown() {
    this.setState({ showDropdown: false })
  }

  select(id) {

    const alias = id == 'all'? '全部' : (this.props.items.filter((item) => item.id === id))[0].alias
    this.setState({ selected: alias })
    this.props.pushList({asset_id: id})
    this.closeDropdown()
  }

  render() {
    return (
      <div className={styles.container}>
        <div>存证类型：</div>
        <DropdownButton
          title={this.state.selected}
          onSelect={this.select}
        >
          <MenuItem eventKey={'all'}>全部</MenuItem>
          {this.props.items.map((option) =>
            <MenuItem eventKey={option.id}>{option.alias}</MenuItem>
          )}
        </DropdownButton>
      </div>
    )
  }
}

export const mapStateToProps = (type) => (state) => ({
  autocompleteIsLoaded: state[type].autocompleteIsLoaded,
  items: Object.keys(state[type].items).map(k => state[type].items[k])
})

export const mapDispatchToProps = (type) => (dispatch) => ({
  didLoadAutocomplete: () => dispatch(actions[type].didLoadAutocomplete),
  fetchAll: () => dispatch(actions[type].fetchAll())
})

export default connect(
  mapStateToProps('asset'),
  mapDispatchToProps('asset')
)(FilterField)
