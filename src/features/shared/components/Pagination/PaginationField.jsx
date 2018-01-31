import React from 'react'
import styles from './Pagination.scss'
import { Pagination } from 'react-bootstrap'

class PaginationField extends React.Component {
  render() {
    const handlePageChange = (PageNumber) => this.props.pushList([],PageNumber)
    const noOfPaginationBtn = 5
    const centerClassName = 'text-center'
    return (
     <div className={centerClassName}>
        <Pagination
          bsClass={styles['pagination-S']}
          prev=  "&larr;"
          next=  "&rarr;"
          boundaryLinks
          activePage = {this.props.currentPage}
          items = {this.props.totalNumberPage}
          maxButtons = {noOfPaginationBtn}
          onSelect = {handlePageChange}
        />
      </div>
    )
  }
}

PaginationField.propTypes = {
  currentPage: React.PropTypes.number,
  totalNumberPage: React.PropTypes.number,
  pushList: React.PropTypes.func,
}

export default PaginationField
