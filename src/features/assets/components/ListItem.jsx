import React from 'react'
import { Link } from 'react-router'

class ListItem extends React.Component {
  render() {
    const item = this.props.item
    const lang = this.props.lang

    return(
      <tr>
        <td>{item.alias || '-'}</td>
        <td><code>{item.id}</code></td>
        <td>
          <Link to={`/assets/${item.id}`}>
            {lang === 'zh' ? '查看详情' : 'View details'} →
          </Link>
        </td>
      </tr>
    )
  }
}

export default ListItem
