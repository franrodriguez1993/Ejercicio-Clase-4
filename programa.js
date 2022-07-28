const fs = require("fs");

class Contenedor {
  constructor(archive) {
    this.archive = archive;
  }

  async getAll() {
    try {
      const listObjs = await fs.promises.readFile(
        `./archivos/${this.archive}`,
        "utf-8",
        2
      );
      if (listObjs === "") {
        return console.log("La lista de productos está vacía");
      } else {
        const listParce = JSON.parse(listObjs);
        // console.log(listParce);
        return listParce;
      }
    } catch (err) {
      console.log(`Ocurrió el error: ${err}`);
    }
  }

  async save(object) {
    let listObjs = await this.getAll();
    let id;
    if (listObjs === undefined) {
      listObjs = [];
      id = 1;
    } else {
      id = listObjs.length + 1;
    }
    const newObject = { ...object, id: id };
    listObjs.push(newObject);

    try {
      await fs.promises.writeFile(
        `./archivos/${this.archive}`,
        JSON.stringify(listObjs, null, 2)
      );
      return console.log(`Se guardó el objeto con el id: ${id}`);
    } catch (err) {
      throw new Error("Error al guardar el objeto en el archivo.");
    }
  }
  async getById(id) {
    const listObjs = await this.getAll();
    let filterProduct = listObjs.filter((item) => item.id === id);
    if (filterProduct.length !== 0) {
      return console.log(filterProduct);
    } else {
      return console.log(`No se encontró el objeto con el id ${id}`);
    }
  }
  async deleteById(id) {
    const listObjs = await this.getAll();
    //Comprobamos que exista el producto en el archivo:
    const findObj = listObjs.filter((item) => item.id === id);
    if (findObj.length === 0) {
      console.log(`No existe el producto con el id ${id}`);
    } else {
      let filterProduct = listObjs.filter((item) => item.id !== id);
      try {
        await fs.promises.writeFile(
          `./archivos/${this.archive}`,
          JSON.stringify(filterProduct, null, 2)
        );
        return console.log(`Se eliminó el objeto con el id: ${id}`);
      } catch (err) {
        throw new Error("Error al eliminar el objeto en el archivo.");
      }
    }
  }
  async deleteAll() {
    let listObjs = await this.getAll();
    listObjs = [];
    try {
      await fs.promises.writeFile(
        `./archivos/${this.archive}`,
        JSON.stringify(listObjs, null, 2)
      );
      return console.log(`Se eliminaron todos los productos correctamente`);
    } catch (err) {
      throw new Error("Error al eliminar los productos");
    }
  }
}

const miFuncion = new Contenedor("productos.txt");
miFuncion.getAll();
miFuncion.save({
  title: "Regla",
  price: 120.67,
  thumbnail:
    "https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png",
});
miFuncion.getById(1);
miFuncion.deleteById(3);
miFuncion.deleteAll();
