import React from 'react';
import PropTypes from 'prop-types';
import 'bootstrap/js/dist/modal';

const MyModal = ({
  id, title, body, btn1, btn2, onSubmit,
}) => (
  <div className="modal fade" id={id}>
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">{title}</h5>
          <button type="button" className="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          {body}
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={onSubmit} data-dismiss="modal">{btn1}</button>
          <button type="button" className="btn btn-secondary text-white" data-dismiss="modal">{btn2}</button>
        </div>
      </div>
    </div>
  </div>
);


MyModal.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  body: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  btn1: PropTypes.string,
  btn2: PropTypes.string,
  onSubmit: PropTypes.func,
};

MyModal.defaultProps = {
  btn1: '确认',
  btn2: '取消',
  onSubmit: () => {},
};

export default MyModal;
