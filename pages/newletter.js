import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as NewLetterAction from '../states/newLetterStore/newLetterAction'
import * as Auth from '../states/authStore/authAction'

import Check from '../components/newletter/check'
import Content from '../components/newletter/content'
import Template from '../components/newletter/template'
import Complete from '../components/newletter/complete'
import './newletter.css'

// interface IProps {
//   announcementMessage: string
//   updateAnnouncement: any
// }

// interface IState {}
// The keys of the PAGES object can be used in the prop types to catch dev-time errors.

class WriteLetter extends React.Component {
  constructor(props) {
    super(props)
    this.state = { componentState: 0 }
    this.getComponent = this.getComponent.bind(this)
  }

  getComponent() {
    switch (this.state.componentState) {
      case 0:
        return <Content/>
      case 1:
        return <Template/>
      case 2:
        return <Check/>
      case 3:
        return <Complete/>
    }
  }

  render() {
    return (
      <div className="newletter">
        {this.getComponent()}

        <div className="state">

        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = (dispatch) => ({
    Auth: bindActionCreators(Auth, dispatch),
    NewLetterAction: bindActionCreators(NewLetterAction, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(WriteLetter)