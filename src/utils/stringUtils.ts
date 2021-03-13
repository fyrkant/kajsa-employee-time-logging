export const parseDescription = (
  input?: string,
): { general: string[]; log: string[] } => {
  if (!input) {
    return { general: [], log: [] };
  }
  const splat = input.split('\n');
  const logIndex = splat.indexOf('LOG:');

  const general = splat.slice(1, logIndex - 1).filter((x) => x !== '');
  const log = splat.slice(logIndex + 1).filter((x) => x !== '');

  return { general, log };
};

export const stringifyDescription = (input: Record<string, string[]>) => {
  const general = input.general || [];
  const log = input.log || [];
  const sortedLogs = log.sort((a, b) => {
    const timeA = a.substr(0, 5).replace(':', '');
    const timeB = b.substr(0, 5).replace(':', '');

    return parseInt(timeA, 10) - parseInt(timeB, 10);
  });

  return `GENERAL:
${general.length > 0 ? general.join('\n') : ''}

LOG:${sortedLogs.length > 0 ? '\n' + sortedLogs.join('\n') : ''}`;
};
