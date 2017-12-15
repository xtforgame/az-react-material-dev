import React from 'react';
import {
  withRouter,
} from 'react-router-dom';
import { compose } from 'recompose';
import createInjectableEpic from '~/createInjectableEpic';
import { getAsyncInjectors } from '~/utils/injectors';
import getDisplayName from '~/utils/getDisplayName';
import withStore from './withStore';

export default ({moduleName, reducer, epic, saga}) => (Component) => {
  let LoadWithHoc = class LoadWithHoc extends React.Component {
    static displayName = `loadWith(${getDisplayName(Component)})`;
    componentWillMount(){
      console.log('this.props :', this.props);
      console.log('{moduleName, reducer, epic, saga} :', {moduleName, reducer, epic, saga});
      let { store } = this.props;
      // console.log('store :', store);
      let { injectReducer, injectEpic, getInjectableEpic, injectSaga } = getAsyncInjectors(store);
      this.moduleName = moduleName || getDisplayName(Component);
      if(reducer){
        // console.log('reducer :', reducer);
        injectReducer(this.moduleName, reducer);
      }
      if(epic){
        // console.log('epic :', epic);
        this.injectableEpic = injectEpic(this.moduleName, epic);
      }

      if(saga){
        // console.log('saga :', saga);
        this.injectedSaga = injectSaga(this.moduleName, saga);
      }
    }

    componentWillUnmount(){
      let { store } = this.props;
      let { removeEpic, removeSaga, getInjectableEpic } = getAsyncInjectors(store);
      removeEpic(this.moduleName, this.injectableEpic);
      removeSaga(this.moduleName, this.injectedSaga);
    }

    render(){
      return (<Component {...this.props} />);
    }
  }
  return compose(
    withRouter,
    withStore,
  )(LoadWithHoc);
}