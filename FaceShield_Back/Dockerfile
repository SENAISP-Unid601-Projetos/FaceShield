FROM eclipse-temurin:21-jdk-alpine

WORKDIR /app

# Instalar Maven
RUN apk add --no-cache maven

# Copiar pom.xml primeiro para cache de dependências
COPY pom.xml .

# Baixar dependências
RUN mvn dependency:go-offline -B

# Copiar código fonte
COPY src ./src

# Compilar
RUN mvn clean package -DskipTests

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "target/FaceShield_Back-0.0.1-SNAPSHOT.jar"]