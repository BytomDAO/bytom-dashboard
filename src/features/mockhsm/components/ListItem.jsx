import React from 'react'
import { Link } from 'react-router'

class ListItem extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const item = this.props.item
    const lang = this.props.lang

    return(
      <tr>
        <td>{item.alias}</td>
        <td><code>{item.xpub}</code></td>
        <td><Link to={`/keys/${item.id}`}>
          {lang === 'zh' ? '更多' : 'More'}
        </Link></td>
      </tr>
    )
  }
}

export default ListItem
