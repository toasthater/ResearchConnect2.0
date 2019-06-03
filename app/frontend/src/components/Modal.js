import React from 'react';

export default (props) => {
  const { children, isOpen } = props;
  return (
    <div className={`modal ${ isOpen ? 'is-active' : '' }`}>
      <div className="modal-background" />
      <div className="modal-content box" style={{ width: '75%' }}>
        { children }
      </div>
      {/* <button className="modal-close is-large" aria-label="close"></button> */}
    </div>
  );
};
