import React from 'react'
import {
  Grid,
  Header,
  Icon,
  Dropdown,
  Image,
  Modal,
  Input,
  Button,
} from 'semantic-ui-react'
import firebase from '../../firebase'
import AvatarEditor from 'react-avatar-editor'
// import { connect } from 'react-redux'

class UserPanel extends React.Component {
  state = {
    user: this.props.currentUser,
    modal: false,
    previewImage: '',
    croppedImage: '',
    blob: '',
    storageRef: firebase.storage().ref(),
    userRef: firebase.auth().currentUser,
    usersRef: firebase.database().ref('users'),
    metadata: {
      contentType: 'image/jpeg',
    },
    uploadedCropImage: '',
  }

  openModal = () => this.setState({ modal: true })

  closeModal = () => this.setState({ modal: false })

  dropdownOptions = () => [
    {
      key: 'user',
      text: (
        <span>
          Đăng nhập với tên <strong>{this.state.user.displayName}</strong>
        </span>
      ),
      disabled: true,
    },
    {
      key: 'avatar',
      text: <span onClick={this.openModal}>Đổi ảnh đại diện</span>,
    },
    {
      key: 'signout',
      text: <span onClick={this.handleSignout}>Đăng xuất</span>,
    },
  ]

  uploadCropImage = () => {
    const { storageRef, userRef, blob, metadata } = this.state
    storageRef
      .child(`avatar/user-${userRef.uid}`)
      .put(blob, metadata)
      .then((snap) => {
        snap.ref.getDownloadURL().then((downloadURL) => {
          this.setState({ uploadedCropImage: downloadURL }, () =>
            this.changeAvatar()
          )
        })
      })
  }

  changeAvatar = () => {
    this.state.userRef
      .updateProfile({
        photoURL: this.state.uploadedCropImage,
      })
      .then(() => {
        console.log('photo url updated')
        this.closeModal()
      })
      .catch((err) => {
        console.error(err)
      })
    this.state.usersRef
      .child(this.state.user.uid)
      .update({ avatar: this.state.uploadedCropImage })
      .then(() => {
        console.log('user avatar updated')
      })
      .catch((err) => {
        console.error(err)
      })
  }

  handleSignout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => console.log('signed out'))
  }

  handleChange = (event) => {
    const file = event.target.files[0]
    const reader = new FileReader()
    if (file) {
      reader.readAsDataURL(file)
      reader.addEventListener('load', () => {
        this.setState({ previewImage: reader.result })
      })
    }
  }

  handleCropImage = () => {
    if (this.avatarEditor) {
      this.avatarEditor.getImageScaledToCanvas().toBlob((blob) => {
        let imageUrl = URL.createObjectURL(blob)
        this.setState({
          croppedImage: imageUrl,
          blob,
        })
      })
    }
  }

  render() {
    const { user, modal, previewImage, croppedImage } = this.state
    const { primaryColor } = this.props

    return (
      <Grid style={{ background: primaryColor }}>
        <Grid.Column>
          <Grid.Row style={{ padding: '1.2em', margin: 0 }}>
            <Header inverted floated='left' as='h2'>
              <Icon name='code' />
              <Header.Content>DevChat</Header.Content>
            </Header>
            <Header style={{ padding: '0.25em' }} as='h4' inverted>
              <Dropdown
                trigger={
                  <span>
                    <Image src={user.photoURL} spaced='right' avatar />
                    {user.displayName}
                  </span>
                }
                options={this.dropdownOptions()}
              />
            </Header>
          </Grid.Row>

          <Modal basic open={modal} onClose={this.closeModal}>
            <Modal.Header>Đổi avatar</Modal.Header>
            <Modal.Content>
              <Input
                onChange={this.handleChange}
                fluid
                type='file'
                label='Avatar mới'
                name='previewImage'
              />
              <Grid centered stackable columns={2}>
                <Grid.Row centered>
                  <Grid.Column className='ui center aligned grid'></Grid.Column>
                  {previewImage && (
                    <AvatarEditor
                      ref={(node) => (this.avatarEditor = node)}
                      image={previewImage}
                      width={120}
                      height={120}
                      border={50}
                      scale={1.2}
                    />
                  )}
                  <Grid.Column className='ui center aligned grid'></Grid.Column>
                  {croppedImage && (
                    <Image
                      style={{ margin: '3.5em auto' }}
                      width={100}
                      height={100}
                      src={croppedImage}
                    />
                  )}
                </Grid.Row>
              </Grid>
            </Modal.Content>
            <Modal.Actions>
              {croppedImage && (
                <Button color='green' inverted onClick={this.uploadCropImage}>
                  <Icon name='save' />
                  Đổi Avatar
                </Button>
              )}

              <Button color='green' inverted onClick={this.handleCropImage}>
                <Icon name='image' />
                Xem trước
              </Button>

              <Button color='red' inverted onClick={this.closeModal}>
                <Icon name='remove' />
                Hủy
              </Button>
            </Modal.Actions>
          </Modal>
        </Grid.Column>
      </Grid>
    )
  }
}

// const mapStatetoProps = (state) => ({
//   currentUser: state.user.currentUser,
// })

export default UserPanel
