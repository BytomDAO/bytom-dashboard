import React from 'react';
import { Autocomplete } from '../';
import styles from './FilterField.scss'

class FilterField extends React.Component {
  constructor() {
    super();

    this.state = {
      value: '',
    };
    this.onChange = this.onChange.bind(this)
  }

  onChange( newValue) {
    this.setState({
      value: newValue
    });
  };


  render() {
    const { value } = this.state;
    const inputProps = {
      value,
      onChange: this.onChange
    };
    return (
      <div className={styles.container}>
        <div>存证类型：</div>
        <Autocomplete.AssetAlias
          fieldProps={inputProps}
          shouldRenderSuggestions={()=>true}
          onSuggestionSelected={(e)=>{
            e.preventDefault()
            this.props.pushList({asset_alias: this.state.value})}}
        />
      </div>
    )
  }
}

export default FilterField
