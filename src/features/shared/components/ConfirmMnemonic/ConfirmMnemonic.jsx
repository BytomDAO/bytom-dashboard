import React from 'react'
import { ErrorBanner, SingletonField} from 'features/shared/components'
import {reduxForm} from 'redux-form'

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
      submitting
    } = this.props

    const { seedWords } = this.state
    let counter = 0

    return (
      <form  onSubmit={handleSubmit(this.submitWithValidation)}>
        <h2>Enter your wallet recover phrase</h2>
        <p>Confirm that you backup your Recovery phrase by filling in the missing words:</p>
        {seedWords.map((seedWord) => {
          return ( seedWord.show ?
            <div key={seedWord.index} className='seedWord'>{seedWord.word}</div> :
            (words[counter]? <SingletonField
              key={seedWord.index}
              fieldProps={ words[counter++].value }
            /> : null)
          )
        })}

        {error&& <ErrorBanner error={error} />}

        <button type='submit' disabled={submitting}>submit</button>

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

export default (reduxForm({
  form: 'MnemonicInit',
  fields: [
    'words[].value',
    'words[].seedIndex'
  ],
  validate
})(ConfirmMnemonic))
