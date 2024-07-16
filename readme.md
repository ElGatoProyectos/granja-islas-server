## Granjas islas backend

Para iniciar el proyecto backend deberas seguir los siguientes pasos
<br/>
<br/>

- Instalar todas las dependencias

  ```
  npm install
  ```

- Inicializar la base de datos

  ```
  npx prisma migrate dev --name init
  ```

- Inicializar las variables de entorno

  ```
  DATABASE_URL=""

  BASE_API_QUERY=""

  JWT_TOKEN=""
  ```

- Iniciar el proyecto en modo desarrollo

  ```
  npm run dev
  ```

- Si en caso salga error, validar si tienes typescript instalado

  ```
  npm i typescript -g
  ```

<br/>
<br/>
Apis funcionales
<br/>
<br/>

- [<span style="color:green; font-size:18px">Autenticación y autorización</span>](doc/auth.md)

- [<span style="color:green; font-size:18px">Usuarios</span>](doc/users.md)

- [<span style="color:green; font-size:18px">Empresas</span>](doc/company.md)
