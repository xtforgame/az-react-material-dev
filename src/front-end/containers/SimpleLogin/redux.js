
export const INPUT_USERNAME = '@@app/Login/INPUT_USERNAME';

export const inputUsername = username => ({ type: INPUT_USERNAME, username });

const login = (state = {}, action) => {
  switch (action.type) {
    case INPUT_USERNAME:
      return {
        ...state,
        username: action.username,
      };

    default:
      break;
  }
  return state;
};

export default login;
