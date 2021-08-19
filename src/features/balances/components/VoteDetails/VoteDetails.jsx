import React from 'react'
import { connect } from 'react-redux'
import { PageContent, PageTitle, Section, BaseShow} from 'features/shared/components'
import styles from './VoteDetails.scss'
import {withNamespaces} from 'react-i18next'
import actions from 'actions'
import { normalizeGlobalBTMAmount } from 'utility/buildInOutDisplay'
import { btmID } from 'utility/environment'
import { KeyValueTable } from 'features/shared/components'

class VoteDetails extends BaseShow {
  constructor(props) {
    super(props)
  }

  render() {
    const t = this.props.t
    const account = this.props.account
    const btmAmountUnit = this.props.btmAmountUnit

    let view


    if(account){
      const voteDetails = account.voteDetails
      const title = <span>
          {t('balances.voteDetails')}
        <code>{account.accountAlias ? account.accountAlias : account.accountId}</code>
        </span>

      let tokenList
      if(voteDetails){
        // const items = [
        //   { label: t('form.vote'), value:  }
        // ]

        tokenList = voteDetails.map(item => {
          const items = [
            { label: t('form.vote'), value: item.vote },
            { label: t('form.amount'), value: normalizeGlobalBTMAmount(btmID, item.voteNumber, btmAmountUnit) },
          ]
          return <KeyValueTable items={items} />
        })

        // tokenList = <KeyValueTable items={buildBalanceDisplay(balanceItem, this.props.btmAmountUnit, this.props.t)} />
        // tokenList =
        //   <table className={ styles.main }>
        //     <thead>
        //     <tr>
        //       <th>{t('form.vote')}</th><th>{t('form.amount')}</th>
        //     </tr>
        //     </thead>
        //     <tbody>
        //     {(voteDetails).map(item =>
        //       <tr>
        //         <td>{item.vote}</td>
        //         <td>{normalizeGlobalBTMAmount(btmID, item.voteNumber, btmAmountUnit)}</td>
        //       </tr>
        //     )}
        //     </tbody>
        //   </table>

      }


      view =  (
        <div>
          <PageTitle title={title} />

          <PageContent>
            <Section>
              {tokenList}
            </Section>


          </PageContent>
        </div>
      )
    }

    return this.renderIfFound(view)
  }
}


const mapDispatchToProps = (dispatch) => ({
  fetchItem: (id) => dispatch(actions.balance.getVoteDetail()),
})

export default connect(
  (state, ownProps) => {
    const generated = (state.balance || {}).voteDetail || []
    const account = generated.find(i => i.accountId == ownProps.params.id)
    if (account) return {
      account,
      btmAmountUnit: state.core.btmAmountUnit
    }
    return {}
  },
  mapDispatchToProps
)(withNamespaces('translations') ( VoteDetails) )
