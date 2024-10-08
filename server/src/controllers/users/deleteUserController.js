//importamos dependencias
import { deleteUserModel } from '../../models/index.js';

/**
 * Función controladora que elimina un usuario en la base de datos, recibe el id del usuairo a eliminar por path params
 * @middleware authWorkerController - Middleware para comprobar permisos de borrado.
 * @param {Object} req - Objeto request
 * @param {Object} req.params - Parametros de la ruta
 * @param {number} req.params.iduser - Id del usuario a eliminar
 * @param {Object} res - El objeto de respuesta.
 * @param {string} res.status - Estado de la petición. Valores posibles: 'ok', 'error'
 * @param {string} res.message - Mensaje explicativo de respuesta o de error
 * @param {number} res.data - Numero de registros eliminados
 * @param {Function} next - La función de middleware siguiente.
 * @description Llama al modelo `deleteUserModel` para borrar los datos del usuario indicaddo de la base de datos.
 */
const deleteUserController = (req, res, next) => {
    try {
        const affectedRows = deleteUserModel(req.params.iduser);
        res.send({
            status: 'ok',
            message: `Usuario ${req.params.iduser} eliminado`,
            data: affectedRows,
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};
export default deleteUserController;
