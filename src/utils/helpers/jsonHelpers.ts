import { readFileSync, writeFileSync } from 'fs';

export const readJSON = (filePath: string): Record<string, any> => {
  const file = readFileSync(filePath, 'utf-8');
  const json = JSON.parse(file);
  return json;
};

export const writeJSON = (
  filePath: string,
  dataPath: string,
  data: any
): void => {
  const file = readJSON(filePath);
  const pathParts = dataPath.split('.');
  const current: Record<string, any> = file;

  for (const part of pathParts.slice(0, -1)) {
    if (!part) continue;

    if (!(part in current) || current[part] === undefined) {
      current[part] = {};
    }
    const nextCurrent = current[part] as Record<string, any>;
    Object.assign(current, { [part]: nextCurrent });
  }

  const lastPart = pathParts[pathParts.length - 1];
  if (lastPart) {
    if (data === null) {
      delete current[lastPart];
    } else {
      current[lastPart] = data;
    }
  }

  const newJSON = JSON.stringify(file, null, '\t');
  writeFileSync(filePath, newJSON);
};
