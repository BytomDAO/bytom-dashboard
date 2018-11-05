import React from 'react'

class Skip extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <h2>Continue with Mnemonic</h2>
        <p>Mnemonic can be used to restore the relevant key information. You can either skip the Mnemonic step or keep it.</p>
      </div>
    )
  }
}

export default Skip
