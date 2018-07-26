import React from 'react'
import { connect } from 'react-redux'
import { NotFound, PageContent, PageTitle } from 'features/shared/components'
import styles from './GeneratedTxHex.scss'
import { copyToClipboard } from 'utility/clipboard'

class Generated extends React.Component {
  render() {
    const lang = this.props.lang
    if (!this.props.hex) return <NotFound lang={lang} />

    return (
      <div>
        <PageTitle title={ lang==='zh'? '生成的交易' :'Generated Transaction'} />

        <PageContent>
          <div className={styles.main}>
            <p>
              {
                lang==='zh'?
                  '需要让另一个账户签名，请使用一下JSON格式的字符串作为交易：'
                : 'Use the following JSON string as the transaction to sign by another account:'
              }
              </p>

            <button
              className='btn btn-primary'
              onClick={() => copyToClipboard(this.props.hex)}
            >
              {
                lang === 'zh'?
                  '拷贝交易JSON':
                  'Copy to clipboard'
              }
            </button>

            <pre className={styles.hex}>{this.props.hex}</pre>
          </div>
        </PageContent>
      </div>
    )
  }
}

export default connect(
  // mapStateToProps
  (state, ownProps) => {
    const generated = (state.transaction || {}).generated || []
    const found = generated.find(i => i.id == ownProps.params.id)
    if (found) return {
      hex: found.hex,
      lang: state.core.lang
    }
    return { lang: state.core.lang }
  }
)(Generated)
