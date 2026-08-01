import fs from 'fs';
import pdf from 'pdf-parse';

async function readPDF(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    console.log(`\n\n--- CONTENT OF ${filePath} ---`);
    console.log(data.text.substring(0, 2000)); // Just read the first 2000 chars for now to get the gist
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
  }
}

async function main() {
  await readPDF('D:\\Downloads\\chrome downlaods\\Kitty_AI_Chapter_One.pdf');
  await readPDF('D:\\Downloads\\chrome downlaods\\Kitty_AI_Chapters_2-10.pdf');
}

main();
