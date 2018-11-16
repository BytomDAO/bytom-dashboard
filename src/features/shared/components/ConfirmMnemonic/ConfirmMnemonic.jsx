import React from 'react'
import { ErrorBanner, SingletonField} from 'features/shared/components'
import {reduxForm} from 'redux-form'
import style from './ConfirmMnemonic.scss'
import {withNamespaces} from 'react-i18next'

class ConfirmMnemonic extends React.Component {
  constructor(props) {
    super(props)
    this.state = this.getInitialState()

    this.submitWithValidation = this.submitWithValidation.bind(this)
  }

  getInitialState() {
    let seedWords = []
    let randomThreshold = 0.3
    let splitMnemonic = this.props.mnemonic.split(' ')
    for (let i = 0; i < splitMnemonic.length; i++) {
      let hideWord = Math.random()
      seedWords.push({
        word: hideWord > randomThreshold ? splitMnemonic[i] : '',
        show: hideWord > randomThreshold,
        index: i,
      })
      if(hideWord<= randomThreshold){
        this.props.fields.words.addField({
          seedIndex: i
        })
      }
    }
    return {
      seedWords: seedWords,
      splitMnemoic: splitMnemonic,
    }
  }

  submitWithValidation(data) {
    for(let word of data.words){
      if(word.value.trim() !== this.state.splitMnemoic[word.seedIndex]){
        return new Promise((_, reject) => reject({
          _error: 'please match the word'
        }))
      }
    }

    return new Promise((resolve, reject) => {
      this.props.succeeded()
        .catch((err) => reject({type: err}))
    })
  }

  render() {
    const {
      fields: {words},
      error,
      handleSubmit,
      submitting,
      t
    } = this.props

    const { seedWords } = this.state
    let counter = 0

    return (
      <form className={style.container} onSubmit={handleSubmit(this.submitWithValidation)}>
        <h4>{t('mnemonic.confirmTitle')}</h4>
        <p>{t('mnemonic.confirmMessage')}</p>
        <div className={style.seedArea}>
          {seedWords.map((seedWord) => {
            return ( seedWord.show ?
              <div key={seedWord.index} className={`${style.seed} ${style.seedWord}`}>{seedWord.word}</div> :
              (words[counter]? <SingletonField
                className={style.seedWord}
                key={seedWord.index}
                fieldProps={ words[counter++].value }
              /> : null)
            )
          })}
        </div>

        {error&& <ErrorBanner error={error} />}

        <button
          className={`btn btn-primary ${style.submit}`}
          type='submit'
          disabled={submitting}>
          {t('mnemonic.confirm')}
        </button>

      </form>
    )
  }
}

const validate = (values, props) => {
  const errors = {words: {}}
  const splitMnemonic = props.mnemonic.split(' ')

  // Actions
  let numError
  values.words.forEach((word, index) => {
    const seedIndex = values.words[index].seedIndex
    numError = values.words[index].value !== splitMnemonic[seedIndex]
    if (numError) {
      errors.words[index] = {...errors.words[index], value:' '}
    }
  })
  return errors
}

export default  withNamespaces('translations') (reduxForm({
  form: 'MnemonicInit',
  fields: [
    'words[].value',
    'words[].seedIndex'
  ],
  validate
})(ConfirmMnemonic))
