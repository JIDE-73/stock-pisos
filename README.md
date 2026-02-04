# Stock Pisos

Este proyecto es una aplicación desarrollada en React Native utilizando Expo. A continuación, se describen los pasos mínimos necesarios para ejecutar el proyecto en tu entorno local.

## Requisitos previos

Asegúrate de tener instalados los siguientes programas y herramientas:

1. [Node.js](https://nodejs.org/) (versión 14 o superior).
2. [Expo CLI](https://docs.expo.dev/get-started/installation/) (puedes instalarlo globalmente con `npm install -g expo-cli`).
3. Un emulador de Android/iOS o un dispositivo físico con la aplicación Expo Go instalada.
4. [Git](https://git-scm.com/) para clonar el repositorio.

## Pasos para ejecutar el proyecto

1. **Clonar el repositorio**

   Clona este repositorio en tu máquina local:

   ```bash
   git clone https://github.com/Async-DE/Stock-b.git
   cd stock-pisos
   ```

2. **Instalar dependencias**

   Asegúrate de instalar las dependencias necesarias ejecutando el siguiente comando:

   ```bash
   npm install
   ```

3. **Configurar variables de entorno**

   Si el proyecto utiliza variables de entorno, asegúrate de crear un archivo `.env` en la raíz del proyecto y agregar las variables necesarias. Puedes usar el archivo `example.env` como referencia si está disponible.

4. **Iniciar el servidor de desarrollo**

   Inicia el servidor de desarrollo de Expo con el siguiente comando:

   ```bash
   npx expo start
   ```

5. **Abrir la aplicación en un dispositivo o emulador**

   - Si estás utilizando un dispositivo físico, escanea el código QR que aparece en la terminal o en la página web de Expo con la aplicación Expo Go.
   - Si estás utilizando un emulador, selecciona la opción correspondiente en la página web de Expo o en la terminal.

## Estructura del proyecto

- `app/`: Contiene las pantallas y componentes principales de la aplicación.
- `components/`: Componentes reutilizables de la interfaz de usuario.
- `assets/`: Archivos estáticos como imágenes, íconos y fuentes.
- `constants/`: Archivos de configuración y constantes globales.
- `package.json`: Archivo de configuración de dependencias del proyecto.
- `tsconfig.json`: Configuración de TypeScript.
- `tailwind.config.js`: Configuración de Tailwind CSS.

## Notas adicionales

- Asegúrate de que tu dispositivo o emulador esté conectado a la misma red que tu computadora.
- Si encuentras problemas, intenta limpiar la caché de Expo con el siguiente comando:

  ```bash
  npx expo start --clear
  ```

- Consulta la [documentación oficial de Expo](https://docs.expo.dev/) para más información sobre cómo usar Expo.

---

¡Disfruta desarrollando con Stock Pisos!