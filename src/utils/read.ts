export const readJson = () => {
  return new Promise((resolve, reject) => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'application/json';
    fileInput.click();
    fileInput.addEventListener('change', (event) => {
      const file = (event?.target as any)?.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const jsonData = JSON.parse((e?.target as any)?.result as string);
          resolve(jsonData);
          fileInput.remove();

        };
        reader.readAsText(file);
      }
    });
  });
};
