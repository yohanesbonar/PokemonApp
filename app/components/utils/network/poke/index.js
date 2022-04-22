import {API_CALL} from '../requestHelper';

export const getPokemonFetch = async params => {
  try {
    const option = {
      method: 'get',
      url: `pokemon/`,
      params: params,
    };
    let response = await API_CALL(option);

    return response;
  } catch (error) {
    return;
  }
};

export const getMovesFetch = async id => {
  try {
    const option = {
      method: 'get',
      url: `move/`,
      params: id,
    };
    let response = await API_CALL(option);

    return response;
  } catch (error) {
    return;
  }
};

export const getAbilityFetch = async id => {
  try {
    const option = {
      method: 'get',
      url: `ability/`,
      params: id,
    };
    let response = await API_CALL(option);

    return response;
  } catch (error) {
    return;
  }
};

export const getTypesFetch = async id => {
  try {
    const option = {
      method: 'get',
      url: `type/`,
      params: id,
    };
    let response = await API_CALL(option);

    return response;
  } catch (error) {
    return;
  }
};
