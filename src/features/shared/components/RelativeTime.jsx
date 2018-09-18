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
      timestamp = momentTime.format('YYYY-MM-DD HH:mm:ss')
    }

    return(
      <span>{timestamp}</span>
    )
  }
}

export default RelativeTime
