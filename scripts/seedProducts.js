require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const products = [
    {
        id: 1,
        name: 'Proteína Carnivor',
        category: 'proteinas',
        categoryLabel: 'Proteínas',
        description:
            'Carnivor 4 libras es un suplemento de proteína diseñado para deportistas y personas que buscan aumentar la masa muscular magra. Este producto contiene proteína hidrolizada de carne de res, lo que permite una rápida absorción y un uso eficiente por el organismo.',
        price: 210000,
        inStock: true,
        image:
            'https://resources.claroshop.com/medios-plazavip/publicidad/6317b6cc1da44_carnivor-protein-musclemeds-56-serv-no-aplica-para-ning-n-desc-ultimas-pzassuc-villada-526-pjpg.jpg',
    },
    {
        id: 2,
        name: 'Creatina Monohidratada platinum',
        category: 'creatinas',
        categoryLabel: 'Creatinas',
        description:
            'La creatina monohidratada Platinum 80 Servicios es un suplemento dietético que aporta 5 g de creatina monohidratada por porción, ideal para aumentar la fuerza y mejorar el rendimiento físico. Es 100% pura, sin aditivos ni rellenos, y se recomienda mezclarla con agua, jugo o batidos de proteína. Este producto es especialmente útil para atletas y personas que buscan optimizar su rendimiento en ejercicios de alta intensidad y corta duración. ',
        price: 150000,
        inStock: true,
        image:
            'https://fitplus.com.co/wp-content/uploads/2024/08/WhatsApp-Image-2024-08-30-at-4.38.10-PM.jpeg',
    },
    {
        id: 3,
        name: 'Pre-entreno C4',
        category: 'pre-entreno',
        categoryLabel: 'Pre-entrenos',
        description:
            'Este es un suplemento deportivo diseñado para tomarse antes de entrenar con el fin de maximizar la energía, la fuerza y la concentración. <br> Objetivo: Aumentar el rendimiento físico y retrasar la fatiga en ejercicios de alta intensidad.<br> Componentes clave: Contiene cafeína (para dar energía), beta-alanina (que pospone el cansancio muscular), creatina (para mayor fuerza) y óxido nítrico (para mejorar el flujo sanguíneo). <br> Uso: Se consume disuelto en agua entre 20 y 30 minutos antes de comenzar la actividad física, durante el entrenamiento.',
        price: 125000,
        inStock: true,
        image:
            'https://th.bing.com/th/id/OIP.CH5l1SuDhFWyCOmsLK0F0QHaHa?w=211&h=211&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
    },
    {
        id: 4,
        name: 'Multivitamínico platinum',
        category: 'vitaminas',
        categoryLabel: 'Vitaminas',
        description:
            'El Platinum Multivitamin es un suplemento dietario diseñado para apoyar una vida activa y saludable. <br> Contiene 20 vitaminas y minerales, incluyendo antioxidantes como C y E, así como 865 mg de aminoácidos por porción. <br> Este producto está formulado para proporcionar una ingesta completa de nutrientes esenciales, ideal para atletas y personas con un estilo de vida activo. Se recomienda tomar 3 tabletas diarias con un vaso de agua, preferiblemente después de una comida principal. <br> Es importante almacenarlo en su empaque original a temperatura inferior a 30°C y mantenerlo seco.',
        price: 90000,
        inStock: false,
        image:
            'https://th.bing.com/th/id/OIP.RifOon0hVA7ss7yOshLyUwHaHa?w=198&h=198&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
    },
    {
        id: 5,
        name: 'Carnivor Beef Aminos',
        category: 'aminoacidos',
        categoryLabel: 'aminoácidos',
        description:
            'Es un suplemento de aminoácidos ultra concentrado elaborado a base de aislado de proteína de carne de res de alta pureza. <br> A diferencia de los aminos convencionales derivados del suero de leche (lácteos), este producto está diseñado para promover el crecimiento muscular, la recuperación y el anabolismo utilizando las propiedades de la carne roja, pero libre de grasa, colesterol y calorías de más.',
        price: 135000,
        inStock: true,
        image:
            'https://th.bing.com/th/id/OIP.ypMZ7dZ-H3jk57HzI_k7UAHaHa?w=212&h=213&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
    },
];

async function seed() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        multipleStatements: true,
    });

    const schemaPath = path.join(__dirname, '..', 'sql', 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await connection.query(schemaSql);
    await connection.query(`USE ${process.env.DB_NAME}`);

    const insertQuery = `
    INSERT INTO products (id, name, category, category_label, description, price, in_stock, image)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      name = VALUES(name),
      category = VALUES(category),
      category_label = VALUES(category_label),
      description = VALUES(description),
      price = VALUES(price),
      in_stock = VALUES(in_stock),
      image = VALUES(image)
  `;

    for (const product of products) {
        await connection.execute(insertQuery, [
            product.id,
            product.name,
            product.category,
            product.categoryLabel,
            product.description,
            product.price,
            product.inStock,
            product.image,
        ]);
    }

    console.log(`${products.length} productos migrados a la base de datos "${process.env.DB_NAME}".`);
    await connection.end();
}

seed().catch((error) => {
    console.error('Error al migrar los productos:', error.message);
    process.exit(1);
});
