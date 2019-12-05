import React from 'react'
import NotFound from './NotFound'

export default class BaseShow extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    this.props.fetchItem(this.props.params.id).then(resp => {
      if (resp && ((resp.status == 'fail') || (resp.data && resp.data.length === 0))) {
        this.setState({notFound: true})
      }
    }).catch(error =>{
      if(error.status === 'fail'){
        this.setState({notFound: true})
      }
    })
  }

  renderIfFound(view) {
    if (this.state.notFound) {
      return(<NotFound/>)
    } else if (view) {
      return(view)
    } else {
      return(<div>Loading...</div>)
    }
  }
}
