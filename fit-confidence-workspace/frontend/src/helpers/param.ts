export const getUrlParameterJson = (): string => {
  const search = window.location.search.substring(1);
  if (search !== '') {
    const urlParams = JSON.parse(
      `{"${search.replace(/&/g, '","').replace(/=/g, '":"')}"}`,
      (key, value) => {
        return key === '' ? value : decodeURIComponent(value);
      }
    );
    return JSON.stringify(urlParams);
  }
  return '';
};

const urlParams = getUrlParameterJson();

export const CONSTANT = {
  isEmbedded: urlParams !== '' ? JSON.parse(urlParams).embedded === '1' : false
};
