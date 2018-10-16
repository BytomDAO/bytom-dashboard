import React from 'react'
import {withNamespaces} from 'react-i18next'

class NotFound extends React.Component {
  render() {
    const t = this.props.t
    return (
      <div className='jumbotron text-center'>
        <h3>404 {t('notFound.title')}</h3>
        <p>{t('notFound.word')}</p>
      </div>
    )
  }
}

export default withNamespaces('translations')  (NotFound)
