import React from 'react'
import ReactDOM from 'react-dom'
import styles  from './ConsoleSection.scss'
import commandList from './command.json'
import ListItem from './ListItem/ListItem'
import disableAutocomplete from 'utility/disableAutocomplete'

class ConsoleSection extends React.Component {
  constructor(props) {
    super(props)
    this.state= {
      data:[],
      historyCount:0,
      commandHistory:[]
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.scrollToBottom = this.scrollToBottom.bind(this)
  }

  scrollToBottom () {
    const messagesContainer = ReactDOM.findDOMNode(this.messagesContainer)
    messagesContainer.scrollTop = messagesContainer.scrollHeight
  }
  componentDidMount() {
    this.scrollToBottom()
  }

  componentDidUpdate() {
    this.scrollToBottom()
  }

  handleSubmit(event) {
    event.preventDefault()
    let dataArray = this.state.data
    const command = event.target[0].value.trim()

    this.setState({
      commandHistory: this.state.commandHistory.concat(command),
      historyCount: this.state.commandHistory.length
    })

    event.target[0].value = ''

    if(command === 'help'){
      dataArray = dataArray.concat([{'command': command , 'success':true, 'commandOutput': commandList['help']}])
      this.setState({data: dataArray})
    }else if(command === 'clear'){
      this.setState({data: []})
    }else{
      this.props.cmd(command)
        .then(resp=>
        {
          if(resp.status === 'fail'){
            dataArray = dataArray.concat( [{'command': command , 'success':false, 'commandOutput': resp.msg}] )
          }else{
            dataArray = dataArray.concat( [{'command': command , 'success':true, 'commandOutput': resp.data}] )
          }
          this.setState({data: dataArray})
        }).catch(() =>
        {
          dataArray = dataArray.concat([{'command': command , 'success':false, 'commandOutput': 'command not found'}])
          this.setState({data: dataArray})
        })
    }
  }

  keyDownEvent(event) {
    if ([38, 40].includes(event.keyCode) && this.state.commandHistory.length > 0) {
      let historyCount = this.state.historyCount
      if (event.keyCode === 38) {
        if (historyCount > 0) {
          this.setState({ historyCount: historyCount-1})
        }
      } else {
        if (historyCount < this.state.commandHistory.length-1) {
          this.setState({ historyCount: historyCount+1})
        }
      }
      event.target.value = this.state.commandHistory[historyCount]
    }
  }

  render() {
    const lang = this.porps.lang
    let taskList = this.state.data.map(function(listItem) {
      return (
        <ListItem
          content={listItem}
        />
      )
    })
    return(
      <div>
        <div
          className={styles.reactConsoleContainer}
          ref={(el) => { this.messagesContainer = el }}
        >
          <p>
            Welcome to the Bytom Core API console.<br/>
            Type <code>help</code> for an overview of available commands.
          </p>
          <p className='text-danger'>
            <strong>WARNING:</strong> Scammers have been active, telling users to type commands here, stealing their wallet contents. Do not use this console without fully understanding the ramification of a command.
          </p>

          {taskList}

        </div>
        <div>
          <form className={styles.inputBox} onSubmit={this.handleSubmit} {...disableAutocomplete}>
            <span>
              <input
                className={styles.input}
                type='text'
                autoFocus='autofocus'
                onKeyDown={(event) => this.keyDownEvent(event)}
                placeholder='Enter "help" for an overview of available commands' />
            </span>
            <button type='submit' className={'btn btn-primary'} tabIndex='-1'>
              { lang === 'zh' ? '提交' : 'Submit' }
            </button>
          </form>
        </div>
      </div>


    )
  }
}

export default ConsoleSection