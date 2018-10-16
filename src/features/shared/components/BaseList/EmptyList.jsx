import React from 'react'
import styles from './EmptyList.scss'
import componentClassNames from 'utility/componentClassNames'
import { docsRoot } from 'utility/environment'
import {withNamespaces} from 'react-i18next'

class EmptyList extends React.Component {
  render() {
    const t =this.props.t
    let emptyImage

    try {
      emptyImage = require(`images/empty/${this.props.type}.svg`)
    } catch (err) { /* do nothing */ }

    let emptyBlock
    if (!this.props.loadedOnce) {
      emptyBlock = <span>{t('emptyList.loading')}…</span>
    } else if (this.props.showFirstTimeFlow) {
      emptyBlock = <div>
        <span className={`${styles.emptyLabel} ${styles.noResultsLabel}`}>
          {t('emptyList.noRecord', {objectName: this.props.objectName})}
        </span>
      </div>
    }

    const classNames = [
      'flex-container',
      styles.empty
    ]

    return (
      <div className={componentClassNames(this, ...classNames)}>
        {emptyImage && <img className={styles.image} src={emptyImage} />}
        {emptyBlock}
      </div>
    )
  }
}

EmptyList.propTypes = {
  type: React.PropTypes.string,
  objectName: React.PropTypes.string,
  newButton: React.PropTypes.object,
  loadedOnce: React.PropTypes.bool,
  showFirstTimeFlow: React.PropTypes.bool
}

export default withNamespaces('translations') (EmptyList)
