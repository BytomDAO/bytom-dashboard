import React from 'react'

class NotFound extends React.Component {
  render() {
    const lang = this.props.lang
    return (
      <div className='jumbotron text-center'>
        <h3>404 {lang === 'zh'? '页面找不到' : 'Not Found'}</h3>
        <p>{lang === 'zh'? '我们找不到你所寻找的页面。':"We couldn't find the page you were looking for."}</p>
      </div>
    )
  }
}

export default NotFound
