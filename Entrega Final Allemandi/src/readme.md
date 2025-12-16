Alumno: Franco Allemandi
Curso: Backend II

Este proyecto corresponde a la entrega final del curso Backend II y consiste en el desarrollo de un servidor backend para un ecommerce, implementando una arquitectura profesional basada en DAO. Se utilizó como base la Entrega Final del curso Backend I, así como la pre-entrega de este curso.

El objetivo principal fue mejorar la arquitectura del servidor y profundizar en la lógica de compras.

Funcionalidades Implementadas:
Productos
* Crear productos
* Listar productos con paginación
* Obtener producto por ID
* Actualizar productos
* Eliminar productos
Usuarios
* Crear usuarios
* Hash de contraseñas con bcrypt
* Asociación automática de carrito al crear un usuario
* Listado de usuarios
Carritos
* Crear carrito
* Obtener carrito con productos populados
* Agregar productos al carrito
* Actualizar cantidad de un producto
* Eliminar productos del carrito
* Vaciar carrito
Tickets
* Verificación de stock producto por producto
* Productos con stock → se compran
* Productos sin stock → se devuelven como no procesados
* Descuento de stock automático
* Generación de Ticket de compra
* Vaciado del carrito solo de los productos comprados

Nota: es necesario un archivo .env en la carpeta raíz con el siguiente contenido:

PORT=8080
JWT_SECRET="jwt_secret_key"
JWT_EXPIRES_IN=1h
MONGODB_URL=mongodb+srv://francoaallemandi_db_user:e86iweUzTx6WujPa@cluster0.ag8e0nz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
