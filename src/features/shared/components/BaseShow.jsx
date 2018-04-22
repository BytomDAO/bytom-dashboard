import React from 'react'
import NotFound from './NotFound'

export default class BaseShow extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  componentDidMount() {
    this.props.fetchItem(this.props.params.id).then(resp => {
      if (resp.status == 'fail') {
        this.setState({notFound: true})
      }
    })
  }

  renderIfFound(view) {
    if (this.state.notFound) {
      return(<NotFound lang={this.props.lang}/>)
    } else if (view) {
      return(view)
    } else {
      return(<div>Loading...</div>)
    }
  }
}
