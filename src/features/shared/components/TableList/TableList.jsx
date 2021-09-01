import React from 'react'
import styles from './TableList.scss'

class TableList extends React.Component {
  render() {
    if (!this.props.showHead) {
      return <div className={`${styles.list} ${this.props.styles || ''}`}>{this.props.children}</div>
    }
    return (
      <table className={`${styles.main} ${this.props.styles || ''}`}>
        <thead>
          <tr>
            {this.props.titles.map((title) => (
              <th key={title}>{title}</th>
            ))}
            <th></th>
          </tr>
        </thead>
        <tbody>{this.props.children}</tbody>
      </table>
    )
  }
}

export default TableList
