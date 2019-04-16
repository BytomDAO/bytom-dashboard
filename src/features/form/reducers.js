import { reducer as form } from 'redux-form'

export default form.normalize({
  newAssetForm: {                                    // <--- name of the form
    symbol: value => value && value.toUpperCase(),   // normalizer for 'upper' field
  }
})