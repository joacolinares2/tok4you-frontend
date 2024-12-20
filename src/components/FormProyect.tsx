'use client'

import { useState, useEffect } from 'react'
import { useForm, FormProvider, useFormContext, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { subclasesPorClase, camposPorPaso } from "../data/projectCreation/index"
import DOMPurify from "dompurify";
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { sanitizeAndValidate } from "@/utils/sanitizeStringsBeforeSendingThemToTheBackend";
import { formatNumber } from "@/utils/formatNumber/formatNumber";
const backendEndpoint = import.meta.env.VITE_API_BASE_URL;
import { Plus } from "lucide-react";
import LoadingOverlay from "./Loading/LoadingOverlay";
import { toast } from "react-toastify";
import { isoAllCountriesInformation } from "@/utils/countries/countriesInformationAsIsoWith3NumericSlots.js";
const formSchema = z.object({
  nombreProyecto: z.string().min(1, "El nombre del proyecto es requerido"),
  documentos: z
    .array(
      z.object({
        file: z.instanceof(File),
        title: z.string().min(1, "El título es requerido."),
        description: z.string().min(1, "La descripción es requerida.")
      })
    )
    .refine((docs) => docs.length > 0, "Se requiere al menos un documento."),

  imagenes: z
    .array(
      z.object({
        file: z.instanceof(File),
        title: z.string().min(1, "El título es requerido."),
        description: z.string().min(1, "La descripción es requerida.")
      })
    )
    .refine((imgs) => imgs.length > 0, "Se requiere al menos una imagen."),
  /*   documentos: z.instanceof(FileList).optional(),
  imagenes: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, "Al menos una imagen es requerida"), */
  descripcion: z.string().min(1, "La descripción es requerida"),
  /*   emisor: z.string().min(1, "El emisor es requerido"), */
  fechaCreacion: z.string().min(1, "La fecha de creación es requerida"),
  pais: z.string().min(1, "El país es requerido"),
  ubicacion: z.string().min(1, "La ubicación es requerida"),
  claseActivo: z.string().min(1, "La clase de activo es requerida"),
  subclaseActivo: z.string().min(1, "La subclase de activo es requerida"),
  ods: z.record(z.boolean()).optional(),
  limiteMaximo: z.number().positive("El límite máximo debe ser positivo"),
  limiteBlando: z.number().positive("El límite blando debe ser positivo"),
  asignadoPreventa: z
    .number()
    .nonnegative("El valor asignado a preventa debe ser no negativo"),
  asignadoVentaPublica: z
    .number()
    .nonnegative("El valor asignado a venta pública debe ser no negativo"),
  inversionMinima: z.number().positive("La inversión mínima debe ser positiva"),
  inversionMaxima: z.number().positive("La inversión máxima debe ser positiva"),
  inversoresAceptados: z
    .record(z.boolean())
    .refine(
      (data) => Object.values(data).some(Boolean),
      "Al menos un tipo de inversor debe ser seleccionado"
    ),
  prelanzamiento: z.string().min(1, "La fecha de prelanzamiento es requerida"),
  lanzamiento: z.string().min(1, "La fecha de lanzamiento es requerida"),
  distribucionTokens: z
    .string()
    .min(1, "La fecha de distribución de tokens es requerida"),
  finalizado: z.string().min(1, "La fecha de finalización es requerida"),
  nombreToken: z.string().min(1, "El nombre del token es requerido"),
  precioPrelanzamiento: z
    .number()
    .positive("El precio de prelanzamiento debe ser positivo"),
  precioLanzamiento: z
    .number()
    .positive("El precio de lanzamiento debe ser positivo"),
  /*  plataforma: z.string().min(1, "La plataforma es requerida"), */
  /* cadenaBloques: z.string().min(1, "La cadena de bloques es requerida"), */
  derechosToken: z
    .array(z.string())
    .min(1, "Selecciona al menos un derecho del token"),
  estructuraInversion: z
    .string()
    .min(1, "La estructura de inversión es requerida"),
  rendimientoDividendos: z
    .number()
    .nonnegative("El rendimiento de dividendos debe ser no negativo"),
  maximoBalance: z
    .number()
    .nonnegative("El balance máximo por usuario debe ser no negativo")
    .max(20000, "El balance máximo por usuario no puede exceder 20,000"),
  paisesRestringidos: z
    .array(z.string()),
  periodoInversion: z.number().min(1, "El periodo de inversión es requerido"),
  unidadInversion: z.enum(["meses", "años"], {
    errorMap: () => ({ message: "La unidad de medida es requerida y debe ser 'meses' o 'años'." })
  }),
  tirBruta: z.number().nonnegative("La TIR Bruta debe ser no negativa"),
  frecuenciaDistribucion: z
    .string()
    .min(1, "La frecuencia de distribución es requerida"),
  razonesInvertir: z
    .string()
    .min(1, "Las razones para invertir son requeridas"),
  problemaResuelve: z.string().min(1, "El problema que resuelve es requerido"),
  impacto: z.string().min(1, "El impacto es requerido"),
  diferenciacion: z.string().min(1, "La diferenciación es requerida"),
  mercadoObjetivo: z.string().min(1, "El mercado objetivo es requerido"),
  modeloNegocio: z.string().min(1, "El modelo de negocio es requerido"),
  proyeccionesResumidas: z
    .string()
    .min(1, "Las proyecciones resumidas son requeridas"),
  preguntasAdicionales: z
    .array(
      z.object({
        pregunta: z.string().min(1, "La pregunta es requerida."),
        descripcion: z.string().min(1, "La descripción es requerida."),
      })
    )
    .optional(),

  sitioWeb: z.string().min(1, "El sitio web es requerido"),
  redesSociales: z.object({
    facebook: z.string().url("Debe ser un enlace válido").min(1, "El enlace de Facebook es requerido"),
    twitter: z.string().url("Debe ser un enlace válido").min(1, "El enlace de Twitter es requerido"),
    linkedin: z.string().url("Debe ser un enlace válido").min(1, "El enlace de LinkedIn es requerido"),
  }),
  correoElectronico: z.string().email("Debe ser un correo electrónico válido"),
});

type FormData = z.infer<typeof formSchema>;

const Paso1 = () => {
  const {
    register,
    watch,
    formState: { errors },
    setValue,
  } = useFormContext();
  const [images, setImages] = useState<{ file: File; title: string; description: string }[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map((file) => ({
        file,
        title: "",
        description: ""
      }));
      if (images.length + newImages.length > 10) {
        alert("Puedes subir hasta 10 imágenes.");
        return;
      }
      setImages((prevImages) => [...prevImages, ...newImages]);
      setValue("imagenes", [...images, ...newImages]); // Actualiza el formulario
    }
  };

  // Obtener subclases basadas en la clase seleccionada
  const claseActivoSeleccionada = watch(
    "claseActivo"
  ) as keyof typeof subclasesPorClase;
  const subclasesDisponibles = subclasesPorClase[claseActivoSeleccionada] || [];

  return (
    <div className="space-y-4 h-full max-h-[600px] overflow-y-auto">
      <div>
        <Label htmlFor="nombreProyecto">Nombre del Proyecto</Label>
        <Input id="nombreProyecto" {...register("nombreProyecto")} />
        {errors.nombreProyecto && (
          <p className="text-red-500">{errors.nombreProyecto.message}</p>
        )}
      </div>

      <div className="space-y-4">
        <Label htmlFor="imagenes">Imágenes: </Label>
        <input
          id="imagenes"
          type="file"
          multiple
          onChange={handleImageChange}
          className="mb-2"
          disabled={images.length >= 10}
        />

        {images.map((img, index) => (
          <div key={index} className="flex flex-col bg-gray-100 rounded-md p-4 mt-4">
            <p className="font-semibold">{img.file.name}</p>
            <input
              type="text"
              placeholder="Título de la imagen"
              value={img.title}
              onChange={(e) => {
                const updatedImages = [...images];
                updatedImages[index].title = e.target.value;
                setImages(updatedImages);
                setValue("imagenes", updatedImages); // Actualiza el estado del formulario
              }}
              className="border border-gray-300 rounded p-2 my-2"
            />
            {errors.imagenes?.[index]?.title && (
              <p className="text-red-500">{errors.imagenes[index].title.message}</p>
            )}

            <textarea
              placeholder="Descripción de la imagen"
              value={img.description}
              onChange={(e) => {
                const updatedImages = [...images];
                updatedImages[index].description = e.target.value;
                setImages(updatedImages);
                setValue("imagenes", updatedImages); // Actualiza el estado del formulario
              }}
              className="border border-gray-300 rounded p-2 my-2"
            />
            {errors.imagenes?.[index]?.description && (
              <p className="text-red-500">{errors.imagenes[index].description.message}</p>
            )}
          </div>
        ))}

        {errors.imagenes && typeof errors.imagenes === 'string' && (
          <p className="text-red-500">{errors.imagenes}</p>
        )}
      </div>



      <div>
        <Label htmlFor="descripcion">Descripción</Label>
        <Textarea id="descripcion" {...register("descripcion")} />
        {errors.descripcion && (
          <p className="text-red-500">{errors.descripcion.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="emisor">Emisor</Label>
        <p>Tok4You</p>
        {/* <Input id="emisor" defaultValue="Tokenus" {...register("emisor")} /> */}
        {errors.emisor && (
          <p className="text-red-500">{errors.emisor.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="fechaCreacion">Fecha de Creación</Label>
        <Input id="fechaCreacion" type="date" {...register("fechaCreacion")} />
        {errors.fechaCreacion && (
          <p className="text-red-500">{errors.fechaCreacion.message}</p>
        )}
      </div>

      <div>
        {" "}
        {/* TODO: Cambiar por input de tipo select con los paises	habilitados para operar */}
        <Label htmlFor="pais">País</Label>
        <Input
          id="pais"
          placeholder="País"
          defaultValue=""
          {...register("pais")}
        />
        {errors.pais && <p className="text-red-500">{errors.pais.message}</p>}
      </div>

      <div>
        <Label htmlFor="ubicacion">{"Ubicación (dirección)"}</Label>
        <Input id="ubicacion" {...register("ubicacion")} />
        {errors.ubicacion && (
          <p className="text-red-500">{errors.ubicacion.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="subclaseActivo">Subclase de activo</Label>
        <Select onValueChange={(value) => setValue("subclaseActivo", value)}>
          <SelectTrigger id="subclaseActivo">
            <SelectValue placeholder="Seleccione subclase de activo" />
          </SelectTrigger>
          <SelectContent>
            {subclasesDisponibles.map((subclase: string) => (
              <SelectItem key={subclase} value={subclase}>
                {subclase}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.subclaseActivo && (
          <p className="text-red-500">{errors.subclaseActivo.message}</p>
        )}
      </div>

      {/* Mostrar ODS solo si la clase de activo es "Inversiones Sostenibles y Responsables" */}
      {watch("claseActivo") === "Inversiones Sostenibles y Responsables" && (
        <div>
          <Label>Elegir uno o más Objetivos de Desarrollo Sostenible</Label>
          <div className="flex flex-col">
            {/* Fin de la pobreza */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="ods1"
                checked={!!watch("ods.ods1")}
                onCheckedChange={(checked) => setValue("ods.ods1", checked)}
              />
              <Label htmlFor="ods1">Fin de la pobreza</Label>
            </div>
            {/* Hambre cero */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="ods2"
                checked={!!watch("ods.ods2")}
                onCheckedChange={(checked) => setValue("ods.ods2", checked)}
              />
              <Label htmlFor="ods2">Hambre cero</Label>
            </div>
            {/* Salud y bienestar */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="ods3"
                checked={!!watch("ods.ods3")}
                onCheckedChange={(checked) => setValue("ods.ods3", checked)}
              />
              <Label htmlFor="ods3">Salud y bienestar</Label>
            </div>
            {/* Educación de calidad */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="ods4"
                checked={!!watch("ods.ods4")}
                onCheckedChange={(checked) => setValue("ods.ods4", checked)}
              />
              <Label htmlFor="ods4">Educación de calidad</Label>
            </div>
            {/* Igualdad de género */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="ods5"
                checked={!!watch("ods.ods5")}
                onCheckedChange={(checked) => setValue("ods.ods5", checked)}
              />
              <Label htmlFor="ods5">Igualdad de género</Label>
            </div>
            {/* Agua limpia y saneamiento */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="ods6"
                checked={!!watch("ods.ods6")}
                onCheckedChange={(checked) => setValue("ods.ods6", checked)}
              />
              <Label htmlFor="ods6">Agua limpia y saneamiento</Label>
            </div>
            {/* Energía asequible y no contaminante */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="ods7"
                checked={!!watch("ods.ods7")}
                onCheckedChange={(checked) => setValue("ods.ods7", checked)}
              />
              <Label htmlFor="ods7">Energía asequible y no contaminante</Label>
            </div>
            {/* Trabajo decente y crecimiento económico */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="ods8"
                checked={!!watch("ods.ods8")}
                onCheckedChange={(checked) => setValue("ods.ods8", checked)}
              />
              <Label htmlFor="ods8">
                Trabajo decente y crecimiento económico
              </Label>
            </div>
            {/* Industria, innovación e infraestructura */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="ods9"
                checked={!!watch("ods.ods9")}
                onCheckedChange={(checked) => setValue("ods.ods9", checked)}
              />
              <Label htmlFor="ods9">
                Industria, innovación e infraestructura
              </Label>
            </div>
            {/* Reducción de las desigualdades */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="ods10"
                checked={!!watch("ods.ods10")}
                onCheckedChange={(checked) => setValue("ods.ods10", checked)}
              />
              <Label htmlFor="ods10">Reducción de las desigualdades</Label>
            </div>
            {/* Ciudades y comunidades sostenibles */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="ods11"
                checked={!!watch("ods.ods11")}
                onCheckedChange={(checked) => setValue("ods.ods11", checked)}
              />
              <Label htmlFor="ods11">Ciudades y comunidades sostenibles</Label>
            </div>
            {/* Producción y consumo responsables */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="ods12"
                checked={!!watch("ods.ods12")}
                onCheckedChange={(checked) => setValue("ods.ods12", checked)}
              />
              <Label htmlFor="ods12">Producción y consumo responsables</Label>
            </div>
            {/* Acción por el clima */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="ods13"
                checked={!!watch("ods.ods13")}
                onCheckedChange={(checked) => setValue("ods.ods13", checked)}
              />
              <Label htmlFor="ods13">Acción por el clima</Label>
            </div>
            {/* Vida submarina */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="ods14"
                checked={!!watch("ods.ods14")}
                onCheckedChange={(checked) => setValue("ods.ods14", checked)}
              />
              <Label htmlFor="ods14">Vida submarina</Label>
            </div>
            {/* Vida de ecosistemas terrestres */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="ods15"
                checked={!!watch("ods.ods15")}
                onCheckedChange={(checked) => setValue("ods.ods15", checked)}
              />
              <Label htmlFor="ods15">Vida de ecosistemas terrestres</Label>
            </div>
            {/* Paz, justicia e instituciones sólidas */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="ods16"
                checked={!!watch("ods.ods16")}
                onCheckedChange={(checked) => setValue("ods.ods16", checked)}
              />
              <Label htmlFor="ods16">
                Paz, justicia e instituciones sólidas
              </Label>
            </div>
            {/* Alianzas para lograr los objetivos */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="ods17"
                checked={!!watch("ods.ods17")}
                onCheckedChange={(checked) => setValue("ods.ods17", checked)}
              />
              <Label htmlFor="ods17">Alianzas para lograr los objetivos</Label>
            </div>

            {errors.ods && <p className="text-red-500">{errors.ods.message}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

const Paso2 = () => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-4 h-full max-h-[600px] overflow-y-auto">
      <div>
        <Label htmlFor="limiteMaximo">Límite máximo ($TOKEN)</Label>
        <Input
          id="limiteMaximo"
          type="number"
          step="0.01"
          {...register("limiteMaximo", {
            valueAsNumber: true,
            required: "Límite máximo es requerido.",
          })}
        />
        {errors.limiteMaximo && (
          <p className="text-red-500">{errors.limiteMaximo.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="limiteBlando">Límite blando ($TOKEN)</Label>
        <Input
          id="limiteBlando"
          type="number"
          step="0.01"
          {...register("limiteBlando", {
            valueAsNumber: true,
            required: "Límite blando es requerido.",
          })}
        />
        {errors.limiteBlando && (
          <p className="text-red-500">{errors.limiteBlando.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="asignadoPreventa">Asignado a preventa ($TOKEN)</Label>
        <Input
          id="asignadoPreventa"
          type="number"
          step="0.01"
          {...register("asignadoPreventa", {
            valueAsNumber: true,
            required: "Asignado a preventa es requerido.",
          })}
        />
        {errors.asignadoPreventa && (
          <p className="text-red-500">{errors.asignadoPreventa.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="asignadoVentaPublica">
          Asignado a venta pública ($TOKEN)
        </Label>
        <Input
          id="asignadoVentaPublica"
          type="number"
          step="0.01"
          {...register("asignadoVentaPublica", {
            valueAsNumber: true,
            required: "Asignado a venta pública es requerido.",
          })}
        />
        {errors.asignadoVentaPublica && (
          <p className="text-red-500">{errors.asignadoVentaPublica.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="inversionMinima">Inversión mínima ($)</Label>
        <Input
          id="inversionMinima"
          type="number"
          step="0.01"
          {...register("inversionMinima", {
            valueAsNumber: true,
            required: "Inversión mínima es requerida.",
          })}
        />
        {errors.inversionMinima && (
          <p className="text-red-500">{errors.inversionMinima.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="inversionMaxima">Inversión máxima ($)</Label>
        <Input
          id="inversionMaxima"
          type="number"
          step="0.01"
          {...register("inversionMaxima", {
            valueAsNumber: true,
            required: "Inversión máxima es requerida.",
          })}
        />
        {errors.inversionMaxima && (
          <p className="text-red-500">{errors.inversionMaxima.message}</p>
        )}
      </div>

      <div>
        <Label>Inversores aceptados ($)</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="inversorInstitucional"
              checked={!!watch("inversoresAceptados.institucional")} // Convertir valor a booleano
              onCheckedChange={(checked) =>
                setValue("inversoresAceptados.institucional", checked)
              } // Actualizar valor como booleano
            />
            <Label htmlFor="inversorInstitucional">Institucional</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="inversorCalificado"
              checked={!!watch("inversoresAceptados.calificado")}
              onCheckedChange={(checked) =>
                setValue("inversoresAceptados.calificado", checked)
              }
            />
            <Label htmlFor="inversorCalificado">Calificado</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="inversorMinorista"
              checked={!!watch("inversoresAceptados.minorista")}
              onCheckedChange={(checked) =>
                setValue("inversoresAceptados.minorista", checked)
              }
            />
            <Label htmlFor="inversorMinorista">Minorista</Label>
          </div>

          {errors.inversoresAceptados && (
            <p className="text-red-500">{errors.inversoresAceptados.message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

const Paso3 = () => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-4 h-full max-h-[600px]  overflow-y-auto">
      <div>
        <Label htmlFor="prelanzamiento">Prelanzamiento</Label>
        <Input
          id="prelanzamiento"
          type="date"
          {...register("prelanzamiento", {
            required: "Fecha de prelanzamiento es requerida.",
          })}
        />
        {errors.prelanzamiento && (
          <p className="text-red-500">{errors.prelanzamiento.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="lanzamiento">Lanzamiento</Label>
        <Input
          id="lanzamiento"
          type="date"
          {...register("lanzamiento", {
            required: "Fecha de lanzamiento es requerida.",
          })}
        />
        {errors.lanzamiento && (
          <p className="text-red-500">{errors.lanzamiento.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="distribucionTokens">Fecha de reclamo de tokens</Label>
        <Input
          id="distribucionTokens"
          type="date"
          {...register("distribucionTokens", {
            required: "Fecha de distribución de tokens es requerida.",
          })}
        />
        {errors.distribucionTokens && (
          <p className="text-red-500">{errors.distribucionTokens.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="finalizado">Finalizado</Label>
        <Input
          id="finalizado"
          type="date"
          {...register("finalizado", {
            required: "Fecha de finalización es requerida.",
          })}
        />
        {errors.finalizado && (
          <p className="text-red-500">{errors.finalizado.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="nombreToken">Nombre del Token</Label>
        <Input
          id="nombreToken"
          {...register("nombreToken", {
            required: "Nombre del token es requerido.",
          })}
        />
        {errors.nombreToken && (
          <p className="text-red-500">{errors.nombreToken.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="precioPrelanzamiento">Precio prelanzamiento ($)</Label>
        <Input
          id="precioPrelanzamiento"
          type="number"
          step="0.01"
          {...register("precioPrelanzamiento", {
            valueAsNumber: true,
            required: "Precio de prelanzamiento es requerido.",
          })}
        />
        {errors.precioPrelanzamiento && (
          <p className="text-red-500">{errors.precioPrelanzamiento.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="precioLanzamiento">Precio lanzamiento ($)</Label>
        <Input
          id="precioLanzamiento"
          type="number"
          step="0.01"
          {...register("precioLanzamiento", {
            valueAsNumber: true,
            required: "Precio de lanzamiento es requerido.",
          })}
        />
        {errors.precioLanzamiento && (
          <p className="text-red-500">{errors.precioLanzamiento.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="plataforma">Plataforma</Label>
        <p>Tok4You</p>
        {/* <Input
          id="plataforma"
          defaultValue="Tokenus"
          {...register("plataforma", { required: "Plataforma es requerida." })}
        /> */}
        {errors.plataforma && (
          <p className="text-red-500">{errors.plataforma.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="cadenaBloques">Cadena de bloques</Label>
        <p>Polygon</p>
        {/* <Select onValueChange={(value) => setValue("cadenaBloques", value)}>
          <SelectTrigger id="cadenaBloques">
            <SelectValue placeholder="Seleccione cadena de bloques" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="polygon">Polygon</SelectItem>
          </SelectContent>
        </Select> */}
        {errors.cadenaBloques && (
          <p className="text-red-500">{errors.cadenaBloques.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="derechosToken">Derechos del token</Label>
        <div className="flex flex-col space-y-2">
          {[
            { label: "Derechos de Propiedad", value: "propiedad" },
            { label: "Derechos de Ingresos", value: "ingresos" },
            { label: "Derechos de Voto", value: "voto" },
            { label: "Derechos de Uso", value: "uso" },
            { label: "Derechos de Garantía", value: "garantia" },
            {
              label: "Derechos de Participación en Plusvalía",
              value: "plusvalia",
            },
            { label: "Derechos de Acceso", value: "acceso" },
          ].map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <input
                id={option.value}
                type="checkbox"
                value={option.value}
                {...register("derechosToken", {
                  required: "Selecciona al menos un derecho del token",
                })}
              />
              <label htmlFor={option.value} className="text-gray-700">
                {option.label}
              </label>
            </div>
          ))}
        </div>
        {errors.derechosToken && (
          <p className="text-red-500">{errors.derechosToken.message}</p>
        )}
      </div>
    </div>
  );
};
const Paso4 = () => {
  const {
    register,
    setValue,
    formState: { errors },
    trigger,
    watch,
  } = useFormContext();
  const [editorContent, setEditorContent] = useState("");
  const [rendimientoDividendos, setRendimientoDividendos] = useState(0);
  const [tirBruta, setTirBruta] = useState(0);
  const [maximoBalance, setMaximoBalance] = useState(0);
  const [paisesRestringidos, setPaisesRestringidos] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "video"],
      ["clean"],
    ],
  };
  useEffect(() => {
    setValue("rendimientoDividendos", rendimientoDividendos);
  }, [rendimientoDividendos, setValue]);

  useEffect(() => {
    setValue("tirBruta", tirBruta);
  }, [tirBruta, setValue]);

  useEffect(() => {
    setValue("maximoBalance", maximoBalance);
  }, [maximoBalance, setValue]);

  useEffect(() => {
    setValue("paisesRestringidos", paisesRestringidos);
  }, [paisesRestringidos, setValue]);

  const handleEditorChange = (content: string) => {
    setEditorContent(content);
    setValue("estructuraInversion", content || ""); // Asegúrate de que siempre se actualiza
  };

  const validarYSanitizar = () => {
    // Verifica que se haya ingresado contenido en el editor
    if (!editorContent.trim()) {
      alert("Debes ingresar contenido en la estructura de inversión.");
      return false; // Si no hay contenido, no avancemos
    }

    // Sanitizar el contenido usando DOMPurify
    const sanitizedContent = DOMPurify.sanitize(editorContent);
    setValue("estructuraInversion", sanitizedContent); // Establece el contenido sanitizado
    return true; // Si todo es válido, regresamos true
  };

  const paisesRestringidosWatch = watch("paisesRestringidos");

  const filteredCountries = isoAllCountriesInformation.filter((country: { englishShortName: string }) =>
    country.englishShortName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectChange = (selectedNumeric: string) => {
    
    setPaisesRestringidos((prevState) =>
      prevState.includes(selectedNumeric)
        ? prevState
        : [...prevState, selectedNumeric]
    );
    console.log(paisesRestringidos);
  };
  return (
    <div className="space-y-4 h-full max-h-[600px] overflow-y-auto">
      <div>
        <Label htmlFor="estructuraInversion">Estructura de inversión</Label>
        <ReactQuill
          value={editorContent}
          onChange={handleEditorChange}
          modules={modules} // Aplicar módulos personalizados
          placeholder="Describe la estructura de inversión..."
        />
        {errors.estructuraInversion && (
          <p className="text-red-500">{errors.estructuraInversion.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="rendimientoDividendos">
          Rendimiento de dividendos (%)
        </Label>
        <div className="items-center">
          <Input
            id="rendimientoDividendos"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={rendimientoDividendos}
            onChange={(e) => setRendimientoDividendos(Number(e.target.value))}
            {...register("rendimientoDividendos", {
              valueAsNumber: true,
              required: "Rendimiento de dividendos es requerido.",
            })}
          />
          <input
            type="range"
            min="0"
            max="100"
            step="0.01"
            value={rendimientoDividendos}
            onChange={(e) => setRendimientoDividendos(Number(e.target.value))}
            className="w-full"
          />
        </div>
        {errors.rendimientoDividendos && (
          <p className="text-red-500">{errors.rendimientoDividendos.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="maximoBalance">Balance máximo por usuario</Label>
        <div className="items-center">
          <Input
            id="maximoBalance"
            type="text"
            step="1"
            min="0"
            max="20000"
            placeholder="0"
            value={maximoBalance}
            onChange={(e) => setMaximoBalance(Number(e.target.value))}
            {...register("maximoBalance", {
              valueAsNumber: true,
              required: "El balance máximo es requerido.",
              min: { value: 0, message: "El balance no puede ser negativo." },
              max: { value: 20000, message: "El balance no puede exceder 20,000." },
            })}
          />
          <input
            type="range"
            min="0"
            max="20000"
            step="1"
            value={maximoBalance}
            onChange={(e) => setMaximoBalance(Number(e.target.value))}
            className="w-full"
          />
        </div>
        {errors.maximoBalance && (
          <p className="text-red-500">{errors.maximoBalance.message}</p>
        )}
      </div>
      <div className="space-y-4 h-full max-h-[600px] overflow-y-auto">
        <div>
          <Label htmlFor="paisesRestringidos">Paises Restringidos</Label>

          <Select onValueChange={handleSelectChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un país" />
            </SelectTrigger>
            <SelectContent>
              <div className="p-2">
                <input
                  type="text"
                  placeholder="Buscar país..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md mb-2"
                />
                {filteredCountries.map((country: { numeric: string; englishShortName: string }) => (
                  <SelectItem key={country.numeric} value={country.numeric}>
                    {country.englishShortName}
                  </SelectItem>
                ))}
              </div>
            </SelectContent>
          </Select>

          {Array.isArray(paisesRestringidosWatch) && paisesRestringidosWatch.length > 0 && (
            <div className="mt-2">
              <h3 className="text-sm font-medium">Paises seleccionados:</h3>
              <ul className="list-disc pl-5">
                {paisesRestringidosWatch.map((numeric: string) => {
                  const country = isoAllCountriesInformation.find(
                    (c: { numeric: string }) => c.numeric === numeric
                  );
                  return <li key={numeric}>{country?.englishShortName}</li>;
                })}
              </ul>
            </div>
          )}

          {errors.paisesRestringidos && (
            <p className="text-red-500">{errors.paisesRestringidos.message}</p>
          )}
        </div>
      </div>
      <div>
        <Label htmlFor="periodoInversion">Periodo de inversión</Label>
        <Input
          id="periodoInversion"
          type="number"
          {...register("periodoInversion", {
            valueAsNumber: true,
            required: "Precio de lanzamiento es requerido.",
          })}
        />
        {errors.periodoInversion && (
          <p className="text-red-500">{errors.periodoInversion.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="unidadInversion">Unidad de tiempo: </Label>
        <select
          id="unidadInversion"
          {...register("unidadInversion", {
            required: "La unidad de medida es requerida.",
          })}
          className="border border-gray-300 rounded p-2"
        >
          <option value="meses">Meses</option>
          <option value="años">Años</option>
        </select>
        {errors.unidadInversion && (
          <p className="text-red-500">{errors.unidadInversion.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="tirBruta">TIR Bruta (%)</Label>
        <div className="items-center">
          <Input
            id="tirBruta"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={tirBruta}
            onChange={(e) => setTirBruta(Number(e.target.value))}
            {...register("tirBruta", {
              valueAsNumber: true,
              required: "TIR Bruta es requerida.",
            })}
          />
          <input
            type="range"
            min="0"
            max="100"
            step="0.01"
            value={tirBruta}
            onChange={(e) => setTirBruta(Number(e.target.value))}
            className="w-full"
          />
        </div>
        {errors.tirBruta && (
          <p className="text-red-500">{errors.tirBruta.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="frecuenciaDistribucion">
          Frecuencia de distribución
        </Label>
        <Select
          onValueChange={(value) => setValue("frecuenciaDistribucion", value)}
        >
          <SelectTrigger id="frecuenciaDistribucion">
            <SelectValue placeholder="Seleccione frecuencia" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mensual">Mensual</SelectItem>
            <SelectItem value="trimestral">Trimestral</SelectItem>
            <SelectItem value="semestral">Semestral</SelectItem>
            <SelectItem value="anual">Anual</SelectItem>
            <SelectItem value="finalProyecto">Final del proyecto</SelectItem>
          </SelectContent>
        </Select>
        {errors.frecuenciaDistribucion && (
          <p className="text-red-500">
            {errors.frecuenciaDistribucion.message}
          </p>
        )}
      </div>
    </div>
  );
};

const Paso5 = () => {
  const {
    register,
    control,
    formState: { errors },
    setValue,
  } = useFormContext();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [preguntasAdicionales, setPreguntasAdicionales] = useState<
    { pregunta: string; descripcion: string }[]
  >([]);

  const [documents, setDocuments] = useState<{ file: File; title: string; description: string }[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        file,
        title: "",
        description: ""
      }));

      if (documents.length + newFiles.length > 10) {
        alert("Puedes subir hasta 10 documentos.");
        return;
      }

      setDocuments((prevDocuments) => [...prevDocuments, ...newFiles]);
      setValue("documentos", [...documents, ...newFiles]);
    }
  };



  const handleAddPregunta = () => {
    setPreguntasAdicionales([
      ...preguntasAdicionales,
      { pregunta: "", descripcion: "" },
    ]);
  };

  const handleRemovePregunta = (index: number) => {
    setPreguntasAdicionales(preguntasAdicionales.filter((_, i) => i !== index));
  };

  const handlePreguntaChange = (index: number, value: string) => {
    const nuevasPreguntas = [...preguntasAdicionales];
    nuevasPreguntas[index].pregunta = value;
    setPreguntasAdicionales(nuevasPreguntas);
    setValue(`preguntasAdicionales[${index}].pregunta`, value);
  };

  const handleDescripcionChange = (index: number, value: string) => {
    const nuevasPreguntas = [...preguntasAdicionales];
    nuevasPreguntas[index].descripcion = value;
    setPreguntasAdicionales(nuevasPreguntas);
    setValue(`preguntasAdicionales[${index}].descripcion`, value);
  };

  return (
    <div className="space-y-4 h-full max-h-[600px] overflow-y-auto">
      <div className="mt-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Documentos adicionales para descarga
        </h2>
      </div>

      <div className="flex flex-col bg-gray-100 rounded-md p-4">
        <div className="flex flex-col items-start">
          <input
            id="documentos"
            type="file"
            multiple
            onChange={handleFileChange}
            className="mb-2"
          />
        </div>
      </div>

      {documents.map((doc, index) => (
        <div key={index} className="flex flex-col bg-gray-100 rounded-md p-4 mt-4">
          <p className="font-semibold">{doc.file.name}</p>

          <input
            type="text"
            placeholder="Título del documento"
            value={doc.title}
            onChange={(e) => {
              const updatedDocs = [...documents];
              updatedDocs[index].title = e.target.value;
              setDocuments(updatedDocs);
              setValue("documentos", updatedDocs); // Actualiza el estado del formulario
            }}
            className="border border-gray-300 rounded p-2 my-2"
          />
          {errors.documentos?.[index]?.title && (
            <p className="text-red-500">{errors.documentos[index].title.message}</p>
          )}

          <textarea
            placeholder="Descripción del documento"
            value={doc.description}
            onChange={(e) => {
              const updatedDocs = [...documents];
              updatedDocs[index].description = e.target.value;
              setDocuments(updatedDocs);
              setValue("documentos", updatedDocs); // Actualiza el estado del formulario
            }}
            className="border border-gray-300 rounded p-2 my-2"
          />
          {errors.documentos?.[index]?.description && (
            <p className="text-red-500">{errors.documentos[index].description.message}</p>
          )}
        </div>
      ))}

      {errors.documentos && typeof errors.documentos === 'string' && (
        <p className="text-red-500">{errors.documentos}</p>
      )}



      <div className="mt-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Preguntas frecuentes
        </h2>
      </div>

      <div>
        <Label htmlFor="razonesInvertir">Razones para invertir</Label>
        <Textarea
          id="razonesInvertir"
          {...register("razonesInvertir", {
            required: "Las razones para invertir son requeridas.",
          })}
        />
        {errors.razonesInvertir && (
          <p className="text-red-500">{errors.razonesInvertir.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="problemaResuelve">Problema que resuelve</Label>
        <Textarea
          id="problemaResuelve"
          {...register("problemaResuelve", {
            required: "El problema que resuelve es requerido.",
          })}
        />
        {errors.problemaResuelve && (
          <p className="text-red-500">{errors.problemaResuelve.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="impacto">Impacto</Label>
        <Textarea
          id="impacto"
          {...register("impacto", { required: "El impacto es requerido." })}
        />
        {errors.impacto && (
          <p className="text-red-500">{errors.impacto.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="diferenciacion">Diferenciación</Label>
        <Textarea
          id="diferenciacion"
          {...register("diferenciacion", {
            required: "La diferenciación es requerida.",
          })}
        />
        {errors.diferenciacion && (
          <p className="text-red-500">{errors.diferenciacion.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="mercadoObjetivo">Mercado objetivo</Label>
        <Textarea
          id="mercadoObjetivo"
          {...register("mercadoObjetivo", {
            required: "El mercado objetivo es requerido.",
          })}
        />
        {errors.mercadoObjetivo && (
          <p className="text-red-500">{errors.mercadoObjetivo.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="modeloNegocio">Modelo de negocio</Label>
        <Textarea
          id="modeloNegocio"
          {...register("modeloNegocio", {
            required: "El modelo de negocio es requerido.",
          })}
        />
        {errors.modeloNegocio && (
          <p className="text-red-500">{errors.modeloNegocio.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="proyeccionesResumidas">Proyecciones resumidas</Label>
        <Textarea
          id="proyeccionesResumidas"
          {...register("proyeccionesResumidas", {
            required: "Las proyecciones resumidas son requeridas.",
          })}
        />
        {errors.proyeccionesResumidas && (
          <p className="text-red-500">{errors.proyeccionesResumidas.message}</p>
        )}
      </div>
      <div className="space-y-4 h-full max-h-[600px] overflow-y-auto">
        {/* Otros campos del formulario */}

        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Preguntas adicionales
          </h2>
          {preguntasAdicionales.map((pregunta, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center space-x-2">
                <Textarea
                  {...register(`preguntasAdicionales.${index}.pregunta`, {
                    required: "La pregunta no puede estar vacía.",
                  })}
                  value={pregunta.pregunta}
                  onChange={(e) => handlePreguntaChange(index, e.target.value)}
                  placeholder={`Pregunta adicional ${index + 1}`}
                />
                <button
                  type="button"
                  className="bg-red-500 text-white p-2 rounded-md"
                  onClick={() => handleRemovePregunta(index)}
                >
                  Eliminar
                </button>
              </div>
              <div>
                <Textarea
                  {...register(`preguntasAdicionales.${index}.descripcion`, {
                    required: "La descripción es requerida.",
                  })}
                  value={pregunta.descripcion}
                  onChange={(e) =>
                    handleDescripcionChange(index, e.target.value)
                  }
                  placeholder={`Descripción de la pregunta adicional ${index + 1
                    }`}
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            className="bg-c-primaryColor text-white p-2 rounded-md mt-2"
            onClick={handleAddPregunta}
          >
            Agregar otra pregunta
          </button>
        </div>

        {errors.preguntasAdicionales && (
          <p className="text-red-500">{errors.preguntasAdicionales.message}</p>
        )}
      </div>
    </div>
  );
};

const Paso6 = () => {
  const {
    register,
    formState: { errors },
    setValue,
  } = useFormContext();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Sanitizamos el valor antes de guardarlo en el formulario
    const sanitizedValue = DOMPurify.sanitize(event.target.value);
    setValue(event.target.name, sanitizedValue);
  };

  return (
    <div className="space-y-4 h-full max-h-[600px] overflow-y-auto">
      <div>
        <Label htmlFor="sitioWeb">Sitio Web</Label>
        <Input
          id="sitioWeb"
          type="text" // Cambiamos a 'text' para permitir entradas sin HTTPS
          {...register("sitioWeb", {
            onChange: handleChange, // Llama a la función de sanitización en el cambio
          })}
        />
        {errors.sitioWeb && (
          <p className="text-red-500">{errors.sitioWeb.message}</p>
        )}
      </div>

      <div className="mt-4">
        <h2 className="text-lg font-semibold text-gray-800">Redes sociales</h2>
      </div>

      <div className="space-y-2">
        <div className="flex flex-col space-y-2">
          <Label htmlFor="facebook">Facebook</Label>
          <Input
            id="facebook"
            type="text" // Cambiamos a 'text' para permitir entradas sin HTTPS
            placeholder="facebook.com/"
            {...register("redesSociales.facebook", {
              onChange: handleChange,
            })}
          />
          {errors.redesSociales?.facebook && (
            <p className="text-red-500">
              {errors.redesSociales.facebook.message}
            </p>
          )}
        </div>

        <div className="flex flex-col space-y-2">
          <Label htmlFor="twitter">Twitter</Label>
          <Input
            id="twitter"
            type="text" // Cambiamos a 'text' para permitir entradas sin HTTPS
            placeholder="twitter.com/"
            {...register("redesSociales.twitter", {
              onChange: handleChange,
            })}
          />
          {errors.redesSociales?.twitter && (
            <p className="text-red-500">
              {errors.redesSociales.twitter.message}
            </p>
          )}
        </div>

        <div className="flex flex-col space-y-2">
          <Label htmlFor="linkedin">LinkedIn</Label>
          <Input
            id="linkedin"
            type="text" // Cambiamos a 'text' para permitir entradas sin HTTPS
            placeholder="linkedin.com/"
            {...register("redesSociales.linkedin", {
              onChange: handleChange,
            })}
          />
          {errors.redesSociales?.linkedin && (
            <p className="text-red-500">
              {errors.redesSociales.linkedin.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="correoElectronico">
          Correo Electrónico de contacto
        </Label>
        <Input
          id="correoElectronico"
          type="email"
          {...register("correoElectronico")}
        />
        {errors.correoElectronico && (
          <p className="text-red-500">{errors.correoElectronico.message}</p>
        )}
      </div>
    </div>
  );
};

interface FormularioProyectoCompletoProps {
  claseActivo: string | null;
  toggleFormProyect: () => void;
  toggleMostrarSeleccionarClase: () => void;
}

export default function FormularioProyectoCompleto({
  claseActivo,
  toggleFormProyect,
  toggleMostrarSeleccionarClase,
}: FormularioProyectoCompletoProps): JSX.Element {
  const [paso, setPaso] = useState(1);
  const [validaciones, setValidaciones] = useState<boolean[]>(
    Array(6).fill(false)
  ); // Estado para saber qué pasos han sido validados
  const methods = useForm({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });
  const [isLoading, setIsLoading] = useState(false);

  const { handleSubmit, trigger, setValue } = methods;

  useEffect(() => {
    setValue("claseActivo", claseActivo);
  }, [claseActivo, setValue]);

  const avanzar = async () => {
    const camposAValidar = camposPorPaso[paso as 1 | 2 | 3 | 4 | 5 | 6];
    const isValid = await trigger(camposAValidar);

    if (isValid && paso < 6) {
      setPaso(paso + 1);
      const nuevasValidaciones = [...validaciones];
      nuevasValidaciones[paso - 1] = true; // Marca el paso actual como validado
      setValidaciones(nuevasValidaciones);
    } else {
      console.log("Errores en el paso:", paso);
      console.log(methods.formState.errors);
    }
  };

  const retroceder = () => {
    if (paso > 1) {
      setPaso(paso - 1);
    }
  };

  const renderPaso = () => {
    switch (paso) {
      case 1:
        return <Paso1 />;
      case 2:
        return <Paso2 />;
      case 3:
        return <Paso3 />;
      case 4:
        return <Paso4 />;
      case 5:
        return <Paso5 />;
      case 6:
        return <Paso6 />;
      default:
        return <div>Paso no encontrado</div>;
    }
  };

  //TODO: Sanitizar los datos de los inputs html con la función que está declarada más arriba, el resto de inputs se dejan con sanitizeAndValidate importado para strings. hay que cambiarle los nombres a eso para no confundirnos después.
  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    const projectCreationFormData = new FormData();

    // Append text fields
    projectCreationFormData.append(
      "name",
      sanitizeAndValidate(data.nombreProyecto)
    );
    projectCreationFormData.append(
      "description",
      sanitizeAndValidate(data.descripcion)
    );
    projectCreationFormData.append("transmitter", "Tok4You");
    projectCreationFormData.append("country", sanitizeAndValidate(data.pais));
    projectCreationFormData.append(
      "location",
      sanitizeAndValidate(data.ubicacion)
    );
    projectCreationFormData.append(
      "asset_type",
      sanitizeAndValidate(data.claseActivo)
    );
    projectCreationFormData.append(
      "asset_subclass",
      sanitizeAndValidate(data.subclaseActivo)
    );
    projectCreationFormData.append(
      "token_name",
      sanitizeAndValidate(data.nombreToken)
    );
    projectCreationFormData.append(
      "token_symbol",
      sanitizeAndValidate(data.nombreToken)
    );
    projectCreationFormData.append("platform", "Tok4You");
    projectCreationFormData.append("blockchain", "Polygon");
    projectCreationFormData.append(
      "token_rights",
      JSON.stringify(data.derechosToken || [])
    );
    projectCreationFormData.append(
      "restricted_countries",
      JSON.stringify(data.paisesRestringidos || [])
    );
    projectCreationFormData.append(
      "investment_structure",
      JSON.stringify(data.estructuraInversion)
    );
    projectCreationFormData.append(
      "target_market",
      sanitizeAndValidate(data.mercadoObjetivo)
    );
    projectCreationFormData.append(
      "business_model",
      sanitizeAndValidate(data.modeloNegocio)
    );
    projectCreationFormData.append(
      "website",
      sanitizeAndValidate(data.sitioWeb)
    );
    projectCreationFormData.append(
      "email",
      sanitizeAndValidate(data.correoElectronico)
    );
    projectCreationFormData.append("ods", JSON.stringify(data.ods));
    projectCreationFormData.append(
      "additional_questions",
      JSON.stringify(data.preguntasAdicionales || [])
    );

    // Append details
    const details = {
      reasons_invest: sanitizeAndValidate(data.razonesInvertir),
      problem_that_solves: sanitizeAndValidate(data.problemaResuelve),
      impact: sanitizeAndValidate(data.impacto),
      differentiation: sanitizeAndValidate(data.diferenciacion),
      projections_summary: sanitizeAndValidate(data.proyeccionesResumidas),
    };
    projectCreationFormData.append("details", JSON.stringify([details]));

    // Append financials
    const financials = {
      max_limit: sanitizeAndValidate(data.limiteMaximo, false),
      soft_limit: sanitizeAndValidate(data.limiteBlando, false),
      assigned_presale: sanitizeAndValidate(data.asignadoPreventa, false),
      assigned_public_sale: sanitizeAndValidate(
        data.asignadoVentaPublica,
        false
      ),
      min_investment: sanitizeAndValidate(data.inversionMinima, false),
      max_investment: sanitizeAndValidate(data.inversionMaxima, false),
      launch_price: sanitizeAndValidate(data.precioLanzamiento, false),
      prelaunch_price: sanitizeAndValidate(data.precioPrelanzamiento, false),
      dividend_yield: sanitizeAndValidate(data.rendimientoDividendos, false),
      gross_tir: sanitizeAndValidate(data.tirBruta, false),
      max_balance: sanitizeAndValidate(data.maximoBalance, false),
      investment_period: sanitizeAndValidate(data.periodoInversion),
      investment_period_unit: sanitizeAndValidate(data.unidadInversion),
      distribution_frequency: sanitizeAndValidate(data.frecuenciaDistribucion),
      investors_accepted: data.inversoresAceptados || {},
    };
    projectCreationFormData.append("financials", JSON.stringify([financials]));

    // Append dates
    const dates = {
      pre_launch: new Date(data.prelanzamiento).toISOString(),
      launch: new Date(data.lanzamiento).toISOString(),
      token_claim_date: new Date(data.distribucionTokens).toISOString(),
      finalized: new Date(data.finalizado).toISOString(),
    };
    projectCreationFormData.append("dates", JSON.stringify([dates]));

    // Append social media
    const socialMedia = {
      social_media_facebook: sanitizeAndValidate(data.redesSociales.facebook),
      social_media_twitter: sanitizeAndValidate(data.redesSociales.twitter),
      social_media_linkedin: sanitizeAndValidate(data.redesSociales.linkedin),
    };
    projectCreationFormData.append(
      "socialMedia",
      JSON.stringify([socialMedia])
    );

    const walletAddress = localStorage.getItem("fullUserDataObject");

    // Append wallet
    if (walletAddress) {
      try {
        const userData = JSON.parse(walletAddress);
        projectCreationFormData.append("wallet", userData.wallet || "");
      } catch (error) {
        console.error("Failed to parse wallet address:", error);
        projectCreationFormData.append("wallet", ""); // Fallback if parsing fails
      }
    } else {
      projectCreationFormData.append("wallet", ""); // Fallback if walletAddress is null
    }

    const imageTitles = data.imagenes.map((img) => img.title);
    const imageDescriptions = data.imagenes.map((img) => img.description);
    const documentTitles = data.documentos.map((doc) => doc.title);
    const documentDescriptions = data.documentos.map((doc) => doc.description);


    if (data.imagenes) {
      data.imagenes.forEach((img) => {
        projectCreationFormData.append("images", img.file);
      });
      projectCreationFormData.append("imageTitles", JSON.stringify(imageTitles));
      projectCreationFormData.append("imageDescriptions", JSON.stringify(imageDescriptions));
    }

    if (data.documentos) {
      data.documentos.forEach((doc) => {
        projectCreationFormData.append("documents", doc.file);
      });
      projectCreationFormData.append("documentTitles", JSON.stringify(documentTitles));
      projectCreationFormData.append("documentDescriptions", JSON.stringify(documentDescriptions));
    }

    console.log("Formulario a enviar:", projectCreationFormData);

    const response = await fetch(`${backendEndpoint}/projects/`, {
      method: "POST",
      body: projectCreationFormData as any, // Directly pass formData
    });

    const dataResponse = await response.json();

    console.log("Formulario enviado, esta es la respuesta:", dataResponse);

    if (dataResponse.message === "Proyecto Creado Exitosamente") {
      toast.success("Proyecto Creado Exitosamente");
      toggleFormProyect();
      toggleMostrarSeleccionarClase();
    } else {
      toast.error("Error al crear el proyecto:");
    }
    setIsLoading(false);
    /* 
    toggleFormProyect();
    toggleMostrarSeleccionarClase(); */
  };

  const renderCirculos = () => (
    <div className="flex justify-center space-x-4 mb-6 pt-6">
      {[1, 2, 3, 4, 5, 6].map((num) => (
        <div
          key={num}
          className={`w-6 h-6 rounded-full flex items-center justify-center
            ${validaciones[num - 1]
              ? "bg-green-500"
              : num === paso
                ? "bg-gray-500"
                : "bg-red-500"
            }
          `}
        ></div>
      ))}
    </div>
  );

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="w-full max-w-6xl mx-auto h-full">
          {" "}
          {/* Aumentar el ancho máximo */}
          <CardContent className="space-y-6">
            {" "}
            {/* Espaciado entre elementos */}
            {/* Renderiza los círculos de progreso */}
            {renderCirculos()}
            {renderPaso()}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" onClick={retroceder} disabled={paso === 1}>
              Anterior
            </Button>
            {paso < 6 ? (
              <Button type="button" onClick={avanzar}>
                Siguiente
              </Button>
            ) : (
              <Button type="submit">Enviar</Button>
            )}
          </CardFooter>
        </Card>
      </form>
      <LoadingOverlay isLoading={isLoading} />
    </FormProvider>
  );
}