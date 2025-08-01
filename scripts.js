//----------------------------------------------------------------------------------------
//PROYECTO CON DOM:

let ropaDiv = document.getElementById("ropa")
// let verCatalogoBtn = document.getElementById("verCatalogo")
// let ocultarCatalogoBtn = document.getElementById("ocultarCatalogo")
let guardarRopaBtn = document.getElementById("guardarRopaBtn")
let inputBuscador = document.querySelector("#buscador")
let coincidencia = document.getElementById("coincidencia")
let selectOrden = document.getElementById("selectOrden")
let botonCarrito = document.getElementById("botonCarrito")
let modalBodyCarrito = document.getElementById("modal-bodyCarrito")
let precioTotal = document.getElementById("precioTotal")
let loaderTexto = document.getElementById("loaderTexto")
let loader = document.getElementById("loader")
let reloj = document.getElementById("reloj")
let botonFinalizarCompra = document.getElementById("botonFinalizarCompra")

//array carrito
let productosEnCarrito = []
if(localStorage.getItem("carrito")){
    //se pierde 
    // productosEnCarrito = JSON.parse(localStorage.getItem("carrito"))
    
    for(let ropa of JSON.parse(localStorage.getItem("carrito"))){
        //se captura cantidad del storage
        let cantStorage = ropa.cantidad
        //se instancia ropa para no perder la class y pasarle método --> por defecto new ropa me pone 1 en cantidad
        let ropaStorage = new Ropa(ropa.id, ropa.tipo, ropa.color,ropa.talle ,ropa.precio, ropa.imagen)
        //piso el atributo cantidad con la variable que me guarda la cant storage
        ropaStorage.cantidad = cantStorage
        productosEnCarrito.push(ropaStorage)
    }
    
}else{
    productosEnCarrito = []
    localStorage.setItem("carrito", productosEnCarrito)
}


//FUNCTIONS PROYECTO DOM
//imprimiendo los objetos en el DOM
function verCatalogo(array){
    //antes que se vuelva a imprimir, resear el div
    ropaDiv.innerHTML = ""

    for(let ropa of array){
    //código para imprimir el array
        //creamos un div padre de la card
        let nuevoRopaDiv = document.createElement("div")
        nuevoRopaDiv.className = "col-12 col-md-6 col-lg-4 my-3"
        nuevoRopaDiv.innerHTML = `
        <div id="${ropa.id}" class="card" style="width: 18rem;">
            <img class="card-img-top img-fluid" style="height: 200px;width: 100%;"src="${ropa.imagen}" alt="${ropa.tipo} de ${ropa.color}">
            <div class="card-body">
                <h4 class="card-title">${ropa.tipo}</h4>
                <p>Talle: ${ropa.talle}</p>
                <p>Color: ${ropa.color}</p>
                <p id="ultP" class="${ropa.precio <= 2300 && "ofertaRopa"}">Precio: ${ropa.precio}</p>
                <button id="agregarBtn${ropa.id}" class="btn btn-outline-success">Agregar al carrito</button>
            </div>
        </div> 
        `
        ropaDiv.appendChild(nuevoRopaDiv)
        let agregarBtn = document.getElementById(`agregarBtn${ropa.id}`)
        agregarBtn.onclick = ()=>{
            
            agregarAlCarrito(ropa)
        }
    }
}



function agregarAlCarrito(ropa){
    // console.log(ropa)
    console.log(`El producto ${ropa.color} de ${ropa.tipo} ha sido agregado al carrito y vale ${ropa.precio}`)
    //sumarlo a productosEnCarrito
    productosEnCarrito.push(ropa)
    //setearlo en storage
    localStorage.setItem("carrito", JSON.stringify(productosEnCarrito))
    console.log(productosEnCarrito)
    //evaluar si ya existe o no el producto
}

function cargarRopa(array){
    let inputTipo = document.getElementById("tipoInput")
    let inputColor = document.getElementById("colorInput")
    let inputPrecio = document.getElementById("precioInput")
    
    //hacerlo con la function constructora
    const nuevoRopa = new Ropa(array.length+1, inputTipo.value, inputColor.value,parseInt(inputPrecio.value), "ropaNuevo.jpg")
    console.log(nuevoRopa)
 
    //pushearlo o sumarlo al array
    array.push(nuevoRopa)
    //guardar en storage:
    localStorage.setItem("estanteria", JSON.stringify(array))
    verCatalogo(array)
    let formAgregarRopa = document.getElementById("formAgregarRopa")
   
    formAgregarRopa.reset()

    //agregado Toastify:
    Toastify({
        text: `La ropa ${nuevoRopa.color} de ${nuevoRopa.tipo} ha sido agregado al stock`,
        duration: 2500,
        gravity: "top",
        position: "right",
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
            color: "Black"
        }
}).showToast()
}


function buscarInfo(buscado, array){
    let busquedaArray = array.filter(
            (ropa) => ropa.tipo.toLowerCase().includes(buscado.toLowerCase()) || ropa.color.toLowerCase().includes(buscado.toLowerCase())
        )
    busquedaArray.length == 0 ? 
    (coincidencia.innerHTML = `<h3>No hay coincidencias con su búsqueda</h3>`, verCatalogo(busquedaArray)) 
    : (coincidencia.innerHTML = "", verCatalogo(busquedaArray))
}
function cargarProductosCarrito(array){
    modalBodyCarrito.innerHTML = ""
    //forEach para imprimir card
    array.forEach((productoCarrito)=>{
        
        modalBodyCarrito.innerHTML += `
        <div class="card border-primary mb-3" id ="productoCarrito${productoCarrito.id}" style="max-width: 340px;">
            <img class="card-img-top" height="200px" src="assets/${productoCarrito.imagen}" alt="${productoCarrito.color}">
            <div class="card-body">
                    <h4 class="card-title">${productoCarrito.color}</h4>
                
                    <p class="card-text">Precio unitario: $${productoCarrito.precio}</p> 
                    <p class="card-text">Total de unidades: ${productoCarrito.cantidad}</p> 
                    <p class="card-text">Sub Total: ${productoCarrito.precio * productoCarrito.cantidad}</p> 

                    <button class= "btn btn-success" id="botonSumarUnidad${productoCarrito.id}"><i class=""></i>+1</button>
                    <button class= "btn btn-danger" id="botonEliminarUnidad${productoCarrito.id}"><i class=""></i>-1</button> 

                    <button class= "btn btn-danger" id="botonEliminar${productoCarrito.id}"><i class="fas fa-trash-alt"></i></button>
            </div>    
        </div>
        `
        })
     //segundo forEach agregar functions  
     array.forEach((productoCarrito)=>{
        //function boton eliminar
        document.getElementById(`botonEliminar${productoCarrito.id}`).addEventListener("click", ()=>{
            
            //borrar del DOM
            let cardProducto = document.getElementById(`productoCarrito${productoCarrito.id}`)
            cardProducto.remove()
            //eliminar del array
            //busco prod a eliminar
            let productoEliminar = array.find(ropa => ropa.id == productoCarrito.id)
            console.log(productoEliminar)
            //busco el indice
            let posicion = array.indexOf(productoEliminar)
            console.log(posicion)
            //splice (posicion donde trabajar, cant de elementos a eliminar)
            array.splice(posicion, 1)
            console.log(array)
            //eliminar storage (volver a setear)
            localStorage.setItem("carrito", JSON.stringify(array))
            //recalcular total
            compraTotal(array)
        })

        //Sumar unidad
        document.getElementById(`botonSumarUnidad${productoCarrito.id}`).addEventListener("click", ()=>{
            
            productoCarrito.sumarUnidad()
            localStorage.setItem("carrito", JSON.stringify(array))
            cargarProductosCarrito(array)

        })

        //restar unidad
        document.getElementById(`botonEliminarUnidad${productoCarrito.id}`).addEventListener("click", ()=>{
            let cantidad = productoCarrito.restarUnidad()
            
            if(cantidad < 1){
                //borrar del DOM
            let cardProducto = document.getElementById(`productoCarrito${productoCarrito.id}`)
            cardProducto.remove()

           
            //busco el indice
            let posicion = array.indexOf(productoCarrito)
            
            //splice (posicion donde trabajar, cant de elementos a eliminar)
            array.splice(posicion, 1)
            //eliminar storage (volver a setear)
            localStorage.setItem("carrito", JSON.stringify(array))
            //recalcular total
            compraTotal(array)
            }else{
                localStorage.setItem("carrito", JSON.stringify(array))

            }
            cargarProductosCarrito(array)
        })
     })
    compraTotal(array)
}
function agregarAlCarrito(ropa){
    //evaluar si ya existe o no el producto
    let ropaAgregado = productosEnCarrito.find((elem)=> elem.id == ropa.id)
    if(ropaAgregado == undefined){
        console.log(`El producto ${ropa.color} de ${ropa.tipo} ha sido agregado al carrito y vale ${ropa.precio}`)
        //sumarlo a productosEnCarrito
        productosEnCarrito.push(ropa)
        //setearlo en storage
        localStorage.setItem("carrito", JSON.stringify(productosEnCarrito))
        //sweetalert para experiencia de usuario
        Swal.fire({
            title: 'Ha agregado un producto',
            text: `El ropa ${ropa.color} de ${ropa.tipo} ha sido agregado`,
            icon: "info",
            confirmButtonText: "Gracias!",
            confirmButtonColor: "green",
            //milisegundo por medida
            timer: 3000,
            //para img
            imageUrl: `assets/${ropa.imagen}`,
            imageHeight: 200 
        })

    }else{
        
        //el producto ya se encuentra
        console.log(`El producto ${ropa.color} de ${ropa.tipo} ya se encuentra en el carrito. Siga sumando desde display el carrito`)
        //OTRA OPCION: logica que acumule cantidad
        //que me avise que ya está en el carrito
        Swal.fire({
            text: `El ropa ${ropa.color} de ${ropa.tipo} ya existe en el carrito`,
            icon: "info",
            timer: 1500,
            showConfirmButton: false
        })
    }

}
function compraTotal(array){
    let total = array.reduce((acc, productoCarrito)=> acc + (productoCarrito.precio * productoCarrito.cantidad) ,0)
    //ternario para mostrar en el html
    total == 0 ?
    precioTotal.innerHTML = `No hay productos agregados` :
    precioTotal.innerHTML = `El total del carrito es <strong>${total}</strong>`
    return total
}
function finalizarComprar(array){
    Swal.fire({
        title: 'Está seguro de realizar la compra',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Sí, seguro',
        cancelButtonText: 'No, no quiero',
        confirmButtonColor: 'green',
        cancelButtonColor: 'red',
    }).then( (result)=> {
            if(result.isConfirmed){
                let totalFinalizar = compraTotal(array)
                Swal.fire({
                    title: 'Compra realizada',
                    icon: 'success',
                    confirmButtonColor: 'green',
                    text: `Muchas gracias por su compra ha adquirido nuestros productos. Por un total de ${totalFinalizar}`,
                    })
                //nivel array
                productosEnCarrito = []
                localStorage.removeItem("carrito")    
                
            }else{
                Swal.fire({
                    title: 'Compra no realizada',
                    icon: 'info',
                    text: `La compra no ha sido realizada! Atención sus productos siguen en el carrito :D`,
                    confirmButtonColor: 'green',
                    timer:3500
                })
            }
    })

}

//functions ordenar:
function ordenarMenorMayor(array){
    //copia array original, para no modificar estanteria
    const menorMayor = [].concat(array)
    menorMayor.sort((param1, param2)=> param1.precio - param2.precio)
    verCatalogo(menorMayor)
}

function ordenarMayorMenor(array){
    //array que recibe y lo copia
    const mayorMenor = [].concat(array)
    mayorMenor.sort((a,b)=> b.precio - a.precio)
    verCatalogo(mayorMenor)
    
}

function ordenarAlfabeticamenteColor(array){
        const ordenadoAlfabeticamente = [].concat(array)
        //ordenar algo que tiene un dato string
        //forma de la a-z ascendente
        ordenadoAlfabeticamente.sort((a, b) => {
            if (a.color > b.color) {
              return 1
            }
            if (a.color < b.color) {
              return -1
            }
            // a es igual b
            return 0
          })
          verCatalogo(ordenadoAlfabeticamente)
}


 //EVENTOS:
guardarRopaBtn.addEventListener("click", ()=>{
    cargarRopa(estanteria)

})


//por cada evento, averiguar su funcionamiento, luego pasarle function con instrucciones a realizar
inputBuscador.addEventListener("input", ()=>{
    buscarInfo(inputBuscador.value.toLowerCase(), estanteria)
})
//select para ordenar
selectOrden.addEventListener("change", ()=>{
    // console.log(selectOrden.value)
    if(selectOrden.value == "1"){
        ordenarMayorMenor(estanteria)
    }else if(selectOrden.value =="2"){
        ordenarMenorMayor(estanteria)
    }else if(selectOrden.value == "3"){
        ordenarAlfabeticamenteColor(estanteria)
    }else{
        verCatalogo(estanteria)
    }
})

botonCarrito.addEventListener("click", ()=>{
    cargarProductosCarrito(productosEnCarrito)
})
botonFinalizarCompra.addEventListener("click", ()=>{
    finalizarComprar(productosEnCarrito)
})

//CODIGO:
setTimeout(()=>{
    loaderTexto.innerText =""
    loader.remove()
    verCatalogo(estanteria)
},3000)