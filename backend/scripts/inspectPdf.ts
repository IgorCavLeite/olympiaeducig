import fs from 'fs';
import path from 'path';
import { PDFParse } from 'pdf-parse';

async function inspect() {
  const pdfPath = path.join(__dirname, '../provas/Prova OBB 2021.pdf');
  if (!fs.existsSync(pdfPath)) {
    console.error('Arquivo não encontrado:', pdfPath);
    return;
  }

  console.log('🔄 Lendo o arquivo PDF...');
  const dataBuffer = fs.readFileSync(pdfPath);
  const parser = new PDFParse({ data: dataBuffer });
  const data = await parser.getText();

  console.log('--- Informações do PDF ---');
  console.log('Total de Páginas:', data.total);
  console.log('Tamanho do texto:', data.text.length, 'caracteres');
  
  const lastPageNum = data.total;
  console.log(`\n--- Texto da Última Página (Página ${lastPageNum}) ---`);
  console.log(data.getPageText(lastPageNum));
  
  // Liberar recursos
  await parser.destroy();
}

inspect().catch(err => console.error(err));
