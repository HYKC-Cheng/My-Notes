export const downloadJson = (data: object) => {
  const json = JSON.stringify(data);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'MyNote_Data.json';
  a.click();
  URL.revokeObjectURL(url);
};
