// Importamos la librería supertest la cual nos permite testear peticiones
const request = require('supertest');
//Importamos app, que contiene a express
const app = require('../../app.js');
const mongoose = require('mongoose')
const Product = require('../../models/products.model')

describe('Api de products', () => {

    beforeAll(async () => {
        //Para que funcionen los test hay que conectar primero con la base de datos, con mysql o cualquier otra bd pasaría lo mismo.
        await mongoose.connect('mongodb://127.0.0.1:27017/tienda_online');
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    describe('GET /api/products', () => {

        //El código que coloque aquí dentro se va a ejecutar antes de todas las pruebas.
        let response
        beforeAll(async () => {
            response = await request(app)
                .get('/api/products')
                .send();
        })


        it('Debería devolver status 200', () => {
            //A request le tenemos que pasar app, ya que necesita la aplicación de express, para ver si la petición es correcta.
            expect(response.statusCode).toBe(200);

        })

        it('Deberia devolver la respuesta en formato JSON', () => {

            //Dentro del expect pongo lo que yo quiero probar, y después en el .toBe el resultado de la prueba, sino queremos que el resultado sea igual, sino que lo contenga, pondríamos .toContain()
            expect(response.headers['content-type'])
                .toContain('application/json');
        })

        it('Debería devolver un array', () => {
            //.toBeInstanceOf detecta de que tipo es la respuesta a la petición.
            expect(response.body).toBeInstanceOf(Array);
        })
    });

    describe('POST /api/products', () => {
        let response;
        const newProduct = { name: 'Producto de prueba', description: 'Esto es para probar', price: 100, category: 'test', available: true, stock: 10, image: 'Url chacho' };

        beforeAll(async () => {
            response = await request(app)
                .post('/api/products')
                .send(newProduct); //Esto sería el body de la petición post, es decir, lo que le mando a la petición
        });

        afterAll(async () => {
            //No se borra hasta que pasen todas las pruebas.
            await Product.deleteMany({ category: 'test' });
        })

        it('Debería existir la URL en la aplicación', () => {
            expect(response.statusCode).toBe(200);

            /*             expect(response.headers['content-type']).toContain('application/json'); */
        });

        it('El producto devuelto debería tener _id', () => {
            //El valor que queremos comprobar es el body, que es el objeto que me devuelve el servidor como respuesta, con el ._id vemos si el body tiene id. Para comprobar esto lanzamos el método .toBeDefined();
            expect(response.body._id).toBeDefined();
        });

        it('El nombre del producto se ha insertado correctamente', () => {
            //El response.body devuelve el producto que se ha insertado, con el .name accedemos al nombre, y comprobamos si coincide con newProduct.name
            expect(response.body.name).toBe(newProduct.name);
        })
    });

    describe('PUT /api/products/PRODUCTID', () => {
        const newProduct = { name: 'Producto de prueba', description: 'Esto es para probar', price: 100, category: 'test', available: true, stock: 10, image: 'Url chacho' };

        let response;
        let productToEdit;
        beforeAll(async () => {
            productToEdit = await Product.create(newProduct); //Devuelve el nuevo producto creado

            //Lanzar la prueba, esto sería la peticion de peticiones.rest .
            response = await request(app)
                .put(`/api/products/${productToEdit._id}`)
                .send({ stock: 333, price: 99 }); //Esto es el req.body
        });

        afterAll(async () => {
            await Product.findByIdAndDelete(productToEdit._id); //Borra el producto

        });

        it('Debería exixtir la URL', () => {
            expect(response.statusCode).toBe(200);
            expect(response.headers['content-type']).toContain('application/json');
        });


        it('Los datos deberían cambiarse', () => {
            expect(response.body.stock).toBe(333);
            expect(response.body.price).toBe(99);

        })
    })

    describe('DELETE /api/products/PRODUCTID', () => {
        const newProduct = { name: 'Producto de prueba', description: 'Esto es para probar', price: 100, category: 'test', available: true, stock: 10, image: 'Url chacho' };

        let response
        let productoCreado
        beforeAll(async () => {
            productoCreado = Product.create(newProduct);

            response = await request(app)
                .delete(`/api/products/${productoCreado._id}`)
                .send()
        })

        afterAll(async () => {
            await Product.findByIdAndDelete(productoCreado._id);
        })

        it('Ver status y toa la pesca', () => {
            expect(response.statusCode).toBe(200);
            expect(response.headers['content-type']).toContain('application/json');
        });

        it('El producto debería borrarse de la BD', async () => {
            const borrado = await Product.findById(productoCreado._id); //Buscamos el producto, y si ha funcionado borrado debería ser null.
            expect(borrado).toBeNull(); //Cuando hacemos un delete esperamos un null
        })
    })
})