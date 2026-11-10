export const categorias = [
    { id: "todo", label: "Todo" },
    { id: "hogar", label: "Hogar" },
    { id: "regalos", label: "Regalos" },
    { id: "surf", label: "Surf" },
    { id: "negocio", label: "Para tu negocio" },
];

// Para agregar o quitar un producto, edita solo este arreglo.
// `imagen: null` muestra el recuadro "Foto próximamente"; para reemplazarlo,
// pon la ruta de la foto (por ejemplo "/catalogo/porta-inciensos.webp").
const productos = [
    {
        nombre: "Lámparas espirales",
        categoria: "hogar",
        imagen: "/catalogo/lamparas.webp",
        alt: "Lámparas de mesa espirales impresas en 3D, en luz cálida, azul y blanca",
        descripcion:
            "Lámpara de mesa impresa en 3D, de forma espiral, en luz cálida, azul y blanca.",
    },
    {
        nombre: "Porta inciensos",
        categoria: "hogar",
        imagen: "/catalogo/porta-inciensos.webp",
        alt: "Porta inciensos impresos en 3D con forma de tabla de surf, en distintos diseños y colores, con varitas de incienso encendidas",
        descripcion: "Impresos en 3D, con el diseño y el color que elijas.",
    },
    {
        nombre: "Posavasos",
        categoria: "hogar",
        imagen: "/catalogo/posavasos.webp",
        alt: "Set de posavasos impresos en 3D con soporte, con diseños de sol y olas en varios colores",
        descripcion:
            "Set con soporte, con diseños de sol y olas en varios colores.",
    },
    {
        nombre: "Clickers corazón",
        categoria: "regalos",
        imagen: "/catalogo/clickers-corazon.webp",
        alt: "Clickers en forma de corazón con el nombre Lobitos en relieve y cadena",
        descripcion: "Con el nombre Lobitos en relieve y cadena.",
    },
    {
        nombre: "Clickers concha",
        categoria: "regalos",
        imagen: "/catalogo/clickers-concha.webp",
        alt: "Clickers en forma de concha de mar con cadena",
        descripcion: "En forma de concha, con cadena.",
    },
    {
        nombre: "Clickers cubo",
        categoria: "regalos",
        imagen: "/catalogo/clickers-cubo.webp",
        alt: "Clickers cuadrados con el logo en relieve y cadena",
        descripcion: "Cuadrado, con el logo en relieve y cadena.",
    },
    {
        nombre: "Llaveros personalizados",
        categoria: "negocio",
        imagen: "/catalogo/llaveros.webp",
        alt: "Llaveros personalizados con el logo, diseño o nombre de un negocio",
        descripcion: "Con el logo, el diseño o el nombre de tu negocio.",
    },
    {
        nombre: "Llaveros de surf",
        categoria: "surf",
        imagen: "/catalogo/llaveros-surf.webp",
        alt: "Llaveros de surf con forma de mini tablas y olas de colores",
        descripcion: "Mini tablas y olas de colores.",
    },
    {
        nombre: "Peines para cera",
        categoria: "surf",
        imagen: "/catalogo/peines.webp",
        alt: "Peines para sacar la cera de la tabla de surf, con diseño o marca personalizada",
        descripcion:
            "Para sacar la cera de la tabla, con tu diseño o tu marca.",
    },
    {
        nombre: "Trofeos y premios",
        categoria: "negocio",
        imagen: "/catalogo/trofeos.webp",
        alt: "Trofeos y premios impresos en 3D hechos a medida para campeonatos y eventos",
        descripcion: "A medida para campeonatos, eventos y escuelas.",
    },
];

export default productos;
