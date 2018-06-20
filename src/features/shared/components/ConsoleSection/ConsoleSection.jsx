import React from 'react'
import styles  from './ConsoleSection.scss'
import Console from 'react-console-component'
import command from './command.json'

class ConsoleSection extends React.Component {
  constructor(props) {
    super(props)
    this.echo = this.echo.bind(this)
  }

  echo (text) {
    if(text.trim() === 'help'){
      command['help'].forEach( (descriptionLine) => {
        this.terminal.log(descriptionLine)
      })
    }else if(text.trim() === 'clear'){
      this.terminal.setState({
        acceptInput: true,
        log: []
      })
    }else{
      this.props.cmd(text)
        .then(data=>
        {
          if(data.status === 'success'){
            let output = data.data
            if(output){
              const keys = Object.keys(output)
              if(keys.length === 1){
                this.terminal.log(output[keys[0]])
              }else{
                this.terminal.log(JSON.stringify(output, null, 2))
              }
            }
          }else if(data.status === 'fail'){
            this.terminal.logX('Error', data.msg.replace(/"/g,''))
          }else{
            this.terminal.log(JSON.stringify(data.data, null, 2))
          }
        }).catch(() =>
        {
          this.terminal.logX('Error','command not found')
        })
    }
    this.terminal.return()
  }

  render() {
    return(
      <div
        className={styles.reactConsoleContainer}
      >
        <p>
          Welcome to the Bytom Core API console.<br/>
          Type <code>help</code> for an overview of available commands.
        </p>
        <p className='text-danger'>
          <strong>WARNING:</strong> Scammers have been active, telling users to type commands here, stealing their wallet contents. Do not use this console without fully understanding the ramification of a command.
        </p>

        <Console
          ref={ref => this.terminal = ref}
          handler={this.echo}
          autofocus={true}
        />
      </div>
    )
  }
}

export default ConsoleSection