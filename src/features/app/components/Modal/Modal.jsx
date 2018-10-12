import React from 'react'
import { connect } from 'react-redux'
import styles from './Modal.scss'
import actions from 'actions'
import {withNamespaces} from 'react-i18next'

class Modal extends React.Component {
  render() {
    let {
      dispatch,
      isShowing,
      body,
      acceptAction,
      cancelAction,
      t
    } = this.props

    if (!isShowing) return null

    const accept = () => {
      dispatch(acceptAction)
      dispatch(actions.app.hideModal)
    }
    const cancel = cancelAction ? () => dispatch(cancelAction) : null
    const backdropAction = this.props.options.dialog? null : (cancel || accept)
    const boxStyle = this.props.options.box
    const noCloseBtn = this.props.options.noCloseBtn

    return(
      <div className={styles.main}>
        <div className={styles.backdrop} onClick={backdropAction}></div>
        <div className={`${this.props.options.wide && styles.wide ||''} ${boxStyle? styles.box: styles.content}`}>
          {
            boxStyle &&
              <div className={styles.title}>
                <p>{ t('console.title')}</p>
                <button className={`btn ${styles.close}`} onClick={accept}>X</button>
              </div>
          }
          {body}
          {!noCloseBtn && <button className={`btn btn-${this.props.options.danger ? 'danger' : 'primary'} ${styles.accept}`} onClick={accept}>
            { t('form.ok') }</button>}
          {!noCloseBtn && cancel && <button className={`btn btn-link ${styles.cancel}`} onClick={cancel}>Cancel</button>}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  isShowing: state.app.modal.isShowing,
  body: state.app.modal.body,
  acceptAction: state.app.modal.accept,
  cancelAction: state.app.modal.cancel,
  options: state.app.modal.options,
})

// NOTE: ommitting a function for `mapDispatchToProps` passes `dispatch` as a
// prop to the component
export default connect(mapStateToProps)(withNamespaces('translations')(Modal))
