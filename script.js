/**
 * Prueba Desis
 * 
 * El siguiente archivo javascript contiene las funciones para controlar 
 * el renderizado y envío de datos del formulario de producto
 * 
 */

/**
 * Carga las bodegas disponibles desde la API y las renderiza en el select correspondiente
 * 
 * Respuesta: Llena el select de bodegas con las opciones obtenidas de la API
 */
async function cargarBodegas() {
  const selectBodega = document.querySelector("select[name='bodega']");
  
  try {
    // Realizar petición a la API
    const response = await fetch('api/bodegas.php');
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    const resultado = await response.json();
    
    if (resultado.success) {
      // Limpiar opciones existentes excepto la primera (vacía)
      selectBodega.innerHTML = '<option value="">-- Seleccionar Bodega --</option>';
      
      // Agregar opciones al select desde la respuesta de la API
      resultado.data.forEach(bodega => {
        const option = document.createElement("option");
        option.value = bodega.idbodega;
        option.textContent = bodega.nombre;
        selectBodega.appendChild(option);
      });
      
      console.log(`Cargadas ${resultado.total} bodegas desde la API`);
    } else {
      console.error('Error en la respuesta de la API:', resultado.message);
    }
    
  } catch (error) {
    console.error('Error al cargar bodegas:', error);
  }
}

/**
 * Carga las monedas disponibles desde la API y las renderiza en el select correspondiente
 * 
 * Respuesta: Llena el select de monedas con las opciones obtenidas de la API
 */
async function cargarMonedas() {
  const selectMoneda = document.querySelector("select[name='moneda']");
  
  try {
    // Realizar petición a la API
    const response = await fetch('api/monedas.php');
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    const resultado = await response.json();
    
    if (resultado.success) {
      // Limpiar opciones existentes excepto la primera (vacía)
      selectMoneda.innerHTML = '<option value="">-- Seleccionar Moneda --</option>';
      
      // Agregar opciones al select desde la respuesta de la API
      resultado.data.forEach(moneda => {
        const option = document.createElement("option");
        option.value = moneda.idmoneda;  // Usar el ID de la moneda como value
        option.textContent = `${moneda.codigo}`;  // Mostrar código
        selectMoneda.appendChild(option);
      });
      
      console.log(`Cargadas ${resultado.total} monedas desde la API`);
    } else {
      console.error('Error en la respuesta de la API:', resultado.message);
    }
    
  } catch (error) {
    console.error('Error al cargar monedas:', error);
  }
}

/**
 * Carga los materiales disponibles desde la API y los renderiza como checkboxes
 * 
 * Respuesta: Genera checkboxes dinámicos en el grupo de materiales con los datos de la API
 */
async function cargarMateriales() {
  const checkboxGroup = document.querySelector(".checkbox-group");
  
  try {
    // Realizar petición a la API
    const response = await fetch('api/materiales.php');
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    const resultado = await response.json();
    
    if (resultado.success) {
      // Limpiar checkboxes existentes
      checkboxGroup.innerHTML = '';
      
      // Agregar checkboxes desde la respuesta de la API
      resultado.data.forEach(material => {
        const label = document.createElement("label");
        const checkbox = document.createElement("input");
        
        checkbox.type = "checkbox";
        checkbox.name = "materiales";
        checkbox.value = material.idmaterial;  // Usar el ID del material como value
        
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(` ${material.nombre}`));
        
        checkboxGroup.appendChild(label);
      });
      
      console.log(`Cargados ${resultado.total} materiales desde la API`);
    } else {
      console.error('Error en la respuesta de la API:', resultado.message);
    }
    
  } catch (error) {
    console.error('Error al cargar materiales:', error);
  }
}

/**
 * Carga las sucursales correspondientes a una bodega específica desde la API
 * 
 * Entrada: bodegaId (string) - ID de la bodega seleccionada
 * Respuesta: Llena el select de sucursales con las opciones filtradas por bodega
 */
async function cargarSucursales(bodegaId) {
  const selectSucursal = document.querySelector("select[name='sucursal']");
  const selectBodega = document.querySelector("select[name='bodega']");
  
  // Limpiar opciones existentes excepto la primera (vacía)
  selectSucursal.innerHTML = '<option value="">-- Seleccionar Sucursal --</option>';
  
  // Si no hay bodega seleccionada, mantener el select vacío
  if (!bodegaId) {
    return;
  }
  
  // Obtener el nombre de la bodega seleccionada
  const bodegaSeleccionada = selectBodega.options[selectBodega.selectedIndex];
  const nombreBodega = bodegaSeleccionada ? bodegaSeleccionada.textContent : '';
  
  if (!nombreBodega || nombreBodega === '-- Seleccionar Bodega --') {
    return;
  }
  
  try {
    // Realizar petición a la API de sucursales
    const response = await fetch(`api/sucursales.php?bodega=${encodeURIComponent(nombreBodega)}`);
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    const resultado = await response.json();
    
    if (resultado.success) {
      // Agregar opciones al select desde la respuesta de la API
      resultado.data.forEach(sucursal => {
        const option = document.createElement("option");
        option.value = sucursal.idsucursal;  // Campo en minúsculas
        option.textContent = sucursal.nombre; // Campo en minúsculas
        selectSucursal.appendChild(option);
      });
      
      console.log(`Cargadas ${resultado.total} sucursales para la bodega "${nombreBodega}"`);
    } else {
      console.error('Error en la respuesta de la API de sucursales:', resultado.message);
    }
    
  } catch (error) {
    console.error('Error al cargar sucursales:', error);
  }
}

/**
 * Configura el evento change del select de bodega para cargar sucursales dinámicamente
 * 
 * Respuesta: Configura el listener del evento change para el select de bodegas
 */
function configurarEventoBodega() {
  const selectBodega = document.querySelector("select[name='bodega']");
  
  selectBodega.addEventListener("change", function() {
    const bodegaSeleccionada = this.value;
    cargarSucursales(bodegaSeleccionada);
  });
}

// Cargar datos cuando se carga la página
document.addEventListener("DOMContentLoaded", function() {
  cargarBodegas();
  cargarMonedas();
  cargarMateriales();
  configurarEventoBodega();
});

/**
 * Valida el código del producto según reglas de negocio
 * 
 * Entrada: codigo (string) - Código del producto a validar
 * Respuesta: boolean - true si es válido, false si no cumple las reglas
 */
function validarCodigo(codigo) {
  // 1. Validar que no esté vacío
  if (!codigo || codigo.trim() === "") {
    alert("El código del producto no puede estar en blanco.");
    return false;
  }
  
  // 2. Validar longitud (entre 5 y 15 caracteres)
  if (codigo.length < 5 || codigo.length > 15) {
    alert("El código del producto debe tener entre 5 y 15 caracteres.");
    return false;
  }
  
  // 3. Validar formato con regex: al menos una letra y un número, solo letras y números
  const regexFormato = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]+$/;
  if (!regexFormato.test(codigo)) {
    alert("El código del producto debe contener letras y números");
    return false;
  }
  
  return true;
}

/**
 * Valida el nombre del producto verificando que no esté vacío y tenga longitud adecuada
 * 
 * Entrada: nombre (string) - Nombre del producto a validar
 * Respuesta: boolean - true si es válido, false si no cumple las reglas
 */
function validarNombre(nombre) {
  // 1. Validar que no esté vacío
  if (!nombre || nombre.trim() === "") {
    alert("El nombre del producto no puede estar en blanco.");
    return false;
  }
  
  // 2. Validar longitud (entre 2 y 50 caracteres)
  const nombreTrimmed = nombre.trim();
  if (nombreTrimmed.length < 2 || nombreTrimmed.length > 50) {
    alert("El nombre del producto debe tener entre 2 y 50 caracteres.");
    return false;
  }
  
  return true;
}

/**
 * Valida el precio del producto verificando formato numérico y que sea positivo
 * 
 * Entrada: precio (string) - Precio del producto a validar
 * Respuesta: boolean - true si es válido, false si no cumple las reglas
 */
function validarPrecio(precio) {
  // 1. Validar que no esté vacío
  if (!precio || precio.trim() === "") {
    alert("El precio del producto no puede estar en blanco.");
    return false;
  }
  
  // 2. Validar formato con regex: número positivo con hasta dos decimales
  const regexPrecio = /^([1-9]\d*(\.\d{1,2})?|0\.\d{1,2})$/;
  if (!regexPrecio.test(precio.trim())) {
    alert("El precio del producto debe ser un número positivo con hasta dos decimales.");
    return false;
  }
  
  return true;
}

/**
 * Valida que se hayan seleccionado al menos dos materiales para el producto
 * 
 * Entrada: form (HTMLFormElement) - Formulario que contiene los checkboxes de materiales
 * Respuesta: boolean - true si se seleccionaron al menos 2 materiales, false en caso contrario
 */
function validarMateriales(form) {
  // Obtener todos los checkboxes de materiales seleccionados
  const materialesSeleccionados = form.querySelectorAll("input[name=materiales]:checked");
  
  // Validar que se seleccionen al menos dos materiales
  if (materialesSeleccionados.length < 2) {
    alert("Debe seleccionar al menos dos materiales para el producto.");
    return false;
  }
  
  return true;
}

/**
 * Valida que se haya seleccionado una bodega válida
 * 
 * Entrada: bodega (string) - Valor del select de bodega
 * Respuesta: boolean - true si se seleccionó una bodega, false si está vacío
 */
function validarBodega(bodega) {
  // Validar que se haya seleccionado una bodega (no esté vacío)
  if (!bodega || bodega.trim() === "") {
    alert("Debe seleccionar una bodega.");
    return false;
  }
  
  return true;
}

/**
 * Valida que se haya seleccionado una sucursal válida
 * 
 * Entrada: sucursal (string) - Valor del select de sucursal
 * Respuesta: boolean - true si se seleccionó una sucursal, false si está vacío
 */
function validarSucursal(sucursal) {
  // Validar que se haya seleccionado una sucursal (no esté vacío)
  if (!sucursal || sucursal.trim() === "") {
    alert("Debe seleccionar una sucursal para la bodega seleccionada.");
    return false;
  }
  
  return true;
}

/**
 * Valida que se haya seleccionado una moneda válida
 * 
 * Entrada: moneda (string) - Valor del select de moneda
 * Respuesta: boolean - true si se seleccionó una moneda, false si está vacío
 */
function validarMoneda(moneda) {
  // Validar que se haya seleccionado una moneda (no esté vacío)
  if (!moneda || moneda.trim() === "") {
    alert("Debe seleccionar una moneda para el producto.");
    return false;
  }
  
  return true;
}

/**
 * Valida la descripción del producto verificando que no esté vacía y tenga longitud adecuada
 * 
 * Entrada: descripcion (string) - Descripción del producto a validar
 * Respuesta: boolean - true si es válida, false si no cumple las reglas
 */
function validarDescripcion(descripcion) {
  // 1. Validar que no esté vacío
  if (!descripcion || descripcion.trim() === "") {
    alert("La descripción del producto no puede estar en blanco.");
    return false;
  }
  
  // 2. Validar longitud (entre 10 y 1000 caracteres)
  const descripcionFormateada = descripcion.trim();
  if (descripcionFormateada.length < 10 || descripcionFormateada.length > 1000) {
    alert("La descripción del producto debe tener entre 10 y 1000 caracteres.");
    return false;
  }
  
  return true;
}

document.getElementById("formulario-producto").addEventListener("submit", async e => {
  e.preventDefault();
  const form = e.target;
  
  // Validar código antes de enviar
  if (!validarCodigo(form.codigo.value)) {
    return; // Detener el envío si la validación falla
  }
  
  // Validar nombre antes de enviar
  if (!validarNombre(form.nombre.value)) {
    return; // Detener el envío si la validación falla
  }
  
  // Validar bodega antes de enviar
  if (!validarBodega(form.bodega.value)) {
    return; // Detener el envío si la validación falla
  }

  // Validar sucursal antes de enviar
  if (!validarSucursal(form.sucursal.value)) {
    return; // Detener el envío si la validación falla
  }

  // Validar moneda antes de enviar
  if (!validarMoneda(form.moneda.value)) {
    return; // Detener el envío si la validación falla
  }

  // Validar precio antes de enviar
  if (!validarPrecio(form.precio.value)) {
    return; // Detener el envío si la validación falla
  }
  
  // Validar materiales antes de enviar
  if (!validarMateriales(form)) {
    return; // Detener el envío si la validación falla
  }
  
  // Validar descripción antes de enviar
  if (!validarDescripcion(form.descripcion.value)) {
    return; // Detener el envío si la validación falla
  }
  
  const data = {
    codigo: form.codigo.value,
    nombre: form.nombre.value,
    bodega: form.bodega.value,
    sucursal: form.sucursal.value,
    moneda: form.moneda.value,
    precio: form.precio.value,
    materiales: Array.from(form.querySelectorAll("input[name=materiales]:checked")).map(c => c.value),
    descripcion: form.descripcion.value
  };
  
  const res = await fetch("api/guardar_producto.php", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify(data)
  });
  const json = await res.json();
  
  if (json.ok) {
    alert("Producto guardado!");
    form.reset(); // Limpiar el formulario
  } else {
    alert("Error: " + json.error);
  }
});