import { promises as fs } from 'fs';
import { join } from 'path';

async function concatenateFiles(directoryPath, outputPath) {
    let output = '';
    
    // Función auxiliar para leer directorios de forma recursiva
    async function readDirectory(currentPath, relativePath = '') {
        const entries = await fs.readdir(currentPath, { withFileTypes: true });
        
        // Ordenamos las entradas alfabéticamente
        entries.sort((a, b) => a.name.localeCompare(b.name));
        
        for (const entry of entries) {
            const fullPath = join(currentPath, entry.name);
            const relPath = join(relativePath, entry.name);
            
            if (entry.isDirectory()) {
                // Es un directorio, llamada recursiva
                await readDirectory(fullPath, relPath);
            } else {
                // Es un archivo, leemos su contenido
                try {
                    // Ignoramos el archivo de salida si está en el mismo directorio
                    if (fullPath === outputPath) continue;
                    
                    // Usamos un formato más distintivo para las rutas
                    output += `\n<<<FILE_START:${relPath}>>>\n`;
                    const content = await fs.readFile(fullPath, 'utf8');
                    output += content;
                    output += `\n<<<FILE_END:${relPath}>>>\n`;
                } catch (error) {
                    console.error(`Error reading file ${fullPath}:`, error);
                }
            }
        }
    }
    
    try {
        // Verificamos que el directorio existe
        await fs.access(directoryPath);
        
        // Iniciamos la lectura recursiva
        await readDirectory(directoryPath);
        
        // Escribimos el archivo de salida
        await fs.writeFile(outputPath, output.trim());
        
        console.log(`Successfully concatenated all files to ${outputPath}`);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

// Verificamos que se proporcionaron los argumentos necesarios
if (process.argv.length < 4) {
    console.log('Usage: node script.js <source_directory> <output_file>');
    process.exit(1);
}

// Obtenemos los argumentos de la línea de comandos
const sourceDir = process.argv[2];
const outputFile = process.argv[3];

// Ejecutamos la función principal
concatenateFiles(sourceDir, outputFile);