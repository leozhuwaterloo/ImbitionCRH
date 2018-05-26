import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FaUser from 'react-icons/lib/fa/user';
import DistinctViewPage from '../DistinctViewPage';
import { NAMES, translate } from '../../consts';
import { updateData, fetchData, passwordReset } from '../../actions';
import { getTempPassword } from '../../reducers';
import { TextInput, MyModal } from '../FormControl';
import ImageEditor from './ImageEditor';

class SettingsDumb extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        last_name: '',
        first_name: '',
        email: '',
        phone: '',
      },
      portrait: '',
      position: {},
      passwordReset: {
        oldPassword: this.props.tempPassword,
        newPassword: '',
        newPasswordConfirm: '',
      },
    };
    this.modalId = 'settingsModal';
    this.handleInputChange = (event) => {
      this.state.user[event.target.name] = event.target.value;
      this.forceUpdate();
    };
    this.handlePasswordResetInputChange = (event) => {
      this.state.passwordReset[event.target.name] = event.target.value;
      this.forceUpdate();
    };
    this.mobileRender = () => (
      <div>
        <div className="container mt-5 col-8 shadow mb-5 bg-white rounded pt-5 pb-5">
          <div className="ml-3 mr-3">
            <div className="form-group center-display">
              <a
                data-toggle="modal"
                data-target={`#${this.modalId}-1`}
                href="#portrait"
              >
                {this.state.portrait
                  ?
                    <div className="card-img-top center-display mb-2">
                      <div className="card-img-container center-display rounded-circle fill-container bg-secondary">
                        <img src={this.state.portrait} alt={NAMES.EMPLOYEE_PORTRAIT} />
                      </div>
                    </div>
                  : <FaUser size={100} className="text-secondary" />}
              </a>
            </div>
            {Object.keys(this.state.user).map(key => (
              <div key={key} className="form-group center-display">
                <TextInput
                  name={key}
                  labelClassName="w-1"
                  inputClassName="w-1"
                  label={translate(key)}
                  value={this.state.user[key]}
                  onChange={this.handleInputChange}
                  error={this.props.updateerrors && this.props.updateerrors.settings
                  && (translate(this.props.updateerrors.settings[key])
                  || (this.props.updateerrors.settings.user
                    && translate(this.props.updateerrors.settings.user[key])))}
                />
              </div>
            ))}
            <div className="form-group center-display">
              <button
                className="btn btn-info"
                onClick={() => {
                  this.props.updateUser(this.props.user.id, this.props.user.user.id, {
                    user: {
                      id: this.props.user.user.id,
                      last_name: this.state.user.last_name,
                      first_name: this.state.user.first_name,
                      email: this.state.user.email,
                    },
                    portrait: this.state.portrait,
                    phone: this.state.user.phone,
                    position: this.state.position.id,
                  });
                }}
              >{NAMES.EMPLOYEE_SAVE}
              </button>
              <button
                ref={(passwordResetButton) => {
                  this.passwordResetButton = passwordResetButton;
                }}
                className="btn btn-warning ml-3"
                data-toggle="modal"
                data-target={`#${this.modalId}-2`}
              >{NAMES.PASSWORD_RESET}
              </button>
            </div>
          </div>
        </div>
        <MyModal
          id={`${this.modalId}-1`}
          title={NAMES.PORTRAIT_EDIT}
          body={
            <div className="center-display fill-container">
              <ImageEditor
                initImage={this.state.portrait}
                ref={(ref) => {
                  this.portraitEditor = ref;
                }}
                onClickSave={(imageURL) => {
                  this.setState({ portrait: imageURL });
                }}
              />
            </div>
          }
          onSubmit={() => this.portraitEditor.onClickSave()}
        />
        <MyModal
          id={`${this.modalId}-2`}
          title={NAMES.PORTRAIT_EDIT}
          body={
            <div>
              {Object.keys(this.state.passwordReset).map(key => (
                <TextInput
                  name={key}
                  key={key}
                  labelClassName="w-1"
                  inputClassName="w-1"
                  type="password"
                  label={translate(key)}
                  value={this.state.passwordReset[key]}
                  onChange={this.handlePasswordResetInputChange}
                />
              ))}
            </div>
          }
          onSubmit={() => this.props.resetPassword(this.props.user.id, this.state.passwordReset, () => {
            this.setState({
              passwordReset: {
                oldPassword: '',
                newPassword: '',
                newPasswordConfirm: '',
              },
            });
          })}
        />
      </div>
    );
  }

  componentDidMount() {
    if (this.passwordResetButton && this.props.tempPassword) {
      this.passwordResetButton.click();
      alert(NAMES.LOGIN_FIRST_PASSWORD_CHANGE_WARNING); // eslint-disable-line no-alert
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user && nextProps.user.user) {
      this.setState({
        user: {
          last_name: nextProps.user.user.last_name,
          first_name: nextProps.user.user.first_name,
          email: nextProps.user.user.email,
          phone: nextProps.user.phone,
        },
        portrait: nextProps.user.portrait,
        position: nextProps.user.position || {},
      });
    }
  }

  render() {
    return (
      <DistinctViewPage
        title={NAMES.SETTINGS}
        mobileRender={() => this.mobileRender()}
      />
    );
  }
}


SettingsDumb.propTypes = {
  user: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  updateerrors: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  updateUser: PropTypes.func.isRequired,
  resetPassword: PropTypes.func.isRequired,
  tempPassword: PropTypes.string,
};

SettingsDumb.defaultProps = {
  tempPassword: '',
};

const mapStateToProps = state => ({
    user: state.data.user,
    updateerrors: state.data.updateerrors,
    tempPassword: getTempPassword(state),
  }),
  mapDispatchToProps = dispatch => ({
    updateUser: (employeeId, userId, body) => {
      dispatch(updateData(`employee/${employeeId}`, body, 'settings', () => {
        dispatch(fetchData(`user/${userId}`, 'user'));
      }));
    },
    resetPassword: (userId, body, clearInputs) => {
      dispatch(passwordReset(userId, body.oldPassword, body.newPassword, body.newPasswordConfirm, (status) => {
        if (status === 200) clearInputs();
      }));
    },
  }),
  Settings = connect(mapStateToProps, mapDispatchToProps)(SettingsDumb);

export default Settings;
