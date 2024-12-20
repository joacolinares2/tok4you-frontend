
# Tokenus - app tokenizadora de activos

![image](https://github.com/user-attachments/assets/dc01c518-9571-4099-b584-343cfdce2c6c)


## Levantamiento del proyecto 

Desarrollo

```bash
  npm install && npm run dev (o "npm run preview" para ver la build en local)
```

Producción (se utiliza la librería ***serve*** para servir la build de producción en los servidores)

```bash
  npm install && npm run build && npm run start
```


## Tecnologías 

```bash
1. Vite con React: Base del desarrollo.
2. TypeScript: Para hacer más estricto el flujo de datos.
3. React Router: Manejo de navegación en aplicaciones React.
4. Tailwind CSS: Framework de CSS utilitario.
5. Zod: Biblioteca de validación de esquemas de datos.
6. React Hook Form: Gestión de formularios en React.
7. ShadCn / Radix UI: Librerías de componentes accesibles y editables.
8. Thirdweb: Plataforma para integraciones Web3.
9. Zustand: Gestión de estados globales.
```

## Variables de entorno (.env)

`VITE_TEMPLATE_CLIENT_ID=93729630d0da6f757c062b76625f4afb` -  (Se reemplaza por el id de cliente de thirdweb en producción)

`VITE_API_BASE_URL=http://localhost:4000/api/v1` - (Se reemplaza por link al backend de desarrollo o de producción)


- [Documentación del backend](https://www.notion.so/8d0f8e2eeab04111ba6d73bf693c68e8?v=1b32c940c13c43dfa511d52bef2208e5)
- [Figma de desarrollo](https://www.figma.com/design/i8puX0WZWjbtpiAejaKIRN/Proyecto%3A-TokenUS?node-id=10480-12083&node-type=canvas&t=NbiOiuUqOTrCD8wO-0)
- [Documentación de thirdweb](https://portal.thirdweb.com/typescript/v5)
- [Autenticación con thirdweb](https://playground.thirdweb.com/connect/auth)


## Servidores 
Se utilizó railway para los deploys de desarrollo porque permite enviar a "dormir" los servidores cuando no se estén utilizando. Y el tiempo para la primera petición que hace que se "despierte" el servidor toma entre 3 y 10 segundos normalmente. Este es un muy buen número para el ahorro que se obtiene al "apagarse" automáticamente cuando no se utilizan.   

![image](https://github.com/user-attachments/assets/1134fe91-5768-4e46-8923-0c4e21135707)


1. Frontend de desarrollo  
2. Frontend de producción  
3. Backend de desarrollo    
4. Backend de producción  
