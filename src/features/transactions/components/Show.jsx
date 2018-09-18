import React from 'react'
import {
  BaseShow,
  PageTitle,
  PageContent,
  KeyValueTable,
  Section,
  RawJsonButton,
} from 'features/shared/components'
import { normalizeGlobalBTMAmount } from 'utility/buildInOutDisplay'

import { Summary } from './'
import { buildTxInputDisplay, buildTxOutputDisplay } from 'utility/buildInOutDisplay'
import { btmID } from 'utility/environment'
import moment from 'moment/moment'

class Show extends BaseShow {

  render() {
    const item = this.props.item
    const lang = this.props.lang
    const btmAmountUnit = this.props.btmAmountUnit

    let view
    if (item) {
      const confirmation = this.props.highestBlock - item.blockHeight + 1
      const btmInput = item.inputs.reduce((sum, input) => {
        if (input.type === 'spend' && input.assetId === btmID) {
          sum += input.amount
        }
        return sum
      }, 0)

      item.confirmations = confirmation

      const btmOutput = item.outputs.reduce((sum, output) => {
        if (output.type === 'control' && output.assetId === btmID) {
          sum += output.amount
        }
        return sum
      }, 0)

      const gasAmount = btmInput > 0 ? btmInput - btmOutput : 0

      const gas = normalizeGlobalBTMAmount(btmID, gasAmount, btmAmountUnit)

      const unconfirmedItem = (item.blockHeight === 0 && item.blockId === '0000000000000000000000000000000000000000000000000000000000000000')

      const status = (!item.statusFail)? (lang === 'zh' ? '成功' : 'Succeed'): (lang === 'zh' ? '失败' : 'Failed')

      const getInout = (inout) =>{
        let resultoutput = {}

        resultoutput.id = inout.id

        if(inout.address){
          resultoutput.address = inout.address
        }else if(inout.controlProgram){
          resultoutput.controlProgram = inout.controlProgram
        }

        resultoutput.amount = inout.amount

        if(inout.accountAlias ||inout.accountId){
          resultoutput.account = inout.accountAlias ||inout.accountId
        }

        resultoutput.accountId = inout.accountId
        resultoutput.asset = inout.assetAlias || inout.assetId
        resultoutput.assetId =  inout.assetId
        resultoutput.assetDefinition =  inout.assetDefinition
        resultoutput.type = inout.type

        return resultoutput
      }

      let outputs = []
      item.outputs.forEach((output,index) =>{
        let resultoutput = getInout(output)
        outputs[index] = resultoutput
      })

      let inputs = []
      item.inputs.forEach((input,index) =>{
        let resultinput = getInout(input)
        inputs[index] = resultinput
      })


      const title = <span>
        {lang === 'zh' ? '交易' : 'Transaction '}
        &nbsp;<code>{item.id}</code>
      </span>

      view = <div>
        <PageTitle title={title} />

        <PageContent>
          <Section
            title={lang === 'zh' ? '概括' : 'Summary'}
            actions={[
              <RawJsonButton key='raw-json' item={item} />
            ]}>
            <Summary transaction={item} lang={lang} btmAmountUnit={btmAmountUnit}/>
          </Section>

          <KeyValueTable
            title={lang === 'zh' ? '详情' : 'Details'}
            items={[
              {label: 'ID', value: item.id},
              {label: (lang === 'zh' ? '时间戳' : 'Timestamp'), value:  unconfirmedItem ? '-' : moment.unix(item.timestamp).format()},
              {label: (lang === 'zh' ? '区块ID' : 'Block ID'), value: unconfirmedItem? '-' : item.blockId},
              {label: (lang === 'zh' ? '区块高度': 'Block Height'), value: unconfirmedItem?
                  (lang === 'zh' ? '未知 ':'Unknown')+'(0 confirmation)':
                  (item.blockHeight + `(${confirmation} confirmation${confirmation > 1 ? 's' : ''})`)},
              {label: (lang === 'zh' ? '位置' : 'Position'), value: unconfirmedItem? '-' :item.position},
              {label: 'Gas', value: gas},
              {label: (lang === 'zh' ? '交易状态': 'Transaction status'), value: status}
            ]}
          />

          {inputs.map((input, index) =>
            <KeyValueTable
              key={index}
              title={index == 0 ? lang === 'zh' ? '输入' : 'Inputs' : ''}
              items={buildTxInputDisplay(input, btmAmountUnit, lang)}
            />
          )}

          {outputs.map((output, index) =>
            <KeyValueTable
              key={index}
              title={index == 0 ? lang === 'zh' ? '输出' : 'Outputs' : ''}
              items={buildTxOutputDisplay(output, btmAmountUnit, lang)}
            />
          )}
        </PageContent>
      </div>
    }

    return this.renderIfFound(view)
  }
}

// Container

import { actions } from 'features/transactions'
import { connect } from 'react-redux'

const mapStateToProps = (state, ownProps) => ({
  item: state.transaction.items[ownProps.params.id],
  lang: state.core.lang,
  btmAmountUnit: state.core.btmAmountUnit,
  highestBlock: state.core.coreData && state.core.coreData.highestBlock
})

const mapDispatchToProps = ( dispatch ) => ({
  fetchItem: (id) => dispatch(actions.fetchItems({id: `${id}`}))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Show)
