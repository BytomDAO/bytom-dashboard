import React from 'react'
import styles from './Pagination.scss'
import { Pagination } from 'react-bootstrap'

class PaginationField extends React.Component {
  render() {
    const isFirstPage = () => (this.props.currentPage === 1)
    const prevClass = `${styles.button} ${this.props.currentPage > 1 ? '' : styles.disabled}`
    const nextClass = `${styles.button} ${this.props.isLastPage ? styles.disabled : ''}`
    const nextPage = () => this.props.pushList([],this.props.currentPage + 1)
    const prevPage = () => this.props.pushList([],this.props.currentPage - 1)

    return (
     /*<ul className={styles.main}>
        <li>
          <a className={prevClass} onClick={prevPage}>
            &larr;
          </a>
        </li>
        <li className={styles.label}>Page {this.props.currentPage}</li>
        <li>
          <a className={nextClass} onClick={nextPage}>
            &rarr;
          </a>
        </li>
      </ul>*/
     <div>
        <Pagination
          first
          prev
          next
          last
          ellipsis
          activePage = {this.props.currentPage}
          items = {this.props.totalNumberPage}
          maxButtons = {10}
        />

      </div>
    )
  }
}

PaginationField.propTypes = {
  currentPage: React.PropTypes.number,
  totalNumberPage: React.PropTypes.number,
  isLastPage: React.PropTypes.bool,
  pushList: React.PropTypes.func,
}

export default PaginationField
