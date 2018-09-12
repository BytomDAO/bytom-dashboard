import React from 'react'
import moment from 'moment'
import { humanizeDuration } from 'utility/time'

class RelativeTime extends React.Component {
  render() {
    const momentTime = moment.unix(this.props.timestamp)

    let timestamp = momentTime.fromNow()
    const diff = momentTime.diff(moment())

    if (diff > 0) {
      timestamp = humanizeDuration(diff/1000) + ' ahead of local time'
    }
    else if( moment.duration(diff).asHours()<-24){
      timestamp = momentTime.format('ll')
    }

    return(
      <span title={this.props.timestamp}>{timestamp}</span>
    )
  }
}

export default RelativeTime
