export const CSVToJson = (csv) => {
  const cleanedCsv = csv.replace(/\r/g, '').trim();
  const lines = cleanedCsv.split('\n');
  const headers = lines[0].split(',');

  const questions = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;

    const currentLine = lines[i].match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g);
    if (!currentLine || currentLine.length < headers.length) continue;

    const values = currentLine.map((str) => str.replace(/^"|"$/g, '').trim());

    const id = values[headers.indexOf('id')]?.trim();
    const question = values[headers.indexOf('question')]?.trim();
    const rawAnswers = values[headers.indexOf('answers')]?.trim() || '';
    const correctAnswer = values[headers.indexOf('correctAnswer')]?.trim();

    const answers = rawAnswers.includes(';')
      ? rawAnswers
          .split(';')
          .map((a) => a.trim())
          .filter(Boolean)
      : rawAnswers
          .split(',')
          .map((a) => a.trim())
          .filter(Boolean);

    if (id && question && answers.length > 0 && correctAnswer) {
      questions.push({
        id,
        question,
        answers,
        correctAnswer,
      });
    }
  }

  return questions;
};
