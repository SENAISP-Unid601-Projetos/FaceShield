FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

# Instalar Maven primeiro
RUN apk add --no-cache maven

# Copiar apenas o necessário para cache de dependências
COPY pom.xml .

# Baixar dependências
RUN mvn dependency:go-offline -B

# Copiar código fonte
COPY src ./src

# Compilar
RUN mvn clean package -DskipTests

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "target/faceshield-0.0.1-SNAPSHOT.jar"]