import React from 'react'
import PropTypes from 'prop-types'
// import { isAccessToken, getPolicyNames } from 'features/accessControl/selectors'
// import EditPolicies from './EditPolicies'
// import { isArray } from 'lodash'
import styles from './GrantListItem.scss'

class GrantListItem extends React.Component {
  render() {
    const item = this.props.item
    const lang = this.props.lang

    // let desc
    // if (isAccessToken(item)) {
    //   desc = item.guardData.id
    // } else { // x509
    //   const subject = item.guardData.subject
    //   desc = <div>
    //     {Object.keys(subject).map(field =>
    //       <div key={`${item.id}-${field}`}>
    //         {field.toUpperCase()}:
    //         {' '}
    //         {isArray(subject[field])
    //           ? subject[field].join(', ')
    //           : subject[field]}
    //       </div>
    //     )}
    //   </div>
    // }
    return(
      <tr>
        <td>{item.id}</td>
        {/*{!item.isEditing && <td>*/}
          {/*{getPolicyNames(item).map(name =>*/}
            {/*<span key={`${item.id}-${name}`}>{name}<br /></span>*/}
          {/*)}*/}
        {/*</td>}*/}
        <td className={`${styles.tdWrap}`}>{item.token}</td>
        {!item.isEditing && <td>
          {/*<button className='btn btn-link' onClick={this.props.beginEditing.bind(this, item.id)}>*/}
            {/*Edit*/}
          {/*</button>*/}

          <button className='btn btn-link' onClick={this.props.delete.bind(this, item)}>
            { lang==='zh'? '删除' : 'Delete' }
          </button>
        </td>}
        {/*{item.isEditing && <td colSpan='2'>*/}
          {/*<EditPolicies item={item}/>*/}
        {/*</td>}*/}
      </tr>
    )
  }
}

GrantListItem.propTypes = {
  item: PropTypes.object,
  delete: PropTypes.func,
}

export default GrantListItem
