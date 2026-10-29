import bcrypt from 'bcrypt';
import mysql from 'mysql2/promise';


const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Admin123',
  database: 'vetua'
};

async function actualizarPassword() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const passwordPlana = 'admin123';
    const saltRounds = 10;
    
    // Generamos el hash con el bcrypt nativo
    const hashedPassword = await bcrypt.hash(passwordPlana, saltRounds);

    const query = `
      UPDATE clinica_users 
      SET password = ?, rol = 'adminSistema', clinicaId = 1 
      WHERE username = 'admin_sistema'
    `;

    await connection.execute(query, [hashedPassword]);
    console.log('----------------------------------------------------');
    console.log('¡CONTRASEÑA Y ROL DE ADMIN_SISTEMA ACTUALIZADOS CORRECTAMENTE!');
    console.log('----------------------------------------------------');
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('Error al actualizar:', error);
    process.exit(1);
  }
}

actualizarPassword();