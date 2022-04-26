import React from "react";
import profilePicture from "../css/profilePicture.css";
import UploadIcon from "@mui/icons-material/Upload";

const ImgUpload = ({ onChange, src }) => (
  <label htmlFor='photo-upload' className='custom-file-upload fas'>
    <div className='img-wrap img-upload'>
      <img htmlFor='photo-upload' src={src} />
    </div>
    <input id='photo-upload' type='file' onChange={onChange} />
  </label>
);

const Profile = ({ onSubmit, src, name, status }) => (
  <form onSubmit={onSubmit}>
    <label className='custom-file-upload fas'>
      <div className='img-wrap'>
        <img htmlFor='photo-upload' src={src} />
      </div>
    </label>
    <div className='name'>{name}</div>
    <div className='status'>{status}</div>
    <button type='submit' className='edit'>
      Edit Profile{" "}
    </button>
  </form>
);

const Edit = ({ onSubmit, children }) => (
  <div className='card'>
    <form onSubmit={onSubmit}>
      {children}
      <button type='submit' className='save'>
        Save{" "}
      </button>
    </form>
  </div>
);

class CardProfile extends React.Component {
  state = {
    file: "",
    imagePreviewUrl: <UploadIcon />,
    name: "",
    status: "",
    active: "edit",
  };

  photoUpload = (e) => {
    e.preventDefault();
    const reader = new FileReader();
    const file = e.target.files[0];
    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result,
      });
    };
    reader.readAsDataURL(file);
  };

  handleSubmit = (e) => {
    e.preventDefault();
    let activeP = this.state.active === "edit" ? "profile" : "edit";
    this.setState({
      active: activeP,
    });
  };

  render() {
    const { imagePreviewUrl, name, status, active } = this.state;
    return (
      <div>
        {active === "edit" ? (
          <Edit onSubmit={this.handleSubmit}>
            <ImgUpload onChange={this.photoUpload} src={imagePreviewUrl} />
          </Edit>
        ) : (
          <Profile
            onSubmit={this.handleSubmit}
            src={imagePreviewUrl}
            name={name}
            status={status}
          />
        )}
      </div>
    );
  }
}

export default CardProfile;
