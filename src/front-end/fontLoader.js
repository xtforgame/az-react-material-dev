import FontFaceObserver from 'fontfaceobserver';
import { toSeqPromise } from 'common/utils';


const loadMin = () => toSeqPromise([
  ['FontAwesome', undefined],
  // ['Noto Sans TC', 400],
  // ['Noto Sans TC', 500],
  // ['Noto Sans TC', 700],
], (_, value) => {
  const observer = new FontFaceObserver(value[0], {
    weight: value[1],
  });
  return observer.load()
  .then(() => {
    // console.log(`${value[0]}:${value[1]} is avaiLabel`);
  }, () => {
    console.warn(`${value[0]}:${value[1]} is not avaiLabel`);
  });
});

const loadAll = () => toSeqPromise([
  ['Noto Sans TC', 400],
  ['Noto Sans TC', 500],
  ['Noto Sans TC', 700],
  ['Noto Sans SC', 400],
  ['Noto Sans SC', 500],
  ['Noto Sans SC', 700],
  ['Noto Sans JP', 400],
  ['Noto Sans JP', 500],
  ['Noto Sans JP', 700],
  ['Roboto', 400],
  ['Roboto', 500],
  ['Roboto', 700],
], (_, value) => {
  const observer = new FontFaceObserver(value[0], {
    weight: value[1],
  });
  return observer.load()
  .then(() => {
    // console.log(`${value[0]}:${value[1]} is avaiLabel`);
  }, () => {
    console.warn(`${value[0]}:${value[1]} is not avaiLabel`);
  });
});

export default () => {
  const min = loadMin();
  const all = min.then(loadAll);
  return { min, all };
};
