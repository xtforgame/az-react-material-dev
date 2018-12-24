import React from 'react';

export default function withOnPressEnterEvent(TextFieldComponent) {
  return class extends React.Component {
    state = {
      isOnComposition: false,
    };

    onKeyPressed = (e) => {
      const {
        onPressEnter = () => {},
        multiline,
      } = this.props;
      const {
        onPressEnterCheckCondition = event => (!multiline || !event.nativeEvent.shiftKey),
      } = this.props;
      const {
        isOnComposition,
      } = this.state;
      if (!isOnComposition && e.keyCode === 13 && onPressEnterCheckCondition(e)) {
        // e.preventDefault();
        onPressEnter(e);
      }
    }

    handleComposition = (e) => {
      if (e.type === 'compositionend') {
        this.setState({
          isOnComposition: false,
        });
      } else {
        this.setState({
          isOnComposition: true,
        });
      }
    }

    render() {
      const {
        onKeyDown = () => {},
        onCompositionStart = () => {},
        onCompositionUpdate = () => {},
        onCompositionEnd = () => {},
        onPressEnter,
        onPressEnterCheckCondition,
        ...rest
      } = this.props;
      return (
        <TextFieldComponent
          onKeyDown={(e) => {
            onKeyDown(e);
            this.onKeyPressed(e);
          }}
          onCompositionStart={(e) => {
            onCompositionStart(e);
            this.handleComposition(e);
          }}
          onCompositionUpdate={(e) => {
            onCompositionUpdate(e);
            this.handleComposition(e);
          }}
          onCompositionEnd={(e) => {
            onCompositionEnd(e);
            this.handleComposition(e);
          }}
          {...rest}
        />
      );
    }
  };
}
