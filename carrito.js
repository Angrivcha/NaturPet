// Aquí guardo los productos que se agregan al carrito.
let carrito = [];

// Aquí busco los botones y las partes de la página que voy a usar.
const botonMenu = document.getElementById('boton-menu');
const listaMenu = document.getElementById('lista-menu');
const botonesFiltro = document.querySelectorAll('.filtro-categoria');
const tarjetasProductos = document.querySelectorAll('.producto');
const botonesAgregar = document.querySelectorAll('.agregar-carrito');

const listaCarrito = document.getElementById('lista-carrito');
const listaCarritoFlotante = document.getElementById('lista-carrito-flotante');
const contadorCarrito = document.getElementById('contador-carrito');
const totalCarrito = document.getElementById('total-carrito');
const totalFlotante = document.getElementById('total-flotante');
const cantidadFlotante = document.getElementById('cantidad-flotante');
const importeFlotante = document.getElementById('importe-flotante');
const mensajeCarrito = document.getElementById('mensaje-carrito');

const ventanaCarrito = document.getElementById('carrito-flotante');
const productosFlotantes = document.getElementById('productos-flotantes');
const pieCarritoFlotante = document.getElementById('pie-carrito-flotante');
const compra = document.getElementById('compra');
const formularioCompra = document.getElementById('formulario-compra');
const revisionPedido = document.getElementById('revision-pedido');
const pedidoCompletado = document.getElementById('pedido-completado');
const pasoCompra = document.getElementById('paso-compra-flotante');

const nombreCliente = document.getElementById('nombre-cliente');
const telefonoCliente = document.getElementById('telefono-cliente');
const metodoPago = document.getElementById('metodo-pago');

// Aquí hago que el menú se abra y se cierre en celulares.
botonMenu.addEventListener('click', function () {
    listaMenu.classList.toggle('mostrar');

    if (listaMenu.classList.contains('mostrar')) {
        botonMenu.textContent = '✕ Cerrar';
    } else {
        botonMenu.textContent = '☰ Menú';
    }
});

listaMenu.querySelectorAll('a').forEach(function (enlace) {
    enlace.addEventListener('click', function () {
        listaMenu.classList.remove('mostrar');
        botonMenu.textContent = '☰ Menú';
    });
});

// Aquí filtro los productos según la categoría seleccionada.
botonesFiltro.forEach(function (boton) {
    boton.addEventListener('click', function () {
        const categoria = boton.getAttribute('data-categoria');

        botonesFiltro.forEach(function (otroBoton) {
            otroBoton.classList.remove('activo');
        });
        boton.classList.add('activo');

        tarjetasProductos.forEach(function (tarjeta) {
            if (categoria === 'todos' || tarjeta.getAttribute('data-categoria') === categoria) {
                tarjeta.hidden = false;
            } else {
                tarjeta.hidden = true;
            }
        });
    });
});

// Aquí muestro los precios con dos decimales.
function mostrarPrecio(precio) {
    return 'S/ ' + precio.toFixed(2);
}

// Aquí agrego los productos y aumento la cantidad cuando ya están en el carrito.
function agregarProducto(boton) {
    const id = boton.getAttribute('data-id');
    let encontrado = false;

    for (let i = 0; i < carrito.length; i++) {
        if (carrito[i].id === id) {
            carrito[i].cantidad++;
            encontrado = true;
            break;
        }
    }

    if (encontrado === false) {
        const tarjeta = boton.closest('.producto');
        const imagen = tarjeta.querySelector('img').getAttribute('src');

        carrito.push({
            id: id,
            nombre: boton.getAttribute('data-nombre'),
            precio: Number(boton.getAttribute('data-precio')),
            imagen: imagen,
            cantidad: 1
        });
    }

    actualizarCarrito();
    mensajeCarrito.textContent = 'Agregaste ' + boton.getAttribute('data-nombre') + ' al carrito.';
}

botonesAgregar.forEach(function (boton) {
    boton.addEventListener('click', function () {
        agregarProducto(boton);
    });
});

// Aquí creo los botones para aumentar, disminuir o quitar un producto.
function crearBoton(texto, accion, id) {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.textContent = texto;

    boton.addEventListener('click', function () {
        cambiarCantidad(id, accion);
    });
    return boton;
}

// Aquí muestro cada producto dentro del carrito.
function crearProductoCarrito(producto, esFlotante) {
    const fila = document.createElement('li');
    const datos = document.createElement('div');
    const nombre = document.createElement('strong');
    const precio = document.createElement('p');
    const controles = document.createElement('div');
    const subtotal = producto.precio * producto.cantidad;

    nombre.textContent = producto.nombre;
    precio.textContent = mostrarPrecio(producto.precio) + ' por unidad';
    controles.className = 'controles-cantidad';

    const cantidad = document.createElement('span');
    cantidad.textContent = 'Cantidad: ' + producto.cantidad;
    controles.appendChild(crearBoton('-', 'disminuir', producto.id));
    controles.appendChild(cantidad);
    controles.appendChild(crearBoton('+', 'aumentar', producto.id));
    controles.appendChild(crearBoton('Quitar', 'quitar', producto.id));

    datos.appendChild(nombre);
    datos.appendChild(precio);

    if (esFlotante) {
        fila.className = 'producto-flotante';
        const imagen = document.createElement('img');
        imagen.src = producto.imagen;
        imagen.alt = producto.nombre;

        const textoSubtotal = document.createElement('p');
        textoSubtotal.className = 'subtotal-flotante';
        textoSubtotal.textContent = 'Subtotal: ' + mostrarPrecio(subtotal);

        datos.appendChild(controles);
        datos.appendChild(textoSubtotal);
        fila.appendChild(imagen);
        fila.appendChild(datos);
    } else {
        fila.className = 'item-carrito';
        precio.textContent += ' - Subtotal: ' + mostrarPrecio(subtotal);
        fila.appendChild(datos);
        fila.appendChild(controles);
    }

    return fila;
}

// Aquí actualizo la lista, las cantidades y el total de los dos carritos.
function actualizarCarrito() {
    listaCarrito.innerHTML = '';
    listaCarritoFlotante.innerHTML = '';
    let total = 0;
    let cantidadTotal = 0;

    for (let i = 0; i < carrito.length; i++) {
        const producto = carrito[i];
        listaCarrito.appendChild(crearProductoCarrito(producto, false));
        listaCarritoFlotante.appendChild(crearProductoCarrito(producto, true));
        total += producto.precio * producto.cantidad;
        cantidadTotal += producto.cantidad;
    }

    totalCarrito.textContent = mostrarPrecio(total);
    totalFlotante.textContent = mostrarPrecio(total);
    importeFlotante.textContent = mostrarPrecio(total);
    contadorCarrito.textContent = cantidadTotal;
    cantidadFlotante.textContent = cantidadTotal;

    const vacio = carrito.length === 0;
    document.getElementById('carrito-vacio').hidden = !vacio;
    document.getElementById('vacio-flotante').hidden = !vacio;
    document.getElementById('vaciar-carrito').disabled = vacio;
    document.getElementById('continuar-compra').disabled = vacio;
    document.getElementById('comprar-desde-flotante').disabled = vacio;

    mostrarPaso('carrito');
}

// Aquí cambio las cantidades de los productos o los elimino del carrito.
function cambiarCantidad(id, accion) {
    for (let i = 0; i < carrito.length; i++) {
        if (carrito[i].id === id) {
            if (accion === 'aumentar') {
                carrito[i].cantidad++;
            } else if (accion === 'disminuir' && carrito[i].cantidad > 1) {
                carrito[i].cantidad--;
            } else {
                carrito.splice(i, 1);
            }
            break;
        }
    }

    actualizarCarrito();
    mensajeCarrito.textContent = 'Carrito actualizado. Total: ' + totalCarrito.textContent;
}

// Aquí vacío el carrito cuando el usuario lo confirma.
document.getElementById('vaciar-carrito').addEventListener('click', function () {
    if (confirm('¿Seguro que quieres vaciar el carrito?')) {
        carrito = [];
        actualizarCarrito();
        mensajeCarrito.textContent = 'El carrito está vacío.';
    }
});

// Aquí muestro la parte del carrito, los datos o la confirmación del pedido.
function mostrarPaso(paso) {
    productosFlotantes.hidden = true;
    pieCarritoFlotante.hidden = true;
    compra.hidden = true;
    formularioCompra.hidden = true;
    revisionPedido.hidden = true;
    pedidoCompletado.hidden = true;

    if (paso === 'carrito') {
        productosFlotantes.hidden = false;
        pieCarritoFlotante.hidden = false;
        pasoCompra.textContent = 'Paso 1 de 3 - Productos';
    } else if (paso === 'datos') {
        compra.hidden = false;
        formularioCompra.hidden = false;
        pasoCompra.textContent = 'Paso 2 de 3 - Datos y pago';
    } else if (paso === 'revision') {
        compra.hidden = false;
        revisionPedido.hidden = false;
        pasoCompra.textContent = 'Paso 3 de 3 - Revisa tu pedido';
    } else if (paso === 'confirmacion') {
        compra.hidden = false;
        pedidoCompletado.hidden = false;
        pasoCompra.textContent = 'Pedido confirmado';
    }
}

// Aquí abro y cierro la ventana del carrito.
document.getElementById('abrir-carrito-flotante').addEventListener('click', function () {
    ventanaCarrito.showModal();
});

document.getElementById('cerrar-carrito-flotante').addEventListener('click', function () {
    ventanaCarrito.close();
});

document.getElementById('seguir-comprando').addEventListener('click', function () {
    ventanaCarrito.close();
});

// Aquí paso al formulario y muestro el código QR de Yape.
function iniciarCompra() {
    if (carrito.length === 0) {
        return;
    }
    if (!ventanaCarrito.open) {
        ventanaCarrito.showModal();
    }

    document.getElementById('panel-pago-qr').hidden = false;
    document.getElementById('imagen-pago-qr').src = 'imagenes/qr-yape.jpeg';
    mostrarPaso('datos');
}

document.getElementById('continuar-compra').addEventListener('click', iniciarCompra);
document.getElementById('comprar-desde-flotante').addEventListener('click', iniciarCompra);

// Aquí reviso los datos del cliente y preparo el resumen del pedido.
formularioCompra.addEventListener('submit', function (evento) {
    evento.preventDefault();

    const nombre = nombreCliente.value.trim();
    const telefono = telefonoCliente.value.trim();

    if (nombre.length < 2) {
        alert('Escribe tu nombre.');
        return;
    }
    if (telefono.length !== 9 || isNaN(Number(telefono))) {
        alert('Escribe un número de teléfono de 9 dígitos.');
        return;
    }
    if (carrito.length === 0) {
        return;
    }

    document.getElementById('resumen-cliente').textContent = 'Nombre: ' + nombre + ' - Teléfono: ' + telefono;
    document.getElementById('resumen-entrega').textContent = 'Entrega: Recojo en tienda';
    document.getElementById('resumen-pago').textContent = 'Método de pago: ' + metodoPago.value;
    document.getElementById('resumen-envio').textContent = 'Recojo en tienda, sin costo de envío.';

    const resumenProductos = document.getElementById('resumen-productos');
    resumenProductos.innerHTML = '';
    let total = 0;

    for (let i = 0; i < carrito.length; i++) {
        const producto = carrito[i];
        const subtotal = producto.precio * producto.cantidad;
        const linea = document.createElement('li');
        linea.textContent = producto.nombre + ' x ' + producto.cantidad + ' - ' + mostrarPrecio(subtotal);
        resumenProductos.appendChild(linea);
        total += subtotal;
    }

    document.getElementById('resumen-total').textContent = mostrarPrecio(total);
    mostrarPaso('revision');
});

// Aquí permito regresar para corregir los datos o revisar el carrito.
document.getElementById('editar-datos').addEventListener('click', function () {
    mostrarPaso('datos');
});

document.getElementById('cancelar-compra').addEventListener('click', function () {
    mostrarPaso('carrito');
});

// Aquí confirmo el pedido y preparo el mensaje que se enviará por WhatsApp.
document.getElementById('confirmar-pedido').addEventListener('click', function () {
    if (carrito.length === 0) {
        return;
    }

    let resumen = 'Nombre: ' + nombreCliente.value.trim() + '\n';
    resumen += 'Teléfono: ' + telefonoCliente.value.trim() + '\n\n';

    for (let i = 0; i < carrito.length; i++) {
        const producto = carrito[i];
        resumen += producto.nombre + ' x ' + producto.cantidad;
        resumen += ' - ' + mostrarPrecio(producto.precio * producto.cantidad) + '\n';
    }

    resumen += '\nTotal: ' + document.getElementById('resumen-total').textContent + '\n';
    resumen += 'Pago: Yape\n';
    resumen += 'Recojo en tienda';

    document.getElementById('comprobante-pedido').textContent = resumen;
    const mensaje = 'Hola NaturPet, quiero enviar el comprobante de mi pedido.\n\n' + resumen;
    document.getElementById('enviar-comprobante').href =
        'https://wa.me/51936745228?text=' + encodeURIComponent(mensaje);

    carrito = [];
    actualizarCarrito();
    formularioCompra.reset();
    mostrarPaso('confirmacion');
    mensajeCarrito.textContent = 'Pedido confirmado.';
});

// Aquí regreso a los productos después de terminar el pedido.
document.getElementById('finalizar-compra').addEventListener('click', function () {
    ventanaCarrito.close();
    mostrarPaso('carrito');
    document.getElementById('productos').scrollIntoView();
});

// Aquí preparo la página para que el carrito se vea desde el inicio.
document.getElementById('abrir-carrito-flotante').hidden = false;
actualizarCarrito();
