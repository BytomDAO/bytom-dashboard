import React from 'react'
import { BaseNew } from 'features/shared/components'
import NewKeyAndSign from './NewKeyAndSign'
import NewAssetInfo from './NewAssetInfo'
import {withNamespaces} from 'react-i18next'
import { destroy } from 'redux-form';

class Form extends React.Component {
  constructor(props) {
    super(props)
    this.submitWithValidations = this.submitWithValidations.bind(this)
    this.nextPage = this.nextPage.bind(this)
    this.previousPage = this.previousPage.bind(this)
    this.state = {
      page: 1
    }
  }

  componentWillUnmount(){
    this.props.destroyForm()
  }

  submitWithValidations(data) {
    const resultData = {
      alias: data.alias,
      quorum: data.quorum,
      xpubs: data.xpubs,
      limit_height: data.reissue === 'true'? 0 : this.props.blockHeight+3,
      definition:{
        name: data.alias.trim(),
        symbol: data.symbol.trim(),
        decimals: Number(data.decimals),
        quorum: Number(data.quorum),
        reissue: data.reissue,
        description: data.description
      }
    }

    return new Promise((resolve, reject) => {
      this.props.submitForm(resultData)
        .then(()=>{
          this.props.destroyForm()
        })
        .catch((err) => reject({_error: err}))
    })
  }

  nextPage() {
    this.setState({ page: this.state.page + 1 })
  }

  previousPage() {
    this.setState({ page: this.state.page - 1 })
  }

  render() {
    const { page } = this.state
    return (
      <div>
        {page === 1 && <NewAssetInfo onSubmit={this.nextPage}/>}
        {page === 2 && <NewKeyAndSign previousPage={this.previousPage} onSubmit={this.submitWithValidations}/>}
      </div>
    )
  }
}

const mapDispatchToProps = ( dispatch ) => ({
  ...BaseNew.mapDispatchToProps('asset')(dispatch),
  destroyForm: () => dispatch(destroy('newAssetForm')),
})

const mapStateToProps = ( state ) => ({
  ...BaseNew.mapStateToProps('asset'),
  blockHeight: state.core.blockHeight
})

export default withNamespaces('translations') ( BaseNew.connect(
  mapStateToProps,
  mapDispatchToProps,
  Form
))


