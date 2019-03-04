import React from 'react'
import {withNamespaces} from 'react-i18next'
import { ProgressBar } from 'react-bootstrap'
import styles from './QrCode.scss'
import QRCode from 'qrcode'
import { splitSlice } from 'utility/math'

const opts = {
  width: 340,
}

class QrCode extends React.Component {
  constructor(props) {
    super(props)
    this.state={
      step: 0,
      url: ''
    }
    this.array = splitSlice(this.props.hex, 450)
    this.previous = this.previous.bind(this)
    this.next = this.next.bind(this)
    this.setQrImage = this.setQrImage.bind(this)
  }

  componentDidMount(){
    this.setQrImage(this.state.step)
  }

  setQrImage(step){
    QRCode.toDataURL(this.array[step], opts)
      .then(url => {
        this.setState({
          url:url
        })
      })
      .catch(err => {
        throw err
      })
  }

  previous(e){
    e.preventDefault()
    const step = this.state.step
    if( step > 0 ){
      this.setState({
        step: step - 1
      })
      this.setQrImage( step-1 )
    }
  }

  next(e){
    e.preventDefault()
    const step = this.state.step
    if( step < this.array.length ){
      this.setState({
        step: step + 1
      })
      this.setQrImage( step+1 )
    }
  }

  render() {
    const t = this.props.t
    const arrayLength  = this.array.length
    const step = this.state.step
    const now = ( (step === 0) ? 0 : (step * 100/(arrayLength-1)))

    if (!this.props.hex) return <div></div>
    return (
      <div>
        <p>{arrayLength ===1? t('transaction.advance.generated.qrModalLabel'):t('transaction.advance.generated.qrModalLabels', {size: arrayLength})}</p>
        {
          this.state.url &&
            <img className={styles.code} src={this.state.url}/>
        }
        {
          arrayLength>1 &&
            <ProgressBar className={styles.progressBar} now={now} />
        }
        {
          arrayLength>1  &&
            <button
            className='btn btn-primary'
            onClick={this.next}
            disabled={this.state.step === arrayLength-1}
          >
            {t('commonWords.next')}
          </button>
        }
        {
          this.state.step > 0 &&
          <button
            className='btn btn-link'
            onClick={this.previous}
          >
            {t('commonWords.previous')}
          </button>
        }
      </div>
    )
  }
}

export default (withNamespaces('translations') (QrCode))
