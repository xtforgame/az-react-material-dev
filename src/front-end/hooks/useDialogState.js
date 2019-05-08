import { useState } from 'react';

export default ({
  open: openFunc = () => {},
  close: closeFunc = () => {},
  exited: exitedFunc = () => {},
}) => {
  const [open, setOpen] = useState(false);
  const [exited, setExited] = useState(true);

  const handleOpen = () => {
    if (exited) {
      setOpen(true);
      setExited(false);
      openFunc();
    }
  };

  const handleClose = (v) => {
    const result = closeFunc(v);
    if (result !== false) {
      setOpen(false);
    }
  };

  const handleExited = () => {
    // console.log('handleExited :', handleExited);
    setExited(true);
    exitedFunc();
  };

  const dialogProps = {
    open,
    onClose: handleClose,
    onExited: handleExited,
  };

  return [{
    open,
    exited,
    dialogProps,
  }, {
    setOpen,
    setExited,
    handleOpen,
    handleClose,
    handleExited,
  }];
};
