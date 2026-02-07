/**
 * Migration script: Convert fase from [String] to [{nome, concluida, dataConclusao}]
 *
 * Run once: node src/scripts/migrate-fases.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

async function migrate() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('projetos');

    const projetos = await collection.find({}).toArray();
    let updated = 0;

    for (const projeto of projetos) {
      if (!projeto.fase || projeto.fase.length === 0) continue;

      // Check if already migrated (first element is an object with 'nome')
      if (typeof projeto.fase[0] === 'object' && projeto.fase[0].nome) {
        console.log(`Skipping "${projeto.nome}" - already migrated`);
        continue;
      }

      const newFase = projeto.fase.map((item) => ({
        nome: typeof item === 'string' ? item : String(item),
        concluida: false,
        dataConclusao: null,
      }));

      await collection.updateOne(
        { _id: projeto._id },
        { $set: { fase: newFase } }
      );

      updated++;
      console.log(`Migrated "${projeto.nome}" (${newFase.length} fases)`);
    }

    console.log(`\nDone. ${updated} project(s) migrated.`);
  } catch (error) {
    console.error('Migration error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

migrate();
