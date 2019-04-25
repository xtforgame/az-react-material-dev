/* eslint-disable no-underscore-dangle, react/no-this-in-sfc, no-param-reassign */
export default class PropsProxy {
  constructor(type, link) {
    this.type = type;
    this.link = link;
    this.linker = this.link.linker;
    this.name = this.link.name;

    this.handledByProps = this.link.config.handledByProps && { ...this.link.config.handledByProps };
    if (this.linker.options.controlled) {
      this.handledByProps = {
        value: ({ link: { hostProps } }) => hostProps.value && hostProps.value[this.name],
        onChange: ({ value, rawArgs }, { link, link: { hostProps, linker } }) => {
          if (hostProps.onChange) {
            hostProps.onChange(value, rawArgs, link, {
              ...this.linker.getValues(),
              [this.name]: value,
            });
          }
          if (hostProps.onChanges) {
            if (this.linker.options.applyChangesSync) {
              linker.changeValues({
                [this.name]: value,
              });
            } else {
              linker.addPendingChange(hostProps.onChanges, {
                value, rawArgs, link,
              });
            }
          }
        },
      };
    } else if (this.handledByProps) {
      if (!this.handledByProps.value || !this.handledByProps.onChange) {
        throw new Error('Wrong options: handledByProps');
      }
      if (typeof this.handledByProps.value === 'string') {
        const valueProp = this.handledByProps.value;
        this.handledByProps.value = ({ link: { hostProps } }) => hostProps[valueProp];
      }

      if (typeof this.handledByProps.onChange === 'string') {
        const onChangeProp = this.handledByProps.onChange;
        this.handledByProps.onChange = ({ value, rawArgs }, { link, link: { hostProps } }) => {
          if (hostProps[onChangeProp]) {
            hostProps[onChangeProp](value, rawArgs, link);
          }
        };
      } else {
        const { onChange } = this.handledByProps;
        this.handledByProps.onChange = ({ value, rawArgs }, { link }) => {
          if (onChange) {
            onChange(value, rawArgs, link);
          }
        };
      }
    }
  }

  get host() {
    return this.linker.host;
  }

  getValue = () => this.handledByProps.value({ link: this.link });

  setValue = (value, rawArgs) => this.handledByProps.onChange({ value, rawArgs }, { link: this.link });
}
