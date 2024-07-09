

export function convertObjectToStringRecord(obj: object): Record<string, string> {
  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(obj)) {
    result[String(key)] = String(value);
  }

  return result;
}

export function convertRecordToString(record: Record<string, string> | undefined): string | undefined {
  if (record === undefined) return undefined;
  return Object.entries(record)
    .map(([key, value]) => `${key}=${value}`)
    .join(',');
}

type JsonObject = { [key: string]: any };

/**
 * Get all key paths from a JSON object
 * 
 * Use pattern from https://github.com/g-makarov/dot-path-value
 * For better type: https://x.com/diegohaz/status/1309489079378219009
 */
export function getAllKeyPaths(obj: JsonObject, prefix: string = ''): string[] {
  let paths: string[] = [];

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      paths.push(newKey);

      if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        paths = paths.concat(getAllKeyPaths(obj[key], newKey));
      } else if (Array.isArray(obj[key])) {
        paths.push(newKey);
        obj[key].forEach((_: any, index: number) => {
          const arrayKey = `${newKey}.${index}`;
          paths.push(arrayKey);
          if (typeof obj[key][index] === 'object') {
            paths = paths.concat(getAllKeyPaths(obj[key][index], arrayKey));
          }
        });
      }
    }
  }

  // Make sure to return unique paths
  return [...new Set(paths)];
}
