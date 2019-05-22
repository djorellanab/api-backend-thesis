/**
 * Configuración de puerto
 */
process.env.PORT = process.env.PORT || 3000;

/**
 * Dirección a la base de datos
 */
process.env.NAMEDB = process.env.NAMEDB  || 'iarna';
process.env.URLDB = process.env.URLDB || `mongodb://localhost:27017/${process.env.NAMEDB}`;

/**
 * Vencimiento del token
 */
process.env.CADUCIDAD_TOKEN = process.env.CADUCIDAD_TOKEN || 60 * 60 * 24 * 30;
process.env.SEED = process.env.SEED || "3st3-35-3l-s33d-d3-d3s4r0ll0";

process.env.ADMINUSER = process.env.ADMINUSER || "djob195@gmail.com";
process.env.ADMINPASSWORD = process.env.ADMINPASSWORD || "123456";

/**
 * Configuración de pagineo
 */
process.env.DESDE = parseInt(process.env.DESDE) || 0;
process.env.LIMITE = parseInt(process.env.LIMITE) || 5;