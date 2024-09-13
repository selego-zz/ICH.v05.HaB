//importamos las dependencias
import bcrypt from 'bcrypt';
import { getPool } from '../../db/index.js';
import { generateErrorUtil } from '../../utils/index.js';

/**
 * Modelo para insertar un usuario en la base de datos
 * @param {string} username - Nombre de usuario
 * @param {string} password - Contraseña del usuario en texto plano
 * @param {string} email - Correo electrónico del usuario
 * @param {string} [code] - Código de cliente, o código de agente, caso de que el rol sea uno de ellos. (Opcional)
 * @param {string} [role] - El rol del usuario (opcional). Valores posibles: 'administrador', 'empleado', 'cliente', 'comercial'. Valor por defecto: 'cliente'.
 * @description - Inserta en la base de datos la información del usuario con los datos especificados
 * @returns - Devuelve el id del usuario introducido en la base de datos
 */
const insertUserModel = async (username, password, email, code, role) => {
    // tomamos el pool de la base de datos
    const pool = await getPool();

    //comprobamos que no exista ni el usuario, ni el email (caso de que suministren email)
    let [resultado] = await pool.query(
        'SELECT id FROM users WHERE username = ?',
        [username],
    );

    if (resultado.length)
        generateErrorUtil(
            'Ya existe un usuario con ese nombre de usuario',
            409,
        );

    const args = [username, await bcrypt.hash(password, 10)];
    let SQL = `INSERT INTO users (username, password`;
    let MIDSQL = `) VALUES (?, ?`;

    if (email) {
        [resultado] = await pool.query('SELECT id FROM users WHERE email = ?', [
            email,
        ]);
        if (resultado.length)
            generateErrorUtil(
                'Ya existe un usuario con ese correo electrónico',
                409,
            );
        SQL += `, email`;
        MIDSQL += `, ?`;
        args.push(email);
    }

    if (role) {
        SQL += `, role`;
        MIDSQL += `, ?`;
        args.push(role);
    }

    if (code) {
        SQL += `, code`;
        MIDSQL += `, ?`;
        args.push(code);
    }

    MIDSQL += `)`;

    [resultado] = await pool.query(SQL + MIDSQL, args);

    return resultado.insertId;
};
export default insertUserModel;
