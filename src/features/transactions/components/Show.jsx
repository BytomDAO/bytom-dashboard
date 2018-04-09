import React from 'react'
import {
  BaseShow,
  PageTitle,
  PageContent,
  KeyValueTable,
  Section,
  RawJsonButton,
} from 'features/shared/components'

import { Summary } from './'
import { buildTxInputDisplay, buildTxOutputDisplay } from 'utility/buildInOutDisplay'
import moment from 'moment/moment'

class Show extends BaseShow {

  render() {
    const item = this.props.item
    const lang = this.props.lang
    const btmAmountUnit = this.props.btmAmountUnit

    let view
    if (item) {
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
              {label: 'Timestamp', value: moment.unix(item.timestamp).format()},
              {label: 'Block ID', value: item.blockId},
              {label: 'Block Height', value: item.blockHeight},
              {label: 'Position', value: item.position},
            ]}
          />

          {item.inputs.map((input, index) =>
            <KeyValueTable
              key={index}
              title={index == 0 ? lang === 'zh' ? '输入' : 'Inputs' : ''}
              items={buildTxInputDisplay(input, btmAmountUnit)}
            />
          )}

          {item.outputs.map((output, index) =>
            <KeyValueTable
              key={index}
              title={index == 0 ? lang === 'zh' ? '输出' : 'Outputs' : ''}
              items={buildTxOutputDisplay(output, btmAmountUnit)}
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
  btmAmountUnit: state.core.btmAmountUnit
})

const mapDispatchToProps = ( dispatch ) => ({
  fetchItem: (id) => dispatch(actions.fetchItems({id: `${id}`}))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Show)
