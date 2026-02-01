Expediente Técnico Maestro: Architect Pro / Studio V2.7.3Este documento es el único punto de verdad para la arquitectura y operación del Estudio Maestro Edición Neomorph. Sustituye a todas las versiones anteriores.1. Diagrama de Flujo del Sistema (Mermaid)graph TD

&nbsp;   subgraph "Capa de Interacción (Frontend)"

&nbsp;       A\[Carga de Imagen / UI Neomórfica] --> B{Selector de Estilo}

&nbsp;       B --> C\[Estado Local: imagePreview / selectedStyle]

&nbsp;       D\[Consola de Metadatos] --- C

&nbsp;       Z\[Función de Reinicio] -- Limpia --> C

&nbsp;   end



&nbsp;   subgraph "Capa de Lógica y Transformación"

&nbsp;       C --> E\[Ajustes de Precisión: Brillo/Contraste]

&nbsp;       E --> F\[Prompt Engineering Dinámico]

&nbsp;       F --> G\[Codificación Base64]

&nbsp;       G --> H\[Petición API: fetch]

&nbsp;   end



&nbsp;   subgraph "Capa de Inteligencia (Gemini Engine)"

&nbsp;       H --> I\[Google Gemini 2.5 Flash]

&nbsp;       I --> J\[Generación de Imagen Artística]

&nbsp;       J --> K\[Respuesta JSON: inlineData]

&nbsp;   end



&nbsp;   subgraph "Capa de Salida y Metadatos"

&nbsp;       K --> L\[Decodificación y Renderizado]

&nbsp;       L --> M\[Cálculo Dinámico de Peso]

&nbsp;       M --> N\[Visualización en Canvas / Descarga PNG]

&nbsp;   end

2\. Especificaciones de Diseño y AcentoColor de Acento: Gris Azulado Profundo (#334155). Utilizado en iconos, sliders y tipografía secundaria.Jerarquía de Acción: El botón "Renderizar" se ha definido en Blanco Puro con sombras neomórficas extendidas para actuar como el principal punto de enfoque (CTA).Tokens Neomórficos:neoOuter: Sombras proyectadas para elevación física.neoInner: Sombras internas para cavidades (inputs, sliders, canvas).3. Funciones Críticas VerificadasResetStudio(): Inicializa todos los estados a su valor original, garantizando una limpieza total de la memoria de sesión.Precision Engine: Integra los valores de brillo y contraste del usuario directamente en el proceso de renderizado.Identity Guard: Instrucción técnica para asegurar que el modelo no altere los rasgos faciales del sujeto original.4. Notas de Versión (V2.7.3)Eliminada dependencia de acentos azules brillantes.Optimización de contraste en la consola de metadatos para mejor legibilidad industrial.Verificación de compatibilidad con dispositivos táctiles.Última Actualización: 31 de Enero, 2026Estado: Certificado y Resguardado (V2.7.3)

