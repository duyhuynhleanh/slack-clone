import React from 'react'
import { Segment, Header, Input, Icon } from 'semantic-ui-react'

class MessagesHeader extends React.Component {
  render() {
    return (
      <Segment clearing>
        {/* channel tittle */}
        <Header fluid='true' as='h2' floated='left' style={{ marginBottom: 0 }}>
          <span>
            Kênh
            <Icon name={'star outline'} color='black' />
          </span>
          <Header.Subheader>Người dùng</Header.Subheader>
        </Header>
        {/* channel search input */}
        <Header floated='right'>
          <Input
            size='mini'
            icon='search'
            name='searchTerm'
            placeholder='Tìm tin nhắn'
          />
        </Header>
      </Segment>
    )
  }
}

export default MessagesHeader
