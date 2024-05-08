export function parseInput(obj: any, fields: string) {
  const fieldsArray = fields.split(' ');
  let outputObj: any = {};
  Object.keys(obj).forEach((key: string) => {
    if (fieldsArray.includes(key))
      outputObj[key as keyof typeof outputObj] = obj[key as keyof typeof obj];
  });
  return outputObj;
}
