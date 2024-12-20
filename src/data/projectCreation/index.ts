import React from 'react';
import {
  HelpCircle,
} from "lucide-react";

export const clasesActivo = [
  { id: 1, titulo: "Inversiones Sostenibles y Responsables", descripcion: "Descripción para esta clase", icono: HelpCircle },
  { id: 2, titulo: "Fondos y vehículos de inversión", descripcion: "Descripción para esta clase", icono: HelpCircle },
  { id: 3, titulo: "Seguros y reclamaciones", descripcion: "Descripción para esta clase", icono: HelpCircle },
  { id: 4, titulo: "Materias primas y metales preciosos", descripcion: "Descripción para esta clase", icono: HelpCircle },
  { id: 5, titulo: "Coleccionables y alternativas", descripcion: "Descripción para esta clase", icono: HelpCircle },
  { id: 6, titulo: "Bienes raíces", descripcion: "Descripción para esta clase", icono: HelpCircle },
  { id: 7, titulo: "Instrumentos de Deuda Pública", descripcion: "Descripción para esta clase", icono: HelpCircle },
  { id: 8, titulo: "Servicios financieros y pagos", descripcion: "Descripción para esta clase", icono: HelpCircle },
  { id: 9, titulo: "Infraestructura física", descripcion: "Descripción para esta clase", icono: HelpCircle },
  { id: 10, titulo: "Instrumentos de deuda privada", descripcion: "Descripción para esta clase", icono: HelpCircle },
  { id: 11, titulo: "Renta variable y acciones", descripcion: "Descripción para esta clase", icono: HelpCircle },
  { id: 12, titulo: "Agnóstico de activos", descripcion: "Descripción para esta clase", icono: HelpCircle },
];

export const subclasesPorClase = {
    "Inversiones Sostenibles y Responsables": ["Bonos verdes", "Bonos sociales", "Bonos sostenibles", "Fondos de inversión sostenible", "Infraestructura verde", "Inmuebles sostenibles", "Créditos de carbono"],
    "Fondos y vehículos de inversión": ["Fondos mutuos", "ETFs", "Fondos de cobertura", "Fondos de capital privado"],
    "Seguros y reclamaciones": ["Pólizas de seguro", "Reclamaciones de seguros", "Seguros paramétricos"],
    "Materias primas y metales preciosos": ["Oro", "Plata", "Petróleo", "Gas natural", "Agricultura", "Minerales"],
    "Coleccionables y alternativas": ["Arte", "Antigüedades", "Vinos", "Automóviles clásicos", "Joyería"],
    "Bienes raíces": ["Propiedades residenciales", "Propiedades comerciales", "Terrenos", "Infraestructura verde"],
    "Instrumentos de Deuda Pública": ["Opcion 1", "Opcion 2"],
    "Servicios financieros y pagos": ["Bonos del gobierno", "Letras del tesoro", "Bonos municipales"],
    "Infraestructura física": ["Carreteras", "Puentes", "Plantas de energía", "Redes de telecomunicaciones"],
    "Instrumentos de deuda privada": ["Bonos corporativos", "Préstamos corporativos", "Deuda mezzanine"],
    "Renta variable y acciones": ["Acciones ordinarias", "Acciones preferentes", "Participaciones en startups"],
    "Agnóstico de activos": ["Tokens de utilidad", "Tokens de seguridad", "Stablecoins"]
  };

 export const camposPorPaso: { [key in 1 | 2 | 3 | 4 | 5 | 6]: string[] } = {
    1: [
      'nombreProyecto',
      'imagenes',
      'descripcion',
      'emisor',
      'fechaCreacion',
      'pais',
      'ubicacion',
      'subclaseActivo',
      'ods'
    ],
    2: [
      'limiteMaximo',
      'limiteBlando',
      'asignadoPreventa',
      'asignadoVentaPublica',
      'inversionMinima',
      'inversionMaxima',
      'inversoresAceptados'
    ],
    3: [
      'prelanzamiento',
      'lanzamiento',
      'distribucionTokens',
      'finalizado',
      'nombreToken',
      'precioPrelanzamiento',
      'precioLanzamiento',
      'plataforma',
      'cadenaBloques',
      'opcionesPago',
      'derechosToken'
    ],
    4: [
      'estructuraInversion',
      'rendimientoDividendos',
      'periodoInversion',
      'tirBruta',
      'frecuenciaDistribucion'
    ],
    5: [
      'documentos',
      'razonesInvertir',
      'problemaResuelve',
      'impacto',
      'diferenciacion',
      'mercadoObjetivo',
      'modeloNegocio',
      'proyeccionesResumidas'
    ],
    6: [
      'sitioWeb',
      'redesSociales',
      'correoElectronico'
    ]
  };