import React from 'react'
import GrantListItem from './GrantListItem'
import { connect } from 'react-redux'
import { TableList, PageTitle, PageContent } from 'features/shared/components'
import { push, replace } from 'react-router-redux'
import actions from 'features/accessControl/actions'
import styles from './AccessControlList.scss'
import {withNamespaces} from 'react-i18next'

class AccessControlList extends React.Component {
  render() {
    const itemProps = {
      beginEditing: this.props.beginEditing,
      delete: this.props.delete,
    }
    const t = this.props.t
    const tokenList = <TableList titles={ t('token.formTitle',  { returnObjects: true } )}>
      {(this.props.tokens).map(item => <GrantListItem key={item.id} item={item} {...itemProps} />)}
    </TableList>

    // const certList = <TableList titles={['Certificate', 'Policies']}>
    //   {this.props.certs.map(item => <GrantListItem key={item.id} item={item} {...itemProps} />)}
    // </TableList>

    return (<div>
      <PageTitle title={ t('token.accessToken') } />

      <PageContent>
        <div className={`btn-group ${styles.btnGroup}`} role='group'>
          <button
            className={`btn btn-default ${styles.btn} ${this.props.tokensButtonStyle}`}
            onClick={this.props.showTokens}>
              Tokens
          </button>

          {/*<button*/}
            {/*className={`btn btn-default ${styles.btn} ${this.props.certificatesButtonStyle}`}*/}
            {/*onClick={this.props.showCertificates}>*/}
              {/*Certificates*/}
          {/*</button>*/}
        </div>

        {this.props.tokensSelected && <div>
          <button
            className={`btn btn-primary ${styles.newBtn}`}
            onClick={this.props.showTokenCreate}>
            + {t('token.new')}
          </button>

          {tokenList}
        </div>}

        {/*{this.props.certificatesSelected && <div>*/}
          {/*<button*/}
            {/*className={`btn btn-primary ${styles.newBtn}`}*/}
            {/*onClick={this.props.showAddCertificate}>*/}
              {/*+ Register certificate*/}
          {/*</button>*/}

          {/*{certList}*/}
        {/*</div>}*/}
      </PageContent>
    </div>)
  }
}

const mapStateToProps = (state, ownProps) => {
  const items = state.accessControl.tokens
  const tokensSelected = ownProps.location.query.type == 'token'
  const certificatesSelected = ownProps.location.query.type != 'token'

  return {
    tokens: items || [],
    certs: items,
    tokensSelected,
    certificatesSelected,
    tokensButtonStyle: tokensSelected && styles.active,
    certificatesButtonStyle: certificatesSelected && styles.active,
  }
}

const mapDispatchToProps = (dispatch) => ({
  delete: (grant) => dispatch(actions.deleteToken(grant)),
  showTokens: () => dispatch(replace('/access-control?type=token')),
  showCertificates: () => dispatch(replace('/access-control?type=certificate')),
  showTokenCreate: () => dispatch(push('/access-control/create-token')),
  showAddCertificate: () => dispatch(push('/access-control/add-certificate')),
  beginEditing: (id) => dispatch(actions.beginEditing(id)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNamespaces('translations') (AccessControlList))
